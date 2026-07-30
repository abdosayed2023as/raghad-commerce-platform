export class ProviderInterface {
  /**
   * Generates a structured audit report document.
   * @param {string} promptString - Deterministic serialized prompt constructed from audit-package.json
   * @param {object} auditPackage - Full audit-package.json document
   * @returns {Promise<object>} Structured report matching report.json schema
   */
  async generateReport(promptString, auditPackage) {
    throw new Error('Method "generateReport()" must be implemented by concrete report provider subclasses.');
  }
}
