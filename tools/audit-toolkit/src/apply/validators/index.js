import { runGitValidator } from './gitValidator.js';
import { runChecksumValidator, computeFileMetrics } from './checksumValidator.js';
import { runConflictValidator } from './conflictValidator.js';
import { runPolicyValidator } from './policyValidator.js';

/**
 * Orchestrates the pluggable validator pipeline for AT-13A.
 * Implements PATCH-07 (validator plugin pipeline) and PATCH-09 (telemetry).
 *
 * @param {object} engine Active PatchEngine instance
 * @param {string} absoluteFilePath Absolute file path of target
 * @param {object} patch Candidate patch object
 * @param {string[]} graphConflicts Graph-level conflicts
 * @param {boolean} isBinary True if binary target
 * @returns {Promise<object>} Combined validation result payload with telemetry
 */
export async function validateApply(engine, absoluteFilePath, patch, graphConflicts = [], isBinary = false) {
  // 1. Policy Validator
  const policyRes = runPolicyValidator(patch, isBinary);
  if (!policyRes.passed) {
    return {
      passed: false,
      gitApplyCheck: 'FAILED',
      errorCode: isBinary ? 'APP-008' : 'APP-003',
      conflicts: policyRes.conflicts,
      validatorTelemetry: [policyRes.telemetry]
    };
  }

  // 2. Conflict Validator
  const conflictRes = runConflictValidator(graphConflicts, patch.patchId);
  if (!conflictRes.passed) {
    return {
      passed: false,
      gitApplyCheck: 'FAILED',
      errorCode: 'APP-003',
      conflicts: conflictRes.conflicts,
      validatorTelemetry: [policyRes.telemetry, conflictRes.telemetry]
    };
  }

  // 3. Git Pre-Flight Dry Run Validator
  const gitRes = await runGitValidator(engine, absoluteFilePath, patch.unifiedDiff || '');
  if (!gitRes.passed) {
    return {
      passed: false,
      gitApplyCheck: 'FAILED',
      errorCode: 'APP-003',
      conflicts: gitRes.conflicts,
      validatorTelemetry: [policyRes.telemetry, conflictRes.telemetry, gitRes.telemetry]
    };
  }

  return {
    passed: true,
    gitApplyCheck: 'PASSED',
    errorCode: null,
    conflicts: [],
    validatorTelemetry: [policyRes.telemetry, conflictRes.telemetry, gitRes.telemetry]
  };
}

export {
  runGitValidator,
  runChecksumValidator,
  computeFileMetrics,
  runConflictValidator,
  runPolicyValidator
};
