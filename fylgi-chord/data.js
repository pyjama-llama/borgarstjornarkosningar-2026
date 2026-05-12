// data.js — Hvaðan kemur fylgið?
// Voter flow matrix: Reykjavík city council 2022 → 2026
// Source: Gallup apríl 2026 (Heimildin, 11. maí 2026)

// ─── Party Definitions ────────────────────────────────────────────────────────
// The order of this array defines the layout around the D3 chord diagram circle.
// Since D3 draws the circle starting from the top (12 o'clock) and moves clockwise,
// placing Right-wing parties at the start of the array puts them on the RIGHT side 
// of the circle, and Left-wing parties towards the end puts them on the LEFT side.
export const PARTIES = [
  { id: 'M',    name: 'Miðflokkurinn',          nameEn: 'Centre Party',          color: '#7f8c8d' },
  { id: 'D',    name: 'Sjálfstæðisflokkur',    nameEn: 'Independence Party',    color: '#2980b9' },
  { id: 'C',    name: 'Viðreisn',              nameEn: 'Reform Party',          color: '#f39c12' },
  { id: 'B',    name: 'Framsóknarflokkur',      nameEn: 'Progressive Party',     color: '#27ae60' },
  { id: 'F',    name: 'Flokkur fólksins',       nameEn: "People's Party",        color: '#8e44ad' },
  { id: 'S',    name: 'Samfylkingin',          nameEn: 'Social Democrats',      color: '#c0392b' },
  { id: 'P',    name: 'Píratar',               nameEn: 'Pirates',               color: '#1abc9c' },
  { id: 'V',    name: 'Vinstri græn',           nameEn: 'Left-Greens',           color: '#2ecc71' },
  { id: 'A',    name: 'A-listinn',              nameEn: 'A-list',                color: '#16a085' },
  { id: 'J',    name: 'Sósíalistaflokkur',      nameEn: 'Socialist Party',       color: '#e74c3c' },
  { id: 'none', name: 'Kusu ekki',              nameEn: 'Did not vote',          color: '#666666' },
];

// ─── Voter Flow Matrix ────────────────────────────────────────────────────────
// Rows (i) represent the 2022 source party.
// Columns (j) represent the 2026 destination party.
// Values represent percentages (0-100). The indices MUST match the PARTIES array above.
export const MATRIX = [
  // FROM:  M   D   C   B   F   S   P   V   A   J  none
  /* M  */ [81, 10,  0,  0,  0,  0,  0,  0,  1,  0,  0],
  /* D  */ [17, 73,  3,  0,  2,  1,  0,  0,  0,  2,  0],
  /* C  */ [ 0, 40, 47,  0,  0, 10,  0,  0,  2,  1,  0],
  /* B  */ [ 8, 40, 10, 27,  1,  5,  0,  0,  4,  3,  0],
  /* F  */ [24, 23,  2,  0, 35,  4,  0,  0,  3,  1,  0],
  /* S  */ [ 1, 11, 10,  0,  0, 62,  2,  0, 10,  3,  0],
  /* P  */ [ 0,  1, 10,  0,  4, 21, 26,  0, 23, 15,  0],
  /* V  */ [ 1,  4,  6,  0,  0, 12,  5,  0, 66,  6,  0],
  /* A  */ [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  /* J  */ [ 1,  7,  1,  0,  4, 10,  2,  0, 59, 16,  0],
  /* none*/[20, 28, 13,  5,  1, 13,  1,  0, 12,  3,  0],
];

// ─── Bilingual copy ──────────────────────────────────────────────────────────

export const i18n = {
  is: {
    title:    'Hvaðan kemur fylgið?',
    subtitle: 'Kjósendaflæði 2022 → 2026 · Reykjavíkurborg',
    langLabel: 'English',
    langUrl:  '?lang=en',
    beats: [
      {
        heading: 'Kjósendur eru á hreyfingu',
        body:    'Talsverður hreyfanleiki er á kjósendum milli borgarstjórnarkosninga. Þetta má lesa úr Gallup-könnun á fylgi þeirra í apríl 2026. Hér má sjá hvert fylgið flyst — hvaðan kemur stuðningur hvers flokks?',
      },
      {
        heading: 'Hverjir halda kjósendum sínum?',
        body:    'Miðflokkurinn (81%) og Sjálfstæðisflokkurinn (73%) eru öflugastir í að halda í eigin kjósendur — svokölluð <strong><em>„Tryggðartala“</em></strong><sup>1)</sup>. Samfylkingin (62%) á líka traustan kjósendahóp. Sósíalistaflokkurinn (16%) og Píratar (26%) eru hins vegar í erfiðari stöðu — kjósendur þeirra eru á hreyfingu.',
      },
      {
        heading: 'Framsóknarflokknum blæðir til hægri',
        body:    'Aðeins 27% af kjósendum Framsóknar 2022 ætla að kjósa sama flokkinn aftur. 40% hafa ákveðið að færast yfir til Sjálfstæðisflokksins. Flokkurinn berst nú fyrir því að halda einum manni í borgarstjórn.',
      },
      {
        heading: 'Sanna dregur vinstri kjósendur með sér',
        body:    '59% af kjósendum Sósíalistaflokksins 2022 ætla að kjósa A-listann. 66% af kjósendum Vinstri grænna 2022 gera það sama. Stór hluti vinstri kjósenda fylgir Sönnu Magdalenu Mörtudóttur yfir á nýjan lista.',
      },
      {
        heading: 'Kannaðu flæðið',
        body:    'Veldu flokk til að sjá hvert fylgi hans flyst — og hvaðan það kemur. Smelltu á band eða snertipunkt til að fá nákvæmari upplýsingar.',
      },
    ],
    source: 'Gögn: <a href="https://heimildin.is/grein/26560/hvadan-kemur-fylgid/" target="_blank" style="color: inherit; text-decoration: underline;">Gallup apríl 2026 · Heimildin, 11. maí 2026</a>',
    credit: 'Hannað og þróað af victor.blaer@fyi-lab.is <a href="https://www.linkedin.com/in/victorblaer" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #0077b5; border-radius: 4px; color: white; text-decoration: none; margin-left: 8px; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a><br><br><small>1) Nafnið yfir þetta hugtak var fundið upp árið 2025 af hundinum mínum heitnum, Maximus. Hann hvílir nú í Valhöll, en fór á önnur tilverustig þann 1. júlí 2025.</small>',
    didNotVote: 'Kusu ekki',
    tooltipArrow: 'kustu → ætla að kjósa',
    filterAll:  'Allir',
    filterTop3: 'Efstu 3',
    btnVisit: 'Skoða fyi-lab.is',
    btnRestart: 'Byrja aftur',
    retentionTitle: 'Tryggðartala Tafla',
    retentionSub: 'Hversu stór hluti kjósenda hvers flokks frá 2022 ætlar að kjósa þann flokk (eða sambærilegt framboð) aftur?',
  },

  en: {
    title:    'Where does the support come from?',
    subtitle: 'Voter flow 2022 → 2026 · Reykjavík City Council',
    langLabel: 'Íslenska',
    langUrl:  '?lang=is',
    beats: [
      {
        heading: 'Voters are on the move',
        body:    'Significant voter mobility exists between city council elections. This emerges from a Gallup survey conducted in April 2026. This chart shows where support is flowing — who is gaining, and who is losing voters?',
      },
      {
        heading: 'Who holds on to their voters?',
        body:    'The Centre Party (81%) and Independence Party (73%) are strongest at retaining their 2022 voters — the so-called <strong><em>"Retention Rate"</em></strong><sup>1)</sup>. Social Democrats hold 62%. By contrast, the Socialist Party (16%) and Pirates (26%) are bleeding — their voters are looking elsewhere.',
      },
      {
        heading: 'Progressive Party bleeding rightward',
        body:    'Only 27% of 2022 Progressive Party voters intend to vote for the same party again. 40% are switching to the Independence Party. The party is now fighting to hold a single seat on city council.',
      },
      {
        heading: 'Sanna pulls the left with her',
        body:    '59% of 2022 Socialist Party voters intend to vote for the A-list. 66% of 2022 Left-Greens voters do too. An entire left wing of Reykjavík politics is reorganizing around Sanna Magdalena Mörtudóttir.',
      },
      {
        heading: 'Explore the flows',
        body:    'Select a party to see where its support is going — and where it comes from. Click a ribbon or arc for details.',
      },
    ],
    source: 'Data: <a href="https://heimildin.is/grein/26560/hvadan-kemur-fylgid/" target="_blank" style="color: inherit; text-decoration: underline;">Gallup April 2026</a>',
    credit: 'Designed and developed by victor.blaer@fyi-lab.is <a href="https://www.linkedin.com/in/victorblaer" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: #0077b5; border-radius: 4px; color: white; text-decoration: none; margin-left: 8px; vertical-align: middle;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a><br><br><small>1) The name for this concept was invented in 2025 by my late dog, Maximus. He now rests in Valhalla, having moved to a different plane of existence on July 1, 2025.</small>',
    didNotVote: 'Did not vote',
    tooltipArrow: 'voted → intend to vote',
    filterAll:  'All',
    filterTop3: 'Top 3',
    btnVisit: 'Visit fyi-lab.is',
    btnRestart: 'Start Over',
    retentionTitle: 'Retention Table',
    retentionSub: 'What percentage of each party\'s 2022 voters intend to vote for that same party (or a comparable movement) again?',
  },
};

// ─── Beat definitions ─────────────────────────────────────────────────────────
// Each beat describes which nodes/chords to highlight.
// Used by chord.js transition functions.

export const BEATS = [
  // Beat 0: All chords visible
  { type: 'all' },

  // Beat 1: Self-loops only (same party 2022 → 2026)
  { type: 'self-loops', highlight: ['M', 'D', 'S'] },

  // Beat 2: Framsókn (B) outgoing chords only
  { type: 'source', source: 'B', highlightTarget: 'D' },

  // Beat 3: J + V outgoing chords, destination A
  { type: 'sources', sources: ['J', 'V'], highlightTarget: 'A' },

  // Beat 4: Full interactive outro — all chords restored, pills active
  { type: 'all', interactive: true },
];
