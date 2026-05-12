# Chord Diagram — Arc Label Placement

**Reference doc extracted from `ChordDiagram.tsx`**  
Purpose: Hand this to another LLM (or developer) who needs to implement arc-hugging, correctly-oriented labels on a D3 chord diagram. No React, no app-specific logic — just the pure geometry.

---

## The Core Problem

Labels around a chord diagram arc must:
1. **Follow the curve of the arc** (not sit at a fixed radial angle)
2. **Always read left-to-right** — labels in the bottom hemisphere of the circle would appear upside-down if we used the same arc direction as the top

SVG `<textPath>` solves both problems: the text flows along an invisible `<path>` element drawn at the label radius.

---

## How It Works — Step by Step

### 1. Calculate the label radius

```js
const labelRadius = outerRadius + 20; // px gap between arc edge and text baseline
```

### 2. Find the midpoint angle of each group arc

D3 chord groups expose `startAngle` and `endAngle` in **D3's radial convention**:
- `0` = 12 o'clock
- `Math.PI / 2` = 3 o'clock
- `Math.PI` = 6 o'clock

```js
const angle = (d.startAngle + d.endAngle) / 2;
```

### 3. Determine hemisphere

Labels in the bottom half of the circle (`angle` between 90° and 270°, i.e. `π/2` to `3π/2`) need their arc path reversed so the text isn't upside-down.

```js
const isBottom = angle > Math.PI / 2 && angle < 3 * Math.PI / 2;
```

### 4. Convert D3 angles to SVG x/y coordinates

D3 angles start at 12 o'clock and increase clockwise.  
Standard trig (`sin`/`cos`) starts at 3 o'clock.  
The conversion is:

```js
const getX = (a) => labelRadius * Math.sin(a);
const getY = (a) => -labelRadius * Math.cos(a);  // negative: SVG y-axis is flipped

const pStart = { x: getX(d.startAngle), y: getY(d.startAngle) };
const pEnd   = { x: getX(d.endAngle),   y: getY(d.endAngle)   };
```

### 5. Build the SVG arc path string

Use a circular arc (`A` command). The key flags:
- `sweep-flag = 1` → clockwise (top hemisphere, reads left-to-right naturally)
- `sweep-flag = 0` → counter-clockwise (bottom hemisphere, reversal makes text read left-to-right)

```js
let pathData;
if (isBottom) {
  // CCW: draw from End → Start so text runs left-to-right
  pathData = `M ${pEnd.x} ${pEnd.y} A ${labelRadius} ${labelRadius} 0 0 0 ${pStart.x} ${pStart.y}`;
} else {
  // CW: draw from Start → End (natural reading direction)
  pathData = `M ${pStart.x} ${pStart.y} A ${labelRadius} ${labelRadius} 0 0 1 ${pEnd.x} ${pEnd.y}`;
}
```

**Arc command breakdown:** `A rx ry x-rotation large-arc-flag sweep-flag x y`
- `rx = ry = labelRadius` (it's a circle, so both radii are equal)
- `x-rotation = 0` (no tilt needed for a circular arc)
- `large-arc-flag = 0` (we always want the minor arc — the short way around)
- `sweep-flag = 1` (CW) or `0` (CCW) — this is the hemisphere logic above

### 6. Inject the path into `<defs>` and attach `<textPath>`

The invisible guide path lives in `<defs>` so it doesn't render visually.

```js
// Create a unique, stable ID per arc (use party name, not positional index!)
const pathId = `label-path-${party.replace(/\s+/g, '-')}`;

// Inject into <defs>
svg.select('defs').append('path')
  .attr('id', pathId)
  .attr('d', pathData);

// Attach text that follows the path
label
  .attr('text-anchor', 'middle')  // horizontally centres the text on the path
  .attr('dy', '0.35em')           // vertically centres relative to path baseline
  .append('textPath')
    .attr('href', `#${pathId}`)
    .attr('startOffset', '50%')   // start the text at the path's midpoint
    .text(labelStr);
```

---

## Complete Vanilla JS Example

```html
<!DOCTYPE html>
<html>
<body>
<svg id="chord-svg" width="600" height="600"></svg>
<script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
<script>
const width = 600, height = 600;
const outerRadius = 200;
const innerRadius = 175;
const labelRadius = outerRadius + 20;

const matrix = [
  [80, 10, 5],
  [8,  75, 12],
  [4,  14, 70],
];
const names = ['Party A', 'Party B', 'Party C'];

const svg = d3.select('#chord-svg')
  .attr('viewBox', `0 0 ${width} ${height}`);

const defs = svg.append('defs');

const g = svg.append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);

const chord  = d3.chord().padAngle(0.05)(matrix);
const arc    = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
const ribbon = d3.ribbon().radius(innerRadius);

// Draw ribbons
g.selectAll('path.chord')
  .data(chord)
  .join('path')
  .attr('class', 'chord')
  .attr('d', ribbon)
  .attr('fill', '#aaa')
  .attr('opacity', 0.6);

// Draw arcs + labels
chord.groups.forEach(d => {
  const name = names[d.index];

  // Arc path
  g.append('path')
    .attr('d', arc(d))
    .attr('fill', d3.schemeTableau10[d.index]);

  // --- LABEL PLACEMENT LOGIC ---
  const angle    = (d.startAngle + d.endAngle) / 2;
  const isBottom = angle > Math.PI / 2 && angle < 3 * Math.PI / 2;

  const getX = a => labelRadius * Math.sin(a);
  const getY = a => -labelRadius * Math.cos(a);
  const pStart = { x: getX(d.startAngle), y: getY(d.startAngle) };
  const pEnd   = { x: getX(d.endAngle),   y: getY(d.endAngle)   };

  const pathData = isBottom
    ? `M ${pEnd.x} ${pEnd.y} A ${labelRadius} ${labelRadius} 0 0 0 ${pStart.x} ${pStart.y}`
    : `M ${pStart.x} ${pStart.y} A ${labelRadius} ${labelRadius} 0 0 1 ${pEnd.x} ${pEnd.y}`;

  const pathId = `lp-${name.replace(/\s+/g, '-')}`;

  defs.append('path')
    .attr('id', pathId)
    .attr('d', pathData);

  g.append('text')
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .attr('font-size', 13)
    .attr('font-family', 'sans-serif')
    .append('textPath')
      .attr('href', `#${pathId}`)
      .attr('startOffset', '50%')
      .text(name);
});
</script>
</body>
</html>
```

---

## Key Gotchas

| Gotcha | Fix |
|---|---|
| Labels appear upside-down at the bottom | Use `isBottom` hemisphere check and reverse arc direction (`sweep-flag 0` + swap Start/End) |
| Labels shift when party filter changes | Use stable string IDs for `<path id>` (e.g. party name), **not** positional index `d.index` |
| Text doesn't centre on arc | Set `text-anchor="middle"` on `<text>` and `startOffset="50%"` on `<textPath>` |
| `<textPath>` inside `<defs>` renders nothing | Only the `<path>` goes in `<defs>`. The `<text>/<textPath>` goes in the main `<g>` |
| D3 angle → SVG coordinate | `x = r * sin(angle)`, `y = -r * cos(angle)` (note the negative y) |
| `large-arc-flag` must be `0` | Always use the short arc (minor arc). Using `1` would curve the wrong way around the full circle |

---

## Origin

Extracted from:  
`my-react-app/src/features/polling/components/charts/ChordDiagram.tsx`  
Lines ~392–463 (the `arcGroupMerged.each(function(d) { ... })` block).
