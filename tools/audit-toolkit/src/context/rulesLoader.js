import { loadContextArtifact } from './contractLoaderHelper.js';

export function loadRules(folders) {
  return loadContextArtifact(folders.analysis, 'rules.json', 'rules.json');
}
