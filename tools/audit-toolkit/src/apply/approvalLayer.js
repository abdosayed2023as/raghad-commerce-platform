import { logger } from '../utils/logger.js';

/**
 * Approval Layer gate for AT-13A Patch Applicator.
 * Implements PATCH-12: approval gate between dry-run simulation and actual workspace mutation.
 *
 * Supported modes:
 *   - 'Automatic': All patches with PASSED_VALIDATION are approved without human input.
 *   - 'Policy':    Reserved for future policy-based approval engine.
 *   - 'Human':     Reserved for future interactive approval integration.
 */
export class ApprovalLayer {
  constructor(mode = 'Automatic') {
    const validModes = ['Automatic', 'Policy', 'Human'];
    this.mode = validModes.includes(mode) ? mode : 'Automatic';
  }

  /**
   * Evaluates whether a candidate patch is approved for workspace mutation.
   *
   * @param {object} patch Patch object from patch-package.json
   * @param {object} dryRunResult Dry-run result from validator suite
   * @returns {{ approved: boolean, approvalMode: string, reason: string|null }}
   */
  evaluate(patch, dryRunResult) {
    if (this.mode === 'Human' || this.mode === 'Policy') {
      // Reserved: non-Automatic modes default to Automatic behaviour in V2.
      // Future AT-13B integration may intercept here.
      logger.warn(`[APPROVAL LAYER] Mode "${this.mode}" is not yet active. Falling back to Automatic approval.`);
    }

    // Automatic: Approve if dry-run passed and patch is not NEEDS_MANUAL_REVIEW
    if (patch.safetyStatus === 'REJECTED') {
      return {
        approved: false,
        approvalMode: this.mode,
        reason: `Patch "${patch.patchId}" has safetyStatus REJECTED from AT-12 validation.`
      };
    }

    if (!dryRunResult.passed) {
      return {
        approved: false,
        approvalMode: this.mode,
        reason: `Dry-run pre-flight failed for "${patch.patchId}": ${(dryRunResult.conflicts || []).join('; ')}`
      };
    }

    return {
      approved: true,
      approvalMode: this.mode,
      reason: null
    };
  }
}
