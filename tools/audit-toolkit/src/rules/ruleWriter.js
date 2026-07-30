import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function writeRulesDocument(folders, rulesResult) {
  const analysisDir = folders.analysis;

  if (!fs.existsSync(analysisDir)) {
    fs.mkdirSync(analysisDir, { recursive: true });
  }

  const outputPath = path.join(analysisDir, 'rules.json');
  const formattedJson = JSON.stringify({ schemaVersion: '1.0.0', ...rulesResult }, null, 2);

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`Deterministic rules document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[RULE ENGINE ERROR] Failed to write rules.json: ${err.message}`, err);
    throw err;
  }
}
