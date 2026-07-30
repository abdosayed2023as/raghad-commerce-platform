import { analyzeManifest } from './manifest/manifestAnalyzer.js';
import { analyzeLighthouse } from './lighthouse/lighthouseAnalyzer.js';
import { analyzeConsole } from './console/consoleAnalyzer.js';
import { analyzeNetwork } from './network/networkAnalyzer.js';
import { writeAnalysisDocument } from './analysisWriter.js';
import { logger } from '../utils/logger.js';

export async function runAnalysis(folders) {
  logger.info('====================================================');
  logger.info('   STRUCTURED METRICS ANALYZER V1 (AT-02)           ');
  logger.info('====================================================');

  const runMetrics = analyzeManifest(folders);
  const performanceMetrics = analyzeLighthouse(folders);
  const consoleMetrics = analyzeConsole(folders);
  const networkMetrics = analyzeNetwork(folders);

  const analysisDoc = {
    run: runMetrics,
    performance: performanceMetrics,
    console: consoleMetrics,
    network: networkMetrics
  };

  const outputPath = writeAnalysisDocument(folders, analysisDoc);
  logger.success('Structured Metrics Analysis complete.');
  return outputPath;
}
