import fs from 'fs';
import path from 'path';

export function buildEvidenceIndex(folders) {
  const evidenceIndex = {};

  // Helper to resolve relative path if file exists
  const checkFile = (dirPath, filenamePattern) => {
    if (!fs.existsSync(dirPath)) return null;
    const files = fs.readdirSync(dirPath);
    const match = files.find(f => filenamePattern(f));
    if (!match) return null;
    const fullPath = path.join(dirPath, match);
    const relPath = path.relative(folders.root, fullPath).replace(/\\/g, '/');
    return relPath;
  };

  // 1. Screenshots
  const desktopScreenshot = checkFile(folders.screenshotsDesktop, f => f.endsWith('.png'));
  const mobileScreenshot = checkFile(folders.screenshotsMobile, f => f.endsWith('.png'));

  if (desktopScreenshot || mobileScreenshot) {
    evidenceIndex.screenshots = {};
    if (desktopScreenshot) evidenceIndex.screenshots.desktop = desktopScreenshot;
    if (mobileScreenshot) evidenceIndex.screenshots.mobile = mobileScreenshot;
  }

  // 2. Performance (Lighthouse)
  const desktopHtml = checkFile(folders.performance, f => f.includes('desktop') && f.endsWith('.html'));
  const desktopJson = checkFile(folders.performance, f => f.includes('desktop') && f.endsWith('.json'));
  const mobileHtml = checkFile(folders.performance, f => f.includes('mobile') && f.endsWith('.html'));
  const mobileJson = checkFile(folders.performance, f => f.includes('mobile') && f.endsWith('.json'));

  if (desktopHtml || desktopJson || mobileHtml || mobileJson) {
    evidenceIndex.performance = {};
    if (desktopHtml) evidenceIndex.performance.desktopHtml = desktopHtml;
    if (desktopJson) evidenceIndex.performance.desktopJson = desktopJson;
    if (mobileHtml) evidenceIndex.performance.mobileHtml = mobileHtml;
    if (mobileJson) evidenceIndex.performance.mobileJson = mobileJson;
  }

  // 3. Console
  const consoleLog = checkFile(folders.console, f => f.endsWith('.log'));
  if (consoleLog) {
    evidenceIndex.console = {
      log: consoleLog
    };
  }

  // 4. Network
  const harFile = checkFile(folders.network, f => f.endsWith('.har'));
  if (harFile) {
    evidenceIndex.network = {
      har: harFile
    };
  }

  return evidenceIndex;
}
