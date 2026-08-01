import fs from 'fs';
import { logger } from '../utils/logger.js';

/**
 * @typedef {Object} FoldersInterface
 * @property {string} root - Root evidence run directory path
 * @property {string} runTimestamp - Canonical run timestamp string
 * @property {string} screenshotsDesktop - Path to desktop screenshots folder
 * @property {string} screenshotsMobile - Path to mobile screenshots folder
 * @property {string} performance - Path to performance audit folder
 * @property {string} console - Path to console logs folder
 * @property {string} network - Path to network HAR folder
 * @property {string} accessibility - Path to accessibility folder
 * @property {string} seo - Path to SEO folder
 * @property {string} manifest - Path to technical manifest folder
 * @property {string} analysis - Path to metrics analysis folder
 * @property {string} context - Path to context package folder
 * @property {string} recommendations - Path to recommendations folder
 * @property {string} fixPlans - Path to fix plans folder
 * @property {string} patches - Path to patches folder
 * @property {string} logs - Path to run logs folder
 */

export const ALL_FOLDER_KEYS = [
  'root',
  'runTimestamp',
  'screenshotsDesktop',
  'screenshotsMobile',
  'performance',
  'console',
  'network',
  'accessibility',
  'seo',
  'manifest',
  'analysis',
  'context',
  'recommendations',
  'fixPlans',
  'patches',
  'logs'
];

/**
 * Validates the folder interface structure at pipeline startup.
 * Fails fast if any expected folder key or directory path is missing.
 *
 * @param {FoldersInterface} folders Folders object
 * @param {string[]} [requiredKeys] Optional subset of keys to validate
 * @returns {boolean} True if valid
 * @throws {Error} Fast-fail error if folder structure is invalid
 */
export function validateFolderStructure(folders, requiredKeys = ALL_FOLDER_KEYS) {
  if (!folders || typeof folders !== 'object') {
    const errorMsg = '[FOLDER VALIDATION ERROR] Folders object is null or undefined.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  for (const key of requiredKeys) {
    if (!folders[key]) {
      const errorMsg = `[FOLDER VALIDATION ERROR] Missing required folder key: "${key}"`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (key !== 'runTimestamp' && !fs.existsSync(folders[key])) {
      const errorMsg = `[FOLDER VALIDATION ERROR] Folder path for "${key}" does not exist on filesystem: "${folders[key]}"`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  return true;
}
