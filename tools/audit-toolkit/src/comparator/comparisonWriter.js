import fs from 'fs';
import path from 'path';

/**
 * Writes deterministic comparison.json output with stable key ordering.
 *
 * @param {object} comparisonData Formatted comparison data
 * @param {string} outputPath Target file path (e.g. output/comparison/comparison.json)
 * @returns {string} Absolute path to written comparison.json
 */
export function writeComparison(comparisonData, outputPath = 'output/comparison/comparison.json') {
  const resolvedPath = path.isAbsolute(outputPath)
    ? outputPath
    : path.resolve(process.cwd(), outputPath);

  const parentDir = path.dirname(resolvedPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  const outputDoc = {
    schemaVersion: '1.0.0',
    baselineRun: comparisonData.baselineRun || {},
    targetRun: comparisonData.targetRun || {},
    summary: comparisonData.summary || {},
    metrics: comparisonData.metrics || [],
    findings: comparisonData.findings || [],
    recommendations: comparisonData.recommendations || []
  };

  const jsonString = JSON.stringify(outputDoc, null, 2) + '\n';
  fs.writeFileSync(resolvedPath, jsonString, 'utf8');

  return resolvedPath;
}
