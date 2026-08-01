import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';
import { validateContract } from '../utils/contractValidator.js';

/**
 * Helper to locate and load audit-package.json and report.json from a run directory or file path.
 */
function resolveContractPaths(inputPath) {
  const resolved = path.resolve(process.cwd(), inputPath);
  let packagePath = null;
  let reportPath = null;

  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    const dir = path.dirname(resolved);
    packagePath = path.join(dir, 'audit-package.json');
    reportPath = path.join(dir, 'report.json');
  } else if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
    const candidates = [
      resolved,
      path.join(resolved, 'context'),
      path.join(resolved, 'WA-01_EVIDENCE', 'context')
    ];

    for (const dir of candidates) {
      const pkgCandidate = path.join(dir, 'audit-package.json');
      const rptCandidate = path.join(dir, 'report.json');
      if (fs.existsSync(pkgCandidate) && !packagePath) {
        packagePath = pkgCandidate;
      }
      if (fs.existsSync(rptCandidate) && !reportPath) {
        reportPath = rptCandidate;
      }
    }
  }

  return { packagePath, reportPath };
}

function loadJsonFile(filePath, contractName) {
  if (!filePath || !fs.existsSync(filePath)) {
    logger.warn(`[COMPARATOR LOADER] Contract file missing: "${contractName}" at ${filePath || 'unspecified path'}`);
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    logger.error(`[COMPARATOR LOADER] Failed to parse JSON for "${contractName}" at ${filePath}: ${err.message}`);
    return null;
  }
}

/**
 * Load baseline and target run outputs, validate schemas, and return normalized comparison context.
 *
 * @param {string|object} baselineInput Path to baseline run folder/files or pre-loaded object
 * @param {string|object} targetInput Path to target run folder/files or pre-loaded object
 * @returns {object} Normalized comparison context
 */
export function loadComparisonContext(baselineInput, targetInput) {
  let baselinePackage = null;
  let baselineReport = null;
  let targetPackage = null;
  let targetReport = null;

  if (typeof baselineInput === 'string') {
    const { packagePath, reportPath } = resolveContractPaths(baselineInput);
    baselinePackage = loadJsonFile(packagePath, 'baseline audit-package.json');
    baselineReport = loadJsonFile(reportPath, 'baseline report.json');
  } else if (baselineInput && typeof baselineInput === 'object') {
    baselinePackage = baselineInput.auditPackage || baselineInput.package || baselineInput;
    baselineReport = baselineInput.report || null;
  }

  if (typeof targetInput === 'string') {
    const { packagePath, reportPath } = resolveContractPaths(targetInput);
    targetPackage = loadJsonFile(packagePath, 'target audit-package.json');
    targetReport = loadJsonFile(reportPath, 'target report.json');
  } else if (targetInput && typeof targetInput === 'object') {
    targetPackage = targetInput.auditPackage || targetInput.package || targetInput;
    targetReport = targetInput.report || null;
  }

  if (baselinePackage) {
    validateContract(baselinePackage, 'baseline audit-package.json', ['schemaVersion', 'run', 'manifest', 'analysis', 'rules', 'findings', 'evidence']);
  }
  if (baselineReport) {
    validateContract(baselineReport, 'baseline report.json', ['schemaVersion', 'executiveSummary', 'recommendations', 'traceability']);
  }
  if (targetPackage) {
    validateContract(targetPackage, 'target audit-package.json', ['schemaVersion', 'run', 'manifest', 'analysis', 'rules', 'findings', 'evidence']);
  }
  if (targetReport) {
    validateContract(targetReport, 'target report.json', ['schemaVersion', 'executiveSummary', 'recommendations', 'traceability']);
  }

  const baselineRun = {
    runId: baselinePackage?.run?.runId || 'baseline-run',
    timestamp: baselinePackage?.run?.timestamp || null,
    target: baselinePackage?.run?.target || null,
    environment: baselinePackage?.run?.environment || null
  };

  const targetRun = {
    runId: targetPackage?.run?.runId || 'target-run',
    timestamp: targetPackage?.run?.timestamp || null,
    target: targetPackage?.run?.target || null,
    environment: targetPackage?.run?.environment || null
  };

  return {
    baselineRun,
    targetRun,
    baselineAuditPackage: baselinePackage || {},
    targetAuditPackage: targetPackage || {},
    baselineReport: baselineReport || {},
    targetReport: targetReport || {}
  };
}
