import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';
import { getToolkitVersion } from '../utils/version.js';

export function generateTechnicalManifest(config, folders, artifactTracker, startTime, endTime) {
  const manifestPath = path.join(folders.manifest, 'manifest.json');

  const generatedArtifacts = [];
  const failedArtifacts = artifactTracker.failures || [];

  function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        // Exclude logs directory from evidence manifest
        if (item.name === 'logs') continue;
        scanDirectory(fullPath);
      } else if (item.isFile() && item.name !== 'manifest.json' && !item.name.endsWith('.log.tmp')) {
        const stats = fs.statSync(fullPath);
        const relPath = path.relative(folders.root, fullPath).replace(/\\/g, '/');
        generatedArtifacts.push({
          category: getCategoryFromPath(relPath),
          path: relPath,
          sizeBytes: stats.size,
          status: 'SUCCESS'
        });
      }
    }
  }

  scanDirectory(folders.root);

  let status = 'SUCCESS';
  if (failedArtifacts.length > 0) {
    status = generatedArtifacts.length > 0 ? 'PARTIAL_FAILURE' : 'FAILURE';
  }

  const timestampIso = new Date().toISOString();

  const manifestData = {
    schemaVersion: '1.0.0',
    toolVersion: getToolkitVersion(),
    runId: folders.runTimestamp,
    run: {
      runId: folders.runTimestamp,
      timestamp: timestampIso,
      target: config.target,
      environment: config.environment
    },
    timestamp: timestampIso,
    executionTimeMs: endTime - startTime,
    targetUrl: config.target,
    environment: config.environment,
    browser: 'Chromium',
    browserInfo: artifactTracker.browserInfo || { type: 'Chromium', path: null, resolved: true },
    warnings: artifactTracker.warnings || [],
    headless: config.headless,
    maxRetries: config.maxRetries,
    viewports: config.viewports,
    executionStatus: status,
    generatedArtifactsCount: generatedArtifacts.length,
    failedArtifactsCount: failedArtifacts.length,
    generatedArtifacts,
    failedArtifacts
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');
  logger.success(`Technical manifest generated: ${manifestPath}`);
  return manifestData;
}

function getCategoryFromPath(relPath) {
  if (relPath.startsWith('screenshots/desktop')) return 'Visual (Desktop)';
  if (relPath.startsWith('screenshots/mobile')) return 'Visual (Mobile)';
  if (relPath.startsWith('performance')) return 'Performance (Lighthouse)';
  if (relPath.startsWith('console')) return 'Technical (Console Log)';
  if (relPath.startsWith('network')) return 'Network (HAR)';
  return 'General Artifact';
}
