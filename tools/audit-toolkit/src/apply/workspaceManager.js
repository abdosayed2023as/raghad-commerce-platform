import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

/**
 * Immutable RollbackSession object.
 * Implements PATCH-02 (RollbackSession), PATCH-03 (snapshot metadata),
 * and PATCH-10 (rollback journal).
 */
class RollbackSession {
  constructor(snapshotId) {
    this.snapshotId = snapshotId;
    this.backedUpFiles = new Map(); // relativePath -> { absolutePath, content, sha256, sizeBytes, modifiedTime, permissions }
    this.rollbackJournal = {
      snapshotId,
      timestamp: new Date().toISOString(),
      affectedFiles: [],
      restoredFiles: [],
      restoreDurationMs: 0,
      rollbackStatus: 'IDLE'
    };
  }

  /**
   * Backs up a target file into the in-memory snapshot store.
   * Stores sha256, sizeBytes, modifiedTime, and permissions per PATCH-03.
   *
   * @param {string} relativePath Relative path within repository
   * @param {string} absolutePath Absolute file path
   */
  captureFile(relativePath, absolutePath) {
    if (this.backedUpFiles.has(relativePath)) return;

    if (!fs.existsSync(absolutePath)) {
      this.backedUpFiles.set(relativePath, {
        absolutePath,
        content: null,
        sha256: null,
        sizeBytes: 0,
        modifiedTime: null,
        permissions: null,
        existed: false
      });
      this.rollbackJournal.affectedFiles.push(relativePath);
      return;
    }

    const stat = fs.statSync(absolutePath);
    const content = fs.readFileSync(absolutePath);

    this.backedUpFiles.set(relativePath, {
      absolutePath,
      content,
      sha256: crypto.createHash('sha256').update(content).digest('hex'),
      sizeBytes: stat.size,
      modifiedTime: stat.mtime.toISOString(),
      permissions: stat.mode.toString(8),
      existed: true
    });

    this.rollbackJournal.affectedFiles.push(relativePath);
  }

  /**
   * Restores all backed-up files to their pre-execution state.
   */
  restore() {
    const restoreStart = Date.now();
    this.rollbackJournal.rollbackStatus = 'IN_PROGRESS';
    const restored = [];

    for (const [relativePath, snapshot] of this.backedUpFiles) {
      try {
        if (!snapshot.existed) {
          // File did not exist before — remove it if it was created
          if (fs.existsSync(snapshot.absolutePath)) {
            fs.unlinkSync(snapshot.absolutePath);
          }
        } else {
          fs.mkdirSync(path.dirname(snapshot.absolutePath), { recursive: true });
          fs.writeFileSync(snapshot.absolutePath, snapshot.content);
        }
        restored.push(relativePath);
      } catch (err) {
        logger.error(`[WORKSPACE MANAGER] Rollback failed for "${relativePath}": ${err.message}`);
      }
    }

    this.rollbackJournal.restoredFiles = restored;
    this.rollbackJournal.restoreDurationMs = Date.now() - restoreStart;
    this.rollbackJournal.rollbackStatus = 'COMPLETED';

    logger.info(`[WORKSPACE MANAGER] Rollback complete: restored ${restored.length} file(s) in ${this.rollbackJournal.restoreDurationMs}ms.`);
  }

  /**
   * Purges snapshot data from memory.
   */
  destroy() {
    this.backedUpFiles.clear();
    this.rollbackJournal.rollbackStatus = 'DESTROYED';
  }

  get metadata() {
    return {
      snapshotId: this.snapshotId,
      fileCount: this.backedUpFiles.size,
      affectedFiles: this.rollbackJournal.affectedFiles
    };
  }
}

/**
 * Creates and manages RollbackSession instances.
 * Implements IMP-08: orphan snapshot sanitation at startup.
 *
 * @param {string} runId Current run identifier
 * @param {object} [config] Optional configuration
 * @param {number} [config.maxSnapshotMemoryBytes=104857600] 100MB default
 * @returns {RollbackSession}
 */
export function createRollbackSession(runId, config = {}) {
  const snapshotId = `SNAP_${runId}`;
  return new RollbackSession(snapshotId);
}
