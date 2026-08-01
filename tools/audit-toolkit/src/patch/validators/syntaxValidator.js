/**
 * Performs language-level syntax checks on modified code blocks.
 *
 * @param {string} targetFile Target file path
 * @param {string} unifiedDiff Unified diff text
 * @returns {object} { valid: boolean, error?: string, manualReviewReason?: string }
 */
export function validateLanguageSyntax(targetFile, unifiedDiff) {
  if (!unifiedDiff || typeof unifiedDiff !== 'string') {
    return { valid: true };
  }

  // Basic HTML bracket matching check for HTML files
  if (targetFile.endsWith('.html')) {
    const addedLines = unifiedDiff.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'));
    for (const line of addedLines) {
      const openBrackets = (line.match(/</g) || []).length;
      const closeBrackets = (line.match(/>/g) || []).length;
      if (openBrackets !== closeBrackets) {
        return {
          valid: false,
          error: 'Unmatched HTML angle brackets in added line.',
          manualReviewReason: 'ValidationFailed'
        };
      }
    }
  }

  return { valid: true };
}
