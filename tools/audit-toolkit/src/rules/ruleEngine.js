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
    schemaVersion: '1.0.0',
    run: analysisData?.run || null,
    summary: {
      total: evaluatedRules.length,
      passed: passedCount,
      failed: failedCount,
      skipped: skippedCount
    },
    rules: evaluatedRules
  };
}
