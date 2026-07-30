import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse/core/index.js';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { logger } from '../../utils/logger.js';
import { withRetry } from '../../utils/retry.js';

export async function runLighthouseAudits(config, pageSlug, folders, artifactTracker) {
  if (!config.lighthouse) {
    logger.info('Lighthouse audits disabled in configuration.');
    return;
  }

  logger.info(`Launching Lighthouse environment for ${config.target}...`);

  let chromePath = null;
  let browserInfo = {
    type: 'System Default Chrome',
    path: null,
    resolved: false,
    warning: null
  };

  try {
    const resolvedPath = chromium.executablePath();
    if (resolvedPath && fs.existsSync(resolvedPath)) {
      chromePath = resolvedPath;
      browserInfo = {
        type: 'Playwright Chromium',
        path: chromePath,
        resolved: true,
        warning: null
      };
      logger.info(`Lighthouse using Playwright Chromium binary: ${chromePath}`);
    } else {
      browserInfo.warning = `Playwright Chromium executable path "${resolvedPath}" does not exist. Falling back to system Chrome.`;
      logger.warn(`[WARNING] ${browserInfo.warning}`);
      artifactTracker.addWarning(browserInfo.warning);
    }
  } catch (e) {
    browserInfo.warning = `Failed to resolve Playwright Chromium executable: ${e.message}. Falling back to system Chrome.`;
    logger.warn(`[WARNING] ${browserInfo.warning}`);
    artifactTracker.addWarning(browserInfo.warning);
  }

  artifactTracker.recordBrowserInfo(browserInfo);

  const chromeFlags = ['--no-sandbox', '--disable-gpu'];
  if (config.headless !== false) {
    chromeFlags.push('--headless=new');
  }

  const launchOpts = { chromeFlags };
  if (chromePath) {
    launchOpts.chromePath = chromePath;
  }

  // 1. Mobile Audit
  if (config.mobile) {
    logger.info('Executing Lighthouse Mobile audit...');
    try {
      await withRetry(async () => {
        let chrome;
        try {
          chrome = await chromeLauncher.launch(launchOpts);
          const port = chrome.port;
          const mobileFlags = { port, output: ['html', 'json'], logLevel: 'error' };
          const result = await lighthouse(config.target, mobileFlags);

          if (result && result.report) {
            const htmlReport = Array.isArray(result.report) ? result.report[0] : result.report;
            const jsonReport = Array.isArray(result.report) ? result.report[1] : JSON.stringify(result.lhr, null, 2);

            const htmlPath = path.join(folders.performance, `lighthouse-${pageSlug}-mobile.html`);
            const jsonPath = path.join(folders.performance, `lighthouse-${pageSlug}-mobile.json`);

            fs.writeFileSync(htmlPath, htmlReport, 'utf8');
            fs.writeFileSync(jsonPath, typeof jsonReport === 'string' ? jsonReport : JSON.stringify(jsonReport, null, 2), 'utf8');
            logger.success(`Lighthouse Mobile HTML saved: ${htmlPath}`);
            logger.success(`Lighthouse Mobile JSON saved: ${jsonPath}`);
          }
        } finally {
          if (chrome) {
            try { await chrome.kill(); } catch (kErr) { logger.warn(`Chrome cleanup note: ${kErr.message}`); }
          }
        }
      }, { maxRetries: config.maxRetries, label: 'Lighthouse Mobile Audit' });
    } catch (err) {
      logger.error('Failed to run Lighthouse Mobile audit after retries', err);
      artifactTracker.recordFailure('Performance (Lighthouse Mobile)', `lighthouse-${pageSlug}-mobile.html`, err);
    }
  }

  // 2. Desktop Audit
  if (config.desktop) {
    logger.info('Executing Lighthouse Desktop audit...');
    try {
      await withRetry(async () => {
        let chrome;
        try {
          chrome = await chromeLauncher.launch(launchOpts);
          const port = chrome.port;
          const desktopFlags = { port, output: ['html', 'json'], logLevel: 'error' };
          const result = await lighthouse(config.target, desktopFlags, desktopConfig);

          if (result && result.report) {
            const htmlReport = Array.isArray(result.report) ? result.report[0] : result.report;
            const jsonReport = Array.isArray(result.report) ? result.report[1] : JSON.stringify(result.lhr, null, 2);

            const htmlPath = path.join(folders.performance, `lighthouse-${pageSlug}-desktop.html`);
            const jsonPath = path.join(folders.performance, `lighthouse-${pageSlug}-desktop.json`);

            fs.writeFileSync(htmlPath, htmlReport, 'utf8');
            fs.writeFileSync(jsonPath, typeof jsonReport === 'string' ? jsonReport : JSON.stringify(jsonReport, null, 2), 'utf8');
            logger.success(`Lighthouse Desktop HTML saved: ${htmlPath}`);
            logger.success(`Lighthouse Desktop JSON saved: ${jsonPath}`);
          }
        } finally {
          if (chrome) {
            try { await chrome.kill(); } catch (kErr) { logger.warn(`Chrome cleanup note: ${kErr.message}`); }
          }
        }
      }, { maxRetries: config.maxRetries, label: 'Lighthouse Desktop Audit' });
    } catch (err) {
      logger.error('Failed to run Lighthouse Desktop audit after retries', err);
      artifactTracker.recordFailure('Performance (Lighthouse Desktop)', `lighthouse-${pageSlug}-desktop.html`, err);
    }
  }
}
