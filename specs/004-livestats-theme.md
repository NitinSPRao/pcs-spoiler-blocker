# Spec 004 — LiveStats Page Theming

## Goal

Extend the PCS Dark theme to cover the LiveStats page (`/race/*/live`) and the homepage LiveStats widget. Currently the livestats race cards on the homepage have a cream/light background, and the elevation profile charts on the livestats page have a white canvas background that breaks the dark theme.

---

## What the user sees

### Homepage LiveStats widget

- Race cards: currently cream/yellowish background (`~#f0f4e8`), need dark surface
- Everything else (header, LIVE badge, km badge) already dark

### LiveStats page (`/race/*/live`)

- **Stage profile chart** (main elevation SVG): white/cream canvas background — needs dark bg
- **Detail profile** section box: white container background
- **"VIEW KEYPOINTS TABLE"** button: light background, dark text
- Main page layout (Timeline, Situation panel, tables): already mostly dark — minor polish only

---

## File changes

- `src/themes/dark.ts` — add new CSS section `── LIVESTATS PAGE`
- `docs/theme-runbook.md` — add confirmed selectors after DOM inspection

Selectors will be determined via DevTools inspection before writing any CSS. No guessing.

---

## Key decisions

- Stage profile SVG background: attempt CSS `background` override on the SVG container. If the SVG uses inline `fill` attributes for the white area, CSS cannot override those — document as known limitation.
- Chart canvas/SVG elements rendered by JavaScript (e.g. canvas tags) cannot be styled with CSS. If the profile is a `<canvas>`, theming is out of scope for this spec.
- Preserve all chart line colors, elevation fill (green gradient), and rider position markers — do not touch SVG path fills.

---

## Acceptance criteria

1. Homepage LiveStats race cards have dark surface background matching `--pcs-surface` (`#252d3a`)
2. Livestats page elevation profile chart container has dark background (no white flash)
3. "Detail profile" section container has dark background
4. "VIEW KEYPOINTS TABLE" button styled: dark surface, themed border, gold on hover
5. All existing dark elements (Timeline, Situation, tables) remain unaffected
6. Theme off restores original PCS appearance exactly

---

## Out of scope

- Livestats data tables already themed via global `table`/`th`/`td` rules — no changes needed
- Chart line/fill colors (elevation green, rider markers) — preserve as-is
- Canvas-rendered elements — cannot be CSS-themed
- Mobile/responsive layout
