import path from 'path';
import { loadConfig } from './utils/configLoader.js';
import { logger } from './utils/logger.js';
import { ensureFolderStructure } from './output/folderManager.js';
import { runAllCollectors } from './collector/index.js';
import { generateTechnicalManifest } from './manifest/manifestGenerator.js';
import { runAnalysis } from './analyzer/index.js';
import { runRuleEnginePipeline } from './rules/index.js';
import { runFindingBuilder } from './finding/index.js';
import { runContextBuilder } from './context/index.js';
import { runReportBuilder } from './report-builder/index.js';
import { runSpecificationGenerator } from './specification/index.js';
import { runGitHubTaskGenerator } from './github/index.js';

class ArtifactTracker {
  constructor() {
    this.failures = [];
    this.warnings = [];
    this.browserInfo = null;
  }

  recordBrowserInfo(info) {
    this.browserInfo = info;
  }

  addWarning(warningMsg) {
    this.warnings.push({
      message: warningMsg,
      timestamp: new Date().toISOString()
    });
  }

  recordFailure(category, artifactName, error) {
    this.failures.push({
      category,
      artifactName,
      error: error.message || String(error),
      timestamp: new Date().toISOString()
    });
  }
}

async function main() {
  const startTime = Date.now();

  try {
    const config = loadConfig();
    const folders = ensureFolderStructure(config.outputDir);

    const runLogFile = path.join(folders.logs, 'audit.log');
    const rootLogFile = path.resolve(process.cwd(), 'logs', 'audit.log');
    logger.setLogFilePaths([runLogFile, rootLogFile]);

    logger.writeRunHeader({
      runId: folders.runTimestamp,
      timestamp: new Date(startTime).toISOString(),
      target: config.target,
      environment: config.environment
    });

    logger.info('====================================================');
    logger.info('   AUDIT TOOLKIT — COMPLETE PIPELINE V1 (AT-01..09) ');
    logger.info('====================================================');
    logger.info(`Run ID / Timestamp: ${folders.runTimestamp}`);
    logger.info(`Loaded configuration for target: ${config.target}`);
    logger.info(`Environment: ${config.environment} | Headless: ${config.headless} | Max Retries: ${config.maxRetries} | Provider: ${config.reportProvider}`);
    logger.info(`Timestamped evidence directory: ${folders.root}`);

    const artifactTracker = new ArtifactTracker();

    // 1. Evidence Collector (AT-01)
    await runAllCollectors(config, folders, artifactTracker);

    const endTime = Date.now();
    const manifest = generateTechnicalManifest(config, folders, artifactTracker, startTime, endTime);

    logger.info('====================================================');
    if (manifest.executionStatus === 'SUCCESS') {
      logger.success(`   COLLECTION COMPLETED WITH ZERO ERRORS (${manifest.generatedArtifactsCount} evidence artifacts)`);
    } else if (manifest.executionStatus === 'PARTIAL_FAILURE') {
      logger.warn(`   COLLECTION COMPLETED WITH PARTIAL FAILURES (${manifest.generatedArtifactsCount} succeeded, ${manifest.failedArtifactsCount} failed)`);
    } else {
      logger.error(`   COLLECTION FAILED ALL ARTIFACTS (${manifest.failedArtifactsCount} failures)`);
    }
    logger.info('====================================================');

    // 2. Structured Metrics Analyzer (AT-02)
    await runAnalysis(folders);

    // 3. Deterministic Rule Engine (AT-03)
    await runRuleEnginePipeline(folders);

    // 4. Finding Builder (AT-04)
    await runFindingBuilder(config, folders);

    // 5. Audit Context Builder (AT-05)
    await runContextBuilder(folders);

    // 6. AI Report Builder (AT-06)
    await runReportBuilder(config, folders);

    // 7. Specification Generator (AT-08)
    await runSpecificationGenerator(config, folders);

    // 8. GitHub Task Generator (AT-09)
    await runGitHubTaskGenerator(config, folders);

    if (manifest.executionStatus === 'FAILURE') {
      process.exit(1);
    }
  } catch (err) {
    logger.error('Fatal error executing Audit Toolkit Pipeline V1', err);
    process.exit(1);
  }
}

main();
