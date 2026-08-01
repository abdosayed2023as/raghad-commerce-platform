import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Writes deterministic context/github-issues.json document.
 *
 * @param {object|string} folders Object containing .context folder or string context path
 * @param {object} issueData GitHub issues payload
 * @returns {string} Path to written github-issues.json
 */
export function writeGitHubIssuesDocument(folders, issueData) {
  const contextDir = typeof folders === 'string' ? folders : folders?.context;

  if (!contextDir) {
    const errorMsg = '[GITHUB WRITER ERROR] Context output directory is required.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!fs.existsSync(contextDir)) {
    fs.mkdirSync(contextDir, { recursive: true });
  }

  const outputPath = path.join(contextDir, 'github-issues.json');

  const deterministicDoc = {
    schemaVersion: '1.0.0',
    summary: issueData.summary || {
      totalIssues: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    issues: issueData.issues || []
  };

  const formattedJson = JSON.stringify(deterministicDoc, null, 2) + '\n';

  try {
    fs.writeFileSync(outputPath, formattedJson, 'utf8');
    logger.success(`GitHub issues payload document written: ${outputPath}`);
    return outputPath;
  } catch (err) {
    logger.error(`[GITHUB WRITER ERROR] Failed to write github-issues.json: ${err.message}`, err);
    throw err;
  }
}
