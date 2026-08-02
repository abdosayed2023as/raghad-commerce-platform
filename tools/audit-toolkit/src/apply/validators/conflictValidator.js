/**
 * ConflictValidator: Checks for dependency graph overlap conflicts before application.
 * Implements PATCH-09 telemetry.
 *
 * @param {string[]} graphConflicts Conflict strings from DependencyGraph.resolve()
 * @param {string} patchId Current patch identifier
 * @returns {object} Validation result with telemetry
 */
export function runConflictValidator(graphConflicts, patchId) {
  const startedAt = new Date().toISOString();
  const tStart = Date.now();

  const relevantConflicts = (graphConflicts || []).filter(c => c.includes(patchId));

  const finishedAt = new Date().toISOString();
  const durationMs = Date.now() - tStart;

  return {
    validator: 'ConflictValidator',
    passed: relevantConflicts.length === 0,
    conflicts: relevantConflicts,
    telemetry: { startedAt, finishedAt, durationMs }
  };
}
