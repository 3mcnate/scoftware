# AI Coding Best Practices

Always prefer type safety over defensive programming. Let type systems and schema validation ensure correctness.

Avoid the "any" type. Use only as a last resort when no better option exists.

Don’t guess object shapes. Import or derive types from existing definitions.

Minimize comments. Only add them for non-obvious logic.

No emojis.

No excessive logging.

## Architecture

This project uses Next.js and Supabase, including Supabase Auth. The first choice for data fetching should be on the browser, using Tanstack Query wrapped by the @supabase-cache-helpers/postgrest-react-query library. 

## Project Directory Structure

src/
├── app/                            # Next.js routes (App Router)
│   ├── (auth)/               		# pages for login, signup, forgot password, etc
│   ├── (protected)/                # Authenticated pages
│   │	├── participant/            # Participant portal pages
│   │	├── guide/                  # Guide dashboard pages
│   │	└── admin/                  # Admin guides dashboard pages
│   ├── (public)/					# Public trip pages, users click through and sign up for trips 
│	│	│							# everything in this folder should be rendered with ISR
│   │	├── trips/                  	# Displays list of published upcoming trips
│   │	├── past-trips/             	# Displays list of past trips 
│   │	└── trip/[tripId]/page.tsx      # Trip details page
│   ├── api/                        # API routes when needed for functionality (e.g. Stripe webhooks, managing checkout, etc)
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                     # Components with some amount of global scope (e.g. not specific to a feature)
│   ├── ui/							# shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── modal.tsx
│	├── nav/						# navbars
│   └── providers/					# context providers for Tanstack Query, Theme, Auth, Toaster, etc
│   
├── hooks/                          # React hooks with global scope (not specific to a feature)
│   ├── use-auth.ts
│   └── use-toast.ts
│
├── utils/                          # General utilities
│   ├── supabase/ 		            # Supabase browser/server clients
│   │	├── client.ts         		# Supabase browser client
│   │	├── middleware.ts           # Session refresh middleware
│   │	└── server.ts          		# Supabase server client
│   ├── drizzle.ts           		# Drizzle DB client
│   └── utils.ts                    # Misc helpers
│
├── data/                           # Data-fetching layer (React Query)
│   ├── queries/
│   │   ├── trips-query.ts
│   │   ├── users-query.ts
│   │   └── budgets-query.ts
│   └── mutations/
│       ├── create-trip.ts
│       ├── update-trip.ts
│       └── delete-trip.ts
│
├── drizzle/                        # Database schema + migrations
│   ├── schema.ts
│   ├── migrations/
│   └── client.ts
│
├── supabase/                       # Supabase initialization + auth utils
│   ├── client.ts
│   ├── server.ts
│   ├── auth.ts
│   └── types.ts
│
└── styles/
    ├── globals.css
    └── theme.css


## Frontend (Web App)

Use shadcn/ui components. Use the #shadcn MCP tool to look up documentation and which component is best for each use case. Make simple yet beautiful and performant designs.  

Every input, variable, and return value must have explicit types.

For DB interactions, import/derive types from Tables, Enums, and Views in database.types.ts (e.g. Table<'scripts'>). This keeps in sync with our supabase database. Also, use the supabase MCP server to inspect the schema of the database.

Use the supabase-js client when possible for crud operations. Always wrap calls with the @supabase-cache-helpers/postgrest-react-query library.

Use react-hook-form and the shadcn/ui <Form> component with zod for form management.


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