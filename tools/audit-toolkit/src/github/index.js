import fs from 'fs';
import path from 'path';
import { buildGitHubIssues } from './githubTaskBuilder.js';
import { writeGitHubIssuesDocument } from './githubWriter.js';
import { logger } from '../utils/logger.js';

/**
 * Pipeline entry point for GitHub Task Generator V1 (AT-09).
 * Consumes specifications.json to produce context/github-issues.json.
 *
 * @param {object} configOrFolders Configuration object or folders object
 * @param {object} [foldersParam] Folders structure object
 * @returns {Promise<string>} Output file path
 */
export async function runGitHubTaskGenerator(configOrFolders, foldersParam) {
  logger.info('====================================================');
  logger.info('   GITHUB TASK GENERATOR V1 (AT-09)                 ');
  logger.info('====================================================');

  const folders = foldersParam || configOrFolders;
  const contextDir = folders?.context;

  if (!contextDir) {
    const errorMsg = '[GITHUB TASK GENERATOR ERROR] Invalid folders object provided.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const specPath = path.join(contextDir, 'specifications.json');

  if (!fs.existsSync(specPath)) {
    const errorMsg = `[GITHUB TASK GENERATOR ERROR] Required specifications.json missing at "${specPath}". Run AT-08 first.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  let specData = {};
  try {
    specData = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  } catch (err) {
    const errorMsg = `[GITHUB TASK GENERATOR ERROR] Failed to parse specifications.json: ${err.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const issueData = buildGitHubIssues(specData);
  const outputPath = writeGitHubIssuesDocument(folders, issueData);

  logger.info(`Generated ${issueData.summary.totalIssues} GitHub issue payloads (Critical: ${issueData.summary.critical}, High: ${issueData.summary.high}, Medium: ${issueData.summary.medium}, Low: ${issueData.summary.low})`);
  logger.success('GitHub Task Generator execution complete.');

  return outputPath;
}

export {
  buildGitHubIssues,
  writeGitHubIssuesDocument
};
