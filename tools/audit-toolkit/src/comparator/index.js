import { loadComparisonContext } from './comparisonLoader.js';
import { compareMetrics } from './metricComparator.js';
import { compareFindings } from './findingComparator.js';
import { compareRecommendations } from './recommendationComparator.js';
import { buildComparisonSummary } from './summaryBuilder.js';
import { writeComparison } from './comparisonWriter.js';
import { logger } from '../utils/logger.js';

/**
 * Main entry point for Audit Comparator V1 (AT-07).
 * Consumes baseline and target contracts and generates deterministic output/comparison/comparison.json.
 *
 * @param {string|object} baselineInput Baseline run path or object
 * @param {string|object} targetInput Target run path or object
 * @param {string} [outputPath] Optional target path for comparison.json
 * @returns {Promise<{ comparisonData: object, outputPath: string }>} Resulting comparison
 */
export async function runComparator(baselineInput, targetInput, outputPath = 'output/comparison/comparison.json') {
  logger.info('====================================================');
  logger.info('   AUDIT COMPARATOR V1 (AT-07)                      ');
  logger.info('====================================================');

  const context = loadComparisonContext(baselineInput, targetInput);

  logger.info(`Baseline Run: ${context.baselineRun.runId || 'Unknown'}`);
  logger.info(`Target Run:   ${context.targetRun.runId || 'Unknown'}`);

  const metrics = compareMetrics(context.baselineAuditPackage, context.targetAuditPackage);
  const findings = compareFindings(context.baselineAuditPackage, context.targetAuditPackage);
  const recommendations = compareRecommendations(context.baselineReport, context.targetReport);
  const summary = buildComparisonSummary(metrics, findings, recommendations);

  const comparisonData = {
    baselineRun: context.baselineRun,
    targetRun: context.targetRun,
    summary,
    metrics,
    findings,
    recommendations
  };

  const finalPath = writeComparison(comparisonData, outputPath);

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
