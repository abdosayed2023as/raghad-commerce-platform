import { createGitHubIssue } from './issueTemplate.js';

/**
 * Main orchestration for generating GitHub Issues from specifications.json.
 *
 * @param {object} specData Parsed specifications.json contract
 * @returns {object} GitHub issues payload
 */
export function buildGitHubIssues(specData) {
  const specList = Array.isArray(specData?.specifications) ? specData.specifications : [];

  const issues = specList.map((spec, index) => createGitHubIssue(spec, index));

  const critical = issues.filter(i => i.priority === 'Critical').length;
  const high = issues.filter(i => i.priority === 'High').length;
  const medium = issues.filter(i => i.priority === 'Medium').length;
  const low = issues.filter(i => i.priority === 'Low').length;

  return {
    summary: {
      totalIssues: issues.length,
      critical,
      high,
      medium,
      low
    },
    issues
  };
}
