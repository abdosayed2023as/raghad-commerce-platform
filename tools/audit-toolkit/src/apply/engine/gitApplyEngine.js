import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { PatchEngine } from './engineInterface.js';

/**
 * Native git-based patch application engine.
 * Uses `git apply` for both dry-run verification and actual patch application.
 */
export class GitApplyEngine extends PatchEngine {
  constructor(rootDir = process.cwd()) {
    super();
    this.rootDir = rootDir;
    this.engineName = 'GitApplyEngine';
    this.engineVersion = '1.0.0';
  }

  async isAvailable() {
    try {
      execSync('git --version', { stdio: 'ignore', timeout: 5000 });
      return true;
    } catch (_) {
      return false;
    }
  }

  async dryRun(absoluteFilePath, unifiedDiff, options = {}) {
    const dryRunStart = Date.now();
    const tmpFile = path.join(os.tmpdir(), `at13a-dry-${Date.now()}.patch`);

    try {
      fs.writeFileSync(tmpFile, unifiedDiff, 'utf8');

      const result = spawnSync('git', ['apply', '--check', tmpFile], {
        cwd: this.rootDir,
        encoding: 'utf8',
        timeout: 15000
      });

      const dryRunDurationMs = Date.now() - dryRunStart;
      const passed = result.status === 0;
      const conflicts = passed ? [] : [result.stderr?.trim() || 'Unknown git apply conflict.'];

      return { passed, conflicts, dryRunDurationMs };
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  }

  async applyPatch(absoluteFilePath, unifiedDiff, options = {}) {
    const execStart = Date.now();
    const tmpFile = path.join(os.tmpdir(), `at13a-apply-${Date.now()}.patch`);
    const bytesProcessed = Buffer.byteLength(unifiedDiff, 'utf8');

    try {
      fs.writeFileSync(tmpFile, unifiedDiff, 'utf8');

      const result = spawnSync('git', ['apply', tmpFile], {
        cwd: this.rootDir,
        encoding: 'utf8',
        timeout: 30000
      });

      const executionDurationMs = Date.now() - execStart;

      if (result.status !== 0) {
        return {
          success: false,
          error: result.stderr?.trim() || 'git apply failed with non-zero exit code.',
          engineMetrics: {
            engineName: this.engineName,
            engineVersion: this.engineVersion,
            executionDurationMs,
            dryRunDurationMs: 0,
            bytesProcessed
          }
        };
      }

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
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  }
}
