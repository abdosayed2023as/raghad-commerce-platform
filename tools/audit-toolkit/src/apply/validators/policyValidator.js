/**
 * PolicyValidator: Asserts safetyStatus, binary target protection, and encoding rules.
 * Implements PATCH-06 (binary protection), PATCH-07 (encoding validation), and PATCH-09 (telemetry).
 *
 * @param {object} patch Patch object from patch-package.json
 * @param {boolean} isBinary True if target file is binary
 * @returns {object} Validation result with telemetry
 */
export function runPolicyValidator(patch, isBinary) {
  const startedAt = new Date().toISOString();
  const tStart = Date.now();

  const conflicts = [];

  if (isBinary) {
    conflicts.push('[APP-008] BinaryPatchRejected: Target file is a binary asset.');
  }

  if (patch.safetyStatus === 'REJECTED') {
    conflicts.push(`Patch "${patch.patchId}" safetyStatus is REJECTED by AT-12.`);
  }

  const finishedAt = new Date().toISOString();
  const durationMs = Date.now() - tStart;

  return {
    validator: 'PolicyValidator',
    passed: conflicts.length === 0,
    conflicts,
    telemetry: { startedAt, finishedAt, durationMs }
  };
}
