import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function writeFindingsDocument(folders, findingsResult) {
  const analysisDir = folders.analysis;

  if (!fs.existsSync(analysisDir)) {
    fs.mkdirSync(analysisDir, { recursive: true });
  }

  const outputPath = path.join(analysisDir, 'findings.json');
  const formattedJson = JSON.stringify({ schemaVersion: '1.0.0', ...findingsResult }, null, 2);

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`Deterministic findings document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[FINDING BUILDER ERROR] Failed to write findings.json: ${err.message}`, err);
    throw err;
  }
}
