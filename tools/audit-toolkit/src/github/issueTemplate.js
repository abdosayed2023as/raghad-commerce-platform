import { resolveIssuePriority } from './priorityResolver.js';
import { resolveLabels } from './labelResolver.js';
import { buildFingerprint } from './fingerprintBuilder.js';

/**
 * Builds a deterministic issue object from a specification contract.
 *
 * @param {object} spec Specification contract from specifications.json
 * @param {number} index Index for ISSUE-001 formatting
 * @returns {object} Deterministic issue payload
 */
export function createGitHubIssue(spec, index) {
  const issueId = `ISSUE-${String(index + 1).padStart(3, '0')}`;
  const priority = resolveIssuePriority(spec.priority);
  const labels = resolveLabels(spec, priority);
  const fingerprint = buildFingerprint(spec);

  const relatedFindingIds = Array.isArray(spec.relatedFindingIds) ? spec.relatedFindingIds : [];
  const relatedEvidenceIds = Array.isArray(spec.relatedEvidenceIds) ? spec.relatedEvidenceIds : [];

  const acceptanceList = Array.isArray(spec.acceptanceCriteria) && spec.acceptanceCriteria.length > 0
    ? spec.acceptanceCriteria.map(c => `- ${c}`).join('\n')
    : '- Satisfy metric threshold';

  const findingsStr = relatedFindingIds.length > 0 ? relatedFindingIds.join(', ') : 'None';
  const evidenceStr = relatedEvidenceIds.length > 0 ? relatedEvidenceIds.join(', ') : 'None';

  const bodySections = [
    `## Summary`,
    `${spec.summary || spec.title}`,
    ``,
    `## Problem`,
    `${spec.problem || 'Metric exceeds acceptable threshold.'}`,
    ``,
    `## Expected Result`,
    `${spec.recommendation || 'Implement recommendation and satisfy target metric threshold.'}`,
    ``,
    `## Acceptance Criteria`,
    `${acceptanceList}`,
    ``,
    `## Traceability`,
    `Specification: ${spec.specificationId}`,
    `Finding: ${findingsStr}`,
    `Evidence: ${evidenceStr}`
  ];

  const body = bodySections.join('\n');

  return {
    issueId,
    fingerprint,
    title: spec.title || 'Audit Issue',
    body,
    labels,
    priority,
    assignee: null,
    milestone: null,
    specificationId: spec.specificationId,
    relatedFindingIds,
    relatedEvidenceIds,
    status: 'OPEN'
  };
}
