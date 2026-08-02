/**
 * GitValidator: Performs pre-flight dry-run using the active PatchEngine.
 * Implements PATCH-09 (validator telemetry).
 *
 * @param {object} engine Active PatchEngine instance (GitApplyEngine or JsDiffEngine)
 * @param {string} absoluteFilePath Absolute path of target file
 * @param {string} unifiedDiff Unified diff text
 * @returns {Promise<object>} Validation result with telemetry
 */
export async function runGitValidator(engine, absoluteFilePath, unifiedDiff) {
  const startedAt = new Date().toISOString();
  const tStart = Date.now();

  const result = await engine.dryRun(absoluteFilePath, unifiedDiff);

  const finishedAt = new Date().toISOString();
  const durationMs = Date.now() - tStart;

  return {
    validator: 'GitValidator',
    passed: result.passed,
    conflicts: result.conflicts || [],
    gitApplyCheck: result.passed ? 'PASSED' : 'FAILED',
    telemetry: { startedAt, finishedAt, durationMs }
  };
}
