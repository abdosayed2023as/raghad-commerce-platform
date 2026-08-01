function extractRecommendationsArray(report) {
  if (!report || !report.recommendations) return [];
  if (Array.isArray(report.recommendations)) {
    return report.recommendations;
  }
  return [];
}

/**
 * Compares recommendations between baseline and target AI reports.
 *
 * Comparison MUST use recommendationId.
 * Status values: RESOLVED, NEW, UNCHANGED.
 *
 * @param {object} baselineReport Baseline report.json
 * @param {object} targetReport Target report.json
 * @returns {Array<object>} List of recommendation comparisons
 */
export function compareRecommendations(baselineReport, targetReport) {
  const baselineRecs = extractRecommendationsArray(baselineReport);
  const targetRecs = extractRecommendationsArray(targetReport);

  const baselineMap = new Map();
  baselineRecs.forEach(r => {
    const id = r.recommendationId || r.id;
    if (id) baselineMap.set(id, r);
  });

  const targetMap = new Map();
  targetRecs.forEach(r => {
    const id = r.recommendationId || r.id;
    if (id) targetMap.set(id, r);
  });

  const allRecIds = Array.from(new Set([...baselineMap.keys(), ...targetMap.keys()]))
    .sort((a, b) => String(a).localeCompare(String(b)));

  return allRecIds.map(recommendationId => {
    const bRec = baselineMap.get(recommendationId);
    const tRec = targetMap.get(recommendationId);

    let status = 'UNCHANGED';
    if (bRec && !tRec) {
      status = 'RESOLVED';
    } else if (!bRec && tRec) {
      status = 'NEW';
    } else {
      status = 'UNCHANGED';
    }

    const ref = tRec || bRec;

    return {
      recommendationId,
      title: ref.title || null,
      priority: ref.priority || null,
      status,
      relatedFindingIds: ref.relatedFindingIds || []
    };
  });
}
