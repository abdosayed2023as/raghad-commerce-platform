/**
 * Specification of metrics to compare between baseline and target runs.
 */
const METRIC_DEFINITIONS = [
  // Performance Scores
  { key: 'performance.desktop.performance', category: 'Performance', title: 'Desktop Performance Score', higherIsBetter: true },
  { key: 'performance.desktop.accessibility', category: 'Accessibility', title: 'Desktop Accessibility Score', higherIsBetter: true },
  { key: 'performance.desktop.bestPractices', category: 'Best Practices', title: 'Desktop Best Practices Score', higherIsBetter: true },
  { key: 'performance.desktop.seo', category: 'SEO', title: 'Desktop SEO Score', higherIsBetter: true },
  { key: 'performance.mobile.performance', category: 'Performance', title: 'Mobile Performance Score', higherIsBetter: true },
  { key: 'performance.mobile.accessibility', category: 'Accessibility', title: 'Mobile Accessibility Score', higherIsBetter: true },
  { key: 'performance.mobile.bestPractices', category: 'Best Practices', title: 'Mobile Best Practices Score', higherIsBetter: true },
  { key: 'performance.mobile.seo', category: 'SEO', title: 'Mobile SEO Score', higherIsBetter: true },

  // Core Web Vitals
  { key: 'performance.coreWebVitals.lcp', category: 'Performance', title: 'Largest Contentful Paint (LCP)', higherIsBetter: false },
  { key: 'performance.coreWebVitals.cls', category: 'Performance', title: 'Cumulative Layout Shift (CLS)', higherIsBetter: false },
  { key: 'performance.coreWebVitals.inp', category: 'Performance', title: 'Interaction to Next Paint (INP)', higherIsBetter: false },

  // Console
  { key: 'console.errors', category: 'Console', title: 'Console Errors', higherIsBetter: false },
  { key: 'console.warnings', category: 'Console', title: 'Console Warnings', higherIsBetter: false },

  // Network
  { key: 'network.requests', category: 'Network', title: 'Network Requests Count', higherIsBetter: false },
  { key: 'network.failedRequests', category: 'Network', title: 'Failed Network Requests', higherIsBetter: false },
  { key: 'network.transferredBytes', category: 'Network', title: 'Network Transferred Bytes', higherIsBetter: false }
];

function getValueByPath(obj, pathStr) {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = pathStr.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr === null || curr === undefined || typeof curr !== 'object') {
      return undefined;
    }
    curr = curr[part];
  }
  return curr;
}

/**
 * Compares metrics extracted from analysis sections of baseline and target audit packages.
 *
 * Status values MUST be ONLY: "IMPROVED", "REGRESSION", "UNCHANGED".
 *
 * @param {object} baselineAuditPackage Baseline audit-package.json
 * @param {object} targetAuditPackage Target audit-package.json
 * @returns {Array<object>} List of metric comparisons
 */
export function compareMetrics(baselineAuditPackage, targetAuditPackage) {
  const baselineAnalysis = baselineAuditPackage?.analysis || baselineAuditPackage?.metrics || {};
  const targetAnalysis = targetAuditPackage?.analysis || targetAuditPackage?.metrics || {};

  return METRIC_DEFINITIONS.map(def => {
    const oldValueRaw = getValueByPath(baselineAnalysis, def.key);
    const newValueRaw = getValueByPath(targetAnalysis, def.key);

    const oldValue = typeof oldValueRaw === 'number' ? oldValueRaw : null;
    const newValue = typeof newValueRaw === 'number' ? newValueRaw : null;

    let status = 'UNCHANGED';

    if (oldValue !== null && newValue !== null) {
      if (oldValue === newValue) {
        status = 'UNCHANGED';
      } else if (def.higherIsBetter) {
        status = newValue > oldValue ? 'IMPROVED' : 'REGRESSION';
      } else {
        status = newValue < oldValue ? 'IMPROVED' : 'REGRESSION';
      }
    } else if (oldValue === null && newValue !== null) {
      status = 'IMPROVED';
    } else if (oldValue !== null && newValue === null) {
      status = 'REGRESSION';
    } else {
      status = 'UNCHANGED';
    }

    return {
      metric: def.key,
      category: def.category,
      title: def.title,
      oldValue,
      newValue,
      status
    };
  });
}
