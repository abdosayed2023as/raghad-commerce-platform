import path from 'path';
import { normalizePath } from '../../codebase/pathNormalizer.js';

/**
 * Validates that candidate target file path is within authorized project repository boundaries.
 * Prevents directory traversal attacks (e.g. ../../etc/passwd).
 *
 * @param {string} rootDir Root repository directory
 * @param {string} targetFile Relative target file path
 * @returns {object} { valid: boolean, error?: string, manualReviewReason?: string }
 */
export function validateBoundary(rootDir, targetFile) {
  if (!targetFile || typeof targetFile !== 'string') {
    return {
      valid: false,
      error: 'Target file path is null or invalid.',
      manualReviewReason: 'CrossFileModification'
    };
  }

  const norm = normalizePath(targetFile);
  if (norm.startsWith('../') || norm.includes('/../')) {
    return {
      valid: false,
      error: 'Directory traversal detected in target file path.',
      manualReviewReason: 'CrossFileModification'
    };
  }

  const resolved = path.resolve(rootDir, norm);
  const resolvedRoot = path.resolve(rootDir);

  if (!resolved.startsWith(resolvedRoot)) {
    return {
      valid: false,
      error: 'Target file path escapes repository root boundary.',
      manualReviewReason: 'CrossFileModification'
    };
  }

  return { valid: true };
}
