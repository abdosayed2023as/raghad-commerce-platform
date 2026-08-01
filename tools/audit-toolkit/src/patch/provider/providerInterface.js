/**
 * Abstract base class for Auto Fix Engine patch generation providers (AT-12).
 * Conforms to PATCH 8 provider interface expansion specification.
 */
export class FixPatchProvider {
  /**
   * Generates a structured candidate patch given a prompt context.
   * @param {object} promptContext - { systemPrompt, userPrompt, metadata }
   * @returns {Promise<object>} Candidate patch result
   */
  async generatePatch(promptContext) {
    throw new Error('Method "generatePatch()" must be implemented by concrete provider subclasses.');
  }

  /**
   * Validates API authentication and connection health.
   * @returns {Promise<boolean>} True if connection is healthy
   */
  async validateConnection() {
    throw new Error('Method "validateConnection()" must be implemented by concrete provider subclasses.');
  }

  /**
   * Estimates prompt execution token usage and cost before API dispatch.
   * @param {object} promptContext - { systemPrompt, userPrompt, metadata }
   * @returns {Promise<object>} { estimatedTokens: number, estimatedCostUsd: number }
   */
  async estimateCost(promptContext) {
    throw new Error('Method "estimateCost()" must be implemented by concrete provider subclasses.');
  }

  /**
   * Returns supported capabilities of the concrete provider instance.
   * @returns {object} { supportsDiff: boolean, supportsJSON: boolean, supportsVision: boolean, supportsTools: boolean, supportsStreaming: boolean }
   */
  getCapabilities() {
    throw new Error('Method "getCapabilities()" must be implemented by concrete provider subclasses.');
  }
}
