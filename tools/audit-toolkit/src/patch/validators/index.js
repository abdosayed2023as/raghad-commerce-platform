import { validateBoundary } from './boundaryValidator.js';
import { validateSecurity } from './securityValidator.js';
import { validateDiffSyntax } from './diffValidator.js';
import { validateLanguageSyntax } from './syntaxValidator.js';

/**
 * Orchestrates the full decomposed patch validator suite for AT-12.
 * Conforms to PATCH 2, PATCH 5, PATCH 6, and Audit PATCH-02 specifications.
 *
 * @param {string} rootDir Repository root directory
 * @param {string} targetFile Target file path
 * @param {string} unifiedDiff Unified diff text
 * @param {object} [fileContext] Resolved file context object
 * @returns {object} Validation result payload containing validation object, safetyStatus, confidence, manualReviewReason
 */
export function validatePatch(rootDir, targetFile, unifiedDiff, fileContext = {}) {
  const boundaryRes = validateBoundary(rootDir, targetFile);
  const securityRes = validateSecurity(unifiedDiff);
  const diffRes = validateDiffSyntax(unifiedDiff);
  const syntaxRes = validateLanguageSyntax(targetFile, unifiedDiff);

  const validation = {
    diff: diffRes.valid ? 'PASSED' : 'FAILED',
    syntax: syntaxRes.valid ? 'PASSED' : 'FAILED',
    boundary: boundaryRes.valid ? 'PASSED' : 'FAILED',
    security: securityRes.valid ? 'PASSED' : 'FAILED'
  };

  const errors = [];
  if (!boundaryRes.valid) errors.push(boundaryRes.error);
  if (!securityRes.valid) errors.push(securityRes.error);
  if (!diffRes.valid) errors.push(diffRes.error);
  if (!syntaxRes.valid) errors.push(syntaxRes.error);

  // 1. File Context Check
  if (!fileContext || fileContext.exists === false) {
    return {
      validation: {
        diff: 'FAILED',
        syntax: 'FAILED',
        boundary: boundaryRes.valid ? 'PASSED' : 'FAILED',
        security: 'PASSED'
      },
      safetyStatus: 'NEEDS_MANUAL_REVIEW',
      confidence: 'LOW',
      manualReviewReason: 'MissingContext',
      errors: ['Target file context does not exist in repository codebase.']
    };
  }

  // 2. Boundary / Security Rejection
  if (!boundaryRes.valid) {
    return {
      validation,
      safetyStatus: 'REJECTED',
      confidence: 'LOW',
      manualReviewReason: boundaryRes.manualReviewReason || 'CrossFileModification',
      errors
    };
  }

  if (!securityRes.valid) {
    return {
      validation,
      safetyStatus: 'REJECTED',
      confidence: 'LOW',
      manualReviewReason: securityRes.manualReviewReason || 'UnsafeDelete',
      errors
    };
  }

  // 3. Diff Syntax Validation Failure
  if (!diffRes.valid) {
    return {
      validation,
      safetyStatus: 'NEEDS_MANUAL_REVIEW',
      confidence: 'LOW',
      manualReviewReason: diffRes.manualReviewReason || 'ValidationFailed',
      errors
    };
  }

  // 4. Language Syntax Validation Failure
  if (!syntaxRes.valid) {
    return {
      validation,
      safetyStatus: 'NEEDS_MANUAL_REVIEW',
      confidence: 'MEDIUM',
      manualReviewReason: syntaxRes.manualReviewReason || 'ValidationFailed',
      errors
    };
  }

  // Calculate deterministic confidence
  const diffLinesCount = (unifiedDiff.match(/\n[+-]/g) || []).length;
  let confidence = 'HIGH';
  if (diffLinesCount > 20) {
    confidence = 'MEDIUM';
  }

  return {
    validation,
    safetyStatus: 'PASSED_VALIDATION',
    confidence,
    manualReviewReason: null,
    errors: []
  };
}

export {
  validateBoundary,
  validateSecurity,
  validateDiffSyntax,
  validateLanguageSyntax
};
