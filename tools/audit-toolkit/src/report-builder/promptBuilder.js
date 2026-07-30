export function buildAuditPrompt(auditPackage) {
  const run = auditPackage.run || {};
  const manifest = auditPackage.manifest || {};
  const analysis = auditPackage.analysis || {};
  const rules = auditPackage.rules || {};
  const findings = auditPackage.findings || {};
  const evidence = auditPackage.evidence || {};
  const metadata = auditPackage.metadata || {};

  const promptSections = [
    `=== AUDIT REPORT CONTEXT PACKAGE ===`,
    `RUN METADATA:`,
    `- Run ID: ${run.runId}`,
    `- Timestamp: ${run.timestamp}`,
    `- Target URL: ${run.target}`,
    `- Environment: ${run.environment}`,
    ``,
    `MANIFEST SUMMARY:`,
    `- Artifacts Count: ${manifest.generatedArtifactsCount}`,
    `- Status: ${manifest.status}`,
    `- Warnings: ${JSON.stringify(manifest.warnings || [])}`,
    ``,
    `STRUCTURED METRICS:`,
    JSON.stringify(analysis, null, 2),
    ``,
    `EVALUATED RULES SUMMARY:`,
    `- Total: ${rules.summary?.total ?? 0}, Passed: ${rules.summary?.passed ?? 0}, Failed: ${rules.summary?.failed ?? 0}, Skipped: ${rules.summary?.skipped ?? 0}`,
    ``,
    `STRUCTURED FINDINGS (${findings.summary?.total ?? 0} total):`,
    JSON.stringify(findings.findings || [], null, 2),
    ``,
    `EVIDENCE CATALOG:`,
    JSON.stringify(evidence, null, 2),
    ``,
    `PACKAGE METADATA:`,
    `- Generator: ${metadata.generator} (v${metadata.toolkitVersion})`,
    `- Context Version: ${metadata.contextVersion}`,
    `====================================`
  ];

  return promptSections.join('\n');
}
