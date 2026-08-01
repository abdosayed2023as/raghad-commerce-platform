import { logger } from './logger.js';

/**
 * Validates contract schemaVersion and essential required top-level keys.
 * Fails fast with descriptive error if validation fails.
 *
 * @param {object} contract Data object of the contract
 * @param {string} contractName Human-readable contract name (e.g., "manifest.json")
 * @param {string[]} requiredKeys Array of required top-level keys
 * @returns {boolean} True if valid
 * @throws {Error} Fast-fail error if contract is missing or invalid
 */
export function validateContract(contract, contractName, requiredKeys = []) {
  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
    const errorMsg = `[CONTRACT VALIDATION ERROR] Contract "${contractName}" must be a valid non-null object.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!contract.schemaVersion) {
    const errorMsg = `[CONTRACT VALIDATION ERROR] Contract "${contractName}" is missing mandatory "schemaVersion" field.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  for (const key of requiredKeys) {
    if (contract[key] === undefined || contract[key] === null) {
      const errorMsg = `[CONTRACT VALIDATION ERROR] Contract "${contractName}" is missing required top-level key: "${key}".`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  return true;
}
