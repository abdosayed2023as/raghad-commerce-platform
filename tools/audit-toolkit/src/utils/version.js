import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedVersion = null;

export function getToolkitVersion() {
  if (cachedVersion) return cachedVersion;

  try {
    const pkgPath = path.resolve(__dirname, '../../package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      cachedVersion = pkg.version || '1.6.0';
      return cachedVersion;
    }
  } catch (err) {
    // fallback
  }

  cachedVersion = '1.6.0';
  return cachedVersion;
}
