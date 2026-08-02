import { normalizePath } from '../codebase/pathNormalizer.js';

/**
 * Deterministic Patch Dependency Graph resolver for AT-13A.
 * Implements PATCH-04: DAG-based ordering for overlapping file targets.
 * Implements FIX-06: multi-hunk range overlap detection across ALL hunks.
 */
export class PatchDependencyGraph {
  constructor(patches) {
    this.patches = patches || [];
    this._order = null;
    this._conflicts = [];
  }

  /**
   * Resolves deterministic application order.
   * @returns {{ orderedPatches: object[], conflicts: string[] }}
   */
  resolve() {
    if (this._order) {
      return { orderedPatches: this._order, conflicts: this._conflicts };
    }

    // Group patches by normalized target file
    const fileGroups = new Map();
    for (const patch of this.patches) {
      const normFile = normalizePath(patch.targetFile || '');
      if (!fileGroups.has(normFile)) {
        fileGroups.set(normFile, []);
      }
      fileGroups.get(normFile).push(patch);
    }

    const orderedPatches = [];
    const conflicts = [];

    for (const [file, group] of fileGroups) {
      // Sort each file's patches by their first hunk starting line
      const sorted = group.slice().sort((a, b) => {
        const aLine = this._extractFirstHunkLine(a.unifiedDiff || '');
        const bLine = this._extractFirstHunkLine(b.unifiedDiff || '');
        return aLine - bLine;
      });

      // Detect overlapping hunk ranges within the same file across ALL hunks (FIX-06)
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];

        const prevRanges = this._extractAllHunkRanges(prev.unifiedDiff || '');
        const currRanges = this._extractAllHunkRanges(curr.unifiedDiff || '');

        let hasOverlap = false;
        for (const pR of prevRanges) {
          for (const cR of currRanges) {
            if (this._rangesOverlap(pR, cR)) {
              conflicts.push(`CONFLICT: Patch "${curr.patchId}" overlaps with "${prev.patchId}" on "${file}" (lines ${cR.start}-${cR.end}).`);
              hasOverlap = true;
              break;
            }
          }
          if (hasOverlap) break;
        }
      }

      orderedPatches.push(...sorted);
    }

    this._order = orderedPatches;
    this._conflicts = conflicts;

    return { orderedPatches, conflicts };
  }

  _extractFirstHunkLine(unifiedDiff) {
    const match = (unifiedDiff || '').match(/^@@ -(\d+)/m);
    return match ? parseInt(match[1], 10) : 999999;
  }

  _extractAllHunkRanges(unifiedDiff) {
    const matches = [...(unifiedDiff || '').matchAll(/^@@ -(\d+)(?:,(\d+))? \+\d+/gm)];
    if (!matches.length) return [{ start: 0, end: 0 }];

    return matches.map(match => {
      const start = parseInt(match[1], 10);
      const count = match[2] ? parseInt(match[2], 10) : 1;
      const end = start + Math.max(0, count - 1);
      return { start, end };
    });
  }

  _rangesOverlap(a, b) {
    return a.start <= b.end && b.start <= a.end;
  }
}
