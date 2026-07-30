import fs from 'fs';
import path from 'path';

class Logger {
  constructor() {
    this.logFilePaths = [];
  }

  setLogFilePaths(paths = []) {
    this.logFilePaths = Array.isArray(paths) ? paths : [paths];
    this.logFilePaths.forEach(filePath => {
      try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      } catch (err) {
        console.error(`[LOGGER WARNING] Failed to create log directory for "${filePath}": ${err.message}`);
      }
    });
  }

  _writeToFile(line) {
    this.logFilePaths.forEach(filePath => {
      try {
        fs.appendFileSync(filePath, line + '\n', 'utf8');
      } catch (err) {
        console.error(`[LOGGER WARNING] Failed to append log to file "${filePath}": ${err.message}`);
      }
    });
  }

  writeRunHeader(info) {
    const header = `\n===================================================\n` +
      `RUN START\n` +
      `Run ID: ${info.runId}\n` +
      `Timestamp: ${info.timestamp}\n` +
      `Target: ${info.target}\n` +
      `Environment: ${info.environment}\n` +
      `===================================================`;
    this._writeToFile(header);
  }

  info(msg) {
    const formatted = `[INFO] ${new Date().toISOString()} - ${msg}`;
    console.log(formatted);
    this._writeToFile(formatted);
  }

  success(msg) {
    const formatted = `[SUCCESS] ${new Date().toISOString()} - ${msg}`;
    console.log(formatted);
    this._writeToFile(formatted);
  }

  warn(msg) {
    const formatted = `[WARN] ${new Date().toISOString()} - ${msg}`;
    console.log(formatted);
    this._writeToFile(formatted);
  }

  error(msg, err = null) {
    const formatted = `[ERROR] ${new Date().toISOString()} - ${msg}`;
    console.error(formatted);
    this._writeToFile(formatted);

    if (err) {
      const errDetail = err.stack ? err.stack : (err.message || String(err));
      console.error(errDetail);
      this._writeToFile(`[STACKTRACE] ${errDetail}`);
    }
  }
}

export const logger = new Logger();
