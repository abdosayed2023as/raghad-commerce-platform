import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';
import { withRetry } from '../../utils/retry.js';

export async function captureConsoleLogs(browser, config, pageSlug, folders, artifactTracker) {
  if (!config.console) {
    logger.info('Console logging disabled in configuration.');
    return;
  }

  logger.info(`Capturing console logs for ${config.target}...`);
  try {
    await withRetry(async () => {
      const logs = [];
      const context = await browser.newContext({
        viewport: config.viewports.desktop
      });
      const page = await context.newPage();

      page.on('console', msg => {
        const type = msg.type().toUpperCase();
        const text = msg.text();
        const location = msg.location();
        const locStr = location.url ? ` (${location.url}:${location.lineNumber})` : '';
        logs.push(`[${new Date().toISOString()}] [${type}] ${text}${locStr}`);
      });

      page.on('pageerror', err => {
        logs.push(`[${new Date().toISOString()}] [UNHANDLED EXCEPTION] ${err.stack || err.message}`);
      });

      try {
        await page.goto(config.target, { waitUntil: 'networkidle', timeout: config.timeout });
        await page.waitForTimeout(2000);

        const filename = `console-${pageSlug}-errors.log`;
        const outputPath = path.join(folders.console, filename);

        const header = `=== BROWSER CONSOLE LOG EXPORT ===\nTarget: ${config.target}\nExport Timestamp: ${new Date().toISOString()}\nTotal Messages Captured: ${logs.length}\n==================================\n\n`;

        fs.writeFileSync(outputPath, header + (logs.length > 0 ? logs.join('\n') : 'No console messages recorded.'), 'utf8');
        logger.success(`Console log exported: ${outputPath} (${logs.length} messages)`);
      } finally {
        await context.close();
      }
    }, { maxRetries: config.maxRetries, label: 'Console Logs' });
  } catch (err) {
    logger.error('Failed to capture console logs after retries', err);
    artifactTracker.recordFailure('Technical (Console Log)', `console-${pageSlug}-errors.log`, err);
  }
}
