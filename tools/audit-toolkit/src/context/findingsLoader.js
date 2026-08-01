import { loadContextArtifact } from './contractLoaderHelper.js';

export function loadFindings(folders) {
  return loadContextArtifact(folders.analysis, 'findings.json', 'findings.json');
}
