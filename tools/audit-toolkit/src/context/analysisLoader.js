import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function loadAnalysis(folders) {
  const analysisPath = path.join(folders.analysis, 'analysis.json');

  if (!fs.existsSync(analysisPath)) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Required analysis.json artifact missing at "${analysisPath}"`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const raw = fs.readFileSync(analysisPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Failed to parse analysis.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}
