/**
 * Builds a deterministic, stable fingerprint string for a specification/issue.
 * Format: {RULE_ID}::{SLUG}::{VIEWPORT}
 * Example: PERF_LCP_001::homepage::mobile
 *
 * @param {object} spec Specification contract from specifications.json
 * @returns {string} Deterministic fingerprint string
 */
export function buildFingerprint(spec) {
  let ruleId = null;
  let slug = 'homepage';
  let viewport = 'desktop';

  const criteriaText = Array.isArray(spec.acceptanceCriteria) ? spec.acceptanceCriteria.join(' ') : '';
  const problemText = String(spec.problem || '');
  const titleText = String(spec.title || '');

  // 1. Extract Rule ID
  const ruleMatch = (criteriaText + ' ' + problemText).match(/\b([A-Z0-9_]{3,}_[0-9]{3})\b/);
  if (ruleMatch) {
    ruleId = ruleMatch[1];
  } else {
    if (titleText.includes('Desktop Performance')) ruleId = 'PERF_SCORE_DESKTOP_001';
    else if (titleText.includes('Mobile Performance')) ruleId = 'PERF_SCORE_MOBILE_001';
    else if (titleText.includes('Desktop Best Practices')) ruleId = 'BEST_PRACTICES_SCORE_DESKTOP_001';
    else if (titleText.includes('Mobile Best Practices')) ruleId = 'BEST_PRACTICES_SCORE_MOBILE_001';
    else if (titleText.includes('Desktop Accessibility')) ruleId = 'ACCESSIBILITY_SCORE_DESKTOP_001';
    else if (titleText.includes('Mobile Accessibility')) ruleId = 'ACCESSIBILITY_SCORE_MOBILE_001';
    else if (titleText.includes('Desktop SEO')) ruleId = 'SEO_SCORE_DESKTOP_001';
    else if (titleText.includes('Mobile SEO')) ruleId = 'SEO_SCORE_MOBILE_001';
    else if (titleText.includes('Largest Contentful Paint') || titleText.includes('LCP')) ruleId = 'PERF_LCP_001';
    else if (titleText.includes('Cumulative Layout Shift') || titleText.includes('CLS')) ruleId = 'PERF_CLS_001';
    else if (titleText.includes('Next Paint') || titleText.includes('TBT') || titleText.includes('INP')) ruleId = 'PERF_INP_001';
    else if (titleText.includes('Console Errors')) ruleId = 'CONSOLE_ERRORS_001';
    else if (titleText.includes('Console Warnings')) ruleId = 'CONSOLE_WARNINGS_001';
    else if (titleText.includes('Failed HTTP Requests') || titleText.includes('Failed Network')) ruleId = 'NETWORK_FAILED_REQUESTS_001';
    else if (titleText.includes('Transferred Bytes')) ruleId = 'NETWORK_TRANSFERRED_BYTES_001';
    else if (titleText.includes('HTTP Request Count') || titleText.includes('Request Count')) ruleId = 'NETWORK_REQUEST_COUNT_001';
    else ruleId = spec.specificationId || 'GENERIC_RULE_001';
  }

  // 2. Extract Evidence Slug & Viewport from relatedEvidenceIds
  const evidenceIds = Array.isArray(spec.relatedEvidenceIds) ? spec.relatedEvidenceIds : [];
  for (const evd of evidenceIds) {
    const parts = String(evd).split('-');
    if (parts.length >= 4) {
      const evdViewport = parts[2].toLowerCase();
      const evdSlug = parts.slice(3).join('_').toLowerCase();
      if (['desktop', 'mobile', 'all'].includes(evdViewport)) {
        viewport = evdViewport;
      }
      if (evdSlug) {
        slug = evdSlug;
      }
      break;
    }
  }

  // Fallback viewport check if evidence ID didn't specify
  if (ruleId.includes('MOBILE') || ruleId.startsWith('PERF_LCP') || ruleId.startsWith('PERF_CLS') || ruleId.startsWith('PERF_INP')) {
    viewport = 'mobile';
  } else if (ruleId.includes('DESKTOP')) {
    viewport = 'desktop';
  }

  return `${ruleId}::${slug}::${viewport}`;
}
