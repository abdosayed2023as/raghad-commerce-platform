import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';
import { validateContract } from '../utils/contractValidator.js';

export function loadManifest(folders) {
  const manifestPath = path.join(folders.manifest, 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Required manifest.json artifact missing at "${manifestPath}"`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);

    validateContract(manifest, 'manifest.json', ['schemaVersion', 'executionStatus']);

    const runSection = {
      runId: manifest.run?.runId || manifest.runId || folders.runTimestamp || null,
      timestamp: manifest.timestamp || manifest.run?.timestamp || null,
      target: manifest.targetUrl || manifest.run?.target || null,
      environment: manifest.environment || manifest.run?.environment || null
    };

    const manifestSection = {
      generatedArtifactsCount: manifest.generatedArtifactsCount ?? 0,
      failedArtifacts: manifest.failedArtifacts || [],
      browserInfo: manifest.browserInfo || null,
      warnings: manifest.warnings || [],
      status: manifest.executionStatus || "UNKNOWN"
    };

    return { runSection, manifestSection };
  } catch (err) {
    const errorMsg = `[CONTEXT BUILDER ERROR] Failed to parse manifest.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}
