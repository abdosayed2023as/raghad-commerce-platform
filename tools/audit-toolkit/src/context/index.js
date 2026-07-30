import { loadManifest } from './manifestLoader.js';
import { loadAnalysis } from './analysisLoader.js';
import { loadRules } from './rulesLoader.js';
import { loadFindings } from './findingsLoader.js';
import { buildEvidenceIndex } from './evidenceIndexer.js';
import { buildAuditPackage } from './packageBuilder.js';
import { writeContextPackage } from './contextWriter.js';
import { logger } from '../utils/logger.js';

export async function runContextBuilder(folders) {
  logger.info('====================================================');
  logger.info('   AUDIT CONTEXT BUILDER V1 (AT-05)                 ');
  logger.info('====================================================');

  const { runSection, manifestSection } = loadManifest(folders);
  const analysisData = loadAnalysis(folders);
  const rulesData = loadRules(folders);
  const findingsData = loadFindings(folders);
  const evidenceIndex = buildEvidenceIndex(folders);

  const auditPackage = buildAuditPackage(
    runSection,
    manifestSection,
    analysisData,
    rulesData,
    findingsData,
    evidenceIndex
  );

  const outputPath = writeContextPackage(folders, auditPackage);
  logger.success('Audit Context Package assembled successfully.');
  return outputPath;
}
