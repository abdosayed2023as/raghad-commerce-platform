import { logger } from './logger.js';

/**
 * Executes an action with explicit retry semantics:
 * Initial attempt + up to `maxRetries` additional retries (total attempts = 1 + maxRetries).
 *
 * Example: maxRetries = 3 means 1 initial attempt + 3 retries = 4 total attempts.
 */
export async function withRetry(actionFn, { maxRetries = 3, label = 'Task', delayMs = 1000 } = {}) {
  const totalAttempts = 1 + maxRetries;
  let attempt = 0;

  while (attempt < totalAttempts) {
    attempt++;
    try {
      return await actionFn();
    } catch (err) {
      const isInitialAttempt = attempt === 1;
      const retriesLeft = totalAttempts - attempt;

      if (isNonRetryableError(err) || retriesLeft <= 0) {
        throw err;
      }

      const backoff = delayMs * Math.pow(2, attempt - 1);
      const attemptLabel = isInitialAttempt ? 'Initial attempt' : `Retry ${attempt - 1}/${maxRetries}`;
      logger.warn(`[RETRY] ${label} failed during ${attemptLabel}: ${err.message}. Retrying in ${backoff}ms (${retriesLeft} retries remaining)...`);
      await new Promise(res => setTimeout(res, backoff));
    }
  }
}

function isNonRetryableError(err) {
  if (!err) return false;
  const msg = err.message || '';
  if (msg.includes('Configuration error') || msg.includes('Invalid target URL')) {
    return true;
  }
  return false;
}
