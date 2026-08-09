# Change Request Governance System (`docs/change_requests/`)

**Purpose:** Formal change control procedure for proposing, evaluating, and approving modifications to locked strategy decisions, project governance rules, or architecture baselines.

---

## Change Control Rules

1. **Framework Freeze & Lock Enforcement:** Approved brand strategy decisions (BRAND-001..021) and architecture baselines (ADR-001..006) are locked.
2. **Formal Submission:** Any proposed modification must be submitted via a formal Change Request file (`CR-XXX_<Title>.md`).
3. **Approval Mandate:** Strategic brand changes require explicit Business Owner approval. Technical changes require Product Architect approval.

---

## Change Request Lifecycle

```text
Draft  --->  Under Review  --->  Approved  --->  Implemented  --->  Closed
                                 │
                                 └───> Rejected
```

---

## Register of Change Requests

| CR ID | Title | Domain | Proposer | Status | Date |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `CR-000` | Change Request Template & Process Baseline | Governance | Product Architect | Approved | 2026-08-03 |
| `CR-001` | Social Media Channel Architecture | Brand Strategy | Claude (Chief Brand Strategist) | Implemented | 2026-08-08 |
| `CR-002` | Brand Book Secondary Color Hex Typo Correction | Brand Strategy | Claude (Chief Brand Strategist) | Draft | 2026-08-09 |

---

## File Naming Convention

`CR-XXX_<SHORT_DESCRIPTION>.md` (e.g., `CR-001_ADD_PAYMENT_GATEWAY.md`)
