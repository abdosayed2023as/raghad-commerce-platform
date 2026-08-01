/**
 * Deterministic Prompt Synthesizer for Auto Fix Engine V2 (AT-12).
 * Conforms to PATCH 3 & PATCH 9 specifications.
 * Returns structured prompt object: { systemPrompt, userPrompt, metadata }.
 */
export function synthesizeFixPrompt(plan, fileContext, promptVersion = '1.0.0') {
  const targetFile = fileContext?.relativePath || 'unknown';
  const ruleId = plan.ruleId || 'UNKNOWN_RULE';

  const systemPrompt = [
    'You are an expert senior software engineer performing targeted code remediation.',
    'Produce a valid Git unified diff patch for the provided source code to satisfy the specified fix plan objective.',
    'Strict rules:',
    '1. Output ONLY a valid Git unified diff block starting with "--- a/..." and "+++ b/...".',
    '2. Do NOT add markdown code fences or conversational conversational text.',
    '3. Modify minimum required lines to achieve objective.',
    '4. Do NOT introduce new dependencies or security vulnerabilities.'
  ].join('\n');

  const userPrompt = [
    `=== TARGET REPOSITORY FILE: ${targetFile} ===`,
    `RULE ID: ${ruleId}`,
    `PLAN TITLE: ${plan.title || 'Remediation'}`,
    `OBJECTIVE: ${plan.objective || ''}`,
    `EXPECTED OUTCOME: ${plan.expectedOutcome || ''}`,
    ``,
    `EXECUTION STEPS:`,
    JSON.stringify(plan.executionSteps || [], null, 2),
    ``,
    `SOURCE FILE CONTENT:`,
    `<source_file path="${targetFile}">`,
    fileContext?.content || '',
    `</source_file>`,
    `==============================================`
  ].join('\n');

  const metadata = {
    planId: plan.planId,
    recommendationId: plan.recommendationId,
    relatedFindingId: plan.relatedFindingId,
    ruleId,
    targetFile,
    promptVersion
  };

  return {
    systemPrompt,
    userPrompt,
    metadata
  };
}
