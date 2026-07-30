import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

export function analyzeNetwork(folders) {
  const networkDir = folders.network;

  if (!fs.existsSync(networkDir)) {
    logger.warn('[ANALYZER] Network directory missing.');
    return null;
  }

  const files = fs.readdirSync(networkDir);
  const harFile = files.find(f => f.endsWith('.har'));

  if (!harFile) {
    logger.warn('[ANALYZER] HAR network artifact missing.');
    return null;
  }

  const harFilePath = path.join(networkDir, harFile);

  try {
    const raw = fs.readFileSync(harFilePath, 'utf8');
    const harData = JSON.parse(raw);

    const entries = harData.log?.entries || [];

    const requests = entries.length;
    const failedRequests = entries.filter(e => {
      const status = e.response?.status ?? 0;
      const failureText = e.response?._failureText;
      return status >= 400 || status === 0 || (typeof failureText === 'string' && failureText.length > 0);
    }).length;

    const transferredBytes = entries.reduce((total, e) => {
      const transferSize = e.response?._transferSize;
      const bodySize = e.response?.bodySize;
      if (typeof transferSize === 'number' && transferSize > 0) {
        return total + transferSize;
      }
      if (typeof bodySize === 'number' && bodySize > 0) {
        return total + bodySize;
      }
      return total;
    }, 0);

    return {
      requests,
      failedRequests,
      transferredBytes
    };
  } catch (err) {
    logger.warn(`[ANALYZER] Failed to parse HAR artifact "${harFilePath}": ${err.message}`);
    return null;
  }
}
