# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session Start

At the beginning of every session, read these two files before doing anything else:
- `tasks/lessons.md` — past mistakes and patterns to avoid
- `tasks/todo.md` — active tasks and their current status

## Repository Overview

This monorepo contains two independent React/Vite applications:

- **Root app** (`/`) — "Master of Tenis": a tennis match tracker with player management and statistics. UI language is Czech.
- **`business-dashboard/`** — an authenticated business sales dashboard with file upload and AI-powered document parsing.

Both apps use React, Vite, Tailwind CSS, and Supabase as the backend.

---

## Root App — Master of Tenis

### Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server
npm run build     # production build
npm run lint      # run ESLint
npm run preview   # preview production build
```

### Architecture

- **`src/lib/supabase.js`** — Supabase client (credentials hardcoded) + `fromDB` converters that map snake_case DB columns to camelCase app objects (`player`, `match`).
- **`src/hooks/useAppData.js`** — single central hook that loads all data from Supabase on mount and exposes CRUD operations (`addPlayer`, `updatePlayer`, `deletePlayer`, `setPlayerAsMe`, `addMatch`, `updateMatch`, `deleteMatch`). All state lives here; `App.jsx` passes it down as props.
- **`src/utils/stats.js`** — pure functions: `computePlayerStats` and `computeHeadToHead` derive win/loss metrics and head-to-head matrices from the flat players+matches arrays.
- **`src/sections/`** — tab-based views (`Home`, `History`, `Players`, `Stats`) rendered conditionally in `App.jsx` based on `activeTab` state. No router — navigation is a simple string state.
- **`src/components/`** — shared UI: `Header`, `Nav`, `EmptyState`, `ConfirmDialog`.

### Supabase schema (root app)

Two tables, `players` and `matches`, both using snake_case columns. The `fromDB` helpers in `src/lib/supabase.js` handle the translation to camelCase for the app layer.

---

## Business Dashboard (`business-dashboard/`)

### Commands

```bash
cd business-dashboard
npm install
cp .env.local.example .env.local   # fill in your Supabase credentials
npm run dev
npm run build
npm run lint
```

### Environment variables (`.env.local`)

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_ALLOWED_EMAILS` | Comma-separated email whitelist (empty = allow all) |

> `ANTHROPIC_API_KEY` is set as a **Supabase secret**, not in `.env.local`. Set it with: `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`

### Architecture

- **Auth** — Google OAuth via Supabase Auth. `useAuth` hook (`src/hooks/useAuth.js`) gates the app via an email whitelist in `VITE_ALLOWED_EMAILS`. The `allowed` flag blocks access even after successful OAuth if the email isn't whitelisted.
- **Routing** — React Router with five routes: `/` (Dashboard), `/upload`, `/plan`, `/history`, `/settings`. All wrapped in `<Layout>`.
- **Supabase client** (`src/lib/supabase.js`) — reads credentials from env vars; also exports `PARSE_FUNCTION_URL` pointing to the `parse-document` Edge Function.
- **Edge Function** (`supabase/functions/parse-document/`) — receives uploaded documents and calls the Anthropic API (Claude) to parse sales data. The `ANTHROPIC_API_KEY` must be set as a Supabase secret.
- **Database** (`supabase/migrations/001_initial_schema.sql`) — tables: `periods`, `salespersons`, `plans`, `uploads`, `sales_data`, `opportunities`, `invoices_aging`, `settings`. RLS is enabled; all authenticated users have full access (single-tenant design). Run this SQL in the Supabase SQL Editor to initialise a new project.
- **`src/hooks/usePeriod.js`** — shared hook for the currently selected period (month/year), used across Dashboard, Upload, Plan, and History pages.

### Key data flow

1. User uploads a file (Excel/CSV/screenshot) on the Upload page.
2. The file is sent to the `parse-document` Edge Function, which uses Claude to extract structured sales data.
3. Parsed data is stored in `sales_data`, `opportunities`, or `invoices_aging` tables linked to the current `period`.
4. Dashboard and History pages read these tables and display charts/KPIs via Recharts.

---

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules that prevent the same mistake from recurring
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project context

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## Task Management

For every non-trivial task, follow these steps:

1. **Plan First** — Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan** — Check in before starting implementation
3. **Track Progress** — Mark items complete as you go
4. **Explain Changes** — High-level summary at each step
5. **Document Results** — Add review section to `tasks/todo.md`
6. **Capture Lessons** — Update `tasks/lessons.md` after any corrections

---

## Core Principles

- **Simplicity First** — Make every change as simple as possible. Impact minimal code.
- **No Laziness** — Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact** — Only touch what's necessary. No side effects with new bugs.
