import fs from 'fs';
import path from 'path';
import { runAutoFixEngine } from './patch/index.js';
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
      logger.info(`[PATCH CLI] Auto-detected latest run directory: "${runDir}"`);
    }
  }

  if (!runDir) {
    logger.error('Usage: npm run patch [runDirectory]');
    process.exit(1);
  }

  const baseDir = fs.existsSync(path.join(runDir, 'WA-01_EVIDENCE'))
    ? path.join(runDir, 'WA-01_EVIDENCE')
    : runDir;

  const fixPlansDir = fs.existsSync(path.join(baseDir, 'fix-plans'))
    ? path.join(baseDir, 'fix-plans')
    : baseDir;

  const patchesDir = path.join(baseDir, 'patches');
  if (!fs.existsSync(patchesDir)) {
    fs.mkdirSync(patchesDir, { recursive: true });
  }

  const folders = {
    fixPlans: fixPlansDir,
    patches: patchesDir
  };

  try {
    await runAutoFixEngine(folders);
  } catch (err) {
    logger.error('Fatal error executing Auto Fix Engine V2 (AT-12)', err);
    process.exit(1);
  }
}

main();
