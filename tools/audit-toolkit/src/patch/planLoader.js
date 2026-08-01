import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';
import { validateContract } from '../utils/contractValidator.js';

/**
 * Loads and validates fix-plans.json contract (AT-11).
 *
 * @param {object} folders Folders structure object
 * @returns {object} Parsed fix-plans contract
 */
export function loadFixPlans(folders) {
  let planPath = null;

  if (folders?.fixPlans) {
    planPath = path.join(folders.fixPlans, 'fix-plans.json');
  } else if (folders?.context) {
    planPath = path.join(path.dirname(folders.context), 'fix-plans', 'fix-plans.json');
  } else if (typeof folders === 'string') {
    planPath = path.join(folders, 'fix-plans.json');
  }

  if (!planPath || !fs.existsSync(planPath)) {
    const errorMsg = `[PLAN LOADER ERROR] Required fix-plans.json missing at "${planPath || 'unspecified path'}". Run AT-11 first.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const raw = fs.readFileSync(planPath, 'utf8');
    const fixPlansData = JSON.parse(raw);

    validateContract(fixPlansData, 'fix-plans.json', ['schemaVersion', 'summary', 'plans']);

    return fixPlansData;
  } catch (err) {
    const errorMsg = `[PLAN LOADER ERROR] Failed to parse fix-plans.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}
