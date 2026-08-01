import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Writes deterministic fix-plans/fix-plans.json document.
 *
 * @param {object|string} folders Object containing folders structure or string path
 * @param {object} fixPlansData Fix plans payload
 * @returns {string} Path to written fix-plans.json
 */
export function writeFixPlansDocument(folders, fixPlansData) {
  let targetDir = null;

  if (typeof folders === 'string') {
    targetDir = folders;
  } else if (folders?.fixPlans) {
    targetDir = folders.fixPlans;
  } else if (folders?.context) {
    targetDir = path.join(path.dirname(folders.context), 'fix-plans');
  } else if (folders?.root) {
    targetDir = path.join(folders.root, 'fix-plans');
  }

  if (!targetDir) {
    const errorMsg = '[FIX PLAN WRITER ERROR] Fix plans output directory is required.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const outputPath = path.join(targetDir, 'fix-plans.json');

  const deterministicDoc = {
    schemaVersion: '1.0.0',
    run: fixPlansData.run || null,
    summary: fixPlansData.summary || {
      totalPlans: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    plans: fixPlansData.plans || []
  };

  const formattedJson = JSON.stringify(deterministicDoc, null, 2) + '\n';

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`AI Fix Planner document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[FIX PLAN WRITER ERROR] Failed to write fix-plans.json: ${err.message}`, err);
    throw err;
  }
}
