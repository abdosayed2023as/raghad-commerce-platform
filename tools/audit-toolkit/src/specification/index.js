import fs from 'fs';
import path from 'path';
import { buildSpecifications } from './specificationBuilder.js';
import { writeSpecificationsDocument } from './specificationWriter.js';
import { logger } from '../utils/logger.js';

/**
 * Pipeline entry point for Specification Generator V1 (AT-08).
 * Consumes report.json (and optional comparison.json) to produce context/specifications.json.
 *
 * @param {object} configOrFolders Configuration object or folders object
 * @param {object} [foldersParam] Folders structure object
 * @returns {Promise<string>} Output file path
 */
export async function runSpecificationGenerator(configOrFolders, foldersParam) {
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

  // Optionally load comparison.json if available
  let comparison = null;
  const compPath = path.resolve(process.cwd(), 'output', 'comparison', 'comparison.json');
  if (fs.existsSync(compPath)) {
    try {
      comparison = JSON.parse(fs.readFileSync(compPath, 'utf8'));
    } catch (_e) {
      // Optional contract
    }
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
