import { resolvePriority } from './priorityResolver.js';

/**
 * Produces a deterministic specification object from a report recommendation.
 * Pure function: no filesystem access, no provider logic, no non-deterministic code.
 *
 * @param {object} recommendation Recommendation object from report.json
 * @param {number} index Index for sequential ID generation (SPEC-001, etc.)
 * @param {Map<string, object>} findingMap Lookup map of findings by findingId
 * @returns {object} Deterministic specification contract
 */
export function createSpecification(recommendation, index, findingMap = new Map()) {
  const specId = `SPEC-${String(index + 1).padStart(3, '0')}`;
  const priority = resolvePriority(recommendation.priority);

  const relatedFindingIds = Array.isArray(recommendation.relatedFindingIds)
    ? recommendation.relatedFindingIds
    : [];

  const relatedEvidenceIds = Array.isArray(recommendation.relatedEvidenceIds)
    ? recommendation.relatedEvidenceIds
    : [];

  // Lookup primary finding for metric metadata
  const primaryFindingId = relatedFindingIds[0];
  const primaryFinding = primaryFindingId ? findingMap.get(primaryFindingId) : null;

  // Build deterministic acceptance criteria
  const acceptanceCriteria = [];

  if (primaryFinding) {
    if (primaryFinding.metric && primaryFinding.threshold !== undefined && primaryFinding.operator) {
      acceptanceCriteria.push(`${primaryFinding.metric} ${primaryFinding.operator} ${primaryFinding.threshold}`);
    } else {
      acceptanceCriteria.push('Metric threshold satisfied');
    }

    if (primaryFinding.ruleId) {
      acceptanceCriteria.push(`Rule ${primaryFinding.ruleId} passes`);
    }
  } else {
    acceptanceCriteria.push('Metric threshold satisfied');
  }

  relatedFindingIds.forEach(fId => {
    acceptanceCriteria.push(`Finding ${fId} resolved`);
  });

  // Estimate Scope and Complexity deterministically based on priority level
  let estimatedScope = 'Medium';
  let estimatedComplexity = 'Medium';

  if (priority === 'P0') {
    estimatedScope = 'Medium';
    estimatedComplexity = 'High';
  } else if (priority === 'P1') {
    estimatedScope = 'Medium';
    estimatedComplexity = 'Medium';
  } else if (priority === 'P2') {
    estimatedScope = 'Small';
    estimatedComplexity = 'Medium';
  } else {
    estimatedScope = 'Small';
    estimatedComplexity = 'Low';
  }

  return {
    specificationId: specId,
    title: recommendation.title || 'Specification',
    priority,
    summary: recommendation.title ? `${recommendation.title}.` : 'Developer specification.',
    problem: recommendation.description || 'Audit metric exceeds acceptable threshold.',
    recommendation: recommendation.title || 'Implement recommendation.',
    acceptanceCriteria,
    relatedFindingIds,
    relatedEvidenceIds,
    estimatedScope,
    estimatedComplexity,
    status: 'OPEN'
  };
}
