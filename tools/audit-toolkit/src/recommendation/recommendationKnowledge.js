/**
 * Single source of truth for deterministic recommendation metadata per ruleId.
 * Provides owner suggestions, estimated effort, estimated impact, implementation hints, and titles.
 */
export const RULE_RECOMMENDATION_KNOWLEDGE = {
  PERF_SCORE_DESKTOP_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'M',
    estimatedImpact: 'High',
    title: 'Optimize Desktop Performance Score',
    summary: 'Improve desktop Lighthouse performance score above the 0.90 target threshold.',
    expectedBenefit: 'Faster desktop page loads, reduced bounce rate, and improved core metric scores.',
    implementationHints: [
      'Optimize critical rendering path CSS and inline critical styles',
      'Defer non-critical JavaScript execution until after initial paint',
      'Eliminate render-blocking resources in document head'
    ]
  },
  PERF_SCORE_MOBILE_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'L',
    estimatedImpact: 'High',
    title: 'Optimize Mobile Performance Score',
    summary: 'Improve mobile Lighthouse performance score above the 0.90 target threshold.',
    expectedBenefit: 'Significantly faster mobile page interactive speeds and lower mobile user churn.',
    implementationHints: [
      'Reduce total mobile JavaScript bundle payload size',
      'Optimize responsive image formats using WebP/AVIF',
      'Implement native lazy loading for below-the-fold content'
    ]
  },
  ACCESSIBILITY_SCORE_DESKTOP_001: {
    ownerSuggestion: 'Accessibility',
    estimatedEffort: 'S',
    estimatedImpact: 'Medium',
    title: 'Improve Desktop Accessibility Compliance',
    summary: 'Elevate desktop accessibility score above 0.90 to satisfy WCAG AA guidelines.',
    expectedBenefit: 'Enhanced usability for users relying on screen readers and assistive technology.',
    implementationHints: [
      'Ensure proper ARIA roles and labels on all interactive controls',
      'Verify text and background color contrast ratio meets 4.5:1 minimum',
      'Add descriptive alt text to all informational image elements'
    ]
  },
  ACCESSIBILITY_SCORE_MOBILE_001: {
    ownerSuggestion: 'Accessibility',
    estimatedEffort: 'S',
    estimatedImpact: 'Medium',
    title: 'Improve Mobile Accessibility Compliance',
    summary: 'Elevate mobile accessibility score above 0.90 for mobile screen readers and touch input.',
    expectedBenefit: 'Better touch accessibility and screen reader support on mobile devices.',
    implementationHints: [
      'Increase interactive touch target dimensions to minimum 48x48px',
      'Ensure viewport user-scalable parameter is not disabled',
      'Verify logical focus navigation order for screen readers'
    ]
  },
  BEST_PRACTICES_SCORE_DESKTOP_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'S',
    estimatedImpact: 'Medium',
    title: 'Remediate Desktop Best Practices Issues',
    summary: 'Resolve best practices audit failures to reach the 0.90 target score.',
    expectedBenefit: 'Improved browser compatibility, security posture, and runtime health.',
    implementationHints: [
      'Avoid deprecated web APIs and legacy third-party dependencies',
      'Serve images with correct natural aspect ratios',
      'Configure HTTPS and modern Security Content Policy headers'
    ]
  },
  BEST_PRACTICES_SCORE_MOBILE_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'S',
    estimatedImpact: 'Medium',
    title: 'Remediate Mobile Best Practices Issues',
    summary: 'Resolve mobile best practices audit failures to reach the 0.90 target score.',
    expectedBenefit: 'Enhanced mobile browser compatibility and security standards.',
    implementationHints: [
      'Prevent password input fields from blocking paste operations',
      'Ensure clean console log output in production environments',
      'Use secure HTTPS protocol for all external assets'
    ]
  },
  SEO_SCORE_DESKTOP_001: {
    ownerSuggestion: 'SEO',
    estimatedEffort: 'XS',
    estimatedImpact: 'Medium',
    title: 'Enhance Desktop Technical SEO Compliance',
    summary: 'Improve desktop SEO score above 0.90 by correcting crawling and metadata issues.',
    expectedBenefit: 'Higher search engine indexability, richer SERP snippets, and organic traffic growth.',
    implementationHints: [
      'Provide unique descriptive title tags and meta descriptions',
      'Validate structured data JSON-LD syntax on target pages',
      'Ensure crawlable internal anchor link href attributes'
    ]
  },
  SEO_SCORE_MOBILE_001: {
    ownerSuggestion: 'SEO',
    estimatedEffort: 'XS',
    estimatedImpact: 'Medium',
    title: 'Enhance Mobile Technical SEO Compliance',
    summary: 'Improve mobile SEO score above 0.90 by optimizing mobile indexing signals.',
    expectedBenefit: 'Better mobile search ranking signals and crawl efficiency.',
    implementationHints: [
      'Configure viewport meta tag with width=device-width',
      'Ensure legibly sized text without requiring pinch-to-zoom',
      'Verify canonical URL link tags match desktop canonicals'
    ]
  },
  PERF_LCP_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'L',
    estimatedImpact: 'Critical',
    title: 'Optimize Largest Contentful Paint (LCP)',
    summary: 'Reduce LCP duration below the 2500ms threshold for optimal rendering speed.',
    expectedBenefit: 'Instant visual content rendering for arriving visitors, improving conversion rate.',
    implementationHints: [
      'Compress hero image asset and convert to modern WebP/AVIF format',
      'Add rel="preload" link header for the critical LCP image resource',
      'Eliminate client-side render-blocking CSS and heavy web fonts'
    ]
  },
  PERF_CLS_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'S',
    estimatedImpact: 'Critical',
    title: 'Reduce Cumulative Layout Shift (CLS)',
    summary: 'Eliminate visual layout instability below the 0.10 threshold.',
    expectedBenefit: 'Stable visual experience preventing accidental clicks and user frustration.',
    implementationHints: [
      'Set explicit width and height attributes on all img and video elements',
      'Reserve layout dimension containers for dynamic ad or banner slots',
      'Apply CSS font-display: swap with font metric overrides'
    ]
  },
  PERF_INP_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'L',
    estimatedImpact: 'High',
    title: 'Improve Interaction to Next Paint (INP)',
    summary: 'Reduce interaction latency below 200ms for responsive UI feedback.',
    expectedBenefit: 'Responsive UI feedback on button taps, inputs, and click events.',
    implementationHints: [
      'Break up long JavaScript tasks (> 50ms) using requestIdleCallback',
      'De-bounce and optimize heavy event listener event handlers',
      'Reduce main-thread third-party script execution during page interaction'
    ]
  },
  CONSOLE_ERRORS_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'M',
    estimatedImpact: 'High',
    title: 'Fix Unhandled Browser Console Errors',
    summary: 'Eliminate JavaScript exceptions and network errors captured in browser console.',
    expectedBenefit: 'Prevents client-side script crashes, broken UI interactions, and data loss.',
    implementationHints: [
      'Resolve uncaught JavaScript runtime exceptions in application code',
      'Fix broken or missing third-party script resource imports',
      'Wrap asynchronous network calls in defensive try-catch error handlers'
    ]
  },
  CONSOLE_WARNINGS_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'XS',
    estimatedImpact: 'Low',
    title: 'Resolve Browser Console Warnings',
    summary: 'Reduce browser console warning messages below threshold count of 5.',
    expectedBenefit: 'Cleaner developer logs and prevention of future browser feature deprecations.',
    implementationHints: [
      'Review console warning call stacks and address underlying API notices',
      'Replace deprecated browser function calls with modern equivalents',
      'Remove debugging log statements from production builds'
    ]
  },
  NETWORK_FAILED_REQUESTS_001: {
    ownerSuggestion: 'Backend',
    estimatedEffort: 'M',
    estimatedImpact: 'High',
    title: 'Eliminate Failed HTTP Network Requests',
    summary: 'Fix network HTTP requests returning error status codes (>= 400).',
    expectedBenefit: 'Restores missing page assets, API data endpoints, and backend connectivity.',
    implementationHints: [
      'Fix broken 404 image/script paths and 500 server error endpoints',
      'Verify CORS middleware headers and API gateway request routing rules',
      'Ensure static CDN asset paths are correctly deployed'
    ]
  },
  NETWORK_TRANSFERRED_BYTES_001: {
    ownerSuggestion: 'DevOps',
    estimatedEffort: 'M',
    estimatedImpact: 'Medium',
    title: 'Reduce Total Network Transferred Bytes',
    summary: 'Decrease total network payload size below 3MB threshold.',
    expectedBenefit: 'Decreases bandwidth cost, accelerates mobile downloads, and reduces data usage.',
    implementationHints: [
      'Enable Gzip or Brotli compression on HTTP web server headers',
      'Set aggressive Cache-Control browser caching policies for static assets',
      'Minify CSS, JavaScript, and inline SVG assets'
    ]
  },
  NETWORK_REQUEST_COUNT_001: {
    ownerSuggestion: 'Frontend',
    estimatedEffort: 'M',
    estimatedImpact: 'Medium',
    title: 'Reduce HTTP Network Request Count',
    summary: 'Consolidate network traffic below 100 total HTTP requests.',
    expectedBenefit: 'Reduces HTTP connection overhead and improves browser rendering concurrency.',
    implementationHints: [
      'Bundle granular JavaScript modules and stylesheet files',
      'Combine multiple icon graphics into unified SVG spritemaps',
      'Audit and consolidate redundant third-party analytics and tracking tags'
    ]
  }
};

/**
 * Resolves deterministic recommendation knowledge for a given ruleId and finding metadata.
 * @param {string} ruleId Rule identifier
 * @param {object} [finding] Finding metadata object
 * @returns {object} Recommendation knowledge object
 */
export function getRecommendationKnowledge(ruleId, finding = {}) {
  const knowledge = RULE_RECOMMENDATION_KNOWLEDGE[ruleId];

  if (knowledge) {
    return {
      ownerSuggestion: knowledge.ownerSuggestion,
      estimatedEffort: knowledge.estimatedEffort,
      estimatedImpact: knowledge.estimatedImpact,
      title: knowledge.title,
      summary: knowledge.summary,
      expectedBenefit: knowledge.expectedBenefit,
      implementationHints: [...knowledge.implementationHints]
    };
  }

  // Deterministic fallback for unmapped rule IDs
  let ownerSuggestion = 'Unknown';
  const category = (finding.category || '').toLowerCase();
  if (category === 'performance' || category === 'console') ownerSuggestion = 'Frontend';
  else if (category === 'accessibility') ownerSuggestion = 'Accessibility';
  else if (category === 'seo') ownerSuggestion = 'SEO';
  else if (category === 'network') ownerSuggestion = 'DevOps';

  const severity = (finding.severity || '').toLowerCase();
  let estimatedImpact = 'Medium';
  if (severity === 'critical') estimatedImpact = 'Critical';
  else if (severity === 'high') estimatedImpact = 'High';
  else if (severity === 'low') estimatedImpact = 'Low';

  return {
    ownerSuggestion,
    estimatedEffort: 'M',
    estimatedImpact,
    title: finding.title ? `Address ${finding.title}` : 'Address Audit Issue',
    summary: `Rule ${ruleId || 'UNKNOWN'} failed metric threshold evaluation.`,
    expectedBenefit: 'Satisfies target quality metric threshold and improves overall audit score.',
    implementationHints: [
      'Inspect metric threshold and review associated evidence artifacts'
    ]
  };
}
