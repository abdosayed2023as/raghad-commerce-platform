import fs from 'fs';
import path from 'path';
import { runSpecificationGenerator } from './specification/index.js';
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
      logger.info(`[SPEC CLI] Auto-detected latest run directory: "${runDir}"`);
    }
  }

  if (!runDir) {
    logger.error('Usage: npm run spec [runDirectory]');
    process.exit(1);
  }

  const contextDir = fs.existsSync(path.join(runDir, 'context'))
    ? path.join(runDir, 'context')
    : fs.existsSync(path.join(runDir, 'WA-01_EVIDENCE', 'context'))
      ? path.join(runDir, 'WA-01_EVIDENCE', 'context')
      : runDir;

  const folders = { context: contextDir };

  try {
    await runSpecificationGenerator(folders);
  } catch (err) {
    logger.error('Fatal error executing Specification Generator V1 (AT-08)', err);
    process.exit(1);
  }
}

main();
