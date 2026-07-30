import fs from 'fs';
import path from 'path';

export function ensureFolderStructure(baseOutputDir = 'output') {
  const now = new Date();
  const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');
  
  const runRoot = path.resolve(process.cwd(), baseOutputDir, timestamp, 'WA-01_EVIDENCE');

  const folders = {
    root: runRoot,
    runTimestamp: timestamp,
    screenshotsDesktop: path.join(runRoot, 'screenshots', 'desktop'),
    screenshotsMobile: path.join(runRoot, 'screenshots', 'mobile'),
    performance: path.join(runRoot, 'performance'),
    console: path.join(runRoot, 'console'),
    network: path.join(runRoot, 'network'),
    accessibility: path.join(runRoot, 'accessibility'),
    seo: path.join(runRoot, 'seo'),
    manifest: path.join(runRoot, 'manifest'),
    analysis: path.join(runRoot, 'analysis'),
    context: path.join(runRoot, 'context'),
    logs: path.join(runRoot, 'logs')
  };

  // Explicit array of actual filesystem directory paths to create
  const dirsToCreate = [
    folders.root,
    folders.screenshotsDesktop,
    folders.screenshotsMobile,
    folders.performance,
    folders.console,
    folders.network,
    folders.accessibility,
    folders.seo,
    folders.manifest,
    folders.analysis,
    folders.context,
    folders.logs
  ];

  dirsToCreate.forEach(dirPath => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  return folders;
}
