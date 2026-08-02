import fs from 'fs';
import path from 'path';
import { runPatchApplicator } from './apply/index.js';
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

/**
 * Maps error message code prefixes to IMP-06 standardized exit code taxonomy.
 */
function getExitCodeFromError(err) {
  const message = err?.message || String(err);
  if (message.includes('APP-001')) return 2; // Contract / Schema Validation Error
  if (message.includes('APP-002') || message.includes('APP-011')) return 3; // Git / Environment Incompatibility
  if (message.includes('APP-003') || message.includes('APP-010')) return 4; // Dry-Run / Hunk Conflict
  if (message.includes('APP-004')) return 5; // Checksum Mismatch
  if (message.includes('APP-007')) return 6; // Workspace Lock Contention
  if (message.includes('APP-006') || message.includes('APP-008') || message.includes('APP-009')) return 7; // Security / Boundary Violation
  return 1; // General failure
}

async function main() {
  const args = process.argv.slice(2);
  let runDir = args[0] || null;

  if (!runDir) {
    runDir = getLatestRunDir();
    if (runDir) {
      logger.info(`[APPLY CLI] Auto-detected latest run directory: "${runDir}"`);
    }
  }

  if (!runDir) {
    logger.error('Usage: npm run apply [runDirectory]');
    process.exit(1);
  }

  const baseDir = fs.existsSync(path.join(runDir, 'WA-01_EVIDENCE'))
    ? path.join(runDir, 'WA-01_EVIDENCE')
    : runDir;

  const patchesDir = fs.existsSync(path.join(baseDir, 'patches'))
    ? path.join(baseDir, 'patches')
    : baseDir;

  const applyResultDir = path.join(baseDir, 'apply-result');
  if (!fs.existsSync(applyResultDir)) {
    fs.mkdirSync(applyResultDir, { recursive: true });
  }

  const folders = {
    patches: patchesDir,
    applyResult: applyResultDir,
    runTimestamp: path.basename(runDir)
  };

  try {
    await runPatchApplicator(folders);
    process.exit(0);
  } catch (err) {
    const exitCode = getExitCodeFromError(err);
    logger.error(`Fatal error executing Patch Applicator V2 (AT-13A) [Exit Code: ${exitCode}]`, err);
    process.exit(exitCode);
  }
}

main();
