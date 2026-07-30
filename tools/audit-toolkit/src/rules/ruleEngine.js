import { ruleDefinitions } from './ruleDefinitions.js';
import { evaluateRule } from './evaluator.js';

export function runRuleEngine(analysisData) {
  const evaluatedRules = [];
  let passedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  ruleDefinitions.forEach(rule => {
    const result = evaluateRule(rule, analysisData);
    evaluatedRules.push(result);

    if (result.status === 'PASS') {
      passedCount++;
    } else if (result.status === 'FAIL') {
      failedCount++;
    } else if (result.status === 'SKIPPED') {
      skippedCount++;
    }
  });

  return {
    summary: {
      total: evaluatedRules.length,
      passed: passedCount,
      failed: failedCount,
      skipped: skippedCount
    },
    rules: evaluatedRules
  };
}
