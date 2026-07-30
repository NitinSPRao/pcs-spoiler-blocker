export const DARK_THEME_CSS = `
/* ── BASE ────────────────────────────────────────────────── */
body {
  background: #1a2030 !important;
  color: #e8edf3 !important;
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
}

/* ── LAYOUT CONTAINERS ───────────────────────────────────── */
.wrapper, .page, #page, .main, #main,
.content, #content, .cont, .page-content,
.left-cont, .right-cont, .center-cont,
div[class*="cont"], div[class*="content"] {
  background: #1a2030 !important;
  color: #e8edf3 !important;
}

/* ── NAVIGATION ──────────────────────────────────────────── */
ul.topnav, ul.topnav li, ul.topnav li a,
nav, nav li, nav a,
.sitenav, .sitenav li, .sitenav a {
  background: #252d3a !important;
  color: #c8d0db !important;
}
ul.topnav { border-bottom: 2px solid #e8b400 !important; }
ul.topnav li a:hover, nav a:hover { color: #e8b400 !important; }

/* dropdown menus */
ul.topnav ul, nav ul ul {
  background: #2d3748 !important;
  border: 1px solid #3a4556 !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
}
ul.topnav ul li a:hover { background: #3a4556 !important; }

/* ── SECTION HEADERS (h4bar) ─────────────────────────────── */
.h4bar {
  background: #252d3a !important;
  border-left: 3px solid #e8b400 !important;
  border-bottom: 1px solid #3a4556 !important;
}
.h4bar h4, .h4bar h3, .h4bar h2 {
  color: #fff !important;
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
}

/* standalone headings */
h1, h2, h3, h4, h5 {
  color: #e8edf3 !important;
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
}

/* ── TABLES ──────────────────────────────────────────────── */
table {
  background: #252d3a !important;
  border-color: #3a4556 !important;
}
tr { border-color: #3a4556 !important; }
thead tr, table tr.header, table tr:first-child th {
  background: #2d3748 !important;
}
th {
  background: #2d3748 !important;
  color: #e8b400 !important;
  border-color: #3a4556 !important;
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  font-size: 11px !important;
}
td {
  background: transparent !important;
  border-color: #3a4556 !important;
  color: #e8edf3 !important;
}
tbody tr:nth-child(even) td { background: #1f2738 !important; }
tbody tr:hover td { background: #2d3748 !important; }

/* rank 1 highlight */
tbody tr:first-child td {
  border-left: 2px solid #e8b400 !important;
}

/* ── LINKS ───────────────────────────────────────────────── */
a { color: #9db4cc !important; }
a:hover { color: #e8b400 !important; }
a:visited { color: #7a95ad !important; }

/* rider names — gold */
.ridername a, a.rider, td.name a, .name a {
  color: #e8b400 !important;
  font-weight: 600 !important;
}
.ridername a:hover, a.rider:hover { color: #ffc700 !important; }

/* team names — muted */
.team a, td.team a { color: #8896a8 !important; }
.team a:hover { color: #c8d0db !important; }

/* ── RANKINGS / TIME / DATA CELLS ────────────────────────── */
.ar, .rnk, td:first-child {
  color: #8896a8 !important;
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
}
.time, .gap, .result { font-family: 'Barlow Condensed', Arial, sans-serif !important; }
td:first-child { font-weight: 700 !important; }

/* DNF / DNS / OTL */
.dnf, .dns, .otl, .abandon { color: #e05252 !important; }

/* ── HOMEPAGE LIVESTATS WIDGET (ul.hp3-livestats) ───────────── */
/* keep original card colors — frame each card, fix fonts */
ul.hp3-livestats { background: transparent !important; }
ul.hp3-livestats li {
  border: 1px solid #3a4556 !important;
  border-radius: 4px !important;
  overflow: hidden !important;
  margin-bottom: 6px !important;
}
ul.hp3-livestats li a { text-decoration: none !important; }
ul.hp3-livestats span.title {
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  letter-spacing: 0.04em !important;
}
ul.hp3-livestats span.status {
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.1em !important;
}
ul.hp3-livestats div.togo {
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
  font-weight: 700 !important;
}
ul.hp3-livestats div.situ_txt {
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
}

/* ── HOMEPAGE GAMES WIDGET (ul.hp-games) ─────────────────── */
ul.hp-games { background: #1f2738 !important; list-style: none !important; }
ul.hp-games li { background: transparent !important; }
ul.hp-games li div {
  background: #252d3a !important;
  border: 1px solid #3a4556 !important;
}
ul.hp-games li div a {
  background: #252d3a !important;
  color: #c8d0db !important;
  text-decoration: none !important;
}
ul.hp-games li div a:hover { background: #2d3748 !important; color: #e8b400 !important; }

/* ── HOMEPAGE RESULT LISTS ───────────────────────────────── */
ul.hp2-results { background: #1a2030 !important; }
ul.hp2-results li.race {
  border-bottom: 1px solid #3a4556 !important;
  background: #252d3a !important;
}
ul.hp2-results li.race:hover { background: #2d3748 !important; }
ul.hp2-results li.race a { color: #e8edf3 !important; }
ul.hp2-results li.race a:hover { color: #e8b400 !important; }

/* stage subtitle inline color override (#1f8acc cyan → gold) */
ul.hp2-results li.race a span { color: #e8b400 !important; }

/* VIEW RESULTS / GC / LIVESTATS buttons (a.goto-race) */
a.goto-race {
  display: inline-block !important;
  padding: 4px 12px !important;
  background: #252d3a !important;
  color: #e8edf3 !important;
  border: 1px solid #3a4556 !important;
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
  font-weight: 600 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  font-size: 11px !important;
  text-decoration: none !important;
  margin-right: 4px !important;
  transition: background 0.12s, border-color 0.12s !important;
}
a.goto-race:hover {
  background: #2d3748 !important;
  color: #e8b400 !important;
  border-color: #e8b400 !important;
}
a.goto-race.livestats {
  background: #1a3d28 !important;
  color: #52c27a !important;
  border-color: #2a5a3a !important;
}
a.goto-race.livestats:hover {
  background: #22502f !important;
  color: #6ad48a !important;
  border-color: #52c27a !important;
}

/* ── BUTTONS ─────────────────────────────────────────────── */
.btn, button, input[type=submit], input[type=button],
a.button, .button {
  background: #2d3748 !important;
  color: #e8edf3 !important;
  border: 1px solid #3a4556 !important;
}
.btn:hover, button:hover { background: #3a4556 !important; }
.btn-primary, a.btn-blue, .btn-blue {
  background: #e8b400 !important;
  color: #111 !important;
  border-color: #e8b400 !important;
}
.btn-primary:hover { background: #ffc700 !important; }

/* follow-up widget buttons: "PCS Ranking", "Popular Riders", etc */
li.follow-up { list-style: none !important; }
li.follow-up a {
  display: inline-block !important;
  padding: 6px 16px !important;
  background: #252d3a !important;
  color: #e8b400 !important;
  border: 1px solid #3a4556 !important;
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  font-size: 11px !important;
  text-decoration: none !important;
  transition: background 0.15s !important;
}
li.follow-up a:hover {
  background: #2d3748 !important;
  color: #ffc700 !important;
  border-color: #e8b400 !important;
}

/* ── RANKING / POPULARITY BARS (div.valuebar) ───────────────── */
.valuebar { background: #1a2030 !important; }
/* homepage popularity bars */
div.bg.orange  { background: #d97820 !important; }
div.bg.yellow  { background: #c9a200 !important; }
div.bg.green   { background: #2a9858 !important; }
.valuebar .title { color: #1a1000 !important; }
/* rider profile specialty bars */
div.bg.green2  { background: #259858 !important; }
div.bg.red     { background: #b83030 !important; }
div.bg.blue    { background: #2870c8 !important; }
div.bg.purple1 { background: #6e38b0 !important; }
div.bg.pink    { background: #c03870 !important; }
/* specialty bar row separators */
li:has(.xbar) { border-color: #3a4556 !important; }
/* specialty bar text */
.xvalue { color: #e8edf3 !important; }
.xtitle a { color: #8896a8 !important; }
.xtitle a:hover { color: #e8b400 !important; }

/* ── LIVESTATS PAGE ──────────────────────────────────────── */
/* stats row (KM TO GO, RACETIME, KM DONE, AVG., etc.) */
ul.ls5b-kpi, ul.ls5b-kpi * {
  font-family: 'Barlow Condensed', Arial, sans-serif !important;
}
ul.ls5b-kpi li span {
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
}
ul.ls5b-kpi li div { font-weight: 700 !important; }

/* elevation profile — border only, no bg/padding override (yellowgreen is part of chart design) */
.profileWrapper {
  border-top: 2px solid #e8b400 !important;
  border-left: 1px solid #3a4556 !important;
  border-right: 1px solid #3a4556 !important;
  border-bottom: 1px solid #3a4556 !important;
  border-radius: 4px !important;
  overflow: hidden !important;
}
/* detail profile panel — same treatment */
.detailProfileCont {
  background: #1a2030 !important;
  border: 1px solid #3a4556 !important;
  border-radius: 4px !important;
  padding: 8px !important;
}
.detailProfileCont > div { border-color: #3a4556 !important; }
/* view keypoints table button */
a.viewKeypoints {
  display: block !important;
  background: #252d3a !important;
  color: #8896a8 !important;
  border: 1px solid #3a4556 !important;
  text-decoration: none !important;
  text-align: center !important;
}
a.viewKeypoints:hover {
  background: #2d3748 !important;
  color: #e8b400 !important;
  border-color: #e8b400 !important;
}

/* ── RIDER SEASON NAV (ul.rdrSeasonNav) ──────────────────── */
ul.rdrSeasonNav li a.rdrFilterSeason {
  background: #252d3a !important;
  color: #8896a8 !important;
  border: 1px solid #3a4556 !important;
  text-decoration: none !important;
}
ul.rdrSeasonNav li a.rdrFilterSeason:hover {
  background: #2d3748 !important;
  color: #e8b400 !important;
  border-color: #e8b400 !important;
}
ul.rdrSeasonNav li.cur a.rdrFilterSeason {
  background: #2d3748 !important;
  color: #e8b400 !important;
  border-color: #e8b400 !important;
}

/* sort + filter buttons (DATE / RESULT / NO FILTER / CLIMBER etc) */
a.rdrFilterSort, a.rdrFilterFilter {
  background: #252d3a !important;
  color: #8896a8 !important;
  border: 1px solid #3a4556 !important;
  text-decoration: none !important;
}
a.rdrFilterSort:hover, a.rdrFilterFilter:hover {
  background: #2d3748 !important;
  color: #e8b400 !important;
  border-color: #e8b400 !important;
}
/* active state — cur class on parent li or on the element itself */
li.cur a.rdrFilterSort, li.cur a.rdrFilterFilter,
a.rdrFilterSort.cur, a.rdrFilterFilter.cur {
  background: #2d3748 !important;
  color: #e8b400 !important;
  border-color: #e8b400 !important;
}

/* ── SIDEBAR / PANELS ────────────────────────────────────── */
.sidebar, .right-bar, .aside, aside,
div[class*="side"], div[class*="panel"] {
  background: #1f2738 !important;
  border-color: #3a4556 !important;
}

/* ── FORMS / INPUTS ──────────────────────────────────────── */
input[type=text], input[type=search], select, textarea {
  background: #2d3748 !important;
  color: #e8edf3 !important;
  border: 1px solid #3a4556 !important;
}
input::placeholder { color: #5a6a7e !important; }

/* ── MISC ACCENTS ────────────────────────────────────────── */
.blue {
  background: #252d3a !important;
  color: #e8b400 !important;
}
.highlight, .active, .selected {
  background: #2d3748 !important;
  color: #e8b400 !important;
}
hr, .divider, .separator { border-color: #3a4556 !important; }

/* category badges */
.cat, .category, span[class*="cat"] {
  background: #2d3748 !important;
  color: #8896a8 !important;
  border: 1px solid #3a4556 !important;
}

/* ── SCROLLBAR ───────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #1a2030; }
::-webkit-scrollbar-thumb { background: #3a4556; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #e8b400; }
`
