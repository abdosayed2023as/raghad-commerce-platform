/**
 * Single source of truth for deterministic Fix Plan knowledge per ruleId.
 * Defines risk levels, durations, affected components, prerequisites, dependencies,
 * execution steps (with stepType and automationLevel metadata), validation steps, and rollback plans.
 */
export const RULE_FIX_PLAN_KNOWLEDGE = {
  PERF_SCORE_DESKTOP_001: {
    estimatedRisk: 'Medium',
    estimatedDuration: '2-4 hours',
    affectedComponents: ['HTML', 'CSS', 'JS', 'Build Pipeline'],
    prerequisites: [
      'Local development environment configured',
      'Access to CSS/JS build tools and bundler configuration'
    ],
    dependencies: [
      'Frontend build pipeline re-compilation'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Analyze critical CSS rendering path',
        description: 'Identify non-critical CSS stylesheets in head and extract critical above-the-fold inline CSS.',
        order: 1,
        stepType: 'Analyze',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-002',
        title: 'Defer non-essential JavaScript assets',
        description: 'Add async or defer attributes to non-essential script tags in document head.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-003',
        title: 'Minify and bundle assets',
        description: 'Run production build pipeline to bundle and minify JavaScript and CSS assets.',
        order: 3,
        stepType: 'Build',
        automationLevel: 'Automatic'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Lighthouse Desktop Audit',
        expectedResult: 'Desktop performance score >= 0.90'
      },
      {
        stepId: 'VAL-002',
        title: 'Visual Layout Inspection',
        expectedResult: 'Desktop rendering displays zero layout or styling regressions'
      }
    ],
    rollbackPlan: [
      'Revert CSS inline changes via Git commit',
      'Restore original script loading tag order in HTML template'
    ]
  },
  PERF_SCORE_MOBILE_001: {
    estimatedRisk: 'High',
    estimatedDuration: '1-2 days',
    affectedComponents: ['HTML', 'CSS', 'JS', 'Images', 'CDN'],
    prerequisites: [
      'Mobile device testing environment',
      'Image optimization toolchain installed'
    ],
    dependencies: [
      'Image re-processing pipeline execution',
      'CDN edge cache purge'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Optimize mobile image assets',
        description: 'Convert all hero and content images to WebP/AVIF format with responsive srcset breakpoints.',
        order: 1,
        stepType: 'ModifyAsset',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-002',
        title: 'Tree-shake mobile JS bundles',
        description: 'Reduce total mobile JavaScript payload by tree-shaking unused dependencies and splitting routes.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-003',
        title: 'Apply native lazy loading',
        description: 'Add loading="lazy" attributes to all images below the initial mobile viewport.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Lighthouse Mobile Audit',
        expectedResult: 'Mobile performance score >= 0.90'
      },
      {
        stepId: 'VAL-002',
        title: 'Mobile Transferred Bytes Audit',
        expectedResult: 'Total mobile transferred bytes within target threshold'
      }
    ],
    rollbackPlan: [
      'Revert image srcset template modifications',
      'Restore previous JavaScript bundler entry configuration'
    ]
  },
  ACCESSIBILITY_SCORE_DESKTOP_001: {
    estimatedRisk: 'Low',
    estimatedDuration: '1-2 hours',
    affectedComponents: ['HTML', 'CSS'],
    prerequisites: [
      'Screen reader testing software (NVDA or VoiceOver)',
      'Color contrast analyzer utility'
    ],
    dependencies: [
      'Design token contrast verification'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Audit ARIA attributes',
        description: 'Inspect interactive controls and add missing aria-label or aria-expanded attributes.',
        order: 1,
        stepType: 'Analyze',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-002',
        title: 'Adjust color contrast ratios',
        description: 'Update text color tokens to satisfy WCAG AA 4.5:1 minimum contrast ratio.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-003',
        title: 'Fix image alt attributes',
        description: 'Add descriptive alt text attributes to all content image tags.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'Manual'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Lighthouse Accessibility Audit',
        expectedResult: 'Desktop accessibility score >= 0.90'
      },
      {
        stepId: 'VAL-002',
        title: 'Keyboard Navigation Test',
        expectedResult: 'All interactive elements navigable via Tab key with visible focus rings'
      }
    ],
    rollbackPlan: [
      'Revert color token modifications in CSS',
      'Restore original HTML component templates'
    ]
  },
  ACCESSIBILITY_SCORE_MOBILE_001: {
    estimatedRisk: 'Low',
    estimatedDuration: '1-2 hours',
    affectedComponents: ['HTML', 'CSS'],
    prerequisites: [
      'Touch-enabled mobile testing device or emulator'
    ],
    dependencies: [
      'UI component stylesheet re-build'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Expand touch target sizes',
        description: 'Update button and anchor link CSS padding to ensure minimum 48x48px touch targets.',
        order: 1,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-002',
        title: 'Verify viewport zoom permissions',
        description: 'Ensure viewport meta tag permits user-scaling on mobile devices.',
        order: 2,
        stepType: 'Analyze',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-003',
        title: 'Enforce logical focus ordering',
        description: 'Adjust tabIndex attributes to enforce logical mobile screen reader focus order.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'Manual'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Lighthouse Mobile Accessibility Audit',
        expectedResult: 'Mobile accessibility score >= 0.90'
      },
      {
        stepId: 'VAL-002',
        title: 'Touch Target Measurement',
        expectedResult: 'Zero interactive touch targets measuring below 48x48px'
      }
    ],
    rollbackPlan: [
      'Revert component CSS padding styles',
      'Restore previous viewport meta tag configuration'
    ]
  },
  BEST_PRACTICES_SCORE_DESKTOP_001: {
    estimatedRisk: 'Low',
    estimatedDuration: '1-2 hours',
    affectedComponents: ['HTML', 'JS', 'Server'],
    prerequisites: [
      'Access to web server HTTP response header rules'
    ],
    dependencies: [
      'Web server configuration deployment'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Replace deprecated API invocations',
        description: 'Update legacy JavaScript function calls with modern Web API equivalents.',
        order: 1,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-002',
        title: 'Configure security headers',
        description: 'Deploy Content-Security-Policy and Strict-Transport-Security server headers.',
        order: 2,
        stepType: 'Deploy',
        automationLevel: 'Manual'
      },
      {
        stepId: 'STEP-003',
        title: 'Specify image aspect ratios',
        description: 'Set explicit width/height or aspect-ratio CSS properties on responsive images.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Lighthouse Best Practices Audit',
        expectedResult: 'Desktop best practices score >= 0.90'
      },
      {
        stepId: 'VAL-002',
        title: 'Browser Console Inspection',
        expectedResult: 'Zero security header or API deprecation warnings in browser console'
      }
    ],
    rollbackPlan: [
      'Revert web server security header rule additions',
      'Restore previous API function call implementations'
    ]
  },
  BEST_PRACTICES_SCORE_MOBILE_001: {
    estimatedRisk: 'Low',
    estimatedDuration: '1 hour',
    affectedComponents: ['HTML', 'JS'],
    prerequisites: [
      'Mobile form input testing environment'
    ],
    dependencies: [
      'Form component rebuild'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Enable paste on form inputs',
        description: 'Remove onpaste="return false" event preventers from password and text fields.',
        order: 1,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-002',
        title: 'Clean production console output',
        description: 'Strip debugging console.log statements from production JavaScript build.',
        order: 2,
        stepType: 'Build',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-003',
        title: 'Enforce HTTPS asset protocols',
        description: 'Update all image and script URLs to use secure https:// scheme.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Mobile Best Practices Audit',
        expectedResult: 'Mobile best practices score >= 0.90'
      },
      {
        stepId: 'VAL-002',
        title: 'Form Paste Functional Test',
        expectedResult: 'Password fields allow copy-paste on mobile devices'
      }
    ],
    rollbackPlan: [
      'Restore original form input event handlers',
      'Revert asset URL protocol changes'
    ]
  },
  SEO_SCORE_DESKTOP_001: {
    estimatedRisk: 'Low',
    estimatedDuration: '30 mins',
    affectedComponents: ['HTML'],
    prerequisites: [
      'Access to HTML template head metadata files'
    ],
    dependencies: [
      'HTML template deployment'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Update title and meta description',
        description: 'Add unique, descriptive <title> and <meta name="description"> tags to target page template.',
        order: 1,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-002',
        title: 'Fix anchor link hrefs',
        description: 'Ensure all <a> elements contain valid, crawlable internal link href targets.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-003',
        title: 'Add structured JSON-LD schema',
        description: 'Embed valid JSON-LD schema markup for product and webpage metadata.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Lighthouse SEO Audit',
        expectedResult: 'Desktop SEO score >= 0.90'
      },
      {
        stepId: 'VAL-002',
        title: 'Structured Data Validation',
        expectedResult: 'JSON-LD schema passes validation with zero errors'
      }
    ],
    rollbackPlan: [
      'Revert HTML template header meta tags'
    ]
  },
  SEO_SCORE_MOBILE_001: {
    estimatedRisk: 'Low',
    estimatedDuration: '30 mins',
    affectedComponents: ['HTML', 'CSS'],
    prerequisites: [
      'Mobile emulator testing view'
    ],
    dependencies: [
      'Mobile template deployment'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Configure viewport meta tag',
        description: 'Set <meta name="viewport" content="width=device-width, initial-scale=1"> in head.',
        order: 1,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-002',
        title: 'Set legible font sizes',
        description: 'Set base body font size to minimum 16px to prevent mobile browser auto-zoom.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-003',
        title: 'Verify canonical tags',
        description: 'Ensure mobile page canonical link points to canonical desktop URL.',
        order: 3,
        stepType: 'Analyze',
        automationLevel: 'Automatic'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Lighthouse Mobile SEO Audit',
        expectedResult: 'Mobile SEO score >= 0.90'
      },
      {
        stepId: 'VAL-002',
        title: 'Mobile Legibility Test',
        expectedResult: 'Text is legible without horizontal scrolling or manual zooming'
      }
    ],
    rollbackPlan: [
      'Revert viewport meta tag and mobile base font CSS'
    ]
  },
  PERF_LCP_001: {
    estimatedRisk: 'High',
    estimatedDuration: '2-4 hours',
    affectedComponents: ['HTML', 'CSS', 'Images', 'CDN'],
    prerequisites: [
      'Access to original high-res hero image source',
      'CDN HTTP response header access'
    ],
    dependencies: [
      'Image asset re-processing',
      'CDN cache purge'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Optimize LCP hero image asset',
        description: 'Compress hero image, convert to WebP/AVIF format, and generate responsive breakpoints.',
        order: 1,
        stepType: 'ModifyAsset',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-002',
        title: 'Insert preload link header',
        description: 'Add <link rel="preload" as="image" href="..."> to document head for critical LCP asset.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-003',
        title: 'Optimize critical rendering CSS',
        description: 'Inline critical styles for LCP image container and eliminate render-blocking CSS.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'LCP Metric Audit',
        expectedResult: 'Largest Contentful Paint (LCP) <= 2500ms'
      },
      {
        stepId: 'VAL-002',
        title: 'Lighthouse Performance Test',
        expectedResult: 'LCP metric displays green rating in Lighthouse performance report'
      }
    ],
    rollbackPlan: [
      'Remove preload link tag from document head',
      'Restore original hero image asset URL',
      'Revert critical CSS modifications'
    ]
  },
  PERF_CLS_001: {
    estimatedRisk: 'Medium',
    estimatedDuration: '1-2 hours',
    affectedComponents: ['HTML', 'CSS', 'Images'],
    prerequisites: [
      'Access to image and dynamic container CSS stylesheets'
    ],
    dependencies: [
      'UI component stylesheet re-build'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Set explicit image dimensions',
        description: 'Add width and height attributes to all <img> and <video> elements.',
        order: 1,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-002',
        title: 'Reserve ad/banner slot dimensions',
        description: 'Define explicit CSS min-height container dimensions for dynamic asynchronous slots.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-003',
        title: 'Configure web font display',
        description: 'Apply font-display: swap and metric overrides to custom web font declarations.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'Automatic'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'CLS Metric Audit',
        expectedResult: 'Cumulative Layout Shift (CLS) <= 0.10'
      },
      {
        stepId: 'VAL-002',
        title: 'Visual Shift Audit',
        expectedResult: 'Zero unexpected layout shifts during full page render lifecycle'
      }
    ],
    rollbackPlan: [
      'Revert width/height attributes on media tags',
      'Revert container CSS min-height rules'
    ]
  },
  PERF_INP_001: {
    estimatedRisk: 'High',
    estimatedDuration: '1-2 days',
    affectedComponents: ['JS'],
    prerequisites: [
      'JavaScript profiling tooling (Chrome DevTools Performance panel)'
    ],
    dependencies: [
      'JS bundle re-compilation',
      'Regressive interaction testing'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Profile main thread long tasks',
        description: 'Identify long tasks (> 50ms) executing during user page interactions.',
        order: 1,
        stepType: 'Analyze',
        automationLevel: 'Manual'
      },
      {
        stepId: 'STEP-002',
        title: 'Break up main thread execution',
        description: 'Refactor heavy event handlers using requestIdleCallback or setTimeout scheduling.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-003',
        title: 'De-bounce interaction listeners',
        description: 'De-bounce user input listeners and passive scroll/resize handlers.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'INP Metric Audit',
        expectedResult: 'Interaction to Next Paint (INP) / TBT <= 200ms'
      },
      {
        stepId: 'VAL-002',
        title: 'Interaction Latency Profiling',
        expectedResult: 'Click and tap response latency <= 100ms'
      }
    ],
    rollbackPlan: [
      'Revert asynchronous task scheduling in event handlers',
      'Restore original event listener logic'
    ]
  },
  CONSOLE_ERRORS_001: {
    estimatedRisk: 'Medium',
    estimatedDuration: '2-4 hours',
    affectedComponents: ['JS', 'Server'],
    prerequisites: [
      'Browser dev console log file from target audit run'
    ],
    dependencies: [
      'JS source code patch deployment'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Trace console error origins',
        description: 'Analyze error stack traces to pinpoint failing scripts or network endpoints.',
        order: 1,
        stepType: 'Analyze',
        automationLevel: 'Manual'
      },
      {
        stepId: 'STEP-002',
        title: 'Add defensive exception handlers',
        description: 'Add null/undefined defensive checks and try-catch blocks around failing calls.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-003',
        title: 'Fix broken script resources',
        description: 'Update or remove broken external script URL references.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'Manual'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Console Error Count Check',
        expectedResult: 'Console errors count == 0 during page lifecycle'
      },
      {
        stepId: 'VAL-002',
        title: 'Application Feature Testing',
        expectedResult: 'Interactive UI functions operate without client-side exceptions'
      }
    ],
    rollbackPlan: [
      'Revert error handling JS code patches'
    ]
  },
  CONSOLE_WARNINGS_001: {
    estimatedRisk: 'Low',
    estimatedDuration: '30 mins',
    affectedComponents: ['JS'],
    prerequisites: [
      'Console warning message log file'
    ],
    dependencies: [
      'JS source clean-up build'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Review warning stack traces',
        description: 'Inspect console warning stack traces and identify underlying API notices.',
        order: 1,
        stepType: 'Analyze',
        automationLevel: 'Manual'
      },
      {
        stepId: 'STEP-002',
        title: 'Replace deprecated API calls',
        description: 'Replace deprecated function or property references with modern standards.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      },
      {
        stepId: 'STEP-003',
        title: 'Prune production log statements',
        description: 'Remove unnecessary console.warn logging statements from production builds.',
        order: 3,
        stepType: 'Build',
        automationLevel: 'Automatic'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Console Warning Count Check',
        expectedResult: 'Console warnings count <= 5'
      }
    ],
    rollbackPlan: [
      'Revert console logging edits'
    ]
  },
  NETWORK_FAILED_REQUESTS_001: {
    estimatedRisk: 'Medium',
    estimatedDuration: '1-2 hours',
    affectedComponents: ['Server', 'CDN', 'JS'],
    prerequisites: [
      'HAR network log from target audit run'
    ],
    dependencies: [
      'Backend service or CDN asset re-deployment'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Extract 4xx/5xx request URLs',
        description: 'Filter network HAR log to identify all HTTP requests returning error status codes.',
        order: 1,
        stepType: 'Analyze',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-002',
        title: 'Deploy missing static assets',
        description: 'Fix broken asset file paths or re-deploy missing files to server/CDN.',
        order: 2,
        stepType: 'Deploy',
        automationLevel: 'Manual'
      },
      {
        stepId: 'STEP-003',
        title: 'Adjust CORS and gateway routes',
        description: 'Update server CORS headers and API gateway endpoint request handlers.',
        order: 3,
        stepType: 'Deploy',
        automationLevel: 'Manual'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Failed Request Count Check',
        expectedResult: 'Failed HTTP network requests count == 0'
      },
      {
        stepId: 'VAL-002',
        title: 'HTTP Status Code Audit',
        expectedResult: 'All network asset requests return HTTP 200 or 304 status codes'
      }
    ],
    rollbackPlan: [
      'Revert server route and static asset deployment configurations'
    ]
  },
  NETWORK_TRANSFERRED_BYTES_001: {
    estimatedRisk: 'Medium',
    estimatedDuration: '2-4 hours',
    affectedComponents: ['CSS', 'JS', 'Images', 'Server', 'CDN'],
    prerequisites: [
      'Server compression header access'
    ],
    dependencies: [
      'Web server / CDN configuration reload',
      'Asset minification build'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Enable HTTP text compression',
        description: 'Configure Gzip or Brotli compression on server for text, CSS, and JS assets.',
        order: 1,
        stepType: 'Deploy',
        automationLevel: 'Manual'
      },
      {
        stepId: 'STEP-002',
        title: 'Configure Cache-Control headers',
        description: 'Set Cache-Control: public, max-age=31536000, immutable for static resources.',
        order: 2,
        stepType: 'Deploy',
        automationLevel: 'Manual'
      },
      {
        stepId: 'STEP-003',
        title: 'Minify and purge assets',
        description: 'Ensure all CSS and JS bundles are minified and purged of unused code.',
        order: 3,
        stepType: 'Build',
        automationLevel: 'Automatic'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Transferred Bytes Audit',
        expectedResult: 'Total network transferred bytes <= 3,145,728 bytes (3MB)'
      },
      {
        stepId: 'VAL-002',
        title: 'Content-Encoding Verification',
        expectedResult: 'Verify Content-Encoding: br or gzip header on text resources'
      }
    ],
    rollbackPlan: [
      'Revert server compression and HTTP header configuration files'
    ]
  },
  NETWORK_REQUEST_COUNT_001: {
    estimatedRisk: 'Medium',
    estimatedDuration: '2-4 hours',
    affectedComponents: ['HTML', 'CSS', 'JS', 'Build Pipeline'],
    prerequisites: [
      'Build tool bundler configuration access'
    ],
    dependencies: [
      'Asset bundle re-building'
    ],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Consolidate script/style bundles',
        description: 'Reconfigure bundler to combine granular script files into fewer chunks.',
        order: 1,
        stepType: 'Build',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-002',
        title: 'Combine SVG icons into spritemap',
        description: 'Merge individual SVG image requests into a single SVG spritemap.',
        order: 2,
        stepType: 'ModifyAsset',
        automationLevel: 'Automatic'
      },
      {
        stepId: 'STEP-003',
        title: 'Prune redundant third-party tags',
        description: 'Remove duplicate or obsolete analytics and tracking scripts.',
        order: 3,
        stepType: 'ModifyCode',
        automationLevel: 'Manual'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Request Count Audit',
        expectedResult: 'Total HTTP network request count <= 100 requests'
      },
      {
        stepId: 'VAL-002',
        title: 'Page Functionality Audit',
        expectedResult: 'All page components load and function correctly without asset errors'
      }
    ],
    rollbackPlan: [
      'Revert bundler chunking settings',
      'Restore original script inclusions'
    ]
  }
};

/**
 * Resolves deterministic Fix Plan knowledge for a given ruleId.
 * @param {string} ruleId Rule identifier
 * @returns {object} Fix plan knowledge object
 */
export function getFixPlanKnowledge(ruleId) {
  const knowledge = RULE_FIX_PLAN_KNOWLEDGE[ruleId];

  if (knowledge) {
    return {
      estimatedRisk: knowledge.estimatedRisk,
      estimatedDuration: knowledge.estimatedDuration,
      affectedComponents: [...knowledge.affectedComponents],
      prerequisites: [...knowledge.prerequisites],
      dependencies: [...knowledge.dependencies],
      executionSteps: knowledge.executionSteps.map(s => ({
        stepId: s.stepId,
        title: s.title,
        description: s.description,
        order: s.order,
        stepType: s.stepType || 'Unknown',
        automationLevel: s.automationLevel || 'Manual'
      })),
      validationSteps: knowledge.validationSteps.map(s => ({ ...s })),
      rollbackPlan: [...knowledge.rollbackPlan]
    };
  }

  // Deterministic fallback for unmapped rule IDs
  return {
    estimatedRisk: 'Medium',
    estimatedDuration: '1-2 hours',
    affectedComponents: ['Unknown'],
    prerequisites: ['Access to target code repository and audit artifacts'],
    dependencies: ['Development environment build'],
    executionSteps: [
      {
        stepId: 'STEP-001',
        title: 'Investigate audit issue',
        description: 'Review metric failure threshold and associated evidence artifacts.',
        order: 1,
        stepType: 'Analyze',
        automationLevel: 'Manual'
      },
      {
        stepId: 'STEP-002',
        title: 'Apply targeted remediation',
        description: 'Implement code or configuration update to satisfy metric target.',
        order: 2,
        stepType: 'ModifyCode',
        automationLevel: 'AI-Assisted'
      }
    ],
    validationSteps: [
      {
        stepId: 'VAL-001',
        title: 'Metric Re-evaluation Audit',
        expectedResult: 'Metric threshold satisfied and associated finding resolved'
      }
    ],
    rollbackPlan: [
      'Revert remediation code changes via Git commit'
    ]
  };
}
