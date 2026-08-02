import crypto from 'crypto';
import path from 'path';
import { loadPatchPackage } from './patchLoader.js';
import { RepositoryManager } from './repositoryManager.js';
import { createRollbackSession } from './workspaceManager.js';
import { PatchDependencyGraph } from './dependencyGraph.js';
import { ApprovalLayer } from './approvalLayer.js';
import { GitApplyEngine } from './engine/gitApplyEngine.js';
import { JsDiffEngine } from './engine/jsDiffEngine.js';
import { validateApply, computeFileMetrics, runChecksumValidator } from './validators/index.js';
import { writeApplyResultDocument } from './resultWriter.js';
import { logger } from '../utils/logger.js';

/**
 * Main pipeline entry point for Patch Applicator V2 (AT-13A).
 * Consumes ONLY patch-package.json to produce apply-result/apply-result.json.
 * Implements 9-stage pipeline with FIX-01, FIX-02, and FIX-08 corrective patches.
 *
 * @param {object} configOrFolders Configuration object or folders structure
 * @param {object} [foldersParam] Folders structure
 * @returns {Promise<string>} Path to generated apply-result.json
 */
export async function runPatchApplicator(configOrFolders, foldersParam) {
  const pipelineStart = Date.now();
  const eventLog = [];
  const logEvent = (moduleName, action, status, durationMs = 0) => {
    eventLog.push({
      eventId: `EVT-${String(eventLog.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      module: moduleName,
      action,
      status,
      durationMs
    });
  };

  logger.info('====================================================');
  logger.info('   PATCH APPLICATOR V2 (AT-13A)                     ');
  logger.info('====================================================');

  const folders = foldersParam || configOrFolders;
  const config = (configOrFolders && configOrFolders.outputDir) ? configOrFolders : {};
  const rootDir = process.cwd();

  // Stage 1: Load Contract & Acquire Lock
  const patchPackageData = loadPatchPackage(folders);
  const patches = Array.isArray(patchPackageData.patches) ? patchPackageData.patches : [];
  const runId = patchPackageData.run?.runId || folders.runTimestamp || 'UNKNOWN_RUN';

  const repoManager = new RepositoryManager(rootDir, config);
  let lockMeta = null;

  try {
    const tLock = Date.now();
    lockMeta = repoManager.acquireLock(runId);
    logEvent('repositoryManager', 'ACQUIRE_LOCK', 'SUCCESS', Date.now() - tLock);
  } catch (err) {
    logEvent('repositoryManager', 'ACQUIRE_LOCK', 'FAILED', 0);
    throw err;
  }

  const rollbackSession = createRollbackSession(runId, config);

  try {
    // Stage 2: Repository Compatibility Audit
    const tAudit = Date.now();
    const repoAudit = repoManager.auditRepository();
    logEvent('repositoryManager', 'AUDIT_REPOSITORY', 'SUCCESS', Date.now() - tAudit);

    // Select Patch Engine
    const engine = repoAudit.gitAvailable
      ? new GitApplyEngine(rootDir)
      : new JsDiffEngine();

    logger.info(`[AT-13A] Selected patch engine: "${engine.engineName}".`);

    // Stage 3 & 4: Dependency Graph Resolution
    const tGraph = Date.now();
    const graph = new PatchDependencyGraph(patches);
    const { orderedPatches, conflicts: graphConflicts } = graph.resolve();
    logEvent('dependencyGraph', 'RESOLVE_GRAPH', 'SUCCESS', Date.now() - tGraph);

    // Stage 5 & 6: Approval Layer Init
    const approvalLayer = new ApprovalLayer(config.approvalMode || 'Automatic');

    const applications = [];
    const touchedFilesSet = new Set();
    let appliedCount = 0;
    let alreadyAppliedCount = 0;
    let skippedCount = 0;
    let conflictedCount = 0;
    let failedCount = 0;
    let dryRunFailuresCount = 0;
    let checksumFailuresCount = 0;
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    let largestPatchBytes = 0;
    let smallestPatchBytes = Infinity;

    // FIX-02: Inner try-catch for fatal execution exceptions
    try {
      // Process patches sequentially according to dependency graph order
      for (const patch of orderedPatches) {
        const tPatchStart = Date.now();
        const applicationId = `APP_${patch.patchId}`;
        const targetFile = patch.targetFile || 'unknown';

        // Compute deterministic patch fingerprint (PATCH-02)
        const diffHash = crypto.createHash('sha256').update(patch.unifiedDiff || '').digest('hex');
        const patchFingerprint = crypto.createHash('sha256').update(`${targetFile}:${patch.patchId}:${diffHash}`).digest('hex');

        const patchBytes = Buffer.byteLength(patch.unifiedDiff || '', 'utf8');
        if (patchBytes > largestPatchBytes) largestPatchBytes = patchBytes;
        if (patchBytes < smallestPatchBytes && patchBytes > 0) smallestPatchBytes = patchBytes;

        const targetValidation = repoManager.validateTargetFile(targetFile);
        const isBinary = repoManager.isBinaryFile(targetFile);

        // Stage 6: Rollback Snapshot Capture (FIX-01: validPath allows capture for new files)
        if (targetValidation.validPath && !isBinary) {
          rollbackSession.captureFile(targetFile, targetValidation.absolutePath);
        }

        // Pre-apply file integrity metrics
        const preMetrics = computeFileMetrics(targetValidation.absolutePath);

        // Check Idempotency (PATCH-01): Is patch already applied?
        if (targetValidation.validPath && targetValidation.exists && !isBinary && preMetrics.sha256) {
          const dryCheck = await engine.dryRun(targetValidation.absolutePath, patch.unifiedDiff || '');
          if (!dryCheck.passed && (dryCheck.conflicts || []).some(c => c.includes('already exists') || c.includes('reversed'))) {
            alreadyAppliedCount++;
            applications.push({
              applicationId,
              patchId: patch.patchId,
              patchFingerprint,
              planId: patch.planId,
              recommendationId: patch.recommendationId,
              relatedFindingId: patch.relatedFindingId,
              ruleId: patch.ruleId,
              targetFile,
              engineUsed: engine.engineName,
              engineMetrics: { engineName: engine.engineName, engineVersion: '1.0.0', executionDurationMs: Date.now() - tPatchStart, dryRunDurationMs: 0, bytesProcessed: patchBytes },
              approvalMode: approvalLayer.mode,
              gitApplyCheck: 'PASSED',
              applyStatus: 'ALREADY_APPLIED',
              errorCode: null,
              conflicts: [],
              modifiedFiles: [],
              verification: { preApply: preMetrics, postApply: preMetrics, linesAdded: 0, linesDeleted: 0, checksumVerified: true },
              rollbackAvailable: true,
              snapshotId: rollbackSession.snapshotId,
              relatedEvidenceIds: Array.isArray(patch.relatedEvidenceIds) ? patch.relatedEvidenceIds : [],
              relatedArtifacts: Array.isArray(patch.relatedArtifacts) ? patch.relatedArtifacts : []
            });
            continue;
          }
        }

        // Stage 5: Dry-Run Validation Suite
        const validationRes = await validateApply(engine, targetValidation.absolutePath, patch, graphConflicts, isBinary);

        if (!validationRes.passed) {
          dryRunFailuresCount++;
          if (validationRes.errorCode === 'APP-003') conflictedCount++;
          else failedCount++;

          applications.push({
            applicationId,
            patchId: patch.patchId,
            patchFingerprint,
            planId: patch.planId,
            recommendationId: patch.recommendationId,
            relatedFindingId: patch.relatedFindingId,
            ruleId: patch.ruleId,
            targetFile,
            engineUsed: engine.engineName,
            engineMetrics: { engineName: engine.engineName, engineVersion: '1.0.0', executionDurationMs: Date.now() - tPatchStart, dryRunDurationMs: 0, bytesProcessed: patchBytes },
            approvalMode: approvalLayer.mode,
            gitApplyCheck: validationRes.gitApplyCheck,
            applyStatus: validationRes.errorCode === 'APP-003' ? 'CONFLICT' : 'FAILED',
            errorCode: validationRes.errorCode || 'APP-003',
            conflicts: validationRes.conflicts,
            modifiedFiles: [],
            verification: { preApply: preMetrics, postApply: preMetrics, linesAdded: 0, linesDeleted: 0, checksumVerified: false },
            rollbackAvailable: true,
            snapshotId: rollbackSession.snapshotId,
            relatedEvidenceIds: Array.isArray(patch.relatedEvidenceIds) ? patch.relatedEvidenceIds : [],
            relatedArtifacts: Array.isArray(patch.relatedArtifacts) ? patch.relatedArtifacts : []
          });
          continue;
        }

        // Stage 7: Approval Gate
        const approvalRes = approvalLayer.evaluate(patch, { passed: true });
        if (!approvalRes.approved) {
          skippedCount++;
          applications.push({
            applicationId,
            patchId: patch.patchId,
            patchFingerprint,
            planId: patch.planId,
            recommendationId: patch.recommendationId,
            relatedFindingId: patch.relatedFindingId,
            ruleId: patch.ruleId,
            targetFile,
            engineUsed: engine.engineName,
            engineMetrics: { engineName: engine.engineName, engineVersion: '1.0.0', executionDurationMs: Date.now() - tPatchStart, dryRunDurationMs: 0, bytesProcessed: patchBytes },
            approvalMode: approvalLayer.mode,
            gitApplyCheck: 'PASSED',
            applyStatus: 'SKIPPED',
            errorCode: null,
            conflicts: [approvalRes.reason],
            modifiedFiles: [],
            verification: { preApply: preMetrics, postApply: preMetrics, linesAdded: 0, linesDeleted: 0, checksumVerified: false },
            rollbackAvailable: true,
            snapshotId: rollbackSession.snapshotId,
            relatedEvidenceIds: Array.isArray(patch.relatedEvidenceIds) ? patch.relatedEvidenceIds : [],
            relatedArtifacts: Array.isArray(patch.relatedArtifacts) ? patch.relatedArtifacts : []
          });
          continue;
        }

        // Stage 8: Actual Patch Execution
        const engineRes = await engine.applyPatch(targetValidation.absolutePath, patch.unifiedDiff || '');

        if (!engineRes.success) {
          failedCount++;
          applications.push({
            applicationId,
            patchId: patch.patchId,
            patchFingerprint,
            planId: patch.planId,
            recommendationId: patch.recommendationId,
            relatedFindingId: patch.relatedFindingId,
            ruleId: patch.ruleId,
            targetFile,
            engineUsed: engine.engineName,
            engineMetrics: engineRes.engineMetrics,
            approvalMode: approvalLayer.mode,
            gitApplyCheck: 'PASSED',
            applyStatus: 'FAILED',
            errorCode: 'APP-003',
            conflicts: [engineRes.error],
            modifiedFiles: [],
            verification: { preApply: preMetrics, postApply: preMetrics, linesAdded: 0, linesDeleted: 0, checksumVerified: false },
            rollbackAvailable: true,
            snapshotId: rollbackSession.snapshotId,
            relatedEvidenceIds: Array.isArray(patch.relatedEvidenceIds) ? patch.relatedEvidenceIds : [],
            relatedArtifacts: Array.isArray(patch.relatedArtifacts) ? patch.relatedArtifacts : []
          });
          continue;
        }

        // Post-apply file integrity metrics
        const postMetrics = computeFileMetrics(targetValidation.absolutePath);
        const chkRes = runChecksumValidator(preMetrics, postMetrics, patch.unifiedDiff || '');

        if (!chkRes.passed) {
          checksumFailuresCount++;
        }

        appliedCount++;
        touchedFilesSet.add(targetFile);
        totalLinesAdded += chkRes.verification.linesAdded;
        totalLinesDeleted += chkRes.verification.linesDeleted;

        applications.push({
          applicationId,
          patchId: patch.patchId,
          patchFingerprint,
          planId: patch.planId,
          recommendationId: patch.recommendationId,
          relatedFindingId: patch.relatedFindingId,
          ruleId: patch.ruleId,
          targetFile,
          engineUsed: engine.engineName,
          engineMetrics: engineRes.engineMetrics,
          approvalMode: approvalLayer.mode,
          gitApplyCheck: 'PASSED',
          applyStatus: 'APPLIED',
          errorCode: null,
          conflicts: [],
          modifiedFiles: [targetFile],
          verification: chkRes.verification,
          rollbackAvailable: true,
          snapshotId: rollbackSession.snapshotId,
          relatedEvidenceIds: Array.isArray(patch.relatedEvidenceIds) ? patch.relatedEvidenceIds : [],
          relatedArtifacts: Array.isArray(patch.relatedArtifacts) ? patch.relatedArtifacts : []
        });
      }
    } catch (fatalErr) {
      // FIX-02: Automatic rollback on unhandled pipeline exception
      logger.error(`[AT-13A] Fatal execution exception encountered: ${fatalErr.message}`);
      if (rollbackSession.backedUpFiles.size > 0) {
        logger.warn('[AT-13A] Invoking RollbackSession to restore workspace state.');
        rollbackSession.restore();
        logEvent('rollbackSession', 'RESTORE_WORKSPACE', 'SUCCESS', rollbackSession.rollbackJournal.restoreDurationMs);
      }
      throw fatalErr;
    }

    const totalApplyDurationMs = Date.now() - pipelineStart;
    const averagePatchDurationMs = patches.length > 0 ? totalApplyDurationMs / patches.length : 0;

    // FIX-08: Log RELEASE_LOCK before assembling applyResultPayload
    logEvent('repositoryManager', 'RELEASE_LOCK', 'SUCCESS', 0);

    // Stage 9: Assembly & Canonical Writing
    const applyResultPayload = {
      schemaVersion: '1.0.0',
      engineVersion: 'AT13A-2.0.0',
      run: patchPackageData.run || null,
      executionLock: {
        lockAcquired: true,
        lockFile: lockMeta.lockFile,
        acquiredAt: lockMeta.acquiredAt,
        releasedAt: new Date().toISOString()
      },
      repository: {
        gitVersion: repoAudit.gitVersion,
        gitRoot: repoAudit.gitRoot,
        currentBranch: repoAudit.currentBranch,
        headCommit: repoAudit.headCommit,
        isShallow: repoAudit.isShallow,
        isClean: repoAudit.isClean,
        selectedEngine: repoAudit.selectedEngine
      },
      repositoryCompatibility: repoAudit.compatibility,
      summary: {
        totalPatchesProcessed: patches.length,
        patchesApplied: appliedCount,
        patchesAlreadyApplied: alreadyAppliedCount,
        patchesSkipped: skippedCount,
        patchesConflicted: conflictedCount,
        patchesFailed: failedCount,
        dryRunFailures: dryRunFailuresCount,
        checksumFailures: checksumFailuresCount,
        filesTouched: touchedFilesSet.size,
        filesRolledBack: 0,
        totalLinesAdded,
        totalLinesDeleted,
        totalApplyDurationMs,
        averagePatchDurationMs,
        largestPatchBytes: largestPatchBytes === Infinity ? 0 : largestPatchBytes,
        smallestPatchBytes: smallestPatchBytes === Infinity ? 0 : smallestPatchBytes,
        averageRollbackDurationMs: 0,
        rollbackExecuted: false
      },
      rollbackJournal: rollbackSession.rollbackJournal,
      applications,
      eventLogSummary: {
        totalEvents: eventLog.length,
        events: eventLog
      }
    };

    const outputPath = writeApplyResultDocument(folders, applyResultPayload);

    logger.info(`[AT-13A] Applied ${appliedCount} patches (${alreadyAppliedCount} already applied, ${conflictedCount} conflicted, ${failedCount} failed, ${skippedCount} skipped).`);
    logger.success('Patch Applicator V2 execution complete.');

    return outputPath;
  } finally {
    // Stage 9 Release Lock
    repoManager.releaseLock();
  }
}

export {
  loadPatchPackage,
  writeApplyResultDocument
};
