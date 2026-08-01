import { FixPatchProvider } from './providerInterface.js';

export class MockPatchProvider extends FixPatchProvider {
  async generatePatch(promptContext) {
    const meta = promptContext?.metadata || {};
    const targetFile = meta.targetFile;
    const ruleId = meta.ruleId || 'PERF_SCORE_DESKTOP_001';

    if (!targetFile) {
      throw new Error('[MOCK PROVIDER ERROR] targetFile is missing in promptContext metadata. Target file must be resolved by CodebaseResolver.');
    }

    const diffContent = this._generateMockUnifiedDiff(targetFile, ruleId);

    return {
      targetFile,
      unifiedDiff: diffContent,
      explanation: `Deterministic offline patch for rule ${ruleId} on target file ${targetFile}.`,
      generation: {
        provider: 'mock',
        model: 'deterministic-v2',
        temperature: 0.0,
        tokenUsage: {
          promptTokens: 320,
          completionTokens: 95,
          totalTokens: 415
        },
        durationMs: 12,
        promptVersion: meta.promptVersion || '1.0.0'
      }
    };
  }

  async validateConnection() {
    return true;
  }

  async estimateCost(promptContext) {
    return {
      estimatedTokens: 415,
      estimatedCostUsd: 0.0
    };
  }

  getCapabilities() {
    return {
      supportsDiff: true,
      supportsJSON: true,
      supportsVision: false,
      supportsTools: false,
      supportsStreaming: false
    };
  }

  _generateMockUnifiedDiff(targetFile, ruleId) {
    if (targetFile.endsWith('.html')) {
      return `--- a/${targetFile}\n+++ b/${targetFile}\n@@ -10,3 +10,4 @@\n <head>\n+  <link rel="preload" as="image" href="/assets/hero-mobile.webp">\n   <title>Home</title>`;
    }
    if (targetFile.endsWith('.css')) {
      return `--- a/${targetFile}\n+++ b/${targetFile}\n@@ -25,3 +25,4 @@\n .hero-container {\n+  min-height: 400px;\n   display: block;`;
    }
    return `--- a/${targetFile}\n+++ b/${targetFile}\n@@ -1,3 +1,4 @@\n // Application Entry Point\n+console.info('[AUDIT_FIX] Applied performance remediation');\n export default {};`;
  }
}
