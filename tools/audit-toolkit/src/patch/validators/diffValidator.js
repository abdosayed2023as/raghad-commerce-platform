/**
 * Validates Git unified diff syntax structure and hunk headers.
 *
 * @param {string} unifiedDiff Candidate diff string
 * @returns {object} { valid: boolean, error?: string, manualReviewReason?: string }
 */
export function validateDiffSyntax(unifiedDiff) {
  if (!unifiedDiff || typeof unifiedDiff !== 'string' || !unifiedDiff.trim()) {
    return {
      valid: false,
      error: 'Unified diff content is empty or null.',
      manualReviewReason: 'ValidationFailed'
    };
  }

  const lines = unifiedDiff.trim().split(/\r?\n/);
  const hasHeader = lines.some(l => l.startsWith('--- ')) && lines.some(l => l.startsWith('+++ '));

  if (!hasHeader) {
    return {
      valid: false,
      error: 'Unified diff missing standard header markers ("--- a/..." and "+++ b/...").',
      manualReviewReason: 'ValidationFailed'
    };
  }

  const hasHunk = lines.some(l => /^@@ -\d+(,\d+)? \+\d+(,\d+)? @@/.test(l));
  if (!hasHunk) {
    return {
      valid: false,
      error: 'Unified diff missing hunk range marker (@@ -L,C +L,C @@).',
      manualReviewReason: 'ValidationFailed'
    };
  }

  return { valid: true };
}
