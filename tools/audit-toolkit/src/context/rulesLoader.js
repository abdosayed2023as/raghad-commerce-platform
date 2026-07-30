import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function loadRules(folders) {
  const rulesPath = path.join(folders.analysis, 'rules.json');

  if (!fs.existsSync(rulesPath)) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Required rules.json artifact missing at "${rulesPath}"`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const raw = fs.readFileSync(rulesPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Failed to parse rules.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}
