/**
 * Produces deterministic summary metrics count for comparison outputs.
 *
 * @param {Array<object>} metrics Metric comparison array
 * @param {Array<object>} findings Finding comparison array
 * @param {Array<object>} recommendations Recommendation comparison array
 * @returns {object} Summary object
 */
export function buildComparisonSummary(metrics = [], findings = [], recommendations = []) {
  const metricsImproved = metrics.filter(m => m.status === 'IMPROVED').length;
  const metricsRegressed = metrics.filter(m => m.status === 'REGRESSION').length;
  const metricsUnchanged = metrics.filter(m => m.status === 'UNCHANGED').length;

  const findingsResolved = findings.filter(f => f.status === 'RESOLVED').length;
  const findingsAdded = findings.filter(f => f.status === 'NEW').length;
  const findingsUnchanged = findings.filter(f => f.status === 'UNCHANGED').length;

  const recommendationsResolved = recommendations.filter(r => r.status === 'RESOLVED').length;
  const recommendationsAdded = recommendations.filter(r => r.status === 'NEW').length;
  const recommendationsUnchanged = recommendations.filter(r => r.status === 'UNCHANGED').length;

  return {
    metricsImproved,
    metricsRegressed,
    metricsUnchanged,
    findingsResolved,
    findingsAdded,
    findingsUnchanged,
    recommendationsResolved,
    recommendationsAdded,
    recommendationsUnchanged
  };
}
