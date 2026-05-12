// chord.js — D3 Chord Diagram
// Hvaðan kemur fylgið? · Voter flow 2022 → 2026

import { PARTIES, MATRIX, BEATS } from './data.js';

// ─── Dimensions ──────────────────────────────────────────────────────────────
const W = 700, H = 700;
const outerR = 300, innerR = 264;
const LABEL_R = outerR + 28; // gap between arc edge and text baseline

// ─── D3 layout ───────────────────────────────────────────────────────────────
const chord = d3.chordDirected()
  .padAngle(0.028);

const arc   = d3.arc().innerRadius(innerR).outerRadius(outerR);
const ribbon = d3.ribbon().radius(innerR - 2);

// ─── State ───────────────────────────────────────────────────────────────────
let currentBeat = 0;
let activeFilter = 'all'; // used in interactive mode
let tooltipVisible = false;
let svg, groups, chords, chordData;

// ─── Init ─────────────────────────────────────────────────────────────────────
export function initChord(t) {
  const container = document.getElementById('chart-svg-wrapper');
  container.innerHTML = '';

  svg = d3.select('#chart-svg-wrapper').append('svg')
    .attr('id', 'chart')
    .attr('viewBox', `${-W/2} ${-H/2} ${W} ${H}`)
    .attr('role', 'img')
    .attr('aria-label', 'Chord diagram sýnir kjósendaflæði milli flokka 2022 og 2026')
    .style('max-width', '100%')
    .style('height', 'auto');

  // Compute chord layout
  chordData = chord(MATRIX);

  // ── Gradients for directional flow ─────────────────────────────────────────
  const defs = svg.append('defs');
  
  // Create a gradient for every active flow (i -> j)
  chordData.forEach(d => {
    const src = d.source;
    const tgt = d.target;
    // We construct a simple unique ID for each gradient based on the party indices
    const gradId = `gradient-${src.index}-${tgt.index}`;
    
    const gradient = defs.append('linearGradient')
      .attr('id', gradId)
      // We orient the gradient roughly from source to target across the circle
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', innerR * Math.cos((src.startAngle + src.endAngle) / 2 - Math.PI / 2))
      .attr('y1', innerR * Math.sin((src.startAngle + src.endAngle) / 2 - Math.PI / 2))
      .attr('x2', innerR * Math.cos((tgt.startAngle + tgt.endAngle) / 2 - Math.PI / 2))
      .attr('y2', innerR * Math.sin((tgt.startAngle + tgt.endAngle) / 2 - Math.PI / 2));
      
    // Source color at the start
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', PARTIES[src.index].color)
      .attr('stop-opacity', 0.9);
      
    // Target color at the end
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', PARTIES[tgt.index].color)
      .attr('stop-opacity', 0.9);
  });

  // ── Arc groups ─────────────────────────────────────────────────────────────
  const g = svg.append('g').attr('class', 'chord-groups');

  groups = g.selectAll('.group')
    .data(chordData.groups)
    .join('g')
      .attr('class', 'group');

  groups.append('path')
    .attr('class', 'arc-path')
    .attr('d', arc)
    .attr('fill', d => PARTIES[d.index].color)
    .attr('stroke', 'var(--bg)')
    .attr('stroke-width', 2);

  // ── Arc labels — textPath arc-hugging implementation ────────────────────
  // Guide paths live in <defs> (invisible). Text follows the arc curve.
  // Hemisphere check prevents upside-down labels in the bottom half.
  // IDs are keyed by party ID (not positional index) for filter stability.

  const getX = (r, a) => r * Math.sin(a);
  const getY = (r, a) => -r * Math.cos(a); // negative: SVG y-axis is flipped

  chordData.groups.forEach(d => {
    const party    = PARTIES[d.index].id;
    const angle    = (d.startAngle + d.endAngle) / 2;
    const isBottom = angle > Math.PI / 2 && angle < 3 * Math.PI / 2;

    const pStart = { x: getX(LABEL_R, d.startAngle), y: getY(LABEL_R, d.startAngle) };
    const pEnd   = { x: getX(LABEL_R, d.endAngle),   y: getY(LABEL_R, d.endAngle)   };

    // Bottom hemisphere: draw CCW (End→Start) so text reads left-to-right
    // Top hemisphere:    draw CW  (Start→End) — natural reading direction
    const pathData = isBottom
      ? `M ${pEnd.x} ${pEnd.y} A ${LABEL_R} ${LABEL_R} 0 0 0 ${pStart.x} ${pStart.y}`
      : `M ${pStart.x} ${pStart.y} A ${LABEL_R} ${LABEL_R} 0 0 1 ${pEnd.x} ${pEnd.y}`;

    const pathId = `label-path-${party}`;

    defs.append('path')
      .attr('id', pathId)
      .attr('d', pathData);

    const labelText = svg.append('text')
      .attr('class', 'arc-label')
      .attr('data-party', party)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle');

    labelText.append('textPath')
      .attr('class', 'label-full')
      .attr('href', `${window.location.href.split('#')[0]}#${pathId}`)
      .attr('startOffset', '50%')
      .text(PARTIES[d.index].name);

    labelText.append('textPath')
      .attr('class', 'label-short')
      .attr('href', `${window.location.href.split('#')[0]}#${pathId}`)
      .attr('startOffset', '50%')
      .text(party);
        
    // Retention label (Tryggðartalan) — hidden by default
    svg.append('text')
      .attr('class', 'retention-label')
      .attr('data-party', party)
      .attr('x', getX(innerR - 40, angle))
      .attr('y', getY(innerR - 40, angle))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', PARTIES[d.index].color)
      .style('opacity', 0)
      .text(`${MATRIX[d.index][d.index]}%`);
  });

  // ── Ribbons ────────────────────────────────────────────────────────────────
  const r = svg.append('g').attr('class', 'chord-ribbons');

  chords = r.selectAll('.chord')
    .data(chordData)
    .join('path')
      .attr('class', 'chord')
      .attr('d', ribbon)
      .style('fill', d => {
        if (d.source.index === d.target.index) return PARTIES[d.source.index].color;
        // Fix for SVG gradient url() not resolving with base tag / routing
        return `url(${window.location.href.split('#')[0]}#gradient-${d.source.index}-${d.target.index})`;
      })
      .attr('fill-opacity', 0.65)
      .attr('stroke', 'none')
      .on('mouseenter', onRibbonEnter)
      .on('mousemove',  onRibbonMove)
      .on('mouseleave', onRibbonLeave);

  // ── Tooltip ────────────────────────────────────────────────────────────────
  initTooltip();

  // ── Render initial beat ────────────────────────────────────────────────────
  applyBeat(0, false);
}

// ─── Beat transitions ─────────────────────────────────────────────────────────
export function applyBeat(beatIndex, animate = true) {
  currentBeat = beatIndex;
  const beat  = BEATS[beatIndex];
  const dur   = animate ? 500 : 0;

  // Show/hide filter bar
  const filterBar = document.getElementById('filter-bar');
  if (filterBar) {
    filterBar.classList.toggle('visible', !!beat.interactive);
  }

  switch (beat.type) {
    case 'all':
      showAll(dur);
      break;
    case 'self-loops':
      showSelfLoops(beat.highlight, dur);
      break;
    case 'source':
      showSource(beat.source, beat.highlightTarget, dur);
      break;
    case 'sources':
      showSources(beat.sources, beat.highlightTarget, dur);
      break;
  }
}

// ─── Beat helpers ─────────────────────────────────────────────────────────────

function showAll(dur) {
  chords.transition().duration(dur)
    .style('opacity', 0.65)
    .attr('fill-opacity', 0.65);

  d3.selectAll('.arc-path').transition().duration(dur)
    .style('opacity', 1)
    .attr('stroke-width', 1);

  d3.selectAll('.arc-label').transition().duration(dur)
    .style('opacity', 1);

  d3.selectAll('.retention-label').transition().duration(dur)
    .style('opacity', 0);
}

function showSelfLoops(highlightIds, dur) {
  const highlightSet = new Set(highlightIds);

  chords.transition().duration(dur)
    .style('opacity', d =>
      d.source.index === d.target.index ? 0.75 : 0.04
    );

  d3.selectAll('.arc-path').transition().duration(dur)
    .style('opacity', d =>
      highlightSet.has(PARTIES[d.index].id) ? 1 : 0.4
    )
    .attr('stroke-width', d =>
      highlightSet.has(PARTIES[d.index].id) ? 2.5 : 1
    );

  d3.selectAll('.arc-label').transition().duration(dur)
    .style('opacity', function() {
      return highlightSet.has(this.dataset.party) ? 1 : 0.3;
    });

  d3.selectAll('.retention-label').transition().duration(dur)
    .style('opacity', function() {
      return highlightSet.has(this.dataset.party) ? 1 : 0;
    });
}

function showSource(sourceId, targetId, dur) {
  const srcIdx = PARTIES.findIndex(p => p.id === sourceId);
  const tgtIdx = PARTIES.findIndex(p => p.id === targetId);

  chords.transition().duration(dur)
    .style('opacity', d => {
      if (d.source.index === srcIdx) return 0.75;
      return 0.04;
    });

  d3.selectAll('.arc-path').transition().duration(dur)
    .style('opacity', d => {
      if (d.index === srcIdx || d.index === tgtIdx) return 1;
      return 0.25;
    })
    .attr('stroke-width', d =>
      (d.index === srcIdx || d.index === tgtIdx) ? 2.5 : 1
    );

  d3.selectAll('.arc-label').transition().duration(dur)
    .style('opacity', function() {
      const id = this.dataset.party;
      const i  = PARTIES.findIndex(p => p.id === id);
      return (i === srcIdx || i === tgtIdx) ? 1 : 0.25;
    });

  d3.selectAll('.retention-label').transition().duration(dur)
    .style('opacity', 0);
}

function showSources(sourceIds, targetId, dur) {
  const srcIdxs = new Set(sourceIds.map(id => PARTIES.findIndex(p => p.id === id)));
  const tgtIdx  = PARTIES.findIndex(p => p.id === targetId);

  chords.transition().duration(dur)
    .style('opacity', d =>
      srcIdxs.has(d.source.index) ? 0.75 : 0.04
    );

  d3.selectAll('.arc-path').transition().duration(dur)
    .style('opacity', d => {
      if (srcIdxs.has(d.index) || d.index === tgtIdx) return 1;
      return 0.2;
    })
    .attr('stroke-width', d =>
      (srcIdxs.has(d.index) || d.index === tgtIdx) ? 2.5 : 1
    );

  d3.selectAll('.arc-label').transition().duration(dur)
    .style('opacity', function() {
      const id = this.dataset.party;
      const i  = PARTIES.findIndex(p => p.id === id);
      return (srcIdxs.has(i) || i === tgtIdx) ? 1 : 0.2;
    });

  d3.selectAll('.retention-label').transition().duration(dur)
    .style('opacity', 0);
}

// ─── Filter (interactive beat) ────────────────────────────────────────────────
export function applyFilter(filter, t) {
  activeFilter = filter;

  if (filter === 'all' || filter === 'top3') {
    const top3Idxs = filter === 'top3'
      ? getTop3Destinations()
      : null;

    chords.transition().duration(400)
      .style('opacity', d => {
        if (!top3Idxs) return 0.65;
        // With d3.chordDirected, d.target is always the destination
        return top3Idxs.has(d.target.index) ? 0.75 : 0.04;
      });

    d3.selectAll('.arc-path').transition().duration(400)
      .style('opacity', d =>
        !top3Idxs || top3Idxs.has(d.index) ? 1 : 0.3
      );

    d3.selectAll('.arc-label').transition().duration(400)
      .style('opacity', function() {
        if (!top3Idxs) return 1;
        const id = this.dataset.party;
        const i  = PARTIES.findIndex(p => p.id === id);
        return top3Idxs.has(i) ? 1 : 0.25;
      });
    return;
  }

  // Individual party filter
  const idx = PARTIES.findIndex(p => p.id === filter);
  chords.transition().duration(400)
    .style('opacity', d =>
      (d.source.index === idx || d.target.index === idx) ? 0.75 : 0.04
    );

  d3.selectAll('.arc-path').transition().duration(400)
    .style('opacity', d => d.index === idx ? 1 : 0.3);

  d3.selectAll('.arc-label').transition().duration(400)
    .style('opacity', function() {
      const id = this.dataset.party;
      const i  = PARTIES.findIndex(p => p.id === id);
      return i === idx ? 1 : 0.25;
    });
}

function getTop3Destinations() {
  // Sum incoming flow for each 2026 destination
  const totals = PARTIES.map((_, i) =>
    MATRIX.reduce((sum, row) => sum + row[i], 0)
  );
  const sorted = totals
    .map((v, i) => ({ i, v }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 3);
  return new Set(sorted.map(x => x.i));
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function initTooltip() {
  // Tooltip DOM already in index.html
}

function onRibbonEnter(event, d) {
  const tip     = document.getElementById('tooltip');
  const from    = PARTIES[d.source.index];
  const to      = PARTIES[d.target.index];
  const pct     = MATRIX[d.source.index][d.target.index];

  // Get current language
  const lang = new URLSearchParams(window.location.search).get('lang') || 'is';
  const isSelf = d.source.index === d.target.index;

  tip.querySelector('.from').textContent = from.name;
  tip.querySelector('.to').textContent   = to.name;
  tip.querySelector('.pct').textContent  = isSelf
    ? `${pct}% ${lang === 'is' ? 'kjósa sama flokkinn' : 'vote for the same party'}`
    : `${pct}% ${lang === 'is' ? 'af kjósendum ' + from.id + ' 2022 ætla að kjósa ' + to.id : 'of ' + from.id + '-2022 voters intend to vote ' + to.id}`;

  tip.querySelector('.arrow').style.color = from.color;
  tip.removeAttribute('hidden');
  tooltipVisible = true;
  positionTooltip(event);
}

function onRibbonMove(event) {
  if (tooltipVisible) positionTooltip(event);
}

function onRibbonLeave() {
  const tip = document.getElementById('tooltip');
  tip.setAttribute('hidden', '');
  tooltipVisible = false;
}

function positionTooltip(event) {
  const tip = document.getElementById('tooltip');
  const x = event.clientX + 14;
  const y = event.clientY - 10;
  const { width, height } = tip.getBoundingClientRect();
  tip.style.left = (x + width > window.innerWidth ? x - width - 28 : x) + 'px';
  tip.style.top  = (y + height > window.innerHeight ? y - height : y) + 'px';
}
