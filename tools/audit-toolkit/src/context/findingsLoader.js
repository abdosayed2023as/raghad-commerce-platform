import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function loadFindings(folders) {
  const findingsPath = path.join(folders.analysis, 'findings.json');

  if (!fs.existsSync(findingsPath)) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Required findings.json artifact missing at "${findingsPath}"`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const raw = fs.readFileSync(findingsPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Failed to parse findings.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}
