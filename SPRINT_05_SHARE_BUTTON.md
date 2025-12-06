# Share Button Feature – Sprint 05 Micro-Feature

**Status:** Parked (ready to implement post-Season 01)  
**Effort:** 1 sprint atom (~30-60 min)  
**Priority:** Low (retention enhancer, not critical path)

---

## Goal

Make it easy for happy users to invite a friend, with zero friction and no referral complexity.

---

## Scope (v1)

- Add a small `Share Chessio` button on the dashboard header (desktop + mobile).
- On click:
  1. Try `navigator.share` with:
     - title: "Chessio – calm chess training"
     - text: "I've been using Chessio to learn chess in a calm, beginner-friendly way. Try it here:"
     - url: "https://chessio.io"
  2. If `navigator.share` is not available:
     - Copy `"https://chessio.io"` to clipboard.
     - Show toast: `"Link copied – share it with a friend ✨"`.

---

## Telemetry

- Event: `share_clicked`
  - Properties: `{ userId, timestamp, method: "navigator" | "clipboard" }`

---

## Non-goals

- No referral codes
- No share of specific lessons/puzzles
- No social network–specific buttons

---

## Implementation

### A. Reusable Button Component

Create `src/components/ui/ShareButton.tsx`:

```tsx
"use client";

import { useState } from "react";
// import { trackRetentionEvent } from "@/lib/telemetry"; // if you want telemetry

export function ShareButton() {
  const [isCopying, setIsCopying] = useState(false);
  const appUrl = "https://chessio.io";

  async function handleShare() {
    // trackRetentionEvent("share_clicked", { method: "unknown" });

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Chessio – calm chess training",
          text: "I've been using Chessio to learn chess in a calm, beginner-friendly way. Try it here:",
          url: appUrl,
        });
        // trackRetentionEvent("share_clicked", { method: "navigator" });
        return;
      } catch {
        // user cancelled – silently ignore
      }
    }

    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(appUrl);
      // trackRetentionEvent("share_clicked", { method: "clipboard" });
      setTimeout(() => setIsCopying(false), 1500);
    } catch {
      setIsCopying(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
    >
      <span>Share Chessio</span>
      <span className="text-sm">📨</span>
      {isCopying && <span className="ml-1 text-[10px] opacity-75">Copied ✨</span>}
    </button>
  );
}
```

### B. Integrate into Dashboard Header

In `src/app/(protected)/app/page.tsx`, add to the header right-side controls:

```tsx
import { ShareButton } from "@/components/ui/ShareButton";

{/* Header right section - existing XP display area */}
<div className="flex items-center gap-4">
  {/* ... existing XP / sessions / level display ... */}
  <ShareButton />
  {/* ... Sign Out button ... */}
</div>
```

**Suggested placement:** Between XP display and Sign Out button.

---

## Testing Checklist

- [ ] Button appears on dashboard (desktop + mobile)
- [ ] Click on mobile → `navigator.share` sheet appears (iOS/Android)
- [ ] Click on desktop → URL copied to clipboard + "Copied ✨" shows briefly
- [ ] Share sheet includes correct title, text, and URL
- [ ] Telemetry event fires correctly (if implemented)
- [ ] Button styling matches Ink & Ivory design system
- [ ] Button works in dark mode

---

## Notes

- This is a **retention enhancer**, not a growth engine. Don't overthink it.
- No referral tracking needed for v1. If successful, can add UTM params later.
- Mobile-first design: `navigator.share` is the primary UX, clipboard is fallback.
- Calm positioning: "Share with a friend" not "Invite 10 people for rewards".

---

**Decision Point (Post-Season 01):**

After Season 01 debrief, decide:
- ✅ Implement if: Members are asking "how do I share this?" or verbally recommending Chessio
- ❌ Skip if: No organic word-of-mouth happening yet (focus on product depth first)
