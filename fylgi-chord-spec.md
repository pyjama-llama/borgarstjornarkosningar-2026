# Hvaðan kemur fylgið? — Interactive Chord Diagram
### Technical Specification · Incremental Atomic Implementation Plan

---

## 1. Context & Data

**Source:** Gallup poll, April 2026 (published Heimildin, 11 May 2026)  
**Story:** Voter flow from Reykjavík city council election 2022 → declared intent for 2026 election (May 16, 2026)  
**Author:** Aðalsteinn Kjartansson  

### Data Matrix (extracted & verified)

Rows = party the voter chose **in 2022** (or did not vote).  
Columns = party the voter intends to choose **in 2026**.  
Values = percentage of that row's 2022 voters flowing to each 2026 party.  
Blank cells = 0% or negligible (<1%).

```
                S    D    B    C    F    J    M    P    A(Vinstri)
D (Sjálfst.)    1%   73%       3%   2%   2%   17%       
B (Framsókn)    5%   40%  27%  10%  1%   3%   8%        4%
C (Viðreisn)   10%   40%       47%       1%              2%
F (Fl.fólks)    4%   23%       2%   35%  1%   24%       3%
J (Sósíal.)    10%   7%        1%   4%   16%  1%   2%   59%
M (Miðfl.)          10%                      81%       1%
P (Píratar)    21%   1%        10%  4%   15%       26%  23%
S (Samfylk.)   62%   11%       10%       3%   1%   2%   10%
V (V.græn)     12%   4%        6%        6%   1%   5%   66%
Kusu ekki      13%   28%  5%   13%  1%   3%   20%  1%   12%
```

### Party Legend

| Code | Icelandic name | English | 2022 seats | Ideological position |
|------|---------------|---------|------------|---------------------|
| S | Samfylkingin | Social Democratic Alliance | 5 | Centre-left |
| D | Sjálfstæðisflokkur | Independence Party | 6 | Centre-right |
| B | Framsóknarflokkur | Progressive Party | 4 | Centre/agrarian |
| C | Viðreisn | Reform Party | 1 | Liberal |
| F | Flokkur fólksins | People's Party | 1 | Populist right |
| J | Sósíalistaflokkur Íslands | Socialist Party | 2 | Left |
| M | Miðflokkurinn | Centre Party | 0 (in 2022) | Conservative |
| P | Píratar | Pirates | 3 | Progressive/digital rights |
| A | Vinstri græn (now A-list) | Left-Greens | — | Left-green |
| V | Vinstri græn (2022) | Left-Greens | 1 | Left-green (source only) |
| — | Kusu ekki | Did not vote in 2022 | — | Non-voters entering 2026 |

> **Note on A vs V:** In 2022, Left-Greens ran as V-list. For 2026 they run as A-list. Sanna Magdalena Mörtudóttir (ex-Sósíalistar leader) moved to lead the A-list, which is why 59% of 2022 Sósíalistar voters intend to flow to A. Treat A and V as separate nodes: V is a 2022 source, A is a 2026 destination.

---

## 2. Visualization Approach

**Chart type:** D3.js Chord Diagram  
**Justification:** The data is a directed flow matrix between named groups — exactly the use case chords were designed for. Each arc segment represents a party; each ribbon represents voter flow between parties across elections.

**Key interaction model:**
- **Pills (filter bar):** `Allir` · `Top 3` · `[each party individually]` — toggleable, animated
- **Chord hover/click:** Shows a popup with FROM → TO label, arrow icon, percentage
- **Animation:** On filter change, chords animate in/out with staggered enter/exit transitions

---

## 3. Design System

### Typography
- **Headings:** `Faustina` (Google Fonts) — serif, editorial, your brand
- **Body/labels:** `IBM Plex Mono` — monospaced, data journalism, clinical contrast with Faustina
- **UI elements (pills, tooltips):** `Faustina` italic for accents

### Color Palette
Iceland editorial — volcanic earth tones with sharp glacial accents:

```css
--bg:          #0f0f0f;      /* Near-black ground */
--surface:     #1a1919;      /* Card/panel background */
--border:      #2e2c2c;      /* Subtle borders */
--text-primary:#f0ece4;      /* Warm off-white */
--text-muted:  #7a7570;      /* Secondary labels */
--accent:      #e8c170;      /* Warm gold — Faustina headings */
--accent-cool: #6ba3be;      /* Glacial blue — hover states */

/* Party colors — each chord arc */
--S: #c0392b;   /* Samfylking — red */
--D: #2980b9;   /* Sjálfstæðisflokkur — blue */
--B: #27ae60;   /* Framsókn — green */
--C: #f39c12;   /* Viðreisn — amber */
--F: #8e44ad;   /* Flokkur fólksins — purple */
--J: #e74c3c;   /* Sósíalistar — bright red */
--M: #7f8c8d;   /* Miðflokkur — slate */
--P: #1abc9c;   /* Píratar — teal */
--A: #16a085;   /* Vinstri græn (A) — dark teal */
--V: #2ecc71;   /* Vinstri græn (V, 2022 source) — light green */
--none: #555;   /* Kusu ekki — neutral */
```

### Layout
```
┌─────────────────────────────────────────────────┐
│  [Faustina heading]  Hvaðan kemur fylgið?        │
│  [Subhead]  Reykjavíkurborg · Kosningar 2022→2026│
├─────────────────────────────────────────────────┤
│  [Filter pills]  Allir  Top 3  S  D  B  C  F …  │
├─────────────────────────────────────────────────┤
│                                                  │
│            [Chord Diagram SVG]                   │
│         (arcs labeled, ribbons colored)          │
│                                                  │
├─────────────────────────────────────────────────┤
│  [Tooltip popup — appears on hover/click]        │
│  ┌─────────────────────────────────────────┐    │
│  │  Sjálfstæðisflokkur  →  Sjálfstæðifl.  │    │
│  │  73% of D-2022 voters stay with D       │    │
│  └─────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│  [Footer] Source: Gallup apríl 2026 · Heimildin │
└─────────────────────────────────────────────────┘
```

---

## 4. File Structure (GitHub Pages)

```
fylgi-chord/
├── index.html          ← Single entry point (GitHub Pages root)
├── style.css           ← All styles, CSS variables, responsive
├── data.js             ← Matrix data as JS module (no fetch needed)
├── chord.js            ← D3 chord logic, animation, filter state
└── README.md           ← Attribution and build notes
```

> **No build step required.** Pure HTML + CSS + vanilla JS + D3 CDN. GitHub Pages serves it directly from the repo root or `/docs` folder.

---

## 5. Atomic Implementation Stages

Each stage is independently shippable and testable. Hand off one at a time.

---

### Stage 1 — Static HTML Shell
**Goal:** Repo exists, GitHub Pages live, brand typography renders correctly.

**Deliverables:**
- `index.html` with `<head>` (Faustina + IBM Plex Mono from Google Fonts, D3 from CDN)
- `style.css` with all CSS variables, dark background, heading style
- Placeholder `<div id="chart">` and empty filter bar
- Title, subhead, footer render in correct typography

**Acceptance test:** Deploy to GitHub Pages → heading renders in Faustina gold on dark background.

**D3 version:** Use D3 v7 from CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
```

---

### Stage 2 — Data Module
**Goal:** Matrix data is correctly encoded and verified before any drawing begins.

**Deliverables:** `data.js`

```js
// data.js
export const PARTIES = [
  { id: 'S', name: 'Samfylkingin',           nameEn: 'Social Democrats',   color: '#c0392b' },
  { id: 'D', name: 'Sjálfstæðisflokkur',     nameEn: 'Independence Party', color: '#2980b9' },
  { id: 'B', name: 'Framsóknarflokkur',       nameEn: 'Progressive Party',  color: '#27ae60' },
  { id: 'C', name: 'Viðreisn',               nameEn: 'Reform Party',       color: '#f39c12' },
  { id: 'F', name: 'Flokkur fólksins',        nameEn: "People's Party",     color: '#8e44ad' },
  { id: 'J', name: 'Sósíalistaflokkur',       nameEn: 'Socialist Party',    color: '#e74c3c' },
  { id: 'M', name: 'Miðflokkurinn',           nameEn: 'Centre Party',       color: '#7f8c8d' },
  { id: 'P', name: 'Píratar',                nameEn: 'Pirates',            color: '#1abc9c' },
  { id: 'A', name: 'Vinstri græn',            nameEn: 'Left-Greens (2026)', color: '#16a085' },
  { id: 'V', name: 'Vinstri græn (2022)',     nameEn: 'Left-Greens (2022)', color: '#2ecc71' },
  { id: 'none', name: 'Kusu ekki',            nameEn: 'Did not vote',       color: '#666666' },
];

// Matrix: rows = 2022 source party (index matches PARTIES order)
// Columns = 2026 destination party (same order)
// Values = percentage as integer (0–100)
export const MATRIX = [
  // FROM: S  D   B   C   F   J   M   P   A   V  none
  /* S */  [62, 11,  0, 10,  0,  3,  1,  2, 10,  0,  0],
  /* D */  [ 1, 73,  0,  3,  2,  2, 17,  0,  0,  0,  0],
  /* B */  [ 5, 40, 27, 10,  1,  3,  8,  0,  4,  0,  0],
  /* C */  [10, 40,  0, 47,  0,  1,  0,  0,  2,  0,  0],
  /* F */  [ 4, 23,  0,  2, 35,  1, 24,  0,  3,  0,  0],
  /* J */  [10,  7,  0,  1,  4, 16,  1,  2, 59,  0,  0],
  /* M */  [ 0, 10,  0,  0,  0,  0, 81,  0,  1,  0,  0],
  /* P */  [21,  1,  0, 10,  4, 15,  0, 26, 23,  0,  0],
  /* A */  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // A is 2026 dest only
  /* V */  [12,  4,  0,  6,  0,  6,  1,  5, 66,  0,  0],
  /* none*/[13, 28,  5, 13,  1,  3, 20,  1, 12,  0,  0],
];
```

**Acceptance test:** `console.log` the matrix rows sum — each should be ≤ 100 (some don't add to 100 due to rounding in the original poll).

---

### Stage 3 — Static Chord Diagram (no interaction)
**Goal:** D3 chord renders correctly with party arcs and colored ribbons.

**Key implementation notes:**

```js
// chord.js — core pattern
import { PARTIES, MATRIX } from './data.js';

const width = 600, height = 600, outerRadius = 260, innerRadius = 230;

const chord = d3.chord()
  .padAngle(0.05)
  .sortSubgroups(d3.descending);

const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
const ribbon = d3.ribbon().radius(innerRadius - 5);

// Note: D3 chord requires a square NxN matrix.
// Since A (index 8) is a destination-only node, its row will be all zeros.
// Filter out V (2022 source, no 2026 column) for the chord display —
// or keep it and show it as a source-only arc with no outgoing ribbons TO it.
```

**Arc labels:** Party short code (S, D, B...) on the arc, full Icelandic name in a legend below.

**Ribbon coloring:** Color by the SOURCE party (row), so viewers can see "where D's voters went" by the blue ribbons.

**Acceptance test:** All 10 source arcs visible, ribbons connect them to destination arcs.

---

### Stage 4 — Filter Pills UI
**Goal:** Pill bar renders, active state styles work, no animation yet.

**Pills:**
```
[ Allir ] [ Top 3 ] [ S ] [ D ] [ B ] [ C ] [ F ] [ J ] [ M ] [ P ] [ A ] [ V ] [ Kusu ekki ]
```

- `Allir` = show all chords
- `Top 3` = show only the 3 parties with the largest total incoming flow in 2026 (D, S, A based on data)
- Individual pills = show only chords where SOURCE or DESTINATION is that party

**Active pill style:** Filled with that party's color, white text, slight glow using `box-shadow`.

**Acceptance test:** Clicking a pill updates `activeFilter` state variable and logs it to console.

---

### Stage 5 — Animated Filter Transitions
**Goal:** Chords animate in/out when filter changes.

**D3 pattern:**
```js
// On filter change, recompute visible chords, then:
svg.selectAll('.chord')
  .data(visibleChords, d => `${d.source.index}-${d.target.index}`)
  .join(
    enter => enter.append('path')
      .attr('class', 'chord')
      .attr('d', ribbon)
      .style('opacity', 0)
      .call(enter => enter.transition().duration(500).style('opacity', 0.6)),
    update => update.transition().duration(300).attr('d', ribbon),
    exit => exit.transition().duration(300).style('opacity', 0)
      .remove()
  );
```

**Stagger:** When switching to `Top 3` or individual, delay each chord by `i * 40ms` for a reveal cascade effect.

**Acceptance test:** Clicking pills smoothly fades chords in/out without jarring jumps.

---

### Stage 6 — Tooltip Popup
**Goal:** Hover or click on a chord ribbon shows a styled popup.

**Popup content:**
```
┌──────────────────────────────────────────────┐
│  Sjálfstæðisflokkur (D)  →  Sjálfstæðifl.   │
│  73% of D-2022 voters plan to vote D in 2026 │
└──────────────────────────────────────────────┘
```

- Arrow: Unicode `→` styled with the source party color
- Position: Follow mouse (via `mousemove`) or fixed bottom-left on mobile
- Dismiss: `mouseleave` on ribbon, or tap elsewhere on mobile

**HTML structure:**
```html
<div id="tooltip" aria-live="polite" hidden>
  <span class="from"></span>
  <span class="arrow">→</span>
  <span class="to"></span>
  <p class="pct"></p>
</div>
```

**Acceptance test:** Hovering any ribbon shows correct FROM/TO names and percentage. Tooltip disappears on mouse leave.

---

### Stage 7 — Responsive & GitHub Pages Polish
**Goal:** Works on mobile, correct `<meta>` tags, ready to embed.

**Responsive breakpoints:**
```css
/* Desktop: 600×600 chord */
/* Tablet (768px): 480×480 */
/* Mobile (480px): Full-width, chord scales to container */
```

Use `viewBox` on the SVG so it scales without JS:
```js
svg.attr('viewBox', `${-width/2} ${-height/2} ${width} ${height}`)
   .style('width', '100%')
   .style('height', 'auto');
```

**GitHub Pages deploy steps:**
1. Push to `main` branch
2. In repo Settings → Pages → Source: `main` / `root` (or `/docs`)
3. URL format: `https://[username].github.io/[repo-name]/`

**Optional embed snippet** (for Heimildin or other CMS):
```html
<iframe 
  src="https://[username].github.io/fylgi-chord/" 
  width="100%" height="700" 
  frameborder="0" scrolling="no">
</iframe>
```

**`<head>` meta for social sharing:**
```html
<meta property="og:title" content="Hvaðan kemur fylgið? — Reykjavík 2026">
<meta property="og:description" content="Sjálfvirkur flæðiritningur kjósenda milli 2022 og 2026">
<meta property="og:image" content="[path-to-screenshot].png">
```

---

## 6. Key Technical Decisions & Rationale

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Chart library | D3.js v7 (vanilla) | Maximum control over chord layout and animation; no React overhead needed for a single-view data story |
| Build system | None | Static HTML/JS/CSS; GitHub Pages serves directly; no npm, no bundler, no friction for handoff |
| Data format | Inline JS module | No CORS issues with GitHub Pages; no `fetch()` needed; simpler for a single dataset |
| Party as both source AND dest | Separate nodes for V (2022) and A (2026) | Avoids misleading self-loops; V and A are the same party across time but distinct in this flow context |
| Missing rows add to <100% | Keep as-is | Gallup rounding; do not normalize to 100 — that would introduce false precision |
| Tooltip on hover vs click | Both | Hover for desktop, tap for mobile (touch events); `pointer` media query to differentiate |

---

## 7. Icelandic Copy (for UI labels)

| Element | Icelandic | English gloss |
|---------|-----------|---------------|
| Main heading | Hvaðan kemur fylgið? | Where does the support come from? |
| Subheading | Kjósendaflæði 2022 → 2026 | Voter flow 2022 → 2026 |
| Filter: all | Allir | All |
| Filter: top 3 | Efstu 3 | Top 3 |
| Did not vote | Kusu ekki | Did not vote |
| Tooltip arrow label | kustu → ætla að kjósa | voted → intend to vote |
| Source note | Heimild: Gallup apríl 2026 | Source: Gallup April 2026 |
| Credit | Greining: Aðalsteinn Kjartansson / Heimildin | — |

---

## 8. Handoff Checklist for Implementing LLM

When handing each stage to another LLM, include:

- [ ] This full spec document
- [ ] The stage number and its acceptance test
- [ ] The data matrix from Section 2 (not the CSV — the verified JS version from Stage 2)
- [ ] The color palette from Section 3
- [ ] The Google Fonts import string: `https://fonts.googleapis.com/css2?family=Faustina:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap`
- [ ] The D3 CDN import: `https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js`
- [ ] Instruction: **do not use a bundler, do not use React, do not use npm**
- [ ] Instruction: **each stage must not break the output of the previous stage**

---

*Spec version 1.0 · May 11, 2026 · Ready for Stage 1 handoff*
