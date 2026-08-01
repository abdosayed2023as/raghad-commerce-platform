import { ProviderInterface } from './providerInterface.js';

export class MockProvider extends ProviderInterface {
  async generateReport(promptString, auditPackage) {
    const run = auditPackage.run || {};
    const findingsData = auditPackage.findings || { summary: {}, findings: [] };
    const findingsList = Array.isArray(findingsData.findings) ? findingsData.findings : [];

    const criticalList = findingsList.filter(f => f.severity === 'Critical');
    const highList = findingsList.filter(f => f.severity === 'High');
    const mediumList = findingsList.filter(f => f.severity === 'Medium');
    const lowList = findingsList.filter(f => f.severity === 'Low');

    const totalFindings = findingsList.length;
    const criticalCount = criticalList.length;
    const highCount = highList.length;

    let overallStatus = 'HEALTHY';
    if (criticalCount > 0) {
      overallStatus = 'CRITICAL_ATTENTION_REQUIRED';
    } else if (highCount > 0) {
      overallStatus = 'ATTENTION_REQUIRED';
    } else if (totalFindings > 0) {
      overallStatus = 'MINOR_ISSUES_DETECTED';
    }

    // Deterministic recommendation generation based on findings
    const recommendations = [];
    const findingToEvidenceMap = {};
    const recommendationToFindingMap = {};

    findingsList.forEach((finding, index) => {
      const recId = `REC-${String(index + 1).padStart(3, '0')}`;

      // Map finding to evidence
      findingToEvidenceMap[finding.findingId] = finding.evidenceIds || [];
      recommendationToFindingMap[recId] = [finding.findingId];

      let recTitle = `Address ${finding.title}`;
      let recDesc = `Rule ${finding.ruleId} failed with metric value ${finding.actual} vs threshold ${finding.threshold}.`;

      if (finding.ruleId === 'PERF_LCP_001') {
        recTitle = 'Optimize Largest Contentful Paint (LCP)';
        recDesc = `Reduce LCP loading time (current: ${finding.actual}ms) below the ${finding.threshold}ms threshold by optimizing main banner assets and critical render path CSS.`;
      } else if (finding.ruleId === 'PERF_CLS_001') {
        recTitle = 'Reduce Cumulative Layout Shift (CLS)';
        recDesc = `Prevent layout instability (current CLS: ${finding.actual}) by specifying explicit dimensions for image and ad containers.`;
      } else if (finding.ruleId === 'CONSOLE_ERRORS_001') {
        recTitle = 'Fix Unhandled Console Errors';
        recDesc = `Resolve ${finding.actual} unhandled JavaScript/network errors captured in browser console.`;
      } else if (finding.ruleId === 'NETWORK_FAILED_REQUESTS_001') {
        recTitle = 'Eliminate Failed HTTP Requests';
        recDesc = `Fix ${finding.actual} HTTP network requests returning error status codes (>= 400).`;
      }

      recommendations.push({
        recommendationId: recId,
        title: recTitle,
        description: recDesc,
        priority: finding.severity,
        confidence: "High",
        relatedFindingIds: [finding.findingId],
        relatedEvidenceIds: finding.evidenceIds || []
      });
    });

    return {
      schemaVersion: "1.0.0",
      reportVersion: "1.0.0",
      generatedAt: new Date().toISOString(),
      provider: "mock",
      run: {
        runId: run.runId || null,
        timestamp: run.timestamp || null,
        target: run.target || null,
        environment: run.environment || null
      },
      metadata: {
        target: run.target || null,
        environment: run.environment || null,
        runId: run.runId || null
      },
      executiveSummary: {
        totalFindings,
        criticalCount,
        highCount,
        mediumCount: mediumList.length,
        lowCount: lowList.length,
        overallStatus
      },
      findingsSummary: {
        criticalCount,
        highCount,
        mediumCount: mediumList.length,
        lowCount: lowList.length
      },
      criticalFindings: criticalList,
      highPriority: highList,
      recommendations,
      traceability: {
        findingToEvidenceMap,
        recommendationToFindingMap
      }
    };
  }
}
