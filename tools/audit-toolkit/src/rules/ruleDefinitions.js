export const ruleDefinitions = [
  {
    id: "PERF_SCORE_DESKTOP_001",
    category: "Performance",
    metric: "performance.desktop.performance",
    operator: ">=",
    threshold: 0.90,
    severity: "High",
    title: "Desktop Performance Score",
    description: "Lighthouse Desktop performance score is below recommended target of 0.90."
  },
  {
    id: "PERF_SCORE_MOBILE_001",
    category: "Performance",
    metric: "performance.mobile.performance",
    operator: ">=",
    threshold: 0.90,
    severity: "High",
    title: "Mobile Performance Score",
    description: "Lighthouse Mobile performance score is below recommended target of 0.90."
  },
  {
    id: "ACCESSIBILITY_SCORE_DESKTOP_001",
    category: "Accessibility",
    metric: "performance.desktop.accessibility",
    operator: ">=",
    threshold: 0.90,
    severity: "Medium",
    title: "Desktop Accessibility Score",
    description: "Lighthouse Desktop accessibility score is below recommended target of 0.90."
  },
  {
    id: "ACCESSIBILITY_SCORE_MOBILE_001",
    category: "Accessibility",
    metric: "performance.mobile.accessibility",
    operator: ">=",
    threshold: 0.90,
    severity: "Medium",
    title: "Mobile Accessibility Score",
    description: "Lighthouse Mobile accessibility score is below recommended target of 0.90."
  },
  {
    id: "BEST_PRACTICES_SCORE_DESKTOP_001",
    category: "Best Practices",
    metric: "performance.desktop.bestPractices",
    operator: ">=",
    threshold: 0.90,
    severity: "Medium",
    title: "Desktop Best Practices Score",
    description: "Lighthouse Desktop best practices score is below recommended target of 0.90."
  },
  {
    id: "BEST_PRACTICES_SCORE_MOBILE_001",
    category: "Best Practices",
    metric: "performance.mobile.bestPractices",
    operator: ">=",
    threshold: 0.90,
    severity: "Medium",
    title: "Mobile Best Practices Score",
    description: "Lighthouse Mobile best practices score is below recommended target of 0.90."
  },
  {
    id: "SEO_SCORE_DESKTOP_001",
    category: "SEO",
    metric: "performance.desktop.seo",
    operator: ">=",
    threshold: 0.90,
    severity: "Medium",
    title: "Desktop SEO Score",
    description: "Lighthouse Desktop SEO score is below recommended target of 0.90."
  },
  {
    id: "SEO_SCORE_MOBILE_001",
    category: "SEO",
    metric: "performance.mobile.seo",
    operator: ">=",
    threshold: 0.90,
    severity: "Medium",
    title: "Mobile SEO Score",
    description: "Lighthouse Mobile SEO score is below recommended target of 0.90."
  },
  {
    id: "PERF_LCP_001",
    category: "Performance",
    metric: "performance.coreWebVitals.lcp",
    operator: "<=",
    threshold: 2500,
    severity: "Critical",
    title: "Largest Contentful Paint (LCP)",
    description: "Largest Contentful Paint exceeds recommended threshold of 2500ms."
  },
  {
    id: "PERF_CLS_001",
    category: "Performance",
    metric: "performance.coreWebVitals.cls",
    operator: "<=",
    threshold: 0.10,
    severity: "Critical",
    title: "Cumulative Layout Shift (CLS)",
    description: "Cumulative Layout Shift exceeds recommended threshold of 0.10."
  },
  {
    id: "PERF_INP_001",
    category: "Performance",
    metric: "performance.coreWebVitals.inp",
    operator: "<=",
    threshold: 200,
    severity: "High",
    title: "Interaction to Next Paint / TBT",
    description: "INP / TBT exceeds recommended threshold of 200ms."
  },
  {
    id: "CONSOLE_ERRORS_001",
    category: "Console",
    metric: "console.errors",
    operator: "==",
    threshold: 0,
    severity: "High",
    title: "Browser Console Errors",
    description: "Uncaught JavaScript or network errors were detected in browser console."
  },
  {
    id: "CONSOLE_WARNINGS_001",
    category: "Console",
    metric: "console.warnings",
    operator: "<=",
    threshold: 5,
    severity: "Low",
    title: "Browser Console Warnings",
    description: "Browser console warnings exceed threshold of 5 messages."
  },
  {
    id: "NETWORK_FAILED_REQUESTS_001",
    category: "Network",
    metric: "network.failedRequests",
    operator: "==",
    threshold: 0,
    severity: "High",
    title: "Failed HTTP Requests",
    description: "Network traffic contains HTTP requests that returned status codes >= 400 or failed."
  },
  {
    id: "NETWORK_TRANSFERRED_BYTES_001",
    category: "Network",
    metric: "network.transferredBytes",
    operator: "<=",
    threshold: 3145728,
    severity: "Medium",
    title: "Network Transferred Bytes",
    description: "Total network transferred bytes exceed 3MB (3,145,728 bytes) threshold."
  },
  {
    id: "NETWORK_REQUEST_COUNT_001",
    category: "Network",
    metric: "network.requests",
    operator: "<=",
    threshold: 100,
    severity: "Medium",
    title: "Total HTTP Request Count",
    description: "Total HTTP network request count exceeds 100 requests."
  }
];
