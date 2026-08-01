/**
 * Single source of truth for priority resolution across specifications.
 * Maps severity/priority strings into standardized P0..P3 priority levels.
 *
 * Priorities:
 * Critical -> P0
 * High     -> P1
 * Medium   -> P2
 * Low      -> P3
 *
 * @param {string} priorityStr Input priority string
 * @returns {"P0"|"P1"|"P2"|"P3"} Standardized priority
 */
export function resolvePriority(priorityStr) {
  if (!priorityStr || typeof priorityStr !== 'string') {
    return 'P3';
  }

  const normalized = priorityStr.trim().toLowerCase();

  switch (normalized) {
    case 'critical':
    case 'p0':
      return 'P0';
    case 'high':
    case 'p1':
      return 'P1';
    case 'medium':
    case 'p2':
      return 'P2';
    case 'low':
    case 'p3':
      return 'P3';
    default:
      return 'P3';
  }
}
