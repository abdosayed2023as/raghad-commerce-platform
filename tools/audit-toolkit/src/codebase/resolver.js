import fs from 'fs';
import path from 'path';
import { normalizePath } from './pathNormalizer.js';
import { CodebaseScanner } from './scanner.js';
import { extractCodeContext } from './contextExtractor.js';

/**
 * Orchestrates target codebase resolution with an in-memory file context cache.
 * Avoids repeated disk reads across multiple plans targeting the same file.
 */
export class CodebaseResolver {
  constructor(rootDir = process.cwd()) {
    this.rootDir = path.resolve(rootDir);
    this.cache = new Map(); // In-memory cache: relativePath -> fileContext
    this.scanner = new CodebaseScanner(this.rootDir);
  }

  /**
   * Resolves target file context for a given plan.
   * Uses in-memory cache to prevent repeated disk reads.
   *
   * @param {object} plan Fix plan object
   * @returns {object} Resolved file context object
   */
  resolveTargetFile(plan) {
    const candidatePath = this._inferTargetFilePath(plan);
    const normPath = normalizePath(candidatePath);

    if (this.cache.has(normPath)) {
      return this.cache.get(normPath);
    }

    const fullPath = path.resolve(this.rootDir, normPath);

    let content = '';
    let exists = false;

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      try {
        content = fs.readFileSync(fullPath, 'utf8');
        exists = true;
      } catch (err) {
        content = '';
      }
    }

    const extracted = extractCodeContext(content, { maxLines: 300 });

    const context = {
      relativePath: normPath,
      absolutePath: fullPath,
      exists,
      content: extracted.content,
      lineCount: extracted.lineCount,
      truncated: extracted.truncated
    };

    this.cache.set(normPath, context);
    return context;
  }

  _inferTargetFilePath(plan) {
    const ruleId = plan.ruleId || '';
    const affected = Array.isArray(plan.affectedComponents) ? plan.affectedComponents : [];

    if (ruleId === 'PERF_SCORE_DESKTOP_001' || ruleId === 'PERF_LCP_001' || ruleId === 'PERF_CLS_001' || ruleId === 'SEO_SCORE_DESKTOP_001' || ruleId === 'SEO_SCORE_MOBILE_001') {
      return 'public/index.html';
    }
    if (ruleId === 'PERF_SCORE_MOBILE_001' || ruleId === 'NETWORK_TRANSFERRED_BYTES_001' || ruleId === 'NETWORK_REQUEST_COUNT_001') {
      return 'src/index.js';
    }
    if (ruleId === 'ACCESSIBILITY_SCORE_DESKTOP_001' || ruleId === 'ACCESSIBILITY_SCORE_MOBILE_001') {
      return 'src/components/Button.jsx';
    }
    if (ruleId === 'CONSOLE_ERRORS_001' || ruleId === 'CONSOLE_WARNINGS_001' || ruleId === 'PERF_INP_001') {
      return 'src/utils/app.js';
    }
    if (ruleId === 'NETWORK_FAILED_REQUESTS_001' || ruleId === 'BEST_PRACTICES_SCORE_DESKTOP_001') {
      return 'server.js';
    }

    if (affected.includes('HTML')) return 'public/index.html';
    if (affected.includes('JS')) return 'src/index.js';
    if (affected.includes('CSS')) return 'src/styles.css';

    return 'src/index.js';
  }

  clearCache() {
    this.cache.clear();
  }
}
