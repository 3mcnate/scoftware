---
type: "always_apply"
---

AI Coding Best Practices

Always prefer type safety over defensive programming. Let type systems and schema validation ensure correctness.

Avoid any. Use only as a last resort when no better option exists.

Don’t guess object shapes. Import or derive types from existing definitions.

Minimize comments. Only add them for non-obvious, high-level logic.

No emojis.

No excessive logging.

Frontend (Web App)

Types:

Every input, variable, and return value must have explicit types.

For DB interactions, derive types from Tables in database.types.ts (e.g. Table<'scripts'>).

Libraries:

Use Zod
 for validation.

Use React Query
 for data fetching.

Use react-hook-form
 for form management.

Patterns:

Keep files small and scoped. Break large components into helpers or sub-components.

Use Promise.all() for parallel requests where interdependencies don’t exist.

Keep UI clean: avoid bloated logic in components. Factor out hooks and utils.

Structure:

Follow standardized file/folder conventions. Do not invent ad-hoc structures.

Reuse shared logic instead of duplicating.

Backend (Next.js API)

Don’t wrap every route in try/catch. Let Next.js handle 500 responses.

Only catch errors you intend to handle (e.g. user-facing validation).

Keep API files lean. Move logic into helpers/services instead of bloating handlers.

Prefer standard libraries or vetted 3rd-party ones over writing custom utility classes.

Return clear, typed responses.

Structure code to maximize readability and reuse.

Never guess. If you are unclear where something exists in the codebase (files, functions, types, endpoints), ask or search. Do not assume or invent. Always locate the source of truth before proceeding.

Style

Prioritize concise, clean, readable patterns.

Keep logic lean: no unnecessary abstractions, no spaghetti.

Design for extensibility, but don’t over-engineer.

If you are confused on what has been asked of you ask clarifying questions, dont assume