# Repository Layer Rule

Repositories are the ONLY modules permitted to import from
`@prisma/client` or execute raw SQL.

Routes and Services must not import Prisma directly.

This follows ADR-001's architecture. Full automatic enforcement
will be introduced later in Lecture 17.