import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function writeContextPackage(folders, auditPackage) {
  const contextDir = folders.context;

  if (!fs.existsSync(contextDir)) {
    fs.mkdirSync(contextDir, { recursive: true });
  }

  const outputPath = path.join(contextDir, 'audit-package.json');
  const formattedJson = JSON.stringify(auditPackage, null, 2);

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`Audit context package written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[CONTEXT BUILDER ERROR] Failed to write audit-package.json: ${err.message}`, err);
    throw err;
  }
}
