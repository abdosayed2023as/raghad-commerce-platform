/**
 * Scans candidate diff content for security violations, credential leaks, or unsafe file deletions.
 *
 * @param {string} unifiedDiff Unified diff text
 * @returns {object} { valid: boolean, error?: string, manualReviewReason?: string }
 */
export function validateSecurity(unifiedDiff) {
  if (!unifiedDiff || typeof unifiedDiff !== 'string') {
    return { valid: true };
  }

  // Detect potential hardcoded API secrets or private keys added in diff
  const secretPattern = /(?:api[_-]?key|secret|password|private[_-]?key)\s*[:=]\s*["'][A-Za-z0-9_\-]{16,}["']/i;
  if (secretPattern.test(unifiedDiff)) {
    return {
      valid: false,
      error: 'Potential hardcoded secret or API credential detected in patch diff.',
      manualReviewReason: 'UnsafeDelete'
    };
  }

  // Detect unsafe bulk deletions
  const deletionLines = unifiedDiff.split('\n').filter(l => l.startsWith('-') && !l.startsWith('---'));
  if (deletionLines.length > 80) {
    return {
      valid: false,
      error: 'Patch contains excessive bulk deletions (>80 lines).',
      manualReviewReason: 'UnsafeDelete'
    };
  }

  return { valid: true };
}
