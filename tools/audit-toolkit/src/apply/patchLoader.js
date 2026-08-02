import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';
import { validateContract } from '../utils/contractValidator.js';

/**
 * Loads and validates the patch-package.json contract (AT-12 output).
 * Implements fast-fail schema assertion on required top-level fields.
 *
 * @param {object|string} folders Folders structure object or string path to patches directory
 * @returns {object} Parsed and validated patch-package contract
 * @throws {Error} APP-001 PatchPackageMissing — if file is absent or unparseable
 */
export function loadPatchPackage(folders) {
  let patchesDir = null;

  if (typeof folders === 'string') {
    patchesDir = folders;
  } else if (folders?.patches) {
    patchesDir = folders.patches;
  } else if (folders?.root) {
    patchesDir = path.join(folders.root, 'patches');
  }

  if (!patchesDir) {
    const errorMsg = '[APP-001] PatchPackageMissing: patches directory is unresolvable from folders object.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const contractPath = path.join(patchesDir, 'patch-package.json');

  if (!fs.existsSync(contractPath)) {
    const errorMsg = `[APP-001] PatchPackageMissing: patch-package.json not found at "${contractPath}". Run AT-12 first.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  let raw;
  try {
    raw = fs.readFileSync(contractPath, 'utf8');
  } catch (err) {
    const errorMsg = `[APP-001] PatchPackageMissing: Cannot read patch-package.json — ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  let contract;
  try {
    contract = JSON.parse(raw);
  } catch (err) {
    const errorMsg = `[APP-001] PatchPackageMissing: patch-package.json is not valid JSON — ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  validateContract(contract, 'patch-package.json', ['engineVersion', 'run', 'summary', 'patches']);

  if (!Array.isArray(contract.patches)) {
    const errorMsg = '[APP-001] PatchPackageMissing: patch-package.json "patches" field must be an array.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  logger.info(`[PATCH LOADER] Loaded ${contract.patches.length} patches from patch-package.json (engine: ${contract.engineVersion}).`);

  return contract;
}
