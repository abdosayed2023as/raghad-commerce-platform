function extractFindingsArray(auditPackage) {
  if (!auditPackage || !auditPackage.findings) return [];
  if (Array.isArray(auditPackage.findings)) {
    return auditPackage.findings;
  }
  if (Array.isArray(auditPackage.findings.findings)) {
    return auditPackage.findings.findings;
  }
  return [];
}

/**
 * Compares findings between baseline and target audit packages.
 *
 * Comparison MUST use findingId.
 * Status values: RESOLVED, NEW, UNCHANGED.
 *
 * @param {object} baselineAuditPackage Baseline audit-package.json
 * @param {object} targetAuditPackage Target audit-package.json
 * @returns {Array<object>} List of finding comparisons
 */
export function compareFindings(baselineAuditPackage, targetAuditPackage) {
  const baselineFindings = extractFindingsArray(baselineAuditPackage);
  const targetFindings = extractFindingsArray(targetAuditPackage);

  const baselineMap = new Map();
  baselineFindings.forEach(f => {
    const id = f.findingId || f.id;
    if (id) baselineMap.set(id, f);
  });

  const targetMap = new Map();
  targetFindings.forEach(f => {
    const id = f.findingId || f.id;
    if (id) targetMap.set(id, f);
  });

  const allFindingIds = Array.from(new Set([...baselineMap.keys(), ...targetMap.keys()]))
    .sort((a, b) => String(a).localeCompare(String(b)));

  return allFindingIds.map(findingId => {
    const bFinding = baselineMap.get(findingId);
    const tFinding = targetMap.get(findingId);

    let status = 'UNCHANGED';
    if (bFinding && !tFinding) {
      status = 'RESOLVED';
    } else if (!bFinding && tFinding) {
      status = 'NEW';
    } else {
      status = 'UNCHANGED';
    }

    const ref = tFinding || bFinding;

    return {
      findingId,
      ruleId: ref.ruleId || null,
      category: ref.category || null,
      title: ref.title || null,
      severity: ref.severity || null,
      oldValue: bFinding?.actual ?? null,
      newValue: tFinding?.actual ?? null,
      status
    };
  });
}
