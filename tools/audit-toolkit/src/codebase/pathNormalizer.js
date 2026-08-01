import path from 'path';

/**
 * Normalizes cross-platform file paths into canonical forward-slash format.
 * Strips leading './' and handles Windows backslashes.
 *
 * @param {string} filePath Input path
 * @returns {string} Normalized path
 */
export function normalizePath(filePath) {
  if (!filePath || typeof filePath !== 'string') return '';
  let normalized = filePath.replace(/\\/g, '/');
  if (normalized.startsWith('./')) {
    normalized = normalized.slice(2);
  }
  return normalized;
}

/**
 * Resolves a safe relative path from root directory.
 * @param {string} rootDir Root directory
 * @param {string} targetPath Target file path
 * @returns {string} Relative path
 */
export function getRelativePath(rootDir, targetPath) {
  const rel = path.relative(rootDir, targetPath);
  return normalizePath(rel);
}
