# AI Coding Best Practices

Always prefer type safety over defensive programming. Let type systems and schema validation ensure correctness.

Avoid the "any" type. Use only as a last resort when no better option exists.

Don’t guess object shapes. Import or derive types from existing definitions.

Minimize comments. Only add them for non-obvious logic.

No emojis.

No excessive logging.

## Frontend (Web App)

Use shadcn/ui components. Use the #shadcn MCP tool to look up documentation and which component is best for each use case. Make simple yet beautiful and performant designs.  

Every input, variable, and return value must have explicit types.

For DB interactions, import/derive types from Tables, Enums, and Views in database.types.ts (e.g. Table<'scripts'>). This keeps in sync with our supabase database. Also, use the supabase MCP server to inspect the schema of the database.

Use the supabase js client when possible for crud operations. 

Libraries:

Use Zod
 for validation.

Use React Query for all data fetching on the frontend. Always wrap it with the @supabase-cache-helpers/postgrest-react-query library.

Use react-hook-form and the shadcn/ui <Form> component for form management.

## Patterns:

Keep files small and scoped and code clean and modular. Break large components into helpers, sub-components, and separate files.

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