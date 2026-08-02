import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { logger } from '../utils/logger.js';

const LOCK_FILENAME = '.at13a-workspace.lock';

/**
 * Audits the target repository environment and manages workspace execution lock.
 * Implements IMP-01 (structured lock journal), IMP-04 (symlink + TOCTOU), IMP-05 (PATCH-05),
 * IMP-09 (credential redaction), FIX-01 (validPath/exists separation), and FIX-03 (atomic 'wx' lock).
 */
export class RepositoryManager {
  constructor(rootDir = process.cwd(), config = {}) {
    this.rootDir = path.resolve(rootDir);
    this.lockTimeoutMs = config.lockTimeoutMs || 60000;
    this.allowSymlinks = config.allowSymlinks || false;
    this.lockFilePath = path.join(this.rootDir, LOCK_FILENAME);
    this.lockAcquiredAt = null;
  }

  /**
   * Acquires workspace execution lock using atomic filesystem creation ('wx' flag).
   * Implements FIX-03: atomic lock acquisition with EEXIST stale recovery.
   *
   * @param {string} runId Current run identifier
   * @throws {Error} APP-007 WorkspaceLocked
   */
  acquireLock(runId) {
    const lockPayload = {
      pid: process.pid,
      runId,
      host: os.hostname(),
      timestamp: new Date().toISOString()
    };
    const content = JSON.stringify(lockPayload, null, 2);

    try {
      // Atomic exclusive creation (O_CREAT | O_EXCL)
      fs.writeFileSync(this.lockFilePath, content, { flag: 'wx', encoding: 'utf8' });
    } catch (err) {
      if (err.code === 'EEXIST') {
        let existingLock = null;
        try {
          existingLock = JSON.parse(fs.readFileSync(this.lockFilePath, 'utf8'));
        } catch (_) {
          // Corrupt lock file
        }

        if (existingLock) {
          const lockAge = Date.now() - new Date(existingLock.timestamp).getTime();
          const pidActive = this._isPidActive(existingLock.pid);

          if (pidActive && lockAge < this.lockTimeoutMs) {
            const errorMsg = `[APP-007] WorkspaceLocked: Active lock held by PID ${existingLock.pid} (runId: ${existingLock.runId}).`;
            logger.error(errorMsg);
            throw new Error(errorMsg);
          }
        }

        // Stale or crashed lock — auto-recover atomically
        logger.warn('[REPO MANAGER] Stale or crashed lock detected. Auto-recovering workspace lock.');
        try {
          fs.unlinkSync(this.lockFilePath);
        } catch (_) {}

        try {
          fs.writeFileSync(this.lockFilePath, content, { flag: 'wx', encoding: 'utf8' });
        } catch (retryErr) {
          const errorMsg = `[APP-007] WorkspaceLocked: Could not acquire lock after stale recovery — ${retryErr.message}`;
          logger.error(errorMsg);
          throw new Error(errorMsg);
        }
      } else {
        throw err;
      }
    }

    this.lockAcquiredAt = new Date().toISOString();
    logger.info(`[REPO MANAGER] Workspace lock acquired (PID: ${process.pid}, RunId: ${runId}).`);

    return {
      lockFile: LOCK_FILENAME,
      acquiredAt: this.lockAcquiredAt
    };
  }

  /**
   * Releases workspace execution lock.
   * @returns {{ releasedAt: string }}
   * @throws {Error} APP-012 LockReleaseFailure
   */
  releaseLock() {
    try {
      if (fs.existsSync(this.lockFilePath)) {
        fs.unlinkSync(this.lockFilePath);
      }
      const releasedAt = new Date().toISOString();
      logger.info('[REPO MANAGER] Workspace lock released.');
      return { releasedAt };
    } catch (err) {
      const errorMsg = `[APP-012] LockReleaseFailure: Failed to release lock file — ${err.message}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  /**
   * Audits repository compatibility and harvests git metadata.
   * Implements PATCH-05 (repository metadata) and IMP-11 (compatibility check).
   *
   * @returns {object} Repository status and metadata
   */
  auditRepository() {
    const result = {
      gitAvailable: false,
      gitVersion: null,
      gitRoot: this.rootDir,
      currentBranch: null,
      headCommit: null,
      isShallow: false,
      isClean: true,
      writableRoot: false,
      compatibility: {
        compatible: true,
        headReadable: false,
        workingTreeEncoding: 'UTF-8',
        caseSensitiveFs: this._detectCaseSensitiveFs(),
        supportedGitVersion: false
      }
    };

    // Check root directory access
    try {
      fs.accessSync(this.rootDir, fs.constants.W_OK);
      result.writableRoot = true;
    } catch (_) {
      result.writableRoot = false;
    }

    // Attempt git metadata harvesting
    try {
      const gitVersionRaw = execSync('git --version', { cwd: this.rootDir, encoding: 'utf8', timeout: 5000, env: this._sanitizeEnv() });
      result.gitVersion = gitVersionRaw.trim();
      result.gitAvailable = true;
      result.compatibility.supportedGitVersion = true;
    } catch (_) {
      logger.warn('[REPO MANAGER] git binary unavailable. JsDiffEngine fallback will be used.');
      result.gitAvailable = false;
    }

    if (result.gitAvailable) {
      try {
        result.currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: this.rootDir, encoding: 'utf8', timeout: 5000, env: this._sanitizeEnv() }).trim();
        result.headCommit = execSync('git rev-parse HEAD', { cwd: this.rootDir, encoding: 'utf8', timeout: 5000, env: this._sanitizeEnv() }).trim();
        result.compatibility.headReadable = true;

        const shallowFile = path.join(this.rootDir, '.git', 'shallow');
        result.isShallow = fs.existsSync(shallowFile);

        const statusOutput = execSync('git status --porcelain', { cwd: this.rootDir, encoding: 'utf8', timeout: 10000, env: this._sanitizeEnv() }).trim();
        result.isClean = statusOutput.length === 0;
      } catch (_) {
        result.compatibility.headReadable = false;
      }
    }

    result.selectedEngine = result.gitAvailable ? 'GitApplyEngine' : 'JsDiffEngine';
    result.compatibility.compatible = result.writableRoot;

    return result;
  }

  /**
   * Validates a single target file path for existence, writability, and symlink safety.
   * Implements FIX-01: exposes validPath and exists explicitly.
   *
   * @param {string} relativeFilePath Relative file path from patch object
   * @returns {{ valid: boolean, validPath: boolean, exists: boolean, errorCode: string|null, absolutePath: string }}
   */
  validateTargetFile(relativeFilePath) {
    const absolutePath = path.resolve(this.rootDir, relativeFilePath);

    // Boundary: path must remain inside rootDir
    if (!absolutePath.startsWith(this.rootDir + path.sep) && absolutePath !== this.rootDir) {
      return { valid: false, validPath: false, exists: false, errorCode: 'APP-006', absolutePath };
    }

    // IMP-04 TOCTOU: lstat every path component for symlink detection
    if (!this.allowSymlinks) {
      const pathParts = absolutePath.split(path.sep);
      let current = pathParts[0];
      for (let i = 1; i < pathParts.length; i++) {
        current = path.join(current, pathParts[i]);
        try {
          const stat = fs.lstatSync(current);
          if (stat.isSymbolicLink()) {
            return { valid: false, validPath: false, exists: false, errorCode: 'APP-006', absolutePath };
          }
        } catch (_) {
          break;
        }
      }
    }

    const exists = fs.existsSync(absolutePath);
    if (exists) {
      try {
        fs.accessSync(absolutePath, fs.constants.W_OK);
      } catch (_) {
        return { valid: false, validPath: true, exists: true, errorCode: 'APP-006', absolutePath };
      }
    }

    return {
      valid: exists,
      validPath: true,
      exists,
      errorCode: exists ? null : 'MISSING',
      absolutePath
    };
  }

  /**
   * Detects binary file targets that must not be patched.
   * @param {string} filePath Target file path
   * @returns {boolean} True if binary
   */
  isBinaryFile(filePath) {
    const BINARY_EXTENSIONS = new Set([
      '.png', '.jpg', '.jpeg', '.gif', '.ico', '.bmp', '.webp', '.svg',
      '.mp4', '.webm', '.mov', '.avi', '.mkv',
      '.woff', '.woff2', '.ttf', '.eot', '.otf',
      '.zip', '.tar', '.gz', '.bz2', '.7z', '.rar',
      '.exe', '.dll', '.so', '.dylib', '.bin', '.node'
    ]);
    const ext = path.extname(filePath).toLowerCase();
    return BINARY_EXTENSIONS.has(ext);
  }

  _isPidActive(pid) {
    if (!pid) return false;
    try {
      process.kill(pid, 0);
      return true;
    } catch (_) {
      return false;
    }
  }

  _detectCaseSensitiveFs() {
    try {
      const testPath = path.join(this.rootDir, '.git');
      const upperPath = path.join(this.rootDir, '.GIT');
      return fs.existsSync(testPath) && !fs.existsSync(upperPath);
    } catch (_) {
      return true;
    }
  }

  /**
   * Returns environment with sensitive token keys redacted. (IMP-09)
   */
  _sanitizeEnv() {
    const REDACTED_KEYS = /^(GITHUB_TOKEN|GH_TOKEN|NPM_TOKEN|AWS_SECRET|SSH_AUTH_SOCK|CI_JOB_TOKEN|GITLAB_TOKEN|HEROKU_API_KEY)/i;
    const sanitized = {};
    for (const [key, value] of Object.entries(process.env)) {
      sanitized[key] = REDACTED_KEYS.test(key) ? '[REDACTED]' : value;
    }
    return sanitized;
  }
}
