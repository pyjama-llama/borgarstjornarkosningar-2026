# fylgi-chord

**Hvaðan kemur fylgið?** — A scrollytelling chord diagram visualizing voter flow between Reykjavík city council elections 2022 → 2026.

Live: [pyjama-llama.github.io/fylgi-chord](https://pyjama-llama.github.io/fylgi-chord/)  
English: [pyjama-llama.github.io/fylgi-chord/?lang=en](https://pyjama-llama.github.io/fylgi-chord/?lang=en)

---

## Source

- **Data:** Gallup poll, April 2026 (published Heimildin, 11 May 2026)
- **Story:** Voter flow from Reykjavík city council election 2022 → declared intent for 2026 election
- **Analysis:** Victor Blær, fyi-lab.is

---

## Stack

| Layer | Tool |
|---|---|
| Chart | D3.js v7 (CDN) |
| Scroll | Scrollama v3 (CDN) |
| Build | None — static HTML/CSS/JS |
| Hosting | GitHub Pages |

No npm, no bundler, no build step. Push to `main` and it's live.

---

## Deploy

1. Go to repo **Settings → Pages**
2. Source: `main` branch, `/ (root)` folder
3. Save — live in ~60 seconds

---

## File structure

```
index.html   ← Shell + bootstrap
style.css    ← Design system + scrollytelling layout
data.js      ← Matrix + i18n strings (IS + EN)
chord.js     ← D3 chord draw + beat transitions
scroll.js    ← Scrollama step → beat wiring
```

---

## Beats (scroll steps)

| Step | Chord state |
|---|---|
| 0 | All chords visible |
| 1 | Self-loops only (tryggðartala) |
| 2 | Framsókn (B) outgoing only |
| 3 | J + V outgoing to A |
| 4 | Full diagram restored + filter pills |

---

## Bilingual

- Icelandic: `/fylgi-chord/`
- English: `/fylgi-chord/?lang=en`

All copy is in `i18n.is` / `i18n.en` objects in `data.js`. No page reload on language switch — language is set once on init from URL param.

---

## Future enhancements

- **Particle animation:** `particles.js` module — animated dots flowing along ribbon paths
- **OG image:** Screenshot of the chord at each beat state for social sharing
- **Embed mode:** `?embed=true` strips header/footer for iframe use in Heimildin CMS

---

## Arc label integration

Drop your label placement code into `chord.js` at the marked section:

```js
// ╔══════════════════════════════════════════════════╗
// ║  LABEL INTEGRATION POINT                        ║
// ╚══════════════════════════════════════════════════╝
```

Labels should be `<text class="arc-label">` elements — the beat transitions will automatically manage their opacity.
