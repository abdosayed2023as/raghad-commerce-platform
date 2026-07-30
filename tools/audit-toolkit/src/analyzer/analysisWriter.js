import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export function writeAnalysisDocument(folders, analysisData) {
  const analysisDir = folders.analysis;

  if (!fs.existsSync(analysisDir)) {
    fs.mkdirSync(analysisDir, { recursive: true });
  }

  const outputPath = path.join(analysisDir, 'analysis.json');

  // Enforce deterministic top-level schema key order
  const deterministicDoc = {
    schemaVersion: '1.0.0',
    run: analysisData.run || null,
    performance: analysisData.performance || null,
    console: analysisData.console || null,
    network: analysisData.network || null
  };

  const formattedJson = JSON.stringify(deterministicDoc, null, 2);

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`Normalized analysis document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[ANALYZER ERROR] Failed to write analysis.json: ${err.message}`, err);
    throw err;
  }
}
