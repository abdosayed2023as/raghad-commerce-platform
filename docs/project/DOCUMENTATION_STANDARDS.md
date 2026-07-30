# Documentation Standards

Version: 1.0.0

Status: Approved

Owner: Documentation Owner

Last Updated: 29-07-2026

---

## Purpose

Define the official documentation standards used throughout the project. This document serves as the official reference for every future document.

---

## Document Metadata Standard

Every new markdown document must begin with the following metadata header:
- **Title**: Formatted as an `<h1>` (e.g., `# DOCUMENT TITLE`)
- **Version**: Current version (e.g., `1.0.0`)
- **Status**: The current state of the document
- **Owner**: The team or individual responsible
- **Last Updated**: Date in DD-MM-YYYY format
- **Purpose**: A brief section explaining the document's goal

---

## Document Statuses

- **Draft**: Work in progress.
- **Review**: Ready for feedback.
- **Approved**: Finalized and ready for implementation.
- **Deprecated**: No longer in use.

---

## Versioning Rules

- Use semantic versioning (Major.Minor.Patch) for document revisions.
- Increment Patch for minor typo fixes.
- Increment Minor for added sections or structural updates.
- Increment Major for complete overhauls or business strategy changes.

---

## Naming Convention

- Use `UPPER_SNAKE_CASE.md` for project governance documents (e.g., `PROJECT_STATE.md`).
- Use `lower-kebab-case.md` for standard documentation (e.g., `design-system.md`).

---

## Folder Organization

- **`branding/`**: Brand strategy and visual identity.
- **`business/`**: Goals, KPIs, and strategy.
- **`cro/`**: Conversion rate optimization research and hypotheses.
- **`decisions/`**: Architecture Decision Records (ADRs).
- **`easyorders/`**: Easy Orders specific documentation and API limits.
- **`project/`**: Core project governance and standards.
- **`ui/`**: User interface designs and component docs.
- **`ux/`**: User flows, research, and wireframes.

---

## Writing Style Guidelines

- Be concise and objective.
- Favor bullet points over long paragraphs.
- Use professional terminology (refer to `GLOSSARY.md`).
- Never invent functionality.

---

## Cross Referencing Rules

- Always use absolute paths or proper relative markdown links to other documents.
- Keep links up to date when files move.

---

## Update Rules

- Documentation must be updated whenever a project decision changes.
- Never implement code if the documentation is outdated.

---

## Approval Rules

- All documentation updates must be reviewed and approved by the Business Owner before merging.

---

## Document Lifecycle

1. **Drafting**: Create the document with "Draft" status.
2. **Review**: Submit for team and AI review.
3. **Approval**: Business Owner approves.
4. **Maintenance**: Continuously updated as the project evolves.

---

## Documentation Impact Assessment

Every implementation must determine whether it affects:

- Project State
- Project Decisions
- ADRs
- Specs
- Other documentation

Only affected documentation should be updated. Avoid unnecessary edits.

---

## Related Documents

### Referenced By

- [Project Rules](./PROJECT_RULES.md)
- [Project Workflow](./PROJECT_WORKFLOW.md)
