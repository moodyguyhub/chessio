# Chessio Protocol – v0

**Status:** Concept draft (NOT yet implemented)  
**Owner:** Mahmood (Product)  
**Last Updated:** Dec 2025  

> Chessio Protocol = the rules and structures that define how lessons, puzzles, seasons, and clubs are created, connected, and grown – independent of any single UI or release.

This document is **not** a feature spec for immediate implementation.  
It is a **north-star protocol** to guide future sprints once Season 01 is complete.

---

## 0. Purpose & Scope

**Goal:**  
Define a minimal, extensible "protocol" for Chessio so that, over time:

- The **app** becomes just one "client" of the protocol.
- **Coaches and clubs** can create and run their own seasons using shared rules.
- **Content and communities** can grow without Mahmood manually authoring everything.

**Out of scope for v0:**

- Public APIs
- Marketplace / payments / tokens
- Fully decentralized governance

We only define **concepts, entities, and loops** – not exact DB schemas or endpoints.

---

## 1. Core Principles

1. **Calm Focus First**
   - No hype, no grind, no streak guilt.
   - The protocol must support *gentle, sustainable* practice.

2. **Beginner Safety**
   - Everything assumes players are insecure about blundering.
   - Lessons, puzzles, and seasons must be framed to reduce shame and confusion.

3. **Protocol > Platform**
   - Chessio the app = one implementation.
   - The protocol = shared language for:
     - Lessons, puzzles, seasons, clubs.
     - Roles, XP, and progression.

4. **Centralized Now, Federated Later**
   - v0–v1: Mahmood + inner circle control content & seasons.
   - Later: trusted coaches can run seasons, then design content.
   - Only *much* later: broader contribution.

5. **Reputation Over Hype**
   - Growth comes from:
     - Completed seasons
     - Helpful feedback
     - Consistent presence
   - Not from ratings, ELO flexing, or token economics.

---

## 2. Domain Model (High-Level)

The protocol revolves around a few key entities:

- **Player** – A human learner.
- **Lesson** – A conceptual teaching unit (text + examples + mini tasks).
- **Puzzle** – A concrete tactical exercise (1+ positions with solutions).
- **PuzzlePack** – A themed collection of puzzles.
- **Season** – A structured arc (e.g. 4 weeks) with missions and XP targets.
- **Club** – A group of players going through a season together, with a coach.
- **Session / Engagement** – A visit or block of practice (days/sessions).

The app is free to store these however it wants (Prisma, JSON, etc.) as long as it respects the **specs** below.

---

## 3. Content Specs

### 3.1 Lesson Spec (Protocol-Level)

A **Lesson** is a conceptual building block.

**Minimum fields:**

- `lesson_id` (string, stable)
- `slug` (string, human-readable, unique)
- `title` (string)
- `level_index` (int, e.g. 0, 1, 2)
- `content_type` (enum: `intro`, `core`, `review`, `challenge`)
- `xp_value` (int, from protocol XP rules)
- `theme_tags` (list of strings, e.g. `["safety", "development"]`)
- `prerequisites` (list of `lesson_id`s or tags, optional)
- `estimated_time_minutes` (int, rough)
- `version` (int, for future revisions)

**Optional / later:**

- `learning_objectives` (list of short statements)
- `inline_tasks` (list of micro-questions/modules)
- `links_to_puzzle_packs` (optional list)

> In practice, the current hard-coded lessons in `lessons.ts` should be compatible with this spec.

---

### 3.2 Puzzle Spec

A **Puzzle** is a single chess exercise.

**Minimum fields:**

- `puzzle_id` (string)
- `fen` (string – starting position)
- `side_to_move` (`"white"` | `"black"`)
- `solution_moves` (list of moves in algebraic or UCI)
- `tactic_tags` (e.g. `["fork", "pin", "mate_in_one"]`)
- `difficulty` (enum: `easy`, `medium`, `hard`)
- `xp_value` (int, from protocol XP rules)
- `version` (int)

**Optional / later:**

- `explanation` (rich text)
- `common_mistakes` (list of lines)
- `source` (where it came from, if applicable)

---

### 3.3 PuzzlePack Spec

A **PuzzlePack** is a themed collection of puzzles.

**Minimum fields:**

- `pack_id` (string)
- `slug` (string)
- `title` (string)
- `description` (string)
- `associated_level` (int or level label, e.g. `1` / `"Pawn"`)
- `puzzle_ids` (ordered list of `puzzle_id`)
- `xp_value_total` (int – sum or override)

**Optional / later:**

- `recommended_entry_xp_range` (min_xp, max_xp)
- `tactic_focus_tags` (e.g. `["forks", "safety_checks"]`)

---

## 4. Season Spec

A **Season** is a time-bound training arc (e.g. 4 weeks) that maps content to a calendar.

**Minimum fields:**

- `season_id` (string)
- `slug` (string, e.g. `"founding-season-01"`)
- `title` (string)
- `tagline` (short phrase)
- `start_date` (date, optional – some seasons are template-only)
- `end_date` (date, optional)
- `recommended_entry_level` (e.g. `"Novice"` or XP range)
- `target_outcome_level` (e.g. `"Knight"` or `"Bishop"`)
- `weeks` (array of `SeasonWeek` objects)

**SeasonWeek spec:**

- `week_index` (1–N)
- `theme` (string)
- `missions` (array of `SeasonMission`)

**SeasonMission spec (protocol-level):**

- `mission_id` (string)
- `title` (string)
- `description` (short text shown to players)
- `required_lessons` (list of `lesson_id` or `lesson_slug`)
- `required_puzzle_packs` (list of `pack_id`)
- `xp_target` (int, soft target)
- `is_core` (bool – core vs optional)

> `SEASON_01_PLAN.md` is effectively Season 01's instance of this spec. Over time, we can convert that plan into a structured Season object.

---

## 5. Club Spec

A **Club** is a group of players going through a Season together.

**Minimum fields:**

- `club_id` (string)
- `name` (string, e.g. `"Chessio International Club – Founding Season 01"`)
- `season_id` (string – which Season this club is running)
- `timezone` (IANA)
- `communication_channel` (enum: `discord`, `whatsapp`, `slack`, `other`)
- `communication_link` (URL or invite link)
- `max_members` (int)
- `coach_user_id` (string – primary coach)
- `start_date` (date)
- `end_date` (date)

**Optional / later:**

- `description` (text)
- `language` (e.g. `"en"`)
- `status` (enum: `planned`, `active`, `completed`, `archived`)
- `co_coaches` (list of user ids)

---

## 6. Roles & Reputation (Protocol-Level)

Roles are conceptual and can be implemented via permissions / tags in the app or Discord.

**Core roles:**

1. `player`
   - Any registered user using Chessio.

2. `member`
   - A player who has joined a specific club/season.

3. `season_completer`
   - A member who completed a defined minimum threshold of missions for a season (e.g. 80%+ core missions).

4. `helper`
   - A season_completer invited to:
     - Welcome new members
     - Answer basic questions
     - Share reflections

5. `coach`
   - A trusted user allowed to:
     - Run clubs
     - Assign missions from a Season
     - Possibly create new Seasons (later)

6. `admin`
   - You (and trusted core) with full control.

**Reputation principles:**

- Promotions are **manual and curated** at first.
- Criteria can be:
  - Completed seasons
  - Positive presence in chat
  - Quality feedback
- No public "score" yet – reputation is mostly used to decide who can help / coach.

---

## 7. Growth Loops (Self-Growing Mechanisms)

These loops define how the ecosystem can grow without Mahmood doing everything.

### 7.1 Student → Member → Helper → Coach

1. **Student:** Joins a season as a regular member.
2. **Member:** Shows up, completes missions.
3. **Season Completer:** Finishes most of a season.
4. **Helper:** Invited by coach/admin to help future cohorts.
5. **Coach:** Over time, the best helpers are trusted to run their own small clubs/seasons.

> Protocol note: The system tracks which seasons a user has completed and in which clubs they've helped. This becomes the "reputation layer" later.

---

### 7.2 Coach-Driven Seasons

Future path (post–Season 01):

- Admin defines Season templates using the **Season spec**.
- Trusted coaches:
  - Pick a Season template.
  - Spin up a new Club with that Season.
  - Run it with their own 5–20 students.
- Chessio (the app) provides:
  - Content
  - XP rules
  - Progress tracking
  - "Today's Goal" and retention layer

> Over time, Chessio becomes the engine for multiple clubs, not just the founding one.

---

### 7.3 Content Contribution (Later)

Much later, when stable:

1. Admin defines rules for **puzzle pack contributions**:
   - Use Puzzle spec.
   - Submit as JSON or via internal tool.
2. Trusted contributors (coaches/helpers):
   - Propose new packs.
3. Admin:
   - Reviews and approves.
4. Protocol:
   - Tracks completions, fail rates, and fun.
   - High-performing packs become "official".

---

## 8. Invariants & Constraints

These are **rules that must not be broken**, no matter how the system evolves.

1. **XP Reflects Effort, Not Payment**
   - XP comes from lessons/puzzles/real engagement.
   - No pay-to-win or pure financial XP sources.

2. **Beginner-Safe Defaults**
   - No "public shaming" stats.
   - Club/season stats can be aggregated but not used to ridicule.

3. **No Open UGC for Beginners (Yet)**
   - Early-stage users only see curated content.
   - Contribution and creation are *earned* privileges.

4. **Privacy**
   - Session and progression data are used for:
     - Personal feedback
     - Aggregate improvements
   - Never for public humiliation.

5. **No Tokens / Speculation Layer**
   - Protocol is about learning + community.
   - Any future monetization is simple and explicit (subscriptions, etc.), not speculative.

---

## 9. Roadmap & Phased Adoption

This protocol is **not** to be implemented all at once. It guides the evolution.

### Phase 0 – Now (Season 01 prep & run)

- Chessio stays as a relatively "single-club" implementation.
- Protocol lives mostly as documentation (this file + Season 01 docs).
- Goal: Learn from Season 01, not build a network.

### Phase 1 – Model Seasons Explicitly

- Represent Season 01 as a `Season` object in the codebase (even if internal).
- Keep using a single club (Chessio International Club).
- Start tracking:
  - Which users "completed" the season.

### Phase 2 – Roles & Helpers

- Introduce:
  - `season_completer` and `helper` labels.
- Allow helpers to:
  - Welcome users.
  - Suggest improvements.
- Still 1–2 clubs max.

### Phase 3 – Multiple Clubs (Limited)

- Allow a small number of trusted coaches to:
  - Run their own cohorts using existing Seasons.
- Still admin-approved; not fully open.

### Phase 4 – Content Contribution (Curated)

- Open puzzle pack contributions to selected coaches/helpers.
- Admin review and approval pipeline.

Each phase must be:

- Triggered by **real demand** (members/coaches asking).
- Informed by:
  - Debriefs (e.g. `SEASON_01_DEBRIEF_TEMPLATE.md`)
  - Telemetry + qualitative feedback.

---

## 10. Notes & Open Questions

To be answered **after** Season 01:

1. Do players actually want **more seasons**, or deeper basic content first?
2. Are coaches (or would-be coaches) asking for:
   - Better tools?
   - More analytics?
   - More flexible season design?
3. What is the smallest, safest step toward:
   - Multiple clubs?
   - Coach-driven seasons?
   - Community-created puzzle packs?

These answers will decide whether the protocol moves into **Phase 1** or stays as a guiding document while Chessio focuses on depth and polish.

---

**Summary:**  
This protocol defines how Chessio can gradually evolve from a single, centrally-designed beginner app into a **network of seasons, clubs, and coaches**, built on shared specs and calm, beginner-safe principles – without jumping prematurely into decentralization or complexity.
