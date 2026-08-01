import fs from 'fs';
import path from 'path';
import { normalizePath } from './pathNormalizer.js';

const DEFAULT_IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.gemini',
  'output',
  'logs',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  'vendor'
]);

const DEFAULT_IGNORED_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm', '.zip', '.tar', '.gz'
]);

export class IgnoreManager {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.ignorePatterns = new Set(DEFAULT_IGNORED_DIRS);
    this._loadGitIgnore();
  }

  _loadGitIgnore() {
    const gitignorePath = path.join(this.rootDir, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      try {
        const content = fs.readFileSync(gitignorePath, 'utf8');
        content.split(/\r?\n/).forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const cleanPattern = trimmed.replace(/^\//, '').replace(/\/$/, '');
            this.ignorePatterns.add(cleanPattern);
          }
        });
      } catch (err) {
        // Silently continue if .gitignore cannot be read
      }
    }
  }

  isIgnored(relativePath) {
    const norm = normalizePath(relativePath);
    if (!norm) return true;

    const parts = norm.split('/');
    for (const part of parts) {
      if (this.ignorePatterns.has(part)) {
        return true;
      }
    }

    const ext = path.extname(norm).toLowerCase();
    if (DEFAULT_IGNORED_EXTENSIONS.has(ext)) {
      return true;
    }

    return false;
  }
}
