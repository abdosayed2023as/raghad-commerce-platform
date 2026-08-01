import fs from 'fs';
import path from 'path';
import { runComparator } from './comparator/index.js';
import { logger } from './utils/logger.js';

function getLatestTwoRunDirs(outputBaseDir = 'output') {
  const resolvedBase = path.resolve(process.cwd(), outputBaseDir);
  if (!fs.existsSync(resolvedBase)) return [];

  const entries = fs.readdirSync(resolvedBase, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'comparison')
    .map(dirent => ({
      name: dirent.name,
      path: path.join(resolvedBase, dirent.name),
      mtime: fs.statSync(path.join(resolvedBase, dirent.name)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return entries.map(e => e.path);
}

function parseArgs() {
  const args = process.argv.slice(2);
  let baseline = null;
  let target = null;
  let output = 'output/comparison/comparison.json';

  const positional = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--baseline' && args[i + 1]) {
      baseline = args[++i];
    } else if (args[i] === '--target' && args[i + 1]) {
      target = args[++i];
    } else if (args[i] === '--output' && args[i + 1]) {
      output = args[++i];
    } else if (!args[i].startsWith('--')) {
      positional.push(args[i]);
    }
  }

  if (!baseline && positional[0]) baseline = positional[0];
  if (!target && positional[1]) target = positional[1];
  if (positional[2]) output = positional[2];

  if (!baseline || !target) {
    const recentRuns = getLatestTwoRunDirs();
    if (recentRuns.length >= 2) {
      target = recentRuns[0];   // latest
      baseline = recentRuns[1]; // previous
      logger.info(`[COMPARE CLI] Auto-detected baseline: "${baseline}" and target: "${target}"`);
    }
  }

  return { baseline, target, output };
}

async function main() {
  const { baseline, target, output } = parseArgs();

  if (!baseline || !target) {
    logger.error('Usage: npm run compare <baselineDir> <targetDir> [outputJsonPath]');
    logger.error('   OR: npm run compare -- --baseline <baselineDir> --target <targetDir> --output <outputJsonPath>');
    process.exit(1);
  }

  try {
    await runComparator(baseline, target, output);
  } catch (err) {
    logger.error('Fatal error executing Audit Comparator V1 (AT-07)', err);
    process.exit(1);
  }
}

main();
