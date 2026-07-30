import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

export function analyzeManifest(folders) {
  const manifestPath = path.join(folders.manifest, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    logger.warn(`[ANALYZER] Manifest artifact missing: "${manifestPath}". Using fallback run metadata.`);
    return {
      id: folders.runTimestamp || null,
      timestamp: new Date().toISOString(),
      target: null,
      environment: null
    };
  }

  try {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

    return {
      id: manifest.runId || folders.runTimestamp || null,
      timestamp: manifest.timestamp || null,
      target: manifest.targetUrl || null,
      environment: manifest.environment || null
    };
  } catch (err) {
    logger.warn(`[ANALYZER] Failed to parse manifest.json: ${err.message}`);
    return {
      id: folders.runTimestamp || null,
      timestamp: new Date().toISOString(),
      target: null,
      environment: null
    };
  }
}
