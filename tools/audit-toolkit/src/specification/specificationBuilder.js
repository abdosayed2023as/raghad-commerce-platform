import { createSpecification } from './specTemplate.js';

/**
 * Main orchestration for building developer specifications from report.json recommendations.
 *
 * @param {object} report Parsed report.json contract
 * @param {object} [comparison] Optional comparison.json contract
 * @returns {object} Specifications payload containing summary and specifications list
 */
export function buildSpecifications(report, comparison = null) {
  const recommendations = Array.isArray(report?.recommendations) ? report.recommendations : [];

  // Build finding lookup map from report.json embedded findings
  const findingMap = new Map();
  const allFindings = [
    ...(Array.isArray(report?.criticalFindings) ? report.criticalFindings : []),
    ...(Array.isArray(report?.highPriority) ? report.highPriority : []),
    ...(Array.isArray(report?.findings) ? report.findings : [])
  ];

  allFindings.forEach(f => {
    if (f && f.findingId) {
      findingMap.set(f.findingId, f);
    }
  });

  const specifications = recommendations.map((rec, index) =>
    createSpecification(rec, index, findingMap)
  );

  const p0 = specifications.filter(s => s.priority === 'P0').length;
  const p1 = specifications.filter(s => s.priority === 'P1').length;
  const p2 = specifications.filter(s => s.priority === 'P2').length;
  const p3 = specifications.filter(s => s.priority === 'P3').length;

  return {
    summary: {
      totalSpecifications: specifications.length,
      p0,
      p1,
      p2,
      p3
    },
    specifications
  };
}
