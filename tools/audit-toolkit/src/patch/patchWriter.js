import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Writes canonical patch-package.json contract document.
 * Conforms to PATCH 4, PATCH 10, and PATCH 11 frozen schema specifications.
 *
 * @param {object|string} folders Object containing folders structure or string path
 * @param {object} patchPackageData Patch package payload
 * @returns {string} Path to written patch-package.json
 */
export function writePatchPackageDocument(folders, patchPackageData) {
  let targetDir = null;

  if (typeof folders === 'string') {
    targetDir = folders;
  } else if (folders?.patches) {
    targetDir = folders.patches;
  } else if (folders?.context) {
    targetDir = path.join(path.dirname(folders.context), 'patches');
  } else if (folders?.root) {
    targetDir = path.join(folders.root, 'patches');
  }

  if (!targetDir) {
    const errorMsg = '[PATCH WRITER ERROR] Patches output directory is required.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const outputPath = path.join(targetDir, 'patch-package.json');

  const deterministicDoc = {
    schemaVersion: '1.0.0',
    engineVersion: 'AT12-2.0.0',
    run: patchPackageData.run || null,
    summary: patchPackageData.summary || {
      totalPlansProcessed: 0,
      patchesGenerated: 0,
      patchesAutomated: 0,
      patchesAiAssisted: 0,
      patchesManualRequired: 0,
      failedPatches: 0
    },
    patches: patchPackageData.patches || []
  };

  const formattedJson = JSON.stringify(deterministicDoc, null, 2) + '\n';

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`Auto Fix Engine patch package document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[PATCH WRITER ERROR] Failed to write patch-package.json: ${err.message}`, err);
    throw err;
  }
}
