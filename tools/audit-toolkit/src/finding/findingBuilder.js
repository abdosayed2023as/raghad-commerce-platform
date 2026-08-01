import { getMappingForRule } from './findingMappings.js';
import { buildStableFindingId, deriveFindingViewport } from '../utils/evidenceIdBuilder.js';
import { getPageSlug } from '../utils/configLoader.js';

export function buildFindings(rulesData, targetUrl) {
  const rulesList = Array.isArray(rulesData?.rules) ? rulesData.rules : [];
  const runSection = rulesData?.run || null;

  // Filter ONLY FAIL and SKIPPED rules (PASS rules are ignored)
  const targetRules = rulesList.filter(r => r.status === 'FAIL' || r.status === 'SKIPPED');

  const findings = [];
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  let infoCount = 0;

  targetRules.forEach((rule) => {
    const findingId = buildStableFindingId(rule.id, targetUrl);
    const mapping = getMappingForRule(rule.id, targetUrl);
    const pageSlug = getPageSlug(targetUrl);
    const viewport = deriveFindingViewport(rule.id);

    const finding = {
      findingId,
      ruleId: rule.id,
      pageSlug,
      viewport,
      category: rule.category,
      severity: rule.severity,
      status: rule.status,
      title: rule.title,
      metric: rule.metric,
      actual: rule.actual,
      threshold: rule.threshold,
      operator: rule.operator,
      evidenceIds: mapping.evidenceIds,
      sourceArtifacts: mapping.sourceArtifacts,
      createdAt: new Date().toISOString()
    };

    findings.push(finding);

    switch (rule.severity) {
      case 'Critical': criticalCount++; break;
      case 'High':     highCount++;     break;
      case 'Medium':   mediumCount++;   break;
      case 'Low':      lowCount++;      break;
      default:         infoCount++;     break;
    }
  });

  return {
    schemaVersion: '1.0.0',
    run: runSection,
    summary: {
      total: findings.length,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount
    },
    findings
  };
}
