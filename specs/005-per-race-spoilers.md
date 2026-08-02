# Spec 005 — Per-Race Spoiler Blocks

## Goal

Replace the single section-level spoiler banner with individual spoiler blocks per race result. The user can reveal one race's results without exposing any other race.

---

## What the user sees

### Current behavior (Spec 002)

- Homepage "Results today" section: entire `ul.hp2-results` is hidden behind one banner
- One "Reveal Spoilers" button reveals all races at once

### New behavior

- Each `li.race` inside `ul.hp2-results` gets its own inline spoiler overlay
- The race name remains visible in the overlay so the user knows which race it is
- "Reveal" button per race — revealing one does not affect any other
- Section-level banner is removed; per-race overlays replace it entirely
- Persistence: each revealed race is remembered for the calendar day; re-visiting the page doesn't re-hide races the user already revealed

---

## DOM structure (confirmed)

```
ul.hp2-results
  li.race                         ← one per race result
    [race name link, stage info]
    [result rows — the spoiler content]
    [a.goto-race buttons: VIEW RESULTS, GC, LIVESTATS]
  li.race
  ...
```

The race identifier for storage is derived from the first `a.goto-race` `href` inside the `li.race`, which contains the race slug (e.g. `/race/tour-de-france/2026/stage-1/result`). Fallback: `li.race` index within the list if no `a.goto-race` found.

---

## File changes

### `src/content/index.ts`

- Remove `createBanner()`, `reveal()`, `applyBlock()` (section-level logic)
- Add `blockRaces()` — iterates `li.race` elements, injects per-race overlay
- Add `revealRace(li, overlay, key)` — shows hidden content, removes overlay, saves to storage
- Add `getRaceKey(li)` — derives storage key from `a.goto-race` href or fallback index
- Restore persistence: `storageKey()` (today's ISO date), `chrome.storage.local` read on load + write on reveal
- Revert `RESULTS_HEADING_TEXTS` to `['Results today']` only
- `injectPreHideStyle()` updated: hide `li.race` content (not the whole `ul`)

### Overlay design

Compact inline overlay injected as `position: absolute` child over each `li.race` (or `li.race` set to `position: relative`). Shows:

- Spoiler icon (eye-slash SVG, smaller than section banner)
- Race name text (extracted from `li.race`, so user knows what's hidden)
- "Reveal" button

CSS classes: `pcs-sb-race-overlay`, `pcs-sb-race-icon`, `pcs-sb-race-name`, `pcs-sb-race-btn` — all prefixed, no conflicts with PCS styles.

### `src/content/index.ts` — no other files change

The banner CSS (`pcs-sb-banner`, `pcs-sb-heading`, etc.) can be kept or replaced with the new per-race overlay CSS. Old section-banner classes should be removed to avoid dead code.

---

## Key decisions

- **Race key**: derived from `a.goto-race` href trimmed to the race path (without `/result`, `/gc` suffix) — stable across page loads. If no `a.goto-race` exists, use `li.race` position index (less stable but acceptable fallback).
- **Storage schema**: same as current — `{ 'pcs-revealed-YYYY-MM-DD': { [raceKey]: true } }`. No migration needed — old schema stored a single boolean, new schema stores a map of keys. Daily key means yesterday's reveals auto-expire.
- **No "Reveal All"**: removing the section banner removes the only "Reveal All" entry point. This is intentional — the per-race design is the feature.
- **Race name extraction**: use the first `a` inside `li.race` that links to a race page (not a `goto-race` button). If extraction fails, show generic "Race result hidden".
- **`li.race` positioning**: `li.race` may not have `position: relative` — add it via injected style so overlay can use `position: absolute`.

---

## Acceptance criteria

1. Each `li.race` on the "Results today" section is individually hidden behind its own overlay on page load
2. Overlay shows the race name so the user knows which race is hidden
3. Clicking "Reveal" on one race shows only that race; all others remain hidden
4. Revealed races persist across page reloads for the same calendar day
5. Next-day page load hides all races again (daily reset via date-keyed storage)
6. Theme off restores original PCS appearance (overlays removed, `li.race` content visible)
7. No regression on existing dark theme for `ul.hp2-results` styles
8. No regression on non-homepage pages

---

## Out of scope

- Spoiler blocks on race result pages (not homepage)
- "Results yesterday" section (keep `RESULTS_HEADING_TEXTS = ['Results today']`)
- GC classification results (separate `li` types, not `li.race`)
- Mobile layout
