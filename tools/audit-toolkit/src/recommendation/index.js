import fs from 'fs';
import path from 'path';
import { buildRecommendations } from './recommendationBuilder.js';
import { writeRecommendationsDocument } from './recommendationWriter.js';
import { logger } from '../utils/logger.js';
import { validateContract } from '../utils/contractValidator.js';

/**
 * Pipeline entry point for Recommendation Intelligence Engine V2 (AT-10).
 * Consumes ONLY report.json to produce recommendations/recommendations.json.
 *
 * @param {object} configOrFolders Configuration object or folders object
 * @param {object} [foldersParam] Folders structure object
 * @returns {Promise<string>} Output file path
 */
export async function runRecommendationEngine(configOrFolders, foldersParam) {
  logger.info('====================================================');
  logger.info('   RECOMMENDATION INTELLIGENCE ENGINE V2 (AT-10)    ');
  logger.info('====================================================');

  const folders = foldersParam || configOrFolders;
  const contextDir = folders?.context;

  if (!contextDir) {
    const errorMsg = '[RECOMMENDATION ENGINE ERROR] Invalid folders object provided (missing context path).';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const reportPath = path.join(contextDir, 'report.json');

  if (!fs.existsSync(reportPath)) {
    const errorMsg = `[RECOMMENDATION ENGINE ERROR] Required report.json missing at "${reportPath}". Run AT-06 first.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  let report = {};
  try {
    report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch (err) {
    const errorMsg = `[RECOMMENDATION ENGINE ERROR] Failed to parse report.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  validateContract(report, 'report.json', ['schemaVersion', 'executiveSummary', 'recommendations', 'traceability']);

  const recommendationsData = buildRecommendations(report);
  const outputPath = writeRecommendationsDocument(folders, recommendationsData);

  logger.info(`Generated ${recommendationsData.summary.totalRecommendations} recommendations (Critical: ${recommendationsData.summary.critical}, High: ${recommendationsData.summary.high}, Medium: ${recommendationsData.summary.medium}, Low: ${recommendationsData.summary.low})`);
  logger.success('Recommendation Intelligence Engine execution complete.');

  return outputPath;
}

export {
  buildRecommendations,
  writeRecommendationsDocument
};
