import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';
import { validateContract } from '../../utils/contractValidator.js';

export function analyzeManifest(folders) {
  const manifestPath = path.join(folders.manifest, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    logger.warn(`[ANALYZER] Manifest artifact missing: "${manifestPath}". Using fallback run metadata.`);
    return {
      runId: folders.runTimestamp || null,
      timestamp: new Date().toISOString(),
      target: null,
      environment: null
    };
  }

  try {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);

    validateContract(manifest, 'manifest.json', ['schemaVersion', 'runId', 'executionStatus']);

    const runId = manifest.run?.runId || manifest.runId || folders.runTimestamp || null;

    return {
      runId,
      timestamp: manifest.timestamp || null,
      target: manifest.targetUrl || manifest.run?.target || null,
      environment: manifest.environment || manifest.run?.environment || null
    };
  } catch (err) {
    logger.warn(`[ANALYZER] Failed to parse manifest.json: ${err.message}`);
    return {
      runId: folders.runTimestamp || null,
      timestamp: new Date().toISOString(),
      target: null,
      environment: null
    };
  }
}
