# Research Standards

Version: 1.0.0
Status: Approved
Owner: Documentation Engineer
Last Updated: 29-07-2026

## Purpose
This document governs all research activities within the Raghad World project. It ensures that research is rigorous, objective, and moves through a controlled lifecycle before influencing project decisions.

## Core Research Principles

### Focused Research Principle
Each research session must have exactly one Primary Research Question.
Secondary questions are allowed only when they directly support answering the Primary Research Question.
A research session must never attempt to answer multiple unrelated research questions.

The objective is to keep research sessions:
- Focused
- Independent
- Easy to review
- Easy to update
- Easy to reference

### Research Continuity Principle
Every research session must end with:
- A recommended next research session.
- The Primary Research Question for that next session.
- A short explanation of why that session should come next.

This recommendation is advisory only. The official execution order remains the one recorded in PROJECT_STATE.md.

### Reusable Knowledge Principle
The objective of every research session is to extract reusable project knowledge rather than merely summarize external documentation.

Research should transform external information into structured knowledge that can be reused by future contributors and AI assistants.

### Traceability Principle
Every important fact should be traceable to one or more official documentation sources.

Whenever practical, research findings should indicate the documentation page or section from which the fact originated.

### Historical Integrity Principle
Completed research sessions are historical records.

Do not rewrite completed sessions merely to match newer templates or standards.

Methodology improvements should apply only to future sessions unless an explicit migration task is approved.

### Knowledge Management Principle
Every completed research session contributes reusable knowledge to the project.

Research should continuously strengthen the project's long-term knowledge base.

### Knowledge Registration Principle
After completing every research session, the researcher must determine whether the session introduces new reusable knowledge.

If applicable, the Knowledge Index must be updated.

### Knowledge Reuse Principle
Before beginning any research session, contributors must review the Knowledge Index.

Existing knowledge should be reused whenever possible.

Duplicate research should be avoided.

### Knowledge Relationship Principle
Research sessions covering related subjects should reference one another.

Cross-links should be maintained whenever practical.

### Knowledge Index Principle
The Knowledge Index is the project's official navigation layer for research knowledge.

It should never become a documentation summary.

It should only provide structured navigation to reusable knowledge.

### Reference Library Principles
- Research Sessions remain the source of truth.
- Reference files summarize reusable knowledge.
- Every reference entry must cite one or more originating Research Sessions.
- Reference files must never introduce information not present in Research Sessions.
- Reference files may consolidate identical knowledge coming from multiple sessions.

## Research Lifecycle
Every research topic must move through this controlled lifecycle:
1. **Research Notes**: Raw data, findings, and initial observations.
2. **Reviewed**: Peer or AI review to validate logic and facts.
3. **Approved**: Officially recognized by the project owner.
4. **Official Documentation**: Translated into project rules, ADRs, or specifications.

## Terminology Distinctions
- **Fact**: An objective, verifiable piece of information (e.g., "Easy Orders supports JSON templates").
- **Observation**: A notable pattern or specific occurrence (e.g., "Competitor A places the CTA above the fold").
- **Insight**: A conclusion drawn from facts and observations (e.g., "A persistent CTA reduces friction for mobile users").
- **Decision**: An approved action or rule resulting from insights (e.g., "We will implement a sticky add-to-cart button on mobile").
- **Documentation**: The permanent record of approved decisions and architecture.

## Source Validation Rules
- **Primary Sources**: Always prefer official documentation (e.g., Easy Orders API docs) over third-party blogs or forums.
- **Evidence Over Opinion**: All claims must be backed by data, official docs, or established industry best practices.
- **Relevance**: Ensure sources are up to date and applicable to the current platform version.

## Citation Expectations
- Always provide links to original sources.
- Quote directly when interpreting complex constraints or platform limits.
- If a source is anecdotal or unverified, explicitly state this.

## Research Quality Standards
- **Objectivity**: Do not bias research to support a pre-existing preference.
- **Clarity**: Write clearly and concisely.
- **Actionability**: Research should lead to clear insights or decisions.

## Mandatory Session Structure
Starting with Template v2.2.0, all new Research Sessions must include the following structural elements to improve long-term maintainability:
- **Research Scope**: Clearly define what is `In Scope` and `Out of Scope` to prevent scope creep.
- **Architectural Relationships**: Explicitly document what this session `Depends On` and what future work it `Enables` to show its place in the overall knowledge architecture.
- **Decision Candidates**: A space to propose possible future architectural or business decisions. These are strictly candidates, not approved decisions.
  - Research Sessions may contain Decision Candidates.
  - Decision Candidates are proposals only.
  - Decision Candidates must NOT use official DEC identifiers.
  - Official DEC identifiers are assigned exclusively inside `PROJECT_DECISIONS.md` after formal approval.
- **Open Questions**: Must accurately reflect unresolved issues. If no confirmed questions exist within the documented scope, this section must explicitly state so (e.g., "There are no unresolved questions within the documented scope."). Questions discovered outside the current scope should still be recorded.

## Definition of Research Done

Research is complete only when ALL required conditions are satisfied:
- [ ] Primary Research Question answered
- [ ] Facts originate only from approved sources
- [ ] Observations separated from Facts
- [ ] Insights separated from Facts
- [ ] References documented
- [ ] Research Confidence assigned
- [ ] Terminology updated if required
- [ ] Knowledge Registration completed
- [ ] Reference Synchronization completed
- [ ] Documentation Synchronization completed
- [ ] Next Session defined
- [ ] Remaining Open Questions documented
- [ ] Repository Validation completed

This definition becomes mandatory for every future Research Session.

## Repository Validation Rule
Repository Validation is a mandatory quality verification step at the end of every task.
Repository Validation verifies consistency. It does NOT create or modify research.

## Promotion Rule
```text
Research Notes → Reviewed → Approved → Official Documentation
```
Research MUST NOT bypass this pipeline.
