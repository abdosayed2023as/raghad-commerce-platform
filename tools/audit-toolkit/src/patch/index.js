import fs from 'fs';
import path from 'path';
import { loadFixPlans } from './planLoader.js';
import { CodebaseResolver } from '../codebase/resolver.js';
import { synthesizeFixPrompt } from './promptSynthesizer.js';
import { getPatchProvider } from './provider/providerRegistry.js';
import { validatePatch } from './validators/index.js';
import { writePatchPackageDocument } from './patchWriter.js';
import { logger } from '../utils/logger.js';

/**
 * Pipeline entry point for Auto Fix Engine V2 (AT-12).
 * Consumes ONLY fix-plans.json to produce patches/patch-package.json.
 * Implements exact frozen RFC architecture specifications with final pre-freeze audit patches.
 *
 * @param {object} configOrFolders Configuration object or folders object
 * @param {object} [foldersParam] Folders structure object
 * @returns {Promise<string>} Output file path
 */
export async function runAutoFixEngine(configOrFolders, foldersParam) {
  logger.info('====================================================');
  logger.info('   AUTO FIX ENGINE V2 (AT-12)                       ');
  logger.info('====================================================');

  const folders = foldersParam || configOrFolders;
  const config = (configOrFolders && configOrFolders.outputDir) ? configOrFolders : {};
  const providerName = config.patchProvider || process.env.PATCH_PROVIDER || 'mock';

  const fixPlansData = loadFixPlans(folders);
  const plans = Array.isArray(fixPlansData.plans) ? fixPlansData.plans : [];

  const rootDir = process.cwd();
  const codebaseResolver = new CodebaseResolver(rootDir);
  const provider = getPatchProvider(providerName);

  logger.info(`Loaded ${plans.length} fix plans. Using patch provider: "${providerName}".`);

  const patches = [];
  let automatedCount = 0;
  let aiAssistedCount = 0;
  let manualRequiredCount = 0;
  let failedCount = 0;

  for (const plan of plans) {
    const patchId = `PATCH_${plan.planId}`;
    const fileContext = codebaseResolver.resolveTargetFile(plan);

    const promptContext = synthesizeFixPrompt(plan, fileContext, '1.0.0');

    let providerRes = null;
    try {
      providerRes = await provider.generatePatch(promptContext);
    } catch (err) {
      logger.warn(`[AT-12 ENGINE] Provider failed to generate patch for ${plan.planId}: ${err.message}`);
      providerRes = {
        targetFile: fileContext.relativePath,
        unifiedDiff: '',
        explanation: `Provider error: ${err.message}`,
        generation: {
          provider: providerName,
          model: 'error',
          temperature: 0.0,
          tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          durationMs: 0,
          promptVersion: '1.0.0'
        }
      };
    }

    const targetFile = providerRes.targetFile || fileContext.relativePath;
    const validationRes = validatePatch(rootDir, targetFile, providerRes.unifiedDiff, fileContext);

    if (validationRes.safetyStatus !== 'PASSED_VALIDATION') {
      manualRequiredCount++;
      if (validationRes.safetyStatus === 'REJECTED') {
        failedCount++;
      }
    } else {
      if (plan.automationLevel === 'Automatic') {
        automatedCount++;
      } else {
        aiAssistedCount++;
      }
    }

    const patchObj = {
      patchId,
      planId: plan.planId,
      recommendationId: plan.recommendationId,
      relatedFindingId: plan.relatedFindingId,
      ruleId: plan.ruleId,
      targetFile,
      patchType: 'UnifiedDiff',
      automationLevel: plan.automationLevel || 'Automatic',
      confidence: validationRes.confidence || 'HIGH',
      manualReviewReason: validationRes.manualReviewReason || null,
      safetyStatus: validationRes.safetyStatus || 'PASSED_VALIDATION',
      validation: validationRes.validation || {
        diff: 'FAILED',
        syntax: 'FAILED',
        boundary: 'FAILED',
        security: 'FAILED'
      },
      unifiedDiff: providerRes.unifiedDiff || '',
      explanation: providerRes.explanation || `Patch generated for plan ${plan.planId}.`,
      generation: providerRes.generation || {
        provider: providerName,
        model: 'unknown',
        temperature: 0.0,
        tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        durationMs: 0,
        promptVersion: '1.0.0'
      },
      relatedEvidenceIds: Array.isArray(plan.relatedEvidenceIds) ? plan.relatedEvidenceIds : [],
      relatedArtifacts: Array.isArray(plan.relatedArtifacts) ? plan.relatedArtifacts : []
    };

    patches.push(patchObj);
  }

  codebaseResolver.clearCache();

  const patchPackagePayload = {
    schemaVersion: '1.0.0',
    engineVersion: 'AT12-2.0.0',
    run: fixPlansData.run || null,
    summary: {
      totalPlansProcessed: plans.length,
      patchesGenerated: patches.length,
      patchesAutomated: automatedCount,
      patchesAiAssisted: aiAssistedCount,
      patchesManualRequired: manualRequiredCount,
      failedPatches: failedCount
    },
    patches
  };

  const outputPath = writePatchPackageDocument(folders, patchPackagePayload);

  logger.info(`Generated ${patches.length} patch packages (Automated: ${automatedCount}, AI-Assisted: ${aiAssistedCount}, Manual Required: ${manualRequiredCount}, Failed: ${failedCount})`);
  logger.success('Auto Fix Engine execution complete.');

  return outputPath;
}

export {
  loadFixPlans,
  writePatchPackageDocument
};
