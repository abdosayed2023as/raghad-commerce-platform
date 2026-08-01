import fs from 'fs';
import path from 'path';
import { runRecommendationEngine } from './recommendation/index.js';
import { logger } from './utils/logger.js';

function getLatestRunDir(outputBaseDir = 'output') {
  const resolvedBase = path.resolve(process.cwd(), outputBaseDir);
  if (!fs.existsSync(resolvedBase)) return null;

  const entries = fs.readdirSync(resolvedBase, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'comparison')
    .map(dirent => ({
      name: dirent.name,
      path: path.join(resolvedBase, dirent.name),
      mtime: fs.statSync(path.join(resolvedBase, dirent.name)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return entries[0]?.path || null;
}

async function main() {
  const args = process.argv.slice(2);
  let runDir = args[0] || null;

  if (!runDir) {
    runDir = getLatestRunDir();
    if (runDir) {
      logger.info(`[RECOMMEND CLI] Auto-detected latest run directory: "${runDir}"`);
    }
  }

  if (!runDir) {
    logger.error('Usage: npm run recommend [runDirectory]');
    process.exit(1);
  }

  const baseDir = fs.existsSync(path.join(runDir, 'WA-01_EVIDENCE'))
    ? path.join(runDir, 'WA-01_EVIDENCE')
    : runDir;

  const contextDir = fs.existsSync(path.join(baseDir, 'context'))
    ? path.join(baseDir, 'context')
    : baseDir;

  const recommendationsDir = path.join(baseDir, 'recommendations');
  if (!fs.existsSync(recommendationsDir)) {
    fs.mkdirSync(recommendationsDir, { recursive: true });
  }

  const folders = {
    context: contextDir,
    recommendations: recommendationsDir
  };

  try {
    await runRecommendationEngine(folders);
  } catch (err) {
    logger.error('Fatal error executing Recommendation Intelligence Engine V2 (AT-10)', err);
    process.exit(1);
  }
}

main();
