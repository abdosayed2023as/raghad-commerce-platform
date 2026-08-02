/**
 * Abstract PatchEngine interface for AT-13A Auto Fix Engine.
 * All concrete engine implementations must extend this class.
 * Future engines (ThreeWayMergeEngine, SemanticMergeEngine, AstAwarePatchEngine)
 * may be added without changing the AT-13A pipeline.
 */
export class PatchEngine {
  /**
   * Applies a unified diff patch to a target file.
   * @param {string} absoluteFilePath Absolute path of target file
   * @param {string} unifiedDiff Unified diff text
   * @param {object} [options] Optional engine configuration
   * @returns {Promise<object>} { success: boolean, engineMetrics: object }
   */
  async applyPatch(absoluteFilePath, unifiedDiff, options = {}) {
    throw new Error('Method "applyPatch()" must be implemented by concrete PatchEngine subclasses.');
  }

  /**
   * Performs dry-run pre-flight check without mutating target files.
   * @param {string} absoluteFilePath Absolute path of target file
   * @param {string} unifiedDiff Unified diff text
   * @param {object} [options] Optional engine configuration
   * @returns {Promise<object>} { passed: boolean, conflicts: string[], dryRunDurationMs: number }
   */
  async dryRun(absoluteFilePath, unifiedDiff, options = {}) {
    throw new Error('Method "dryRun()" must be implemented by concrete PatchEngine subclasses.');
  }

  /**
   * Returns whether this engine is available in the current host environment.
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    throw new Error('Method "isAvailable()" must be implemented by concrete PatchEngine subclasses.');
  }
}
