import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

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
 * Validates contract schemaVersion and essential structure.
 */
function validateContractSchema(contract, contractName) {
  if (!contract) {
    logger.warn(`[COMPARATOR LOADER] Skipping validation for missing contract "${contractName}".`);
    return false;
  }

  if (!contract.schemaVersion) {
    logger.warn(`[COMPARATOR LOADER] Contract "${contractName}" is missing mandatory "schemaVersion" field.`);
    return false;
  }

  return true;
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

  validateContractSchema(baselinePackage, 'baseline audit-package.json');
  validateContractSchema(baselineReport, 'baseline report.json');
  validateContractSchema(targetPackage, 'target audit-package.json');
  validateContractSchema(targetReport, 'target report.json');

  const baselineRun = {
    runId: baselinePackage?.run?.runId || baselinePackage?.analysis?.run?.id || 'baseline-run',
    timestamp: baselinePackage?.run?.timestamp || baselinePackage?.analysis?.run?.timestamp || null,
    target: baselinePackage?.run?.target || baselinePackage?.analysis?.run?.target || null,
    environment: baselinePackage?.run?.environment || baselinePackage?.analysis?.run?.environment || null
  };

  const targetRun = {
    runId: targetPackage?.run?.runId || targetPackage?.analysis?.run?.id || 'target-run',
    timestamp: targetPackage?.run?.timestamp || targetPackage?.analysis?.run?.timestamp || null,
    target: targetPackage?.run?.target || targetPackage?.analysis?.run?.target || null,
    environment: targetPackage?.run?.environment || targetPackage?.analysis?.run?.environment || null
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
