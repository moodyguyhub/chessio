# Chessio Design Identity – Brand v1.1

**Last updated:** December 6, 2025  
**Status:** Locked for Alpha

---

## 1. Overview

Chessio is a calm, focused chess learning platform for complete beginners. The brand identity reflects:

- **Classic, timeless aesthetic** – inspired by physical chess sets (ivory + ebony)
- **Warm, approachable tone** – no harsh colors, no pressure
- **Clear visual hierarchy** – neutral base + warm amber accents for guidance

This document defines the visual language for Chessio UI. For typography, copy patterns, and component usage, see related docs in `/design`.

---

## 2. Visual System – Color (Ink & Ivory v1.1)

Chessio's colors are inspired by a classic chess set: ink-black, ivory, and a hint of warm gold.  
NO teal/cyan here – those belong to Finura, not Chessio.

### 2.1 Neutrals (Base)

Use Tailwind **neutral/stone** scale, not slate.

- App background (root): `bg-neutral-950`
- Elevated cards / panels: `bg-neutral-900`
- Soft surfaces: `bg-neutral-900/80` or `bg-neutral-800/70`
- Borders: `border-neutral-800`
- Primary text: `text-neutral-50`
- Muted text: `text-neutral-400` / `text-neutral-500`

### 2.2 Board Colors

The board should feel like **ivory + dark wood**, not neon.

- Light squares: `bg-stone-100` (ivory)
- Dark squares: `bg-stone-700` or `bg-neutral-800` (dark wood/ebony)
- Board frame / card: `bg-neutral-900 border border-neutral-800 rounded-2xl`
- Highlights:
  - Selected / last move: `ring-2 ring-amber-300 ring-offset-2 ring-offset-neutral-900`
  - Optional fill: `bg-amber-300/15` (very subtle)

### 2.3 Accents (Progress & Guidance)

Chessio uses **warm amber** as the main accent – think chess clocks, not gaming neon.

- Primary CTAs:
  - `bg-amber-300 text-neutral-950 hover:bg-amber-200`
- XP bar fill:
  - `bg-amber-400`
- "Today's Goal" and focus accents:
  - `border-amber-400 bg-amber-500/10 text-amber-200`
- Success:
  - `text-emerald-400 bg-emerald-500/10` (used sparingly)
- Error:
  - `text-rose-400 bg-rose-500/10` (only for actual errors)

### 2.4 Forbidden Colors

- No teal/cyan as primary accents (reserved for Finura / fintech).
- No indigo/purple glows.
- No bright gradients; only very subtle radial glows if needed.

---

## 3. Typography

- **Families:**
  - Headings: Nunito (via `font-[family-name:var(--font-nunito)]`)
  - Body: Inter (default)
- **Weights:**
  - Use `font-semibold` (600) or `font-medium` (500) only
  - Never `font-bold` (700)
- **Letter spacing:**
  - Always `tracking-tight` for headings and buttons
  - Default tracking for body text

---

## 4. Spacing & Radii

- **Card corners:** `rounded-2xl` (16px)
- **Modal corners:** `rounded-3xl` (24px)
- **Button corners:** `rounded-full` for primary CTAs
- **Shadows:** `shadow-lg` max; no heavy glows

---

## 5. Copy Voice

From `src/lib/copyPatterns.ts`:

- Calm, supportive, never pressuring
- Avoid exclamation marks except for major celebrations
- Use "you" and "your" to personalize
- Examples:
  - ✅ "Learn chess calmly. One confident move at a time."
  - ✅ "You're doing great. Keep going."
  - ❌ "Master chess FAST!!!"

---

## v1.1 Color Changelog (for future us)

- Switched base palette from **slate + teal** to **neutral/stone + amber**:
  - `bg-slate-950` → `bg-neutral-950`
  - `bg-slate-900` → `bg-neutral-900`
  - `border-slate-800` → `border-neutral-800`
  - Primary CTAs: `bg-teal-500` → `bg-amber-300`
- Board styling now mirrors a real set:
  - Light squares: `stone-100`
  - Dark squares: `stone-700` / `neutral-800`
- Teal is **explicitly disallowed** in Chessio UI to avoid overlap with Finura.

---

## Maintenance Notes

- This doc is **locked for Alpha** – no palette changes without team discussion
- For component implementation details, see `src/components/ui/README.md`
- For copy patterns, see `src/lib/copyPatterns.ts`
