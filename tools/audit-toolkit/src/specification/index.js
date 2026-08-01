import fs from 'fs';
import path from 'path';
import { buildSpecifications } from './specificationBuilder.js';
import { writeSpecificationsDocument } from './specificationWriter.js';
import { logger } from '../utils/logger.js';
import { validateContract } from '../utils/contractValidator.js';

/**
 * Pipeline entry point for Specification Generator V1 (AT-08).
 * Consumes report.json (and optional comparison) to produce context/specifications.json.
 *
 * @param {object} configOrFolders Configuration object or folders object
 * @param {object} [foldersParam] Folders structure object
 * @param {object} [options] Optional configuration options including comparison data or path
 * @returns {Promise<string>} Output file path
 */
export async function runSpecificationGenerator(configOrFolders, foldersParam, options = {}) {
  logger.info('====================================================');
  logger.info('   SPECIFICATION GENERATOR V1 (AT-08)               ');
  logger.info('====================================================');

  const folders = foldersParam || configOrFolders;
  const contextDir = folders?.context;

  if (!contextDir) {
    const errorMsg = '[SPECIFICATION GENERATOR ERROR] Invalid folders object provided.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const reportPath = path.join(contextDir, 'report.json');

  if (!fs.existsSync(reportPath)) {
    const errorMsg = `[SPECIFICATION GENERATOR ERROR] Required report.json missing at "${reportPath}". Run AT-06 first.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  let report = {};
  try {
    report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch (err) {
    const errorMsg = `[SPECIFICATION GENERATOR ERROR] Failed to parse report.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  validateContract(report, 'report.json', ['schemaVersion', 'executiveSummary', 'recommendations', 'traceability']);

  // Load comparison ONLY if explicitly passed via parameters or folders (no hardcoded global paths)
  let comparison = options?.comparison || folders?.comparisonData || null;
  const compPath = options?.comparisonPath || folders?.comparisonPath || null;

  if (!comparison && compPath && fs.existsSync(compPath)) {
    try {
      comparison = JSON.parse(fs.readFileSync(compPath, 'utf8'));
    } catch (err) {
      logger.warn(`[SPECIFICATION GENERATOR] Provided comparisonPath could not be parsed: ${err.message}`);
    }
  }

  if (comparison) {
    validateContract(comparison, 'comparison.json', ['schemaVersion', 'baselineRun', 'targetRun', 'summary', 'metrics', 'findings']);
  }

  const specData = buildSpecifications(report, comparison);
  const outputPath = writeSpecificationsDocument(folders, specData);

  logger.info(`Generated ${specData.summary.totalSpecifications} specifications (P0: ${specData.summary.p0}, P1: ${specData.summary.p1}, P2: ${specData.summary.p2}, P3: ${specData.summary.p3})`);
  logger.success('Specification Generator execution complete.');

  return outputPath;
}

export {
  buildSpecifications,
  writeSpecificationsDocument
};
