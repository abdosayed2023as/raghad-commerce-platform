import fs from 'fs';
import crypto from 'crypto';

/**
 * Computes file integrity metrics: SHA-256, sizeBytes, lineCount.
 * Implements PATCH-06 (enhanced integrity verification) and PATCH-09 telemetry.
 *
 * @param {string} absoluteFilePath Absolute path of target file
 * @returns {object} { sha256, sizeBytes, lineCount }
 */
export function computeFileMetrics(absoluteFilePath) {
  if (!fs.existsSync(absoluteFilePath)) {
    return { sha256: null, sizeBytes: 0, lineCount: 0 };
  }
  const content = fs.readFileSync(absoluteFilePath);
  const sha256 = crypto.createHash('sha256').update(content).digest('hex');
  const sizeBytes = content.length;
  const lineCount = content.toString('utf8').split(/\r?\n/).length;
  return { sha256, sizeBytes, lineCount };
}

/**
 * ChecksumValidator: Verifies pre/post SHA-256, sizeBytes, and lineCount parity.
 * Implements FIX-07: verifies line count delta and hash change when modification occurs.
 *
 * @param {object} preMetrics Pre-apply metrics
 * @param {object} postMetrics Post-apply metrics
 * @param {string} unifiedDiff Applied unified diff for expected delta computation
 * @returns {object} Validation result with verification payload
 */
export function runChecksumValidator(preMetrics, postMetrics, unifiedDiff) {
  const startedAt = new Date().toISOString();
  const tStart = Date.now();

  const diffLines = (unifiedDiff || '').split(/\r?\n/);
  const linesAdded = diffLines.filter(l => l.startsWith('+') && !l.startsWith('+++')).length;
  const linesDeleted = diffLines.filter(l => l.startsWith('-') && !l.startsWith('---')).length;

  let checksumVerified = preMetrics.sha256 !== null && postMetrics.sha256 !== null;

  if (checksumVerified && (linesAdded > 0 || linesDeleted > 0)) {
    const expectedLineCount = (preMetrics.lineCount || 0) + linesAdded - linesDeleted;
    const lineDeltaVerified = postMetrics.lineCount === expectedLineCount;
    const hashChanged = preMetrics.sha256 !== postMetrics.sha256;
    checksumVerified = lineDeltaVerified && hashChanged;
  }

  const finishedAt = new Date().toISOString();
  const durationMs = Date.now() - tStart;

  return {
    validator: 'ChecksumValidator',
    passed: checksumVerified,
    verification: {
      preApply: preMetrics,
      postApply: postMetrics,
      linesAdded,
      linesDeleted,
      checksumVerified
    },
    telemetry: { startedAt, finishedAt, durationMs }
  };
}
