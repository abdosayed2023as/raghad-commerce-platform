import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function writeReportDocument(folders, reportDoc) {
  const contextDir = folders.context;

  if (!fs.existsSync(contextDir)) {
    fs.mkdirSync(contextDir, { recursive: true });
  }

  const outputPath = path.join(contextDir, 'report.json');
  const formattedJson = JSON.stringify(reportDoc, null, 2);

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`Versioned report document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[REPORT BUILDER ERROR] Failed to write report.json: ${err.message}`, err);
    throw err;
  }
}
