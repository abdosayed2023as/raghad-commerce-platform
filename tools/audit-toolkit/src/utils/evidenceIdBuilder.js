import { getPageSlug } from './configLoader.js';

/**
 * Derives the viewport string (desktop, mobile, or all) from a ruleId.
 * @param {string} ruleId
 * @returns {string} viewport
 */
export function deriveFindingViewport(ruleId) {
  if (ruleId.includes('DESKTOP')) return 'desktop';
  if (ruleId.includes('MOBILE') || ruleId.startsWith('PERF_LCP') || ruleId.startsWith('PERF_CLS') || ruleId.startsWith('PERF_INP')) return 'mobile';
  return 'all';
}

/**
 * Builds a deterministic stable Finding ID derived from ruleId, pageSlug, and viewport.
 * Format: FIND_{ruleId}_{pageSlug}_{viewport}
 *
 * @param {string} ruleId
 * @param {string} targetUrl
 * @returns {string} Stable finding ID
 */
export function buildStableFindingId(ruleId, targetUrl) {
  const pageSlug = getPageSlug(targetUrl || 'https://raghadkids.com');
  const viewport = deriveFindingViewport(ruleId);
  return `FIND_${ruleId}_${pageSlug}_${viewport}`;
}

/**
 * Generates dynamic Evidence IDs and relative source artifact paths based on rule ID and target URL.
 * @param {string} ruleId
 * @param {string} targetUrl
 * @returns {{ evidenceIds: string[], sourceArtifacts: string[] }}
 */
export function buildDynamicEvidenceMapping(ruleId, targetUrl) {
  const slug = getPageSlug(targetUrl || 'https://raghadkids.com');
  const slugUpper = slug.toUpperCase();

  // Desktop performance / audit rules
  if (ruleId.includes('DESKTOP')) {
    return {
      evidenceIds: [`EVD-PRF-DESKTOP-${slugUpper}`],
      sourceArtifacts: [`performance/lighthouse-${slug}-desktop.json`]
    };
  }

  // Core Web Vitals and Mobile Performance rules
  if (ruleId.includes('MOBILE') || ruleId.startsWith('PERF_LCP') || ruleId.startsWith('PERF_CLS') || ruleId.startsWith('PERF_INP')) {
    return {
      evidenceIds: [`EVD-PRF-MOBILE-${slugUpper}`],
      sourceArtifacts: [`performance/lighthouse-${slug}-mobile.json`]
    };
  }

  // Console rules
  if (ruleId.startsWith('CONSOLE')) {
    return {
      evidenceIds: [`EVD-CNS-${slugUpper}`],
      sourceArtifacts: [`console/console-${slug}-errors.log`]
    };
  }

  // Network rules
  if (ruleId.startsWith('NETWORK')) {
    return {
      evidenceIds: [`EVD-NET-${slugUpper}`],
      sourceArtifacts: [`network/network-${slug}.har`]
    };
  }

  // Default fallback for any unhandled rules
  return {
    evidenceIds: [`EVD-GEN-${slugUpper}`],
    sourceArtifacts: [`manifest/manifest.json`]
  };
}
