import { getToolkitVersion } from '../utils/version.js';

export function buildAuditPackage(runSection, manifestSection, analysisData, rulesData, findingsData, evidenceIndex) {
  return {
    schemaVersion: '1.0.0',
    run: runSection,
    manifest: manifestSection,
    analysis: analysisData,
    rules: rulesData,
    findings: findingsData,
    evidence: evidenceIndex,
    metadata: {
      toolkitVersion: getToolkitVersion(),
      contextVersion: "1.0.0",
      generatedAt: new Date().toISOString(),
      generator: "Audit Context Builder V1"
    }
  };
}
