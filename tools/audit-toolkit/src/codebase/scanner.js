import fs from 'fs';
import path from 'path';
import { normalizePath, getRelativePath } from './pathNormalizer.js';
import { IgnoreManager } from './ignoreManager.js';

/**
 * Safely scans repository directory tree up to maxFiles / maxDepth limits.
 */
export class CodebaseScanner {
  constructor(rootDir, options = {}) {
    this.rootDir = rootDir;
    this.maxFiles = options.maxFiles || 500;
    this.ignoreManager = new IgnoreManager(rootDir);
  }

  scan() {
    const results = [];
    if (!fs.existsSync(this.rootDir)) return results;

    const walk = (currentDir) => {
      if (results.length >= this.maxFiles) return;

      let entries = [];
      try {
        entries = fs.readdirSync(currentDir, { withFileTypes: true });
      } catch (err) {
        return;
      }

      for (const entry of entries) {
        if (results.length >= this.maxFiles) break;

        const fullPath = path.join(currentDir, entry.name);
        const relPath = getRelativePath(this.rootDir, fullPath);

        if (this.ignoreManager.isIgnored(relPath)) {
          continue;
        }

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile()) {
          results.push({
            relativePath: relPath,
            absolutePath: fullPath,
            name: entry.name
          });
        }
      }
    };

    walk(this.rootDir);
    return results;
  }
}
