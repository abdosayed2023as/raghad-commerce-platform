import fs from 'fs';
import path from 'path';
import { buildFindings } from './findingBuilder.js';
import { writeFindingsDocument } from './findingWriter.js';
import { logger } from '../utils/logger.js';

export async function runFindingBuilder(config, folders) {
  logger.info('====================================================');
  logger.info('   DETERMINISTIC FINDING BUILDER V1 (AT-04)         ');
  logger.info('====================================================');

  const rulesPath = path.join(folders.analysis, 'rules.json');

  if (!fs.existsSync(rulesPath)) {
    const errorMsg = `[FINDING BUILDER ERROR] Required rules.json artifact missing at "${rulesPath}"`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  let rulesData;
  try {
    const raw = fs.readFileSync(rulesPath, 'utf8');
    rulesData = JSON.parse(raw);
  } catch (err) {
    const errorMsg = `[FINDING BUILDER ERROR] Failed to parse rules.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const targetUrl = config?.target || 'https://raghadkids.com';
  const findingsResult = buildFindings(rulesData, targetUrl);

  logger.info(`Generated ${findingsResult.summary.total} findings (${findingsResult.summary.critical} Critical, ${findingsResult.summary.high} High, ${findingsResult.summary.medium} Medium, ${findingsResult.summary.low} Low)`);

  const outputPath = writeFindingsDocument(folders, findingsResult);
  logger.success('Finding Builder execution complete.');
  return outputPath;
}
