# Dynasty Blueprint HQ Knowledge Base Overview

**Version:** 1.0 MVP

## Purpose

The Knowledge Base contains the football intelligence that powers Dynasty Blueprint HQ.

Unlike application code, these files define how college football works and how the application should reason about football decisions.

As the game evolves, these files should be updated without requiring major application rewrites. The goal is to separate football knowledge from software implementation.

## Philosophy

The application should never make recommendations based on guesses.

Recommendations should always be grounded in documented football knowledge and the mechanics of EA Sports College Football Dynasty Mode.

When new Dynasty features are introduced in future game releases, the Knowledge Base should be updated before application logic is modified.

## Knowledge Organization

Each major football system will have its own markdown file.

Current intended structure:

```text
knowledge/
00_OVERVIEW.md
01_DYNASTY_BLUEPRINT.md
02_AD_EXPECTATIONS.md
03_PROGRAM_OFFICE.md
04_RECRUITING.md
05_TRANSFER_PORTAL.md
06_PLAYER_PROGRESSION.md
07_ROSTER_INTELLIGENCE.md
08_STAFF_MANAGEMENT.md
09_FACILITIES.md
10_NIL.md
11_COACH_ARCHETYPES.md
12_TEAM_DATABASE.md
13_AI_RECOMMENDATION_RULES.md
```

## Purpose of Each File

### 01_DYNASTY_BLUEPRINT.md

Documents Dynasty Points, budgeting, resource allocation, facilities, NIL spending, and Blueprint strategy.

### 02_AD_EXPECTATIONS.md

Defines school demeanors, Athletic Director expectations, goal evaluation, job security, and program priorities.

### 03_PROGRAM_OFFICE.md

Defines the permanent identity of a football program including Team Prestige, My School Grades, conference, tradition, brand exposure, stadium atmosphere, pipelines, and Program Profile.

### 04_RECRUITING.md

Defines recruiting priorities, position needs, recruit analysis, pipelines, recruiting strategy, and NIL recruiting philosophy.

### 05_TRANSFER_PORTAL.md

Documents transfer portal evaluation including position fit, immediate impact, long-term value, cost analysis, and recommendation logic.

### 06_PLAYER_PROGRESSION.md

Documents development traits, player progression, facilities impact, coach ability impact, overall growth, and long-term roster forecasting.

### 07_ROSTER_INTELLIGENCE.md

Documents position strength, position weakness, roster projections, depth analysis, and future recruiting needs.

### 08_STAFF_MANAGEMENT.md

Documents coordinator evaluation, support staff, staff hiring, staff recommendations, and coach archetype interactions.

### 09_FACILITIES.md

Documents facility tiers, equipment, maintenance, upgrade strategy, and development bonuses.

### 10_NIL.md

Documents recruiting NIL, roster NIL, retention strategy, NIL expectations, and spending philosophy.

### 11_COACH_ARCHETYPES.md

Documents coach archetypes, abilities, progression paths, strengths, and strategic use.

### 12_TEAM_DATABASE.md

Contains reference data for supported schools including Team Prestige, conference, My School Grades, demeanor, AD expectations, and program identity.

### 13_AI_RECOMMENDATION_RULES.md

Defines how Dynasty Blueprint HQ generates recommendations and the reasoning framework used by the recommendation engine.

## Knowledge Standards

Every knowledge file should answer four questions:

1. What is this system?
2. Why does it matter?
3. How should Dynasty Blueprint HQ evaluate it?
4. How should it influence recommendations?

## Recommendation Philosophy

Recommendations should always be:

- Context-aware
- Easy to understand
- Actionable
- Based on football reasoning
- Consistent with the user's current program

Recommendations should never rely on a single variable. The application should evaluate multiple factors before presenting advice.

## Version 1 Scope

Only document knowledge required to support Version 1 features.

Ideas for future versions should be documented separately and should not complicate Version 1 development.

## Maintenance

When EA releases title updates or new versions of College Football, update the relevant knowledge files before modifying application logic.

The Knowledge Base is the single source of truth for football intelligence within Dynasty Blueprint HQ.

## Guiding Principle

The application should become smarter by improving its football knowledge, not by becoming more complicated.
