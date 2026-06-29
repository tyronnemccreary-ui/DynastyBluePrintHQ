# Dynasty Blueprint HQ

Dynasty Blueprint HQ is an AI-assisted Football Operations platform for EA Sports College Football Dynasty Mode.

The Version 1 MVP helps a coach review program identity, roster direction, recruiting priorities, Dynasty Blueprint spending, transfer portal opportunities, staff decisions, and weekly football operations recommendations without turning Dynasty Mode into spreadsheet work.

The product rule is simple:

> Does this help the coach make a better football decision?

## Tech Stack

- Next.js 15 with the App Router
- TypeScript
- Tailwind CSS
- Supabase client foundation
- React Hook Form
- Zod
- Zustand
- Lucide React

## Local Setup

This project uses `pnpm`.

If Node.js is not installed on your Mac yet, install the current LTS version from:

```text
https://nodejs.org
```

After Node.js is installed, enable Corepack and install dependencies:

```bash
corepack enable
pnpm install
```

Start the local development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

If port `3000` is already in use:

```bash
pnpm dev -- --port 3001
```

## Temporary Codex Runtime Command

If your terminal does not recognize `pnpm`, `npx`, or `corepack`, your Mac shell does not have Node.js tooling available yet. As a temporary workaround on this machine, run:

```bash
cd /Users/tyronnemccreary/Documents/DynastyBluePrintHQ
PATH="/Users/tyronnemccreary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" /Users/tyronnemccreary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dev
```

Keep that terminal window open while reviewing the app.

## Quality Checks

Run these before committing meaningful changes:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Environment Variables

Supabase is optional during the MVP foundation. If these values are missing, the app continues using local persisted Zustand state.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Authentication is not required yet.

## Current MVP Modules

- Welcome to the Program
- War Room
- Program Office
- Blueprint Planner
- Roster Intelligence
- Recruiting Command Center
- Transfer Portal
- Staff Management
- Screenshot Import

## Current Development Status

Sprint 16 stabilizes the MVP foundation before OCR, Vision, or new feature work.

Current behavior:

- Program Profile is stored locally with Zustand persistence.
- Supabase client and service-layer persistence exist as a foundation.
- If Supabase credentials are missing, the app continues in local mode.
- The War Room uses the Football Operations Intelligence Engine as the active recommendation path.
- Screenshot uploads are local-only and may clear on refresh until upload persistence is added.

Not included yet:

- OpenAI integration
- OCR or Vision parsing
- Authentication
- Full database-backed workflows
- Player-by-player roster management

## Project Documents

- `PROJECT.md` defines product vision and operating principles.
- `ROADMAP.md` defines sprint order and scope discipline.
- `knowledge/00_OVERVIEW.md` defines the football knowledge architecture.
