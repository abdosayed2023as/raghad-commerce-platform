import path from 'path';
import { logger } from '../../utils/logger.js';
import { withRetry } from '../../utils/retry.js';

export async function captureScreenshots(browser, config, pageSlug, folders, artifactTracker) {
  if (!config.desktop && !config.mobile) {
    logger.info('Screenshots disabled in configuration.');
    return;
  }

  // 1. Desktop Screenshot
  if (config.desktop) {
    logger.info(`Capturing Desktop screenshot (1440x900) for ${config.target}...`);
    try {
      await withRetry(async () => {
        const context = await browser.newContext({
          viewport: config.viewports.desktop,
          deviceScaleFactor: 1
        });
        const page = await context.newPage();
        try {
          await page.goto(config.target, { waitUntil: 'networkidle', timeout: config.timeout });
          await autoScroll(page);
          const filename = `${pageSlug}-desktop.png`;
          const outputPath = path.join(folders.screenshotsDesktop, filename);
          await page.screenshot({ path: outputPath, fullPage: true });
          logger.success(`Desktop screenshot saved: ${outputPath}`);
        } finally {
          await context.close();
        }
      }, { maxRetries: config.maxRetries, label: 'Desktop Screenshot' });
    } catch (err) {
      logger.error(`Failed to capture Desktop screenshot after retries`, err);
      artifactTracker.recordFailure('Visual (Desktop)', 'homepage-desktop.png', err);
    }
  }

  // 2. Mobile Screenshot
  if (config.mobile) {
    logger.info(`Capturing Mobile screenshot (390x844) for ${config.target}...`);
    try {
      await withRetry(async () => {
        const context = await browser.newContext({
          viewport: config.viewports.mobile,
          isMobile: true,
          hasTouch: true,
          deviceScaleFactor: 2,
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        });
        const page = await context.newPage();
        try {
          await page.goto(config.target, { waitUntil: 'networkidle', timeout: config.timeout });
          await autoScroll(page);
          const filename = `${pageSlug}-mobile.png`;
          const outputPath = path.join(folders.screenshotsMobile, filename);
          await page.screenshot({ path: outputPath, fullPage: true });
          logger.success(`Mobile screenshot saved: ${outputPath}`);
        } finally {
          await context.close();
        }
      }, { maxRetries: config.maxRetries, label: 'Mobile Screenshot' });
    } catch (err) {
      logger.error(`Failed to capture Mobile screenshot after retries`, err);
      artifactTracker.recordFailure('Visual (Mobile)', 'homepage-mobile.png', err);
    }
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight > 5000) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await page.waitForTimeout(500);
}
