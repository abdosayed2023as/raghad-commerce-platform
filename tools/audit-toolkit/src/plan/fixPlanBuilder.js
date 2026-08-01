import { getFixPlanKnowledge } from './fixPlanKnowledge.js';

/**
 * Main orchestration for building Fix Plans from recommendations.json contract (AT-11).
 * Consumes ONLY recommendations.json and produces deterministic fix-plans payload.
 * Applies AT-11.1 stabilization patch: stable plan identity derivation and execution step metadata.
 *
 * @param {object} recommendationsData Parsed recommendations.json contract
 * @returns {object} Fix plans payload
 */
export function buildFixPlans(recommendationsData) {
  const recList = Array.isArray(recommendationsData?.recommendations)
    ? recommendationsData.recommendations
    : [];

  const plans = [];
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  recList.forEach(rec => {
    // PATCH-01: Derive planId directly from stable recommendationId
    const planId = `PLAN_${rec.recommendationId}`;
    const knowledge = getFixPlanKnowledge(rec.ruleId);

    // PATCH-02: Map execution steps ensuring stepType and automationLevel are populated
    const executionSteps = (knowledge.executionSteps || []).map(s => ({
      stepId: s.stepId,
      title: s.title,
      description: s.description,
      order: s.order,
      stepType: s.stepType || 'Unknown',
      automationLevel: s.automationLevel || 'Manual'
    }));

    const plan = {
      planId,
      recommendationId: rec.recommendationId,
      relatedFindingId: rec.relatedFindingId,
      ruleId: rec.ruleId,
      title: `Fix Plan: ${rec.title || 'Audit Remediation'}`,
      objective: rec.summary || `Remediate ${rec.title || 'issue'} to resolve finding ${rec.relatedFindingId}.`,
      owner: rec.ownerSuggestion || 'Unknown',
      priority: rec.priority || 'Medium',
      estimatedEffort: rec.estimatedEffort || 'M',
      estimatedRisk: knowledge.estimatedRisk,
      estimatedDuration: knowledge.estimatedDuration,
      executionSteps,
      validationSteps: knowledge.validationSteps,
      rollbackPlan: knowledge.rollbackPlan,
      dependencies: knowledge.dependencies,
      prerequisites: knowledge.prerequisites,
      affectedComponents: knowledge.affectedComponents,
      expectedOutcome: rec.expectedBenefit || `Finding ${rec.relatedFindingId} resolved and target metric threshold satisfied.`,
      relatedEvidenceIds: Array.isArray(rec.relatedEvidenceIds) ? rec.relatedEvidenceIds : [],
      relatedArtifacts: Array.isArray(rec.relatedArtifacts) ? rec.relatedArtifacts : []
    };

    plans.push(plan);

    switch (rec.priority) {
      case 'Critical': criticalCount++; break;
      case 'High':     highCount++;     break;
      case 'Medium':   mediumCount++;   break;
      case 'Low':      lowCount++;      break;
      default:         mediumCount++;   break;
    }
  });

  const runMetadata = recommendationsData?.run || {
    runId: null,
    target: null,
    environment: null
  };

  return {
    schemaVersion: '1.0.0',
    run: runMetadata,
    summary: {
      totalPlans: plans.length,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount
    },
    plans
  };
}
