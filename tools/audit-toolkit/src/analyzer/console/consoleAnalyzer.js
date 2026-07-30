import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

export function analyzeConsole(folders) {
  const consoleDir = folders.console;

  if (!fs.existsSync(consoleDir)) {
    logger.warn('[ANALYZER] Console output directory missing.');
    return null;
  }

  const files = fs.readdirSync(consoleDir);
  const logFile = files.find(f => f.endsWith('.log'));

  if (!logFile) {
    logger.warn('[ANALYZER] Console log artifact missing.');
    return null;
  }

  const logFilePath = path.join(consoleDir, logFile);

  try {
    const content = fs.readFileSync(logFilePath, 'utf8');
    const lines = content.split('\n');

    let errors = 0;
    let warnings = 0;

    lines.forEach(line => {
      if (line.includes('[ERROR]') || line.includes('[ERR]')) {
        errors++;
      } else if (line.includes('[WARNING]') || line.includes('[WARN]')) {
        warnings++;
      }
    });

    return {
      errors,
      warnings
    };
  } catch (err) {
    logger.warn(`[ANALYZER] Failed to read console log "${logFilePath}": ${err.message}`);
    return null;
  }
}
