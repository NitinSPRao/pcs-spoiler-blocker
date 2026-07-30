# Theme Creation Runbook

How to add a new theme to PCS Spoiler Blocker. Follow every section — skipping steps causes visual regressions.

---

## 1. Understand the token system

Every theme uses the same semantic token names. Map your palette to these before writing any CSS:

| Token | Role | PCS Dark value |
|---|---|---|
| `--pcs-bg` | Page background | `#1a2030` |
| `--pcs-surface` | Cards, panels, nav | `#252d3a` |
| `--pcs-surface2` | Elevated, alt rows | `#2d3748` |
| `--pcs-border` | Borders, dividers | `#3a4556` |
| `--pcs-gold` | Primary accent | `#e8b400` |
| `--pcs-gold-dim` | Secondary accent | `#a07c00` |
| `--pcs-text` | Primary text | `#e8edf3` |
| `--pcs-text-dim` | Secondary, metadata | `#8896a8` |
| `--pcs-red` | DNF, abandon, negative | `#e05252` |
| `--pcs-green` | Positive delta, gain | `#52c27a` |

Choose your palette against these roles, not arbitrary colors.

---

## 2. Create the theme file

```
src/themes/<name>.ts
```

Export one constant — the full CSS string:

```typescript
export const <NAME>_THEME_CSS = `
  /* your CSS here */
`
```

### Required CSS sections (must cover all):

| Section | Key selectors |
|---|---|
| Base | `body` (bg, color, font-family) |
| Layout containers | `.wrapper`, `.page`, `#main`, `.cont`, `div[class*="cont"]` |
| Navigation | `ul.topnav`, `ul.topnav li a`, dropdowns |
| Section headers | `.h4bar`, `.h4bar h4` |
| Headings | `h1, h2, h3, h4, h5` |
| Tables | `table`, `tr`, `th`, `td`, `thead`, alternating rows, hover, rank-1 row. Must include `tr { border-color }` — table rows have their own borders independent of `td`. |
| Links | `a`, `a:hover`, `a:visited`, `.ridername a`, `.team a` |
| Data cells | `.ar`, `.rnk`, `.time`, `.gap`, `td:first-child` |
| Status classes | `.dnf`, `.dns`, `.otl` |
| Homepage popularity bars | `div.valuebar` (container bg), `div.bg.orange` / `div.bg.yellow` / `div.bg.green` (bar fills), `.valuebar .title` (number label). Do NOT override `div.bg.red` — used for team-specific jersey colors. |
| Rider specialty bars | Different classes from homepage bars. Structure: `li > div.xbar > div.valuebar > div.bg.[color].left` + `div.xvalue` (number) + `div.xtitle > a` (label). Color classes: `green2` (Onedayraces), `red` (GC), `blue` (TT), `orange` (Sprint — shared with homepage), `purple1` (Climber), `pink` (Hills). Also style `.xvalue` (number color), `.xtitle a` (label link), and `li:has(.xbar) { border-color }` (row separators — these `li` borders are white by default and must be explicitly overridden). **Note:** `div.bg.red` is confirmed used for the GC specialty bar. Whether it also appears on team pages (jersey colors) has not been inspected — verify on `/team/*` pages if regressions appear. |
| Homepage results | `ul.hp2-results`, `li.race`, `li.race a span` (stage subtitle — has inline `style="color:#1f8acc"`, needs explicit override) |
| Homepage games widget | `ul.hp-games li div a` (pill background `#DAE8ED` is on the `a` tag, not `div` or `li` — must override background on `a`). Also override `color` and `text-decoration` on `a`. |
| Result card buttons | `a.goto-race` (View Results, GC buttons), `a.goto-race.livestats` (LiveStats button — different color). Set `display:inline-block`, `text-decoration:none`, border on hover. |
| Homepage LiveStats widget | `ul.hp3-livestats li` — frame each card with `border #3a4556`, `border-radius`, `overflow:hidden`. Keep original card bg (cream/light) and chart colors — do NOT override `li a` background. Fix fonts on `span.title`, `span.status`, `div.togo`, `div.situ_txt` (all Barlow Condensed). |
| LiveStats page — profile chart | Structure: `div[position:absolute;bottom:0]` (no class) > `.profileBG.profileWrapper.xyProfileCont` > `.kmdone.profilePerc` (progress bar, inline width%) + `.xyProfile` (clip-path polygon for elevation silhouette) + SVG. `.profileWrapper` has inline `background: yellowgreen` — this IS the chart design (base color shows through clip-path as progress/remaining). **Do NOT override `.profileWrapper` background** — kills the progress bar. **Approach: border frame only** — `border-top: 2px solid gold`, sides/bottom `#3a4556`, `border-radius`, `overflow: hidden`. No padding, no bg override. |
| LiveStats page — detail profile | `div.detailProfileCont` (outer). Same card-frame approach as profile chart. `.detailProfile` (inner SVG) left natural. Wrapping `div` has inline `border: 1px solid #ddd` — override with `.detailProfileCont > div { border-color }`. |
| LiveStats page — stats row + profile unified card | Common ancestor has no class/id. **Split-card workaround:** `ul.ls5b-kpi` = top half (`background: #ffffff` matching `.xyProfile` computed bg, dark text on spans/divs, sides+top border, `border-radius: 4px 4px 0 0`, no bottom border); `.profileWrapper` = bottom half (sides+bottom border, `border-radius: 0 0 4px 4px`, no top border). Chart bg confirmed `rgb(255,255,255)` via computed style. Span labels: `color: #5a6070`, Barlow Condensed, uppercase. Div values: `color: #1a2030`, bold. |
| LiveStats page — keypoints button | `a.viewKeypoints` (plain anchor, no button tag). Style as block with dark surface. |
| Rider season nav | `ul.rdrSeasonNav li a.rdrFilterSeason` (year pills), `ul.rdrSeasonNav li.cur a.rdrFilterSeason` (active year — `cur` on parent `li`). |
| Rider sort/filter buttons | `a.rdrFilterSort` (DATE / RESULT / PCS POINTS), `a.rdrFilterFilter` (NO FILTER / CLIMBER / HILLS / SPRINTS / TIME TRIALS / CLASSICS). No active-state class exists on these — PCS does not mark the selected sort/filter. |
| Buttons | `.btn`, `button`, `input[type=submit]`, `li.follow-up a` (widget footer buttons: "PCS Ranking", "Popular Riders", etc) |
| Sidebar/panels | `.sidebar`, `.right-bar`, `aside` |
| Forms/inputs | `input[type=text]`, `select`, `textarea` |
| Scrollbar | `::-webkit-scrollbar*` |

### Font loading

Do **not** use `@import` inside the CSS string — it is unreliable in dynamically injected `<style>` tags. Register fonts in `injectTheme()` via a `<link>` element instead (see step 4).

### Specificity

Use `!important` on every rule. PCS uses inline styles and high-specificity selectors that will win otherwise.

---

## 3. Inspect before guessing

Before writing selectors for any PCS element type, inspect the live DOM:

```js
// Find element containing specific text
[...document.querySelectorAll('*')]
  .filter(e => e.childElementCount === 0 && e.textContent.trim() === 'TARGET TEXT')
  .map(e => e.tagName + ' class="' + e.className + '"')

// Check what class an element uses
document.querySelector('.suspected-class')?.outerHTML.slice(0, 300)

// Find next sibling of a known element
document.querySelector('KNOWN_SELECTOR').nextElementSibling?.outerHTML.slice(0, 200)
```

Never write a CSS rule for a PCS element you haven't confirmed in DevTools. Broad guesses pollute the stylesheet and break unintended elements.

---

## 4. Register the theme in theme.ts

`src/content/theme.ts` currently hardcodes `DARK_THEME_CSS`. When multiple themes exist, this becomes a lookup:

```typescript
import { DARK_THEME_CSS } from '../themes/dark'
// import { LIGHT_THEME_CSS } from '../themes/light'  // future

const THEMES: Record<string, string> = {
  dark: DARK_THEME_CSS,
  // light: LIGHT_THEME_CSS,
}
```

For each theme that needs a non-system font, inject a `<link>` in `injectTheme()` (not in the CSS string):

```typescript
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://fonts.googleapis.com/css2?family=YourFont&display=swap'
document.head.appendChild(link)
```

---

## 5. Add the theme to the popup

`src/popup/popup.ts` and `public/popup/popup.html` need a UI entry for the new theme.

Current pattern: single toggle for "PCS Dark". When adding a second theme:
- Change the toggle to a radio group or select
- Store selected theme name in `chrome.storage.local['pcs-theme-name']`
- Update `theme.ts` to read theme name and inject the right CSS string

---

## 6. Visual QA checklist

Test on each page type before shipping. Toggle theme on and off on each — off must restore to exactly the original PCS look.

| Page | URL pattern | Key elements to check |
|---|---|---|
| Homepage | `/` | h4bar headers, result lists, ranking widget bars, nav |
| Race result | `/race/*/result` | result table, rank 1 row, rider links, time column |
| Stage result | `/race/*/stage-*/result` | same as race result + GC table |
| Rider profile | `/rider/*` | rider stats table, palmares list, team links |
| Team page | `/team/*` | roster table, team header |
| Rankings | `/rankings/*` | ranking bars, name links, table headers |
| Startlist | `/race/*/startlist` | bib numbers, team groupings |
| Search results | `/search?*` | result list items |
| Livestats | `/race/*/live` | **out of scope until Spec 004** |

### Per-element checks

- [ ] Body background is themed (no white flash)
- [ ] Nav links readable and hoverable
- [ ] h4bar headers: dark bg, gold left border, white text
- [ ] Tables: alternating rows visible, rank 1 has gold left border, no white row separators
- [ ] Rider names: gold, readable on all backgrounds
- [ ] Team names: muted, distinct from rider names
- [ ] Homepage popularity bars (`div.bg.orange/yellow/green`): solid fill, dark text readable
- [ ] Rider specialty bars (`div.bg.green2/blue/purple1/pink/orange`): all six specialties have correct color, `.xvalue` number readable, `.xtitle a` label visible
- [ ] GC bar (`div.bg.red`): darker red — check team pages for jersey color regressions
- [ ] Homepage result cards: `a.goto-race` buttons styled (dark surface, gold border on hover), `a.goto-race.livestats` green variant
- [ ] Stage subtitle link (inline cyan `#1f8acc`): overridden to gold
- [ ] Soon-closing games widget (`ul.hp-games`): themed, links readable
- [ ] Widget footer buttons (`li.follow-up a`): "PCS Ranking", "Popular Riders" etc styled
- [ ] Buttons: themed, hover state works
- [ ] Links: gold on hover, visited state distinct
- [ ] DNF/DNS: red
- [ ] Scrollbar: themed
- [ ] Spoiler banner: still reads correctly (it has its own inline styles — should be unaffected)
- [ ] Reveal spoilers button: unaffected by theme

---

## 7. Write the spec

Follow the standard openspec approach. Spec must include:

- Design ethos (one paragraph — what is the aesthetic intent?)
- Token mapping (your palette against the standard tokens)
- Any new font and why
- Elements not covered and why (e.g. livestats — Spec 004)
- Full acceptance criteria referencing the QA checklist above

---

## 8. Commit message format

```
feat: add <ThemeName> theme

- font: <font name and why>
- key palette decisions: <2-3 sentences>
- elements deferred: <list>
```
