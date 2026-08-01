import fs from 'fs';
import path from 'path';
import { runFixPlanner } from './plan/index.js';
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
      logger.info(`[PLAN CLI] Auto-detected latest run directory: "${runDir}"`);
    }
  }

  if (!runDir) {
    logger.error('Usage: npm run plan [runDirectory]');
    process.exit(1);
  }

  const baseDir = fs.existsSync(path.join(runDir, 'WA-01_EVIDENCE'))
    ? path.join(runDir, 'WA-01_EVIDENCE')
    : runDir;

  const recommendationsDir = fs.existsSync(path.join(baseDir, 'recommendations'))
    ? path.join(baseDir, 'recommendations')
    : baseDir;

  const fixPlansDir = path.join(baseDir, 'fix-plans');
  if (!fs.existsSync(fixPlansDir)) {
    fs.mkdirSync(fixPlansDir, { recursive: true });
  }

  const folders = {
    recommendations: recommendationsDir,
    fixPlans: fixPlansDir
  };

  try {
    await runFixPlanner(folders);
  } catch (err) {
    logger.error('Fatal error executing AI Fix Planner V2 (AT-11)', err);
    process.exit(1);
  }
}

main();
