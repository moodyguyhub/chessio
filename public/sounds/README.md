# Chessio Sound Assets

This folder contains audio files for the Academy soundscape.

## File Inventory

### UI Sound Effects
- `ui-click.mp3` - Subtle click for primary CTAs
- `move-soft.mp3` - Soft piece movement sound

### Feedback Chimes
- `correct-chime.mp3` - Affirmative tone for correct answers
- `error-thud.mp3` - Low, non-judgmental tone for errors

### Progress Sounds
- `level-up.mp3` - Level/lesson completion celebration

### Coach Voice Lines (Russian School tone)
- `coach-line-foundation.mp3` - Placement test pass / foundation established
- `coach-line-promotion.mp3` - Level promotion / achievement unlocked

## Placeholder Status

Currently using **silent placeholder files** (tiny size).

Mahmood will replace these with:
- AI-generated voice lines (Russian School coach tone)
- Custom sound design matching cathedral atmosphere
- Professional audio mixing (normalized, no clipping)

## Technical Specs

**Target:**
- Format: `.mp3` (wide browser support)
- Sample rate: 44.1kHz
- Bit rate: 128kbps (balance quality/size)
- Duration: 
  - UI FX: <500ms
  - Voice lines: 2-5 seconds
  - Level-up: 1-2 seconds

**Volume Guidelines:**
- Mix at -6dB headroom
- Voice lines slightly quieter than FX (handled in code)
- No distortion or clipping

## Usage

Sounds are loaded via `src/lib/sound/soundscape.ts` and played through `SoundProvider`.

See `src/lib/sound/README.md` for integration details.
