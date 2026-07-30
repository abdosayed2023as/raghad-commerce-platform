/**
 * Runtime Evidence ID Builder
 *
 * Generates page-aware, run-aware evidence IDs and source artifact paths
 * from the rule definition and the current execution context.
 *
 * Format: EVD-{TYPE}-{VIEWPORT}-{SLUG}
 *   TYPE     : PRF (performance), CNS (console), NET (network), VIS (visual)
 *   VIEWPORT : DESKTOP | MOBILE | ALL
 *   SLUG     : normalized page slug (e.g. HOMEPAGE, PDP, CART)
 *
 * This replaces the previous static findingMappings.js lookup table,
 * which was page-unaware and would produce incorrect traceability
 * for any page other than the homepage.
 */

function toEvidenceSlug(pageSlug) {
  return (pageSlug || 'homepage').toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

/**
 * Derives evidence IDs and source artifact paths from a rule and execution context.
 *
 * @param {object} rule        - Rule object from ruleDefinitions (must have .metric)
 * @param {string} pageSlug    - Normalized page slug from configLoader.getPageSlug()
 * @returns {{ evidenceIds: string[], sourceArtifacts: string[] }}
 */
export function buildEvidenceMapping(rule, pageSlug) {
  const slug = toEvidenceSlug(pageSlug);
  const metric = rule.metric || '';

  // Desktop Lighthouse (performance, accessibility, best-practices, seo scores)
  if (metric.includes('.desktop.')) {
    return {
      evidenceIds: [`EVD-PRF-DESKTOP-${slug}`],
      sourceArtifacts: [`performance/lighthouse-${pageSlug}-desktop.json`]
    };
  }

  // Mobile Lighthouse (performance, accessibility, best-practices, seo scores)
  if (metric.includes('.mobile.')) {
    return {
      evidenceIds: [`EVD-PRF-MOBILE-${slug}`],
      sourceArtifacts: [`performance/lighthouse-${pageSlug}-mobile.json`]
    };
  }

  // Core Web Vitals — sourced from mobile Lighthouse run per Google CWV standard
  if (metric.startsWith('performance.coreWebVitals.')) {
    return {
      evidenceIds: [`EVD-PRF-MOBILE-${slug}`],
      sourceArtifacts: [`performance/lighthouse-${pageSlug}-mobile.json`]
    };
  }

  // Console rules
  if (metric.startsWith('console.')) {
    return {
      evidenceIds: [`EVD-CNS-${slug}`],
      sourceArtifacts: [`console/console-${pageSlug}-errors.log`]
    };
  }

  // Network rules
  if (metric.startsWith('network.')) {
    return {
      evidenceIds: [`EVD-NET-${slug}`],
      sourceArtifacts: [`network/network-${pageSlug}.har`]
    };
  }

  // Visual rules (future)
  if (metric.startsWith('visual.')) {
    return {
      evidenceIds: [`EVD-VIS-ALL-${slug}`],
      sourceArtifacts: []
    };
  }

  return { evidenceIds: [], sourceArtifacts: [] };
}
