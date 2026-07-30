import { MockProvider } from './provider/mockProvider.js';
import { buildAuditPrompt } from './promptBuilder.js';
import { logger } from '../utils/logger.js';

const providerRegistry = {
  mock: MockProvider
};

export function getReportProvider(providerName = 'mock') {
  const nameKey = String(providerName).toLowerCase();
  const ProviderClass = providerRegistry[nameKey];

  if (!ProviderClass) {
    logger.warn(`[REPORT BUILDER] Unknown report provider "${providerName}". Falling back to "mock" provider.`);
    return new MockProvider();
  }

  return new ProviderClass();
}

export async function buildReport(auditPackage, providerName = 'mock') {
  const provider = getReportProvider(providerName);
  const promptString = buildAuditPrompt(auditPackage);

  logger.info(`Generating audit report using provider: "${providerName}"`);
  const reportDoc = await provider.generateReport(promptString, auditPackage);
  return reportDoc;
}
