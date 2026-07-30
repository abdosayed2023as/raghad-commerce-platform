import path from 'path';
import { logger } from '../../utils/logger.js';
import { withRetry } from '../../utils/retry.js';

export async function captureNetworkHar(browser, config, pageSlug, folders, artifactTracker) {
  if (!config.har) {
    logger.info('HAR capture disabled in configuration.');
    return;
  }

  logger.info(`Capturing network HAR for ${config.target}...`);
  const filename = `network-${pageSlug}.har`;
  const outputPath = path.join(folders.network, filename);

  try {
    await withRetry(async () => {
      const context = await browser.newContext({
        viewport: config.viewports.desktop,
        recordHar: {
          path: outputPath,
          mode: 'full'
        }
      });

      const page = await context.newPage();
      try {
        await page.goto(config.target, { waitUntil: 'networkidle', timeout: config.timeout });
        await page.waitForTimeout(1000);
        logger.success(`Network HAR exported: ${outputPath}`);
      } finally {
        await context.close();
      }
    }, { maxRetries: config.maxRetries, label: 'Network HAR' });
  } catch (err) {
    logger.error('Failed to capture network HAR after retries', err);
    artifactTracker.recordFailure('Network (HAR)', filename, err);
  }
}
