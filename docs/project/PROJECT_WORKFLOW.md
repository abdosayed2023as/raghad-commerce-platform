# Project Workflow

Version: 1.0.0

Status: Approved

Owner: Product Architect

Last Updated: 2026-08-03

---

# Purpose

This document defines the official workflow used throughout the **رغد | Raghad** (Raghad Commerce Platform) project.

Every feature, document, design, and implementation must follow this workflow.

The objective is to ensure consistency, traceability, and high-quality decision making.

---

# Development Methodology

The project follows a combination of:

- Product Discovery
- Research-Driven Decisions
- Spec-Driven Development
- Documentation-First Development
- Iterative Delivery

Implementation is the final step, never the first.

---

# Standard Workflow

Every feature follows the same lifecycle.

```

Idea

↓

Discovery

↓

Research

↓

Business Analysis

↓

Documentation

↓

Approval

↓

Specification

↓

UX

↓

UI

↓

Technical Review

↓

Implementation

↓

Code Review

↓

QA

↓

Merge

↓

Release

```

No stage may be skipped without Business Owner approval.

---

# Phase 1 — Discovery

Purpose

Understand the problem before discussing solutions.

Outputs

- User insights
- Business goals
- Constraints
- Opportunities

No design or coding is allowed.

---

# Phase 2 — Research

Purpose

Validate assumptions using evidence.

Sources

- Official Easy Orders Documentation
- UX Research
- CRO Best Practices
- Competitor Analysis
- Analytics (when available)

Outputs

- Findings
- Risks
- Recommendations

---

# Phase 3 — Business Analysis

Purpose

Determine whether the proposed solution creates business value.

Questions

- Does it increase trust?
- Does it improve UX?
- Does it increase conversion?
- Does it support scalability?
- Does it align with the brand?

---

# Phase 4 — Documentation

Purpose

Convert discussions into permanent project knowledge.

Examples

- Brand documents
- Business documents
- ADRs
- Architecture
- UX decisions

Documentation must be approved before proceeding.

---

# Phase 5 — Specification

Purpose

Describe exactly what should be built.

Each specification should include:

- Goal
- Scope
- Requirements
- Acceptance Criteria
- Dependencies
- Risks

Specifications are implementation-independent.

---

# Phase 6 — UX

Purpose

Design the experience before the interface.

Deliverables

- User Flows
- Information Architecture
- Wireframes
- Interaction Decisions

---

# Phase 7 — UI

Purpose

Translate UX into visual interfaces.

Deliverables

- Layouts
- Components
- Responsive behavior
- Design System integration

---

# Phase 8 — Technical Review

Purpose

Verify technical feasibility.

Checklist

- Easy Orders compatibility
- Performance
- Accessibility
- Maintainability
- Scalability

No coding should begin before approval.

---

# Phase 9 — Implementation

Responsible

Implementation Engineer (AI or Human)

Responsibilities

- Theme development
- Components
- Refactoring
- Documentation updates

The Implementation Engineer must never invent business requirements.

---

# Phase 10 — Code Review

Responsible

Code Reviewer (AI or Human)

Responsibilities

- Code quality
- Bugs
- Performance
- Security
- Best practices
- Specification compliance

The Code Reviewer reviews implementation only.

Business decisions remain unchanged.

---

# Phase 11 — QA

Purpose

Verify:

- Acceptance Criteria
- UI consistency
- UX consistency
- Mobile responsiveness
- Cross-browser compatibility

---

# Phase 12 — Merge

Requirements

- Documentation approved
- Specification approved
- Review completed
- QA passed

Only then may changes be merged.

---

# AI Collaboration Workflow

Strategist (ChatGPT/Claude/Gemini)

↓

Business Strategy

↓

Documentation

↓

Specification

↓

Implementation Engineer

↓

Implementation

↓

Code Reviewer

↓

Review

↓

Business Owner

↓

Approval

---

# RFC Lifecycle

An RFC (Request for Comments) is a formal proposal for a change to architecture, governance, or major technical implementation.

The lifecycle is:

Draft
↓
Review
↓
Approved
↓
Implemented
↓
Verified
↓
Closed

- **Draft**: The proposal is created and documented.
- **Review**: Stakeholders review the RFC for feasibility, risk, and alignment.
- **Approved**: The Business Owner or Product Architect approves the RFC. Transition recorded in `PROJECT_DECISIONS.md`.
- **Implemented**: The approved changes are executed in the repository.
- **Verified**: The implementation is checked against the approved RFC.
- **Closed**: The RFC is formally closed.

**Relationship to PROJECT_DECISIONS and ADRs**:
- `PROJECT_DECISIONS.md` acts as the ledger logging the approval of the RFC.
- An **ADR (Architecture Decision Record)** is a permanent technical record of the choices made during a technical RFC. Not all RFCs require an ADR (e.g., governance changes), but all major technical RFCs do.

---

# Decision Workflow

Every important decision follows:

Discussion

↓

Research

↓

Recommendation

↓

Approval

↓

Documentation

↓

Implementation

---

# Documentation Workflow

Conversation

↓

Analysis

↓

Approved Document

↓

Repository

↓

Reference for Future Tasks

Conversations are temporary.

Documentation is permanent.

---

# Documentation Synchronization

Whenever a project decision is approved, documentation must be synchronized before implementation begins.

This includes updating, when applicable:

- PROJECT_STATE
- PROJECT_DECISIONS
- CHANGELOG
- ADR
- Related documentation

Implementation must never begin before documentation is synchronized.

---

# Rule of Truth

The Repository is the only source of truth.

Chat conversations are not considered documentation.

If something is not documented, it should be treated as undefined.

---

# Stop Rule

Stop implementation immediately if:

- Requirements are unclear.
- Documentation is missing.
- Easy Orders documentation is insufficient.
- A decision has not been approved.

Never guess.

Always ask or research first.

---

# Task Completion Protocol (TCP)

The Task Completion Protocol defines the mandatory final phase of every task.

Recommended flow for task execution:

```
Task Assigned
↓
Analysis
↓
Research (if required)
↓
Specification
↓
Implementation
↓
Review
↓
Documentation Impact Assessment
↓
Documentation Synchronization
↓
Knowledge Registration (if research session)
↓
Repository Validation
↓
Completion Report
↓
Task Closed
```

Implementation alone never completes a task.

### Knowledge Registration (Research Sessions)
Before a research task can be considered complete:
- evaluate whether the Knowledge Index requires updates
- update it if necessary
- verify session relationships

### Reference Synchronization
Researchers must evaluate whether:
- Reference Library requires updating.

If yes, update the affected reference documents.

This must occur before task closure.

### Repository Validation
Before generating the completion report, verify:
- [ ] Session ID is unique
- [ ] Filename follows repository convention
- [ ] Session exists in KNOWLEDGE_INDEX
- [ ] Reference Library synchronized if required
- [ ] PROJECT_STATE synchronized if required
- [ ] Session Status is synchronized
- [ ] Decision Candidates contain no official DEC identifiers
- [ ] Reference entries cite originating Research Sessions

This validation step is a checklist only. It must NOT create any new process.

---

# Definition of Done

A task is complete only when:

✓ Documentation updated

✓ Specification approved

✓ Implementation completed

✓ Code reviewed

✓ QA passed

✓ Repository updated

✓ Ready for future maintenance

Code alone does not mean completion.

Documentation is part of the deliverable.

---

## Related Documents

### Depends On

- [Project Context](./PROJECT_CONTEXT.md)
- [Project Rules](./PROJECT_RULES.md)

### Related

- [Documentation Standards](./DOCUMENTATION_STANDARDS.md)

### Referenced By

- [Project State](./PROJECT_STATE.md)
- [Project Decisions](./PROJECT_DECISIONS.md)
- [README](../../README.md)