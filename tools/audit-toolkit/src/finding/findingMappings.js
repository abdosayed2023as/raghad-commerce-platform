import { buildDynamicEvidenceMapping } from '../utils/evidenceIdBuilder.js';

/**
 * Returns dynamic evidence ID and source artifact mapping for a given rule ID and target URL.
 * @param {string} ruleId
 * @param {string} targetUrl
 * @returns {{ evidenceIds: string[], sourceArtifacts: string[] }}
 */
export function getMappingForRule(ruleId, targetUrl) {
  return buildDynamicEvidenceMapping(ruleId, targetUrl);
}
