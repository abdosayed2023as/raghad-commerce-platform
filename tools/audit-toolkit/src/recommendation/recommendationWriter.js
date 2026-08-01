import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Writes deterministic recommendations/recommendations.json document.
 *
 * @param {object|string} folders Object containing folders structure or string path
 * @param {object} recommendationsData Recommendations payload
 * @returns {string} Path to written recommendations.json
 */
export function writeRecommendationsDocument(folders, recommendationsData) {
  let targetDir = null;

  if (typeof folders === 'string') {
    targetDir = folders;
  } else if (folders?.recommendations) {
    targetDir = folders.recommendations;
  } else if (folders?.context) {
    targetDir = path.join(path.dirname(folders.context), 'recommendations');
  } else if (folders?.root) {
    targetDir = path.join(folders.root, 'recommendations');
  }

  if (!targetDir) {
    const errorMsg = '[RECOMMENDATION WRITER ERROR] Recommendations output directory is required.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const outputPath = path.join(targetDir, 'recommendations.json');

  const deterministicDoc = {
    schemaVersion: '1.0.0',
    run: recommendationsData.run || null,
    summary: recommendationsData.summary || {
      totalRecommendations: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    recommendations: recommendationsData.recommendations || []
  };

  const formattedJson = JSON.stringify(deterministicDoc, null, 2) + '\n';

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`Recommendations Intelligence document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[RECOMMENDATION WRITER ERROR] Failed to write recommendations.json: ${err.message}`, err);
    throw err;
  }
}
