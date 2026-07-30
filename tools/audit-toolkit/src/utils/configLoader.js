import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadConfig(configPath = null) {
  const defaultPath = configPath || path.resolve(__dirname, '../../audit.config.json');

  if (!fs.existsSync(defaultPath)) {
    throw new Error(`Configuration file not found at: ${defaultPath}`);
  }

  const raw = fs.readFileSync(defaultPath, 'utf8');
  let config;
  try {
    config = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in configuration file at ${defaultPath}: ${err.message}`);
  }

  if (!config.target) {
    throw new Error('Configuration error: "target" URL is required in audit.config.json.');
  }

  try {
    new URL(config.target);
  } catch (err) {
    throw new Error(`Configuration error: Invalid target URL syntax "${config.target}".`);
  }

  let maxRetries = 3;
  if (config.maxRetries !== undefined) {
    const parsed = Number(config.maxRetries);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new Error(`Configuration error: "maxRetries" must be a positive integer >= 1. Received: ${config.maxRetries}`);
    }
    maxRetries = parsed;
  }

  let timeout = 60000;
  if (config.timeout !== undefined) {
    const parsedTimeout = Number(config.timeout);
    if (isNaN(parsedTimeout) || parsedTimeout <= 0) {
      throw new Error(`Configuration error: "timeout" must be a positive number in milliseconds. Received: ${config.timeout}`);
    }
    timeout = parsedTimeout;
  }

  return {
    target: config.target,
    environment: config.environment || 'production',
    desktop: config.desktop ?? true,
    mobile: config.mobile ?? true,
    lighthouse: config.lighthouse ?? true,
    console: config.console ?? true,
    har: config.har ?? true,
    headless: config.headless ?? true,
    reportProvider: config.reportProvider || 'mock',
    maxRetries,
    outputDir: config.outputDir || 'output',
    viewports: {
      desktop: config.viewports?.desktop || { width: 1440, height: 900 },
      mobile: config.viewports?.mobile || { width: 390, height: 844 }
    },
    timeout
  };
}

export function getPageSlug(targetUrl) {
  try {
    const url = new URL(targetUrl);
    const pathname = url.pathname.replace(/^\/+|\/+$/g, '');
    if (!pathname) return 'homepage';
    return pathname.replace(/[^a-zA-Z0-9_-]/g, '-');
  } catch (err) {
    return 'page';
  }
}
