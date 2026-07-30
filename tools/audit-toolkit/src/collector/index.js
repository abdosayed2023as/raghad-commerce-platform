import { chromium } from 'playwright';
import { getPageSlug } from '../utils/configLoader.js';
import { logger } from '../utils/logger.js';
import { captureScreenshots } from './screenshots/screenshotCollector.js';
import { captureConsoleLogs } from './console/consoleCollector.js';
import { captureNetworkHar } from './network/networkCollector.js';
import { runLighthouseAudits } from './lighthouse/lighthouseCollector.js';

export async function runAllCollectors(config, folders, artifactTracker) {
  const pageSlug = getPageSlug(config.target);
  logger.info(`Starting evidence collection for target: "${config.target}" (slug: "${pageSlug}")...`);

  // Launch Playwright Chromium browser using config.headless toggle
  const isHeadless = config.headless !== false;
  logger.info(`Launching Playwright Chromium browser (headless: ${isHeadless})...`);
  const browser = await chromium.launch({
    headless: isHeadless
  });

  try {
    // 1. Capture Screenshots
    await captureScreenshots(browser, config, pageSlug, folders, artifactTracker);

    // 2. Capture Console Logs
    await captureConsoleLogs(browser, config, pageSlug, folders, artifactTracker);

    // 3. Capture Network HAR
    await captureNetworkHar(browser, config, pageSlug, folders, artifactTracker);
  } catch (err) {
    logger.error('Error during Playwright evidence collection session', err);
  } finally {
    await browser.close();
    logger.info('Playwright browser session closed.');
  }

  // 4. Run Lighthouse Audits
  await runLighthouseAudits(config, pageSlug, folders, artifactTracker);

  logger.success('Evidence collection workflow finished.');
}
