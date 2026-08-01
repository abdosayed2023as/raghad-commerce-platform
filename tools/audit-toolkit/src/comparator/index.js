import path from 'path';
import { loadComparisonContext } from './comparisonLoader.js';
import { compareMetrics } from './metricComparator.js';
import { compareFindings } from './findingComparator.js';
import { compareRecommendations } from './recommendationComparator.js';
import { buildComparisonSummary } from './summaryBuilder.js';
import { writeComparison } from './comparisonWriter.js';
import { logger } from '../utils/logger.js';

/**
 * Main entry point for Audit Comparator V1 (AT-07).
 * Consumes baseline and target contracts and generates run-scoped comparison storage.
 *
 * @param {string|object} baselineInput Baseline run path or object
 * @param {string|object} targetInput Target run path or object
 * @param {string} [outputPath] Optional explicit target path for comparison.json
 * @returns {Promise<{ comparisonData: object, outputPath: string }>} Resulting comparison
 */
export async function runComparator(baselineInput, targetInput, outputPath = null) {
  logger.info('====================================================');
  logger.info('   AUDIT COMPARATOR V1 (AT-07)                      ');
  logger.info('====================================================');

  const context = loadComparisonContext(baselineInput, targetInput);

  const bRunId = context.baselineRun.runId || 'baseline';
  const tRunId = context.targetRun.runId || 'target';

  logger.info(`Baseline Run: ${bRunId}`);
  logger.info(`Target Run:   ${tRunId}`);

  const metrics = compareMetrics(context.baselineAuditPackage, context.targetAuditPackage);
  const findings = compareFindings(context.baselineAuditPackage, context.targetAuditPackage);
  const recommendations = compareRecommendations(context.baselineReport, context.targetReport);
  const summary = buildComparisonSummary(metrics, findings, recommendations);

  const comparisonData = {
    schemaVersion: '1.0.0',
    baselineRun: context.baselineRun,
    targetRun: context.targetRun,
    summary,
    metrics,
    findings,
    recommendations
  };

  const targetPath = outputPath || path.join('output', 'comparison', `${bRunId}_vs_${tRunId}`, 'comparison.json');
  const finalPath = writeComparison(comparisonData, targetPath);

  logger.success(`Comparison JSON written successfully to: ${finalPath}`);
  logger.info(`Summary totals -> Improved Metrics: ${summary.metricsImproved}, Regressed Metrics: ${summary.metricsRegressed}, Resolved Findings: ${summary.findingsResolved}, New Findings: ${summary.findingsAdded}`);

  return { comparisonData, outputPath: finalPath };
}

export {
  loadComparisonContext,
  compareMetrics,
  compareFindings,
  compareRecommendations,
  buildComparisonSummary,
  writeComparison
};
