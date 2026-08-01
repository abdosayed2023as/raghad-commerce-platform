/**
 * Single source of truth for priority resolution in GitHub Issue Generator.
 * Converts specification priorities (P0, P1, P2, P3) to issue priorities (Critical, High, Medium, Low).
 *
 * @param {string} specPriority P0, P1, P2, P3
 * @returns {"Critical"|"High"|"Medium"|"Low"} Priority string
 */
export function resolveIssuePriority(specPriority) {
  if (!specPriority || typeof specPriority !== 'string') {
    return 'Low';
  }

  const norm = specPriority.trim().toUpperCase();

  switch (norm) {
    case 'P0':
    case 'CRITICAL':
      return 'Critical';
    case 'P1':
    case 'HIGH':
      return 'High';
    case 'P2':
    case 'MEDIUM':
      return 'Medium';
    case 'P3':
    case 'LOW':
      return 'Low';
    default:
      return 'Low';
  }
}
