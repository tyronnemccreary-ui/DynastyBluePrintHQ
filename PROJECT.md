# Dynasty Blueprint HQ

**Version:** 1.0 MVP  
**Status:** Active Development  
**Project Owner:** Tyronne McCreary  
**Lead Software Architect:** OpenAI ChatGPT

## Mission

Dynasty Blueprint HQ is an AI-assisted Football Operations platform designed to help players make smarter decisions while playing EA Sports College Football Dynasty Mode.

The application is not intended to replace Dynasty Mode. Its purpose is to function like a Football Operations Department that provides strategic recommendations around roster construction, recruiting, Dynasty Blueprint spending, NIL, staff management, and long-term program building.

The application should always prioritize simplicity over complexity. The goal is to make Dynasty players feel like Head Coaches and General Managers rather than spreadsheet managers.

## Product Philosophy

Every feature must support one question:

> Does this help the coach make a better football decision?

If the answer is no, do not build it.

## Core Principles

1. Never overwhelm the user.
2. Never ask for information that does not improve recommendations.
3. Every recommendation explains why.
4. AI advises. The coach decides.
5. Simplicity over feature quantity.
6. Everything should feel like a Football Operations Center.
7. Build Version 1 before discussing Version 2.

## Version 1 Scope

Version 1 contains only these modules:

- Welcome to the Program
- War Room
- Program Office
- Blueprint Planner
- Roster Intelligence
- Recruiting Command Center
- Transfer Portal
- Staff Management

## User Journey

Welcome to the Program  
Program Assessment  
War Room  
Football Operations  
Recommendations  
Coach makes decisions

## War Room Philosophy

The War Room is the Home Screen.

Every time a user opens the application they should immediately know:

- How is my program doing?
- What should I do next?
- What decisions require attention?

The War Room should never become cluttered.

## Design Philosophy

Premium. Executive. Modern. Minimal. Whitespace. No unnecessary animations. No sports TV graphics.

Think Apple, Linear, Vercel, modern SaaS, and a Football Operations Center.

Do not build ESPN. Do not build Madden.

## UI Rules

Every screen answers one question.

Never place unrelated features together.

Avoid information overload.

Always prioritize recommendations over raw data.

## AI Philosophy

The AI is a Football Operations Consultant.

It never makes decisions. It makes recommendations.

Every recommendation should include:

- Recommendation
- Reason
- Tradeoffs
- Expected Outcome

## Coding Standards

- TypeScript only.
- Reusable components.
- Server Components where appropriate.
- No duplicated logic.
- Strong typing everywhere.
- Write readable code.
- Prioritize maintainability.

## Folder Structure

```text
app/
components/
data/
hooks/
lib/
services/
styles/
types/
utils/
```

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- React Hook Form
- Zod
- Zustand
- Lucide

## Database Philosophy

Normalize data.

Avoid duplicated information.

Everything references the Program Profile.

## Product Rule

We are building software for coaches, not programmers.

Every screen should feel intuitive.

## The Three Recommendation Rule

Whenever recommendations are generated, return the three highest priority recommendations first.

## Product Motto

Simple on the surface.

Powerful underneath.

## Definition of Success

If a player opens Dynasty Blueprint HQ and says, "This helped me build my dynasty," then we succeeded.

Not because we had the most features, but because we helped them make better football decisions.
