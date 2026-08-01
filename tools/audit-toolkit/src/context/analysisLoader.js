import { loadContextArtifact } from './contractLoaderHelper.js';

export function loadAnalysis(folders) {
  return loadContextArtifact(folders.analysis, 'analysis.json', 'analysis.json');
}
