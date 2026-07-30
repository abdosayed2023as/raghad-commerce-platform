import fs from 'fs';
import path from 'path';
import { runRuleEngine } from './ruleEngine.js';
import { writeRulesDocument } from './ruleWriter.js';
import { logger } from '../utils/logger.js';

export async function runRuleEnginePipeline(folders) {
  logger.info('====================================================');
  logger.info('   DETERMINISTIC RULE ENGINE V1 (AT-03)             ');
  logger.info('====================================================');

  const analysisPath = path.join(folders.analysis, 'analysis.json');

  if (!fs.existsSync(analysisPath)) {
    const errorMsg = `[RULE ENGINE ERROR] Required analysis.json artifact missing at "${analysisPath}"`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  let analysisData;
  try {
    const raw = fs.readFileSync(analysisPath, 'utf8');
    analysisData = JSON.parse(raw);
  } catch (err) {
    const errorMsg = `[RULE ENGINE ERROR] Failed to parse analysis.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const rulesResult = runRuleEngine(analysisData);

  logger.info(`Evaluated ${rulesResult.summary.total} rules: ${rulesResult.summary.passed} PASSED, ${rulesResult.summary.failed} FAILED, ${rulesResult.summary.skipped} SKIPPED`);

  const outputPath = writeRulesDocument(folders, rulesResult);
  logger.success('Rule Engine evaluation complete.');
  return outputPath;
}
