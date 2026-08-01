import { getRecommendationKnowledge } from './recommendationKnowledge.js';

/**
 * Main orchestration for building recommendations from report.json contract (AT-10).
 * Consumes ONLY report.json and produces deterministic recommendations payload.
 *
 * @param {object} report Parsed report.json contract
 * @returns {object} Recommendations payload
 */
export function buildRecommendations(report) {
  const findingMap = new Map();

  // 1. Collect findings directly present in report arrays
  const directFindingArrays = [
    report?.criticalFindings,
    report?.highPriority,
    report?.findings
  ];

  directFindingArrays.forEach(arr => {
    if (Array.isArray(arr)) {
      arr.forEach(f => {
        if (f && f.findingId) {
          findingMap.set(f.findingId, f);
        }
      });
    }
  });

  // 2. Scan recommendations array in report to capture any findings referenced by ID
  const reportRecs = Array.isArray(report?.recommendations) ? report.recommendations : [];
  reportRecs.forEach(rec => {
    const fIds = Array.isArray(rec.relatedFindingIds) ? rec.relatedFindingIds : [];
    const evdIds = Array.isArray(rec.relatedEvidenceIds) ? rec.relatedEvidenceIds : [];

    fIds.forEach(fId => {
      if (!findingMap.has(fId)) {
        // Reconstruct finding metadata from report recommendation
        const ruleMatch = (rec.description || '').match(/\b([A-Z0-9_]{3,}_[0-9]{3})\b/);
        const ruleId = ruleMatch ? ruleMatch[1] : inferRuleIdFromTitle(rec.title);
        const category = inferCategoryFromRuleId(ruleId, rec.title);

        findingMap.set(fId, {
          findingId: fId,
          ruleId,
          category,
          severity: rec.priority || 'Medium',
          status: 'FAIL',
          title: rec.title || 'Audit Issue',
          metric: inferMetricFromRuleId(ruleId),
          actual: null,
          threshold: null,
          operator: '>=',
          evidenceIds: evdIds,
          sourceArtifacts: []
        });
      }
    });
  });

  const findingsList = Array.from(findingMap.values());
  const recommendations = [];

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  findingsList.forEach(finding => {
    const recId = `REC_${finding.findingId}`;
    const knowledge = getRecommendationKnowledge(finding.ruleId, finding);

    let technicalReason = `Rule ${finding.ruleId} failed audit evaluation criteria.`;
    if (finding.metric && finding.actual !== null && finding.actual !== undefined && finding.threshold !== undefined && finding.threshold !== null) {
      technicalReason = `Metric "${finding.metric}" evaluated to ${finding.actual}, failing target threshold (${finding.operator || '>='} ${finding.threshold}).`;
    }

    const priority = finding.severity || 'Medium';

    const acceptanceCriteria = [];
    if (finding.metric && finding.threshold !== undefined && finding.threshold !== null) {
      acceptanceCriteria.push(`${finding.metric} ${finding.operator || '>='} ${finding.threshold}`);
    } else {
      acceptanceCriteria.push('Metric threshold satisfied');
    }
    if (finding.ruleId) {
      acceptanceCriteria.push(`Rule ${finding.ruleId} evaluates to PASS`);
    }
    acceptanceCriteria.push(`Finding ${finding.findingId} resolved`);

    const recommendation = {
      recommendationId: recId,
      relatedFindingId: finding.findingId,
      ruleId: finding.ruleId,
      title: knowledge.title,
      summary: knowledge.summary,
      technicalReason,
      expectedBenefit: knowledge.expectedBenefit,
      priority,
      estimatedEffort: knowledge.estimatedEffort,
      estimatedImpact: knowledge.estimatedImpact,
      category: finding.category || 'Performance',
      ownerSuggestion: knowledge.ownerSuggestion,
      implementationHints: knowledge.implementationHints,
      acceptanceCriteria,
      relatedEvidenceIds: Array.isArray(finding.evidenceIds) ? finding.evidenceIds : [],
      relatedArtifacts: Array.isArray(finding.sourceArtifacts) ? finding.sourceArtifacts : []
    };

    recommendations.push(recommendation);

    switch (priority) {
      case 'Critical': criticalCount++; break;
      case 'High':     highCount++;     break;
      case 'Medium':   mediumCount++;   break;
      case 'Low':      lowCount++;      break;
      default:         mediumCount++;   break;
    }
  });

  const runMetadata = report?.run || {
    runId: report?.metadata?.runId || null,
    target: report?.metadata?.target || null,
    environment: report?.metadata?.environment || null
  };

  return {
    schemaVersion: '1.0.0',
    run: runMetadata,
    summary: {
      totalRecommendations: recommendations.length,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount
    },
    recommendations
  };
}

function inferRuleIdFromTitle(titleStr = '') {
  const title = String(titleStr);
  if (title.includes('Desktop Performance')) return 'PERF_SCORE_DESKTOP_001';
  if (title.includes('Mobile Performance')) return 'PERF_SCORE_MOBILE_001';
  if (title.includes('Desktop Accessibility')) return 'ACCESSIBILITY_SCORE_DESKTOP_001';
  if (title.includes('Mobile Accessibility')) return 'ACCESSIBILITY_SCORE_MOBILE_001';
  if (title.includes('Desktop Best Practices')) return 'BEST_PRACTICES_SCORE_DESKTOP_001';
  if (title.includes('Mobile Best Practices')) return 'BEST_PRACTICES_SCORE_MOBILE_001';
  if (title.includes('Desktop SEO')) return 'SEO_SCORE_DESKTOP_001';
  if (title.includes('Mobile SEO')) return 'SEO_SCORE_MOBILE_001';
  if (title.includes('Largest Contentful Paint') || title.includes('LCP')) return 'PERF_LCP_001';
  if (title.includes('Cumulative Layout Shift') || title.includes('CLS')) return 'PERF_CLS_001';
  if (title.includes('Next Paint') || title.includes('TBT') || title.includes('INP')) return 'PERF_INP_001';
  if (title.includes('Console Errors')) return 'CONSOLE_ERRORS_001';
  if (title.includes('Console Warnings')) return 'CONSOLE_WARNINGS_001';
  if (title.includes('Failed HTTP Requests')) return 'NETWORK_FAILED_REQUESTS_001';
  if (title.includes('Transferred Bytes')) return 'NETWORK_TRANSFERRED_BYTES_001';
  if (title.includes('Request Count')) return 'NETWORK_REQUEST_COUNT_001';
  return 'GENERIC_RULE_001';
}

function inferCategoryFromRuleId(ruleId = '', title = '') {
  if (ruleId.startsWith('PERF_') || ruleId.includes('PERF')) return 'Performance';
  if (ruleId.startsWith('ACCESSIBILITY_')) return 'Accessibility';
  if (ruleId.startsWith('BEST_PRACTICES_')) return 'Best Practices';
  if (ruleId.startsWith('SEO_')) return 'SEO';
  if (ruleId.startsWith('CONSOLE_')) return 'Console';
  if (ruleId.startsWith('NETWORK_')) return 'Network';
  return 'Performance';
}

function inferMetricFromRuleId(ruleId = '') {
  if (ruleId === 'PERF_SCORE_DESKTOP_001') return 'performance.desktop.performance';
  if (ruleId === 'PERF_SCORE_MOBILE_001') return 'performance.mobile.performance';
  if (ruleId === 'ACCESSIBILITY_SCORE_DESKTOP_001') return 'performance.desktop.accessibility';
  if (ruleId === 'ACCESSIBILITY_SCORE_MOBILE_001') return 'performance.mobile.accessibility';
  if (ruleId === 'BEST_PRACTICES_SCORE_DESKTOP_001') return 'performance.desktop.bestPractices';
  if (ruleId === 'BEST_PRACTICES_SCORE_MOBILE_001') return 'performance.mobile.bestPractices';
  if (ruleId === 'SEO_SCORE_DESKTOP_001') return 'performance.desktop.seo';
  if (ruleId === 'SEO_SCORE_MOBILE_001') return 'performance.mobile.seo';
  if (ruleId === 'PERF_LCP_001') return 'performance.coreWebVitals.lcp';
  if (ruleId === 'PERF_CLS_001') return 'performance.coreWebVitals.cls';
  if (ruleId === 'PERF_INP_001') return 'performance.coreWebVitals.inp';
  if (ruleId === 'CONSOLE_ERRORS_001') return 'console.errors';
  if (ruleId === 'CONSOLE_WARNINGS_001') return 'console.warnings';
  if (ruleId === 'NETWORK_FAILED_REQUESTS_001') return 'network.failedRequests';
  if (ruleId === 'NETWORK_TRANSFERRED_BYTES_001') return 'network.transferredBytes';
  if (ruleId === 'NETWORK_REQUEST_COUNT_001') return 'network.requests';
  return 'audit.metric';
}
