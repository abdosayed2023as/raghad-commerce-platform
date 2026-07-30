export function resolvePath(obj, pathString) {
  if (!obj || typeof obj !== 'object' || !pathString) {
    return null;
  }
  const keys = pathString.split('.');
  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return null;
    }
    current = current[key];
  }
  return current ?? null;
}

export function evaluateComparison(actual, operator, threshold) {
  switch (operator) {
    case '>':
      return actual > threshold;
    case '>=':
      return actual >= threshold;
    case '<':
      return actual < threshold;
    case '<=':
      return actual <= threshold;
    case '==':
      return actual === threshold;
    case '!=':
      return actual !== threshold;
    default:
      throw new Error(`Unsupported rule evaluation operator: "${operator}"`);
  }
}

export function evaluateRule(rule, analysisData) {
  const actualValue = resolvePath(analysisData, rule.metric);

  if (actualValue === null || actualValue === undefined) {
    return {
      id: rule.id,
      category: rule.category,
      title: rule.title,
      status: "SKIPPED",
      severity: rule.severity,
      metric: rule.metric,
      actual: null,
      threshold: rule.threshold,
      operator: rule.operator
    };
  }

  const passed = evaluateComparison(actualValue, rule.operator, rule.threshold);

  return {
    id: rule.id,
    category: rule.category,
    title: rule.title,
    status: passed ? "PASS" : "FAIL",
    severity: rule.severity,
    metric: rule.metric,
    actual: actualValue,
    threshold: rule.threshold,
    operator: rule.operator
  };
}
