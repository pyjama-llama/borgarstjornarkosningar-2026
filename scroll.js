// scroll.js — Scrollama wiring
// Hvaðan kemur fylgið? · Step → beat mapping

import { PARTIES, i18n, BEATS } from './data.js';
import { applyBeat, applyFilter } from './chord.js';

// ─── State ────────────────────────────────────────────────────────────────────
let scroller;
let currentStep = 0;
const lang = new URLSearchParams(window.location.search).get('lang') || 'is';
const t    = i18n[lang];

// ─── Init ─────────────────────────────────────────────────────────────────────
export function initScroll() {
  buildStepCards();
  buildFilterPills();
  buildProgressDots();

  scroller = scrollama();

  scroller
    .setup({
      step:   '.step',
      offset: 0.5,
      debug:  false,
    })
    .onStepEnter(onStepEnter)
    .onStepExit(onStepExit);

  // Re-calculate on resize
  window.addEventListener('resize', scroller.resize);
}

// ─── Build step cards from i18n beats ─────────────────────────────────────────
function buildStepCards() {
  const col = document.getElementById('scroll-steps');
  col.innerHTML = '';

  t.beats.forEach((beat, i) => {
    const div = document.createElement('div');
    div.className = 'step';
    div.dataset.step = i;

    const num = document.createElement('div');
    num.className = 'step-number';
    num.textContent = `${String(i + 1).padStart(2, '0')} / ${t.beats.length}`;

    const h2 = document.createElement('h2');
    h2.textContent = beat.heading;

    const p = document.createElement('p');
    p.innerHTML = beat.body;

    div.append(num, h2, p);

    // Beat 4 gets the filter pills injected here
    if (i === t.beats.length - 1) {
      const filterBar = document.createElement('div');
      filterBar.id = 'filter-bar';
      div.appendChild(filterBar);
    }

    col.appendChild(div);
  });
}

// ─── Filter pills ─────────────────────────────────────────────────────────────
function buildFilterPills() {
  // Will be injected by buildStepCards into the last step
  // We populate after the DOM is ready
  setTimeout(() => {
    const bar = document.getElementById('filter-bar');
    if (!bar) return;

    const filters = [
      { id: 'all',  label: t.filterAll  },
      { id: 'top3', label: t.filterTop3 },
      ...PARTIES.map(p => ({
        id:    p.id,
        label: p.name,
        color: p.color,
        title: p.name,
      })),
    ];

    filters.forEach(f => {
      const btn = document.createElement('button');
      btn.className   = 'pill';
      btn.dataset.filter = f.id;
      btn.textContent = f.label;
      if (f.title) btn.title = f.title;
      if (f.color) btn.style.setProperty('--pill-color', f.color);

      btn.addEventListener('click', () => {
        // Deselect logic: if clicking an already active pill (and it's not 'all')
        if (btn.classList.contains('active') && f.id !== 'all') {
          const allPill = bar.querySelector('[data-filter="all"]');
          if (allPill) allPill.click();
          return;
        }

        // Update active state
        bar.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');

        applyFilter(f.id, t);
      });

      bar.appendChild(btn);
    });

    // Default: 'Allir' active
    const allPill = bar.querySelector('[data-filter="all"]');
    if (allPill) {
      allPill.classList.add('active');
      allPill.style.background  = 'var(--surface-2)';
      allPill.style.borderColor = 'var(--accent)';
    }
  }, 0);
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function buildProgressDots() {
  const container = document.getElementById('progress-dots');
  if (!container) return;
  container.innerHTML = '';

  BEATS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    dot.dataset.dot = i;
    container.appendChild(dot);
  });

  updateProgressDots(0);
}

function updateProgressDots(activeIndex) {
  document.querySelectorAll('.progress-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === activeIndex);
  });
}

// ─── Scroll callbacks ─────────────────────────────────────────────────────────
function onStepEnter({ element, index, direction }) {
  currentStep = index;

  // Activate current step card
  document.querySelectorAll('.step').forEach(el => el.classList.remove('is-active'));
  element.classList.add('is-active');

  // Update progress dots
  updateProgressDots(index);

  // Fire beat transition
  applyBeat(index, true);

  // Dynamic Background
  const dynamicBg = document.getElementById('dynamic-bg');
  if (dynamicBg) {
    if (index === 3) {
      dynamicBg.style.backgroundImage = "url('Sanna.jpg')";
      dynamicBg.style.opacity = '0.15';
    } else {
      dynamicBg.style.opacity = '0';
    }
  }

  console.log(`[scroll] Step ${index} entered (${direction}) → beat: ${BEATS[index].type}`);
}

function onStepExit({ element, index, direction }) {
  element.classList.remove('is-active');
}
