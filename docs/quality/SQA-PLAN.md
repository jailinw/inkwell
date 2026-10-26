# Inkwell SQA Plan — v1

## Standards

- All code changes follow the PR checklist (`docs/reviews`, `.github/PULL_REQUEST_TEMPLATE.md`)
- Architecture conformance per ADR-001 (`docs/architecture/adr-001-modular.monolith.md`)
- API contract conventions per `docs/design/api-contract.md`

## Reviews

- Every merged change is self-reviewed by the author and then peer-reviewed before merge.
- Review findings are logged in `docs/reviews/`.

## Testing

Testing practices will be expanded in Lectures 12–14.

- Unit tests: Services and Repositories (Jest) — ACTIVE as of Lecture 12
- Integration tests: Routes → Services → Repositories, real test DB (Supertest) — ACTIVE (Lecture 13)
- Component tests: React components (RTL) — ACTIVE (Lecture 13)
- End-to-end tests: critical user flows (Playwright) — starting Lecture 14

## Defect Tracking

- All discovered defects, whether found through review, testing, or manual use, are recorded in `docs/quality/DEFECT-LOG.md`.
- Each entry records the cause category, discovery stage, and remediation.

## Metrics Tracked

- Defects per lecture/increment
- Defect cause category distribution
- Review turnaround, tracked informally and qualitatively at this project's scale

## Ownership

- For this course project, the student/team implementing Inkwell owns SQA plan adherence.

## Metrics Snapshot

- Total commits: 19
- Logged defects: 1
- Backlog items at "Requirements Defined" or later: 9