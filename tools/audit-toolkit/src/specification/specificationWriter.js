import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Writes deterministic context/specifications.json document.
 *
 * @param {object|string} folders Object containing .context folder or string context path
 * @param {object} specData Specifications payload
 * @returns {string} Path to written specifications.json
 */
export function writeSpecificationsDocument(folders, specData) {
  const contextDir = typeof folders === 'string' ? folders : folders?.context;

  if (!contextDir) {
    const errorMsg = '[SPEC WRITER ERROR] Context output directory is required.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!fs.existsSync(contextDir)) {
    fs.mkdirSync(contextDir, { recursive: true });
  }

  const outputPath = path.join(contextDir, 'specifications.json');

  const deterministicDoc = {
    schemaVersion: '1.0.0',
    summary: specData.summary || {
      totalSpecifications: 0,
      p0: 0,
      p1: 0,
      p2: 0,
      p3: 0
    },
    specifications: specData.specifications || []
  };

  const formattedJson = JSON.stringify(deterministicDoc, null, 2) + '\n';

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`Developer specifications document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[SPEC WRITER ERROR] Failed to write specifications.json: ${err.message}`, err);
    throw err;
  }
}
