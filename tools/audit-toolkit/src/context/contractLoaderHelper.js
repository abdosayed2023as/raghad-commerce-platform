import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function loadContextArtifact(folderPath, filename, artifactTitle) {
  const artifactPath = path.join(folderPath, filename);

  if (!fs.existsSync(artifactPath)) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Required ${artifactTitle} artifact missing at "${artifactPath}"`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const raw = fs.readFileSync(artifactPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Failed to parse ${artifactTitle}: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}
