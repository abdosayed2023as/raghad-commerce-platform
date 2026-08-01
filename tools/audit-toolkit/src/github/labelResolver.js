/**
 * Single source of truth for label assignment on generated GitHub issues.
 *
 * @param {object} spec Specification object from specifications.json
 * @param {string} issuePriority Resolved issue priority (Critical, High, Medium, Low)
 * @returns {string[]} Sorted unique list of labels
 */
export function resolveLabels(spec, issuePriority) {
  const labels = new Set();

  // Add priority label
  if (issuePriority) {
    labels.add(issuePriority.toLowerCase());
  }

  const titleLower = String(spec.title || '').toLowerCase();
  const problemLower = String(spec.problem || '').toLowerCase();
  const evidenceStr = JSON.stringify(spec.relatedEvidenceIds || []).toLowerCase();

  if (titleLower.includes('accessibility') || problemLower.includes('accessibility')) {
    labels.add('accessibility');
  } else if (titleLower.includes('seo') || problemLower.includes('seo')) {
    labels.add('seo');
  } else if (titleLower.includes('best practices') || problemLower.includes('best practices')) {
    labels.add('best-practices');
  } else if (titleLower.includes('console') || problemLower.includes('console') || evidenceStr.includes('cns')) {
    labels.add('console');
  } else if (titleLower.includes('network') || problemLower.includes('network') || evidenceStr.includes('net')) {
    labels.add('network');
  } else {
    labels.add('performance');
  }

  return Array.from(labels).sort();
}
