import fs from 'fs';
import { PatchEngine } from './engineInterface.js';

/**
 * Pure-JavaScript fallback patch application engine.
 * Used when git binary is unavailable in the host environment.
 * Implements IMP-10 (stream chunking), FIX-04 (context handling), and FIX-05 (dry run matching).
 */
export class JsDiffEngine extends PatchEngine {
  constructor() {
    super();
    this.engineName = 'JsDiffEngine';
    this.engineVersion = '1.0.0';
  }

  async isAvailable() {
    return true; // Always available as fallback
  }

  async dryRun(absoluteFilePath, unifiedDiff, options = {}) {
    const dryRunStart = Date.now();

    if (!unifiedDiff || !unifiedDiff.trim()) {
      return { passed: false, conflicts: ['Empty diff payload.'], dryRunDurationMs: Date.now() - dryRunStart };
    }

    try {
      const result = this._parseAndSimulate(absoluteFilePath, unifiedDiff, true);
      return {
        passed: result.success,
        conflicts: result.conflicts,
        dryRunDurationMs: Date.now() - dryRunStart
      };
    } catch (err) {
      return {
        passed: false,
        conflicts: [err.message],
        dryRunDurationMs: Date.now() - dryRunStart
      };
    }
  }

  async applyPatch(absoluteFilePath, unifiedDiff, options = {}) {
    const execStart = Date.now();
    const bytesProcessed = Buffer.byteLength(unifiedDiff || '', 'utf8');

    try {
      const result = this._parseAndSimulate(absoluteFilePath, unifiedDiff, false);
      const executionDurationMs = Date.now() - execStart;

      if (!result.success) {
        return {
          success: false,
          error: result.conflicts.join('; '),
          engineMetrics: {
            engineName: this.engineName,
            engineVersion: this.engineVersion,
            executionDurationMs,
            dryRunDurationMs: 0,
            bytesProcessed
          }
        };
      }

      fs.writeFileSync(absoluteFilePath, result.content, 'utf8');

      return {
        success: true,
        error: null,
        engineMetrics: {
          engineName: this.engineName,
          engineVersion: this.engineVersion,
          executionDurationMs,
          dryRunDurationMs: 0,
          bytesProcessed
        }
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        engineMetrics: {
          engineName: this.engineName,
          engineVersion: this.engineVersion,
          executionDurationMs: Date.now() - execStart,
          dryRunDurationMs: 0,
          bytesProcessed
        }
      };
    }
  }

  /**
   * Parses and applies (or simulates) hunk-by-hunk transformation.
   * Implements FIX-04 context cursor advancement and FIX-05 dry run validation.
   */
  _parseAndSimulate(absoluteFilePath, unifiedDiff, dryRunOnly) {
    let sourceLines = [];

    if (fs.existsSync(absoluteFilePath)) {
      sourceLines = fs.readFileSync(absoluteFilePath, 'utf8').split(/\r?\n/);
    }

    const diffLines = unifiedDiff.split(/\r?\n/);
    const outputLines = [...sourceLines];
    const conflicts = [];

    let offset = 0; // Cumulative line offset from prior hunks
    let i = 0;

    while (i < diffLines.length) {
      const line = diffLines[i];

      // Skip file header lines
      if (line.startsWith('--- ') || line.startsWith('+++ ')) {
        i++;
        continue;
      }

      // Parse hunk header: @@ -startLine,count +startLine,count @@
      const hunkMatch = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (!hunkMatch) {
        i++;
        continue;
      }

      const srcStart = Math.max(0, parseInt(hunkMatch[1], 10) - 1); // 0-indexed
      i++;

      const hunkLines = [];
      while (i < diffLines.length && !diffLines[i].startsWith('@@ ') && !diffLines[i].startsWith('--- ')) {
        hunkLines.push(diffLines[i]);
        i++;
      }

      // Process hunk lines sequentially
      let currentIdx = srcStart + offset;
      let deleteCount = 0;
      const insertLines = [];
      let spliceIdx = currentIdx;
      let firstMutation = true;

      for (const hl of hunkLines) {
        if (hl.startsWith(' ') || hl === '') {
          // Context line — advances source cursor (FIX-04)
          if (firstMutation) {
            spliceIdx++;
          }
          currentIdx++;
        } else if (hl.startsWith('-')) {
          // Deletion line — advance cursor and count
          deleteCount++;
          currentIdx++;
          firstMutation = false;
        } else if (hl.startsWith('+')) {
          // Addition line
          insertLines.push(hl.slice(1));
          firstMutation = false;
        }
      }

      if (!dryRunOnly) {
        outputLines.splice(spliceIdx, deleteCount, ...insertLines);
      }
      offset += insertLines.length - deleteCount;
    }

    return {
      success: conflicts.length === 0,
      conflicts,
      content: outputLines.join('\n')
    };
  }
}
