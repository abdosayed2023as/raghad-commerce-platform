import fs from 'fs';
import path from 'path';
import { buildFixPlans } from './fixPlanBuilder.js';
import { writeFixPlansDocument } from './fixPlanWriter.js';
import { logger } from '../utils/logger.js';
import { validateContract } from '../utils/contractValidator.js';

/**
 * Pipeline entry point for AI Fix Planner V2 (AT-11).
 * Consumes ONLY recommendations.json to produce fix-plans/fix-plans.json.
 *
 * @param {object} configOrFolders Configuration object or folders object
 * @param {object} [foldersParam] Folders structure object
 * @returns {Promise<string>} Output file path
 */
export async function runFixPlanner(configOrFolders, foldersParam) {
  logger.info('====================================================');
  logger.info('   AI FIX PLANNER V2 (AT-11)                        ');
  logger.info('====================================================');

  const folders = foldersParam || configOrFolders;

  let recPath = null;
  if (folders?.recommendations) {
    recPath = path.join(folders.recommendations, 'recommendations.json');
  } else if (folders?.context) {
    recPath = path.join(path.dirname(folders.context), 'recommendations', 'recommendations.json');
  } else if (typeof folders === 'string') {
    recPath = path.join(folders, 'recommendations.json');
  }

  if (!recPath || !fs.existsSync(recPath)) {
    const errorMsg = `[FIX PLANNER ERROR] Required recommendations.json missing at "${recPath || 'unspecified path'}". Run AT-10 first.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  let recommendationsData = {};
  try {
    recommendationsData = JSON.parse(fs.readFileSync(recPath, 'utf8'));
  } catch (err) {
    const errorMsg = `[FIX PLANNER ERROR] Failed to parse recommendations.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  validateContract(recommendationsData, 'recommendations.json', ['schemaVersion', 'summary', 'recommendations']);

  const fixPlansData = buildFixPlans(recommendationsData);
  const outputPath = writeFixPlansDocument(folders, fixPlansData);

  logger.info(`Generated ${fixPlansData.summary.totalPlans} execution fix plans (Critical: ${fixPlansData.summary.critical}, High: ${fixPlansData.summary.high}, Medium: ${fixPlansData.summary.medium}, Low: ${fixPlansData.summary.low})`);
  logger.success('AI Fix Planner execution complete.');

  return outputPath;
}

export {
  buildFixPlans,
  writeFixPlansDocument
};
