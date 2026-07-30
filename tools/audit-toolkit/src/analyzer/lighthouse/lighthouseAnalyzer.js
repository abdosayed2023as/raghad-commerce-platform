import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

function extractCategoryScores(lighthouseJson) {
  if (!lighthouseJson || !lighthouseJson.categories) {
    return {
      performance: null,
      accessibility: null,
      bestPractices: null,
      seo: null
    };
  }

  const cat = lighthouseJson.categories;
  const getScore = (categoryObj) => {
    if (!categoryObj || typeof categoryObj.score !== 'number') return null;
    return Number(categoryObj.score.toFixed(4));
  };

  return {
    performance: getScore(cat.performance),
    accessibility: getScore(cat.accessibility),
    bestPractices: getScore(cat['best-practices']),
    seo: getScore(cat.seo)
  };
}

function extractCoreWebVitals(lighthouseJson) {
  if (!lighthouseJson || !lighthouseJson.audits) {
    return {
      lcp: null,
      cls: null,
      inp: null
    };
  }

  const audits = lighthouseJson.audits;

  const lcp = audits['largest-contentful-paint']?.numericValue != null
    ? Number(audits['largest-contentful-paint'].numericValue.toFixed(2))
    : null;

  const cls = audits['cumulative-layout-shift']?.numericValue != null
    ? Number(audits['cumulative-layout-shift'].numericValue.toFixed(4))
    : null;

  const rawInp = audits['interaction-to-next-paint']?.numericValue
    ?? audits['experimental-interaction-to-next-paint']?.numericValue
    ?? audits['total-blocking-time']?.numericValue;

  const inp = rawInp != null ? Number(rawInp.toFixed(2)) : null;

  return { lcp, cls, inp };
}

function loadLighthouseJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    logger.warn(`[ANALYZER] Failed to read Lighthouse artifact "${filePath}": ${err.message}`);
    return null;
  }
}

export function analyzeLighthouse(folders) {
  const performanceDir = folders.performance;

  let desktopPath = null;
  let mobilePath = null;

  if (fs.existsSync(performanceDir)) {
    const files = fs.readdirSync(performanceDir);
    desktopPath = files.find(f => f.includes('desktop') && f.endsWith('.json'));
    mobilePath = files.find(f => f.includes('mobile') && f.endsWith('.json'));
  }

  const desktopJson = desktopPath ? loadLighthouseJson(path.join(performanceDir, desktopPath)) : null;
  const mobileJson = mobilePath ? loadLighthouseJson(path.join(performanceDir, mobilePath)) : null;

  if (!desktopJson) {
    logger.warn('[ANALYZER] Lighthouse Desktop JSON artifact missing or unreadable.');
  }
  if (!mobileJson) {
    logger.warn('[ANALYZER] Lighthouse Mobile JSON artifact missing or unreadable.');
  }

  const desktopScores = extractCategoryScores(desktopJson);
  const mobileScores = extractCategoryScores(mobileJson);

  // Core Web Vitals prioritize Mobile run per Google CWV standard, falling back to Desktop
  const mobileCwv = extractCoreWebVitals(mobileJson);
  const desktopCwv = extractCoreWebVitals(desktopJson);

  const cwv = {
    lcp: mobileCwv.lcp ?? desktopCwv.lcp ?? null,
    cls: mobileCwv.cls ?? desktopCwv.cls ?? null,
    inp: mobileCwv.inp ?? desktopCwv.inp ?? null
  };

  return {
    desktop: desktopScores,
    mobile: mobileScores,
    coreWebVitals: cwv
  };
}
