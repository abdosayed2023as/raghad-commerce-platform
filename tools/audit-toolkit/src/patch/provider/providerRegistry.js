import { MockPatchProvider } from './mockPatchProvider.js';

const providerRegistry = {
  mock: new MockPatchProvider()
};

/**
 * Registers a new patch provider instance.
 * @param {string} name Provider name (e.g. 'openai', 'claude', 'gemini', 'local')
 * @param {object} providerInstance Concrete subclass of FixPatchProvider
 */
export function registerPatchProvider(name, providerInstance) {
  providerRegistry[name.toLowerCase()] = providerInstance;
}

/**
 * Gets a registered patch provider instance.
 * @param {string} providerName Provider identifier
 * @returns {object} Concrete FixPatchProvider subclass
 */
export function getPatchProvider(providerName = 'mock') {
  const normalized = String(providerName).toLowerCase();
  const provider = providerRegistry[normalized];

  if (!provider) {
    throw new Error(`[PROVIDER REGISTRY ERROR] Patch provider "${providerName}" is not registered. Available: ${Object.keys(providerRegistry).join(', ')}`);
  }

  return provider;
}
