# Chessio Activity Mix Blueprint (v1)

**Purpose:**  
We keep the ladder at 20 levels. We make it powerful by varying the *activity type* per theme instead of adding more levels.

---

## 1. Fixed Structure

- Total levels: **20** (hard cap).
- Tiers:
  - 0–3 → **Chessio School (Learn to Play)**
  - 4–9 → **Chessio Club (Learn to Win)**
  - 10–20 → **Chessio College (Master the Game)**

We do **not** add more levels. Future growth = new modes, seasons, or side paths, not Level 21+.

---

## 2. Activity Mix by Theme

Each level has a theme (tactics, safety, endgame, opening, strategy, mixed).  
The *interaction* changes based on that theme.

### 2.1 Tactics Levels (e.g. 4, 6, 8, 10, 11)

**Goal:** Pattern recognition + speed.

**Best mechanic:**  
- **Puzzle streaks** or **light time pressure.**

**Examples:**
- "Solve 5 mate-in-1s in under 2 minutes."
- "Solve 5 puzzles in a row with 0 mistakes."

**Why:**  
Tactics = *instinct*. We're training the eye, not doing deep theory.

---

### 2.2 Safety Levels (e.g. 5, 12)

**Goal:** Build the habit of checking for blunders.

**Best mechanic:**  
- **Survival/"one strike and you're out".**

**Examples:**
- "Here is a position. Find the only move that doesn't lose material."
- If user plays a blunder (hangs a piece) → immediate fail → restart.

**Why:**  
Below ~1000 Elo, most games are lost by simple blunders.  
Safety is a *habit loop*, not a flex.

> **Level 5 ("Stop Hanging Pieces") is the most important level in the entire app.**

---

### 2.3 Endgame Levels (e.g. 13, 14, 16)

**Goal:** Technique in won/drawn positions.

**Best mechanic:**  
- **Scenario vs Bot** (short "sparring", not full games).

**Examples:**
- King + pawn vs king: play White vs bot and promote.
- Simple rook ending: your rook + pawn vs rook; hold a draw or convert.

**Why:**  
Endgames often have many winning moves; "single correct puzzle" is awkward.  
Playing the position vs a bot is the cleanest way to learn technique.

---

### 2.4 Opening Levels (e.g. 15, 17)

**Goal:** Principles, not memorization.

**Best mechanic:**  
- **Move guesser / multiple choice.**

**Examples:**
- "Which move follows opening rules here?" (center / development / castling).
- "Which move fixes the bad opening blunder?"

**Why:**  
We care about habits ("don't drag the queen out on move 2"), not lines.

---

### 2.5 Strategy Levels (e.g. 18, 19, 20)

**Goal:** Learn to think in plans and evaluations.

**Best mechanic:**  
- **Position evaluation + plan choice.**

**Examples:**
- "Who is better here and why?" (multiple choice).
- "What is the best plan? (improve worst piece / pawn break / attack king)."

**Why:**  
Strategy is fuzzy. We want **guided thinking**, not engine lines.

---

### 2.6 Mixed / Boss Levels (e.g. 3, 9, 20)

**Goal:** Gatekeepers between tiers.

**Ideas:**
- Level 3 (School Boss):
  - Full or partial game vs weak bot. Survive X moves or reach a simple goal.
- Level 9 (Club Championship):
  - Mixed-puzzle gauntlet (forks, pins, mates, safety checks).  
    Example: 10 puzzles → must get 8/10.
- Level 20 (College Final):
  - "Strategic Sparring": start from a winning position vs stronger bot; convert the win.

---

## 3. Bot Design Principle

We do **not** want generic "Easy/Medium/Hard bot" as the main experience.

Instead, we use **Scenario Bots**:

- Each scenario starts from a **mid-game/endgame position**, not move 1.
- Each scenario is tied to a level theme:
  - Pins level → position where user has a powerful pin; "finish game vs bot".
  - Good vs bad pieces → position where user's knight is great and opponent's bishop is bad; "prove the knight is better".

Typical session length: **3–5 minutes**, not full 20-minute games.

---

## 4. Implementation Notes (Future)

We **don't** need these features in the code now. For now:

- Ship:
  - `levels` config (0–20 with tiers).
  - `curriculum.ts` with `theme`, `title`, `description`, `xpThreshold`.

Later, when adding content:

- Add an `activityType` field per level if needed, e.g.:

  ```ts
  type ActivityType =
    | "puzzle_streak"
    | "survival"
    | "scenario_bot"
    | "move_guesser"
    | "evaluation";

  interface LevelCurriculum {
    id: number;
    title: string;
    description: string;
    theme: LevelTheme;
    xpThreshold: number;
    activityType?: ActivityType; // optional, for content engine
  }
  ```

- Map `theme → default activityType` (can be overridden per level):

  - tactics → `puzzle_streak`
  - safety → `survival`
  - opening → `move_guesser`
  - endgame → `scenario_bot`
  - strategy → `evaluation`
  - mixed → any of the above (boss fights, gauntlets, etc.)

**Current Sprint:**
Only the **data model** (curriculum & tiers) ships.
All these mechanics are for Level 4+ content sprints.

---

## 5. Key Design Decisions

### ✅ 20 levels is enough
- Feels *completable*, not endless
- Keeps difficulty steps smooth without "Knight moves → Knight forks" jumps

### ❌ Don't add more levels
- Future growth = new modes, seasons, side paths
- Not Level 21+

### 🧠 Make the activities smarter, not the ladder longer
- Effectiveness lever = Activity Mix, not More Levels
- Tactics → speed & pattern recognition
- Safety → high-stakes blunder avoidance
- Endgames → bot scenarios, not single-answer puzzles
- Strategy → evaluation + plan questions

---

## 6. Implementation Status

**COMPLETED:**
- ✅ Tier structure (School 0-3, Club 4-9, College 10-20)
- ✅ Level metadata scaffolding (0-20)
- ✅ Tier progression card UI
- ✅ Graduation flow (modals ready for Level 3→4 transition)

**FUTURE (Level 4+ Content Sprints):**
- ⏳ Activity type implementation per theme
- ⏳ Puzzle streak mechanics
- ⏳ Survival mode for safety levels
- ⏳ Scenario bot integration
- ⏳ Move guesser / evaluation UI

---

## 7. Note to Future Vega

> The curriculum and tier system are final.  
> Please **do not add any more levels beyond 20**.  
> `curriculum.ts` is purely metadata for now; we will add `activityType` and scenario/bot mechanics in a later sprint when we start building Level 4+ content.

For now: **ship the JSON + tier scaffolding.**  
The "fun" lives in *how we use puzzles / challenges / bots per theme*, which we'll do when we actually build Level 4+.
