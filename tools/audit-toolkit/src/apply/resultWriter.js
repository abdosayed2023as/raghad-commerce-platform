import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Writes canonical apply-result.json contract document.
 * Conforms to PATCH-08, PATCH-10, and PATCH-14 frozen schema specifications.
 *
 * @param {object|string} folders Object containing folders structure or string path
 * @param {object} applyResultData Apply result payload
 * @returns {string} Path to written apply-result.json
 */
export function writeApplyResultDocument(folders, applyResultData) {
  let targetDir = null;

  if (typeof folders === 'string') {
    targetDir = folders;
  } else if (folders?.applyResult) {
    targetDir = folders.applyResult;
  } else if (folders?.context) {
    targetDir = path.join(path.dirname(folders.context), 'apply-result');
  } else if (folders?.root) {
    targetDir = path.join(folders.root, 'apply-result');
  }

  if (!targetDir) {
    const errorMsg = '[RESULT WRITER ERROR] applyResult output directory is unresolvable.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const outputPath = path.join(targetDir, 'apply-result.json');

  const deterministicDoc = {
    schemaVersion: '1.0.0',
    engineVersion: 'AT13A-2.0.0',
    run: applyResultData.run || null,
    executionLock: applyResultData.executionLock || null,
    repository: applyResultData.repository || null,
    repositoryCompatibility: applyResultData.repositoryCompatibility || {
      compatible: true,
      headReadable: true,
      workingTreeEncoding: 'UTF-8',
      caseSensitiveFs: true,
      supportedGitVersion: true
    },
    summary: applyResultData.summary || {
      totalPatchesProcessed: 0,
      patchesApplied: 0,
      patchesAlreadyApplied: 0,
      patchesSkipped: 0,
      patchesConflicted: 0,
      patchesFailed: 0,
      dryRunFailures: 0,
      checksumFailures: 0,
      filesTouched: 0,
      filesRolledBack: 0,
      totalLinesAdded: 0,
      totalLinesDeleted: 0,
      totalApplyDurationMs: 0,
      averagePatchDurationMs: 0,
      largestPatchBytes: 0,
      smallestPatchBytes: 0,
      averageRollbackDurationMs: 0,
      rollbackExecuted: false
    },
    rollbackJournal: applyResultData.rollbackJournal || null,
    applications: applyResultData.applications || [],
    eventLogSummary: applyResultData.eventLogSummary || {
      totalEvents: 0,
      events: []
    }
  };

  const formattedJson = JSON.stringify(deterministicDoc, null, 2) + '\n';

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`Patch Applicator result document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[RESULT WRITER ERROR] Failed to write apply-result.json: ${err.message}`, err);
    throw err;
  }
}
