import fs from 'fs';
import path from 'path';
import { buildReport } from './reportBuilder.js';
import { writeReportDocument } from './reportWriter.js';
import { logger } from '../utils/logger.js';

export async function runReportBuilder(config, folders) {
  logger.info('====================================================');
  logger.info('   AI REPORT BUILDER V1 (AT-06)                     ');
  logger.info('====================================================');

  const packagePath = path.join(folders.context, 'audit-package.json');

  if (!fs.existsSync(packagePath)) {
    const errorMsg = `[REPORT BUILDER ERROR] Required audit-package.json artifact missing at "${packagePath}"`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  let auditPackage;
  try {
    const raw = fs.readFileSync(packagePath, 'utf8');
    auditPackage = JSON.parse(raw);
  } catch (err) {
    const errorMsg = `[REPORT BUILDER ERROR] Failed to parse audit-package.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const providerName = config.reportProvider || 'mock';
  const reportDoc = await buildReport(auditPackage, providerName);

  const recCount = Array.isArray(reportDoc.recommendations) ? reportDoc.recommendations.length : 0;
  logger.info(`Generated report (v${reportDoc.reportVersion}) with ${recCount} recommendations using provider "${providerName}"`);

  const outputPath = writeReportDocument(folders, reportDoc);
  logger.success('AI Report Builder execution complete.');
  return outputPath;
}
