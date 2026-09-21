import type { ClubExhibit, ListeningPair, VenueSimulationPreset } from '../types';

export const FEATURED_LISTENING_PAIR: ListeningPair = {
  id: 'which-set-2026',
  prompt: 'Which set would you stay for?',
  reflection: 'What did you hear before you knew when—or where—the music was made?',
  options: [
    {
      id: 'a',
      label: 'Room A',
      src: '/audio/web/piano.mp3',
      excerpt: [0, 24],
      credit: {
        title: 'Piano room study',
        artist: 'Project listening study',
        date: 'Prototype recording',
        license: 'Rights review required before public release',
        attribution: 'Temporary study assembled from the project audio stems.',
        description: 'A close, harmonically grounded piano texture with room ambience.',
        rightsStatus: 'prototype',
      },
    },
    {
      id: 'b',
      label: 'Room B',
      src: '/audio/web/sax.mp3',
      excerpt: [0, 24],
      credit: {
        title: 'Saxophone room study',
        artist: 'Project listening study',
        date: 'Prototype recording',
        license: 'Rights review required before public release',
        attribution: 'Temporary study assembled from the project audio stems.',
        description: 'A more exposed saxophone line with unstable edges and open space.',
        rightsStatus: 'prototype',
      },
    },
  ],
};

export const CLUB_EXHIBITS: ClubExhibit[] = [
  {
    id: 'mintons',
    venueId: '0003',
    roomLabel: 'Stop 01 · The jam table',
    name: "Minton's Playhouse",
    years: 'Harlem · opened 1938',
    neighborhood: '210 West 118th Street',
    interaction: 'jam-table',
    prompt: 'Tap a chair. Who had to be in the room for a new musical language to form?',
    wallLabel: 'After-hours exchange made the room more than a stage: it was a place to test ideas in front of peers, night after night.',
    image: '/art/rooms/clubs-room.png',
    accent: '#d79043',
    moments: [
      { id: 'monk', label: 'Piano', title: 'Thelonious Monk', detail: 'Angular voicings and rhythmic space turned the house piano into a laboratory.' },
      { id: 'gillespie', label: 'Trumpet', title: 'Dizzy Gillespie', detail: 'Fast harmonic movement and new accents circulated through the after-hours sessions.' },
      { id: 'clarke', label: 'Drums', title: 'Kenny Clarke', detail: 'Time moved to the ride cymbal, freeing the bass drum for interruption and surprise.' },
      { id: 'parker', label: 'Alto sax', title: 'Charlie Parker', detail: 'Melodic lines moved through familiar song forms at unfamiliar speed and density.' },
    ],
    sources: [
      { label: 'Library of Congress · Charlie Parker collection essay', url: 'https://www.loc.gov/static/collections/gerry-mulligan/articles-and-essays/jeru-in-the-words-of-gerry-mulligan/charlie-parker.html' },
      { label: 'Library of Congress · Dizzy Gillespie photographs and history', url: 'https://blogs.loc.gov/loc/2018/01/this-day-in-history-celebrating-dizzy-gillespie-through-photographs-and-more/' },
    ],
  },
  {
    id: 'five-spot',
    venueId: '0025',
    roomLabel: 'Stop 02 · The changing bill',
    name: 'The Five Spot Café',
    years: 'Cooper Square · 1956–1976',
    neighborhood: '5 Cooper Square',
    interaction: 'handbills',
    prompt: 'Change the bill. What can an extended booking make possible that a single concert cannot?',
    wallLabel: 'The bill changed, but the room kept giving adventurous musicians time: repeated nights let audiences and artists learn how to hear one another.',
    image: '/art/rooms/clubs-room.png',
    accent: '#b94f39',
    moments: [
      { id: 'taylor', label: '1957 · First engagement', title: 'Cecil Taylor Quartet', detail: 'The club opened its jazz policy with music whose density and attack unsettled familiar expectations.' },
      { id: 'monk-coltrane', label: '1957 · Six-month residency', title: 'Monk with Coltrane', detail: 'An extended run made the bandstand a place for daily revision rather than a one-night showcase.' },
      { id: 'coleman', label: '1959 · New York debut', title: 'Ornette Coleman Quartet', detail: 'A sustained engagement gave listeners time to argue with—and eventually enter—a new musical logic.' },
    ],
    sources: [
      { label: 'Museum of Modern Art · Judson and the Five Spot', url: 'https://press.moma.org/wp-content/uploads/2018/01/7_judson_sectionsubsectiontexts.pdf' },
    ],
  },
  {
    id: 'rivbea',
    venueId: '0011',
    roomLabel: 'Stop 03 · The artist-run loft',
    name: 'Studio Rivbea',
    years: 'NoHo · 1970–1980',
    neighborhood: '24 Bond Street',
    interaction: 'loft-mixer',
    prompt: 'Build the room’s sound. Which layers appear when musicians control the space?',
    wallLabel: 'A loft could be rehearsal room, home, venue and meeting place at once. Its informality shifted control from a club owner toward the artists themselves.',
    image: '/art/rooms/clubs-room.png',
    accent: '#8b6e4a',
    moments: [
      { id: 'bass', label: 'Bass · Fred Hopkins', title: 'Foundation', detail: 'The bassist heard on the Wildflowers sessions lets pulse remain present without deciding where every phrase must land.' },
      { id: 'drums', label: 'Drums · Andrew Cyrille', title: 'Collective time', detail: 'Rhythm becomes a field the ensemble can enter and leave, rather than a fixed backbeat.' },
      { id: 'piano', label: 'Piano · Anthony Davis', title: 'Architecture', detail: 'Harmony sketches temporary walls inside the open floor.' },
      { id: 'sax', label: 'Sax · Sam Rivers', title: 'A voice in the loft', detail: 'Rivers could stretch a line because his own room was not timing a table turn.' },
    ],
    sources: [
      { label: 'Project venue research record · source verification in progress', url: '#methodology' },
    ],
  },
  {
    id: 'sistas',
    venueId: '0016',
    roomLabel: 'Stop 04 · The community room',
    name: "Sistas' Place",
    years: 'Bedford-Stuyvesant · 1995–present',
    neighborhood: '456 Nostrand Avenue',
    interaction: 'community-wall',
    prompt: 'Open the community wall. What keeps a room alive beyond ticket sales?',
    wallLabel: 'This is not simply a displaced Manhattan scene. The room connects performance to Black community history, political work, mentorship and neighbourhood stewardship.',
    image: '/art/rooms/clubs-room.png',
    accent: '#45706d',
    moments: [
      { id: 'spirit', label: 'Program · Ahmed Abdullah', title: 'Music of the Spirit', detail: 'The trumpeter and music director names the music through African American cultural lineage rather than treating jazz as décor.' },
      { id: 'oral-history', label: 'Archive · Randy Weston', title: 'Brooklyn oral histories', detail: 'Musicians and organizers record the social memory that a performance calendar alone cannot hold.' },
      { id: 'festival', label: 'Network · Central Brooklyn', title: 'A neighbourhood festival circuit', detail: 'A room becomes durable through relationships with artists and a wider network of community institutions.' },
    ],
    sources: [
      { label: "Sistas' Place · History and oral histories", url: 'https://sistasplace.org/history/' },
      { label: 'New York State Assembly · 2015 cultural institution resolution', url: 'https://nystateassembly.granicus.com/DocumentViewer.php?file=nystateassembly_51394e2126e86b90b775fe72efdf9c01.pdf&view=1' },
    ],
  },
];

export const VENUE_SIMULATION_PRESETS: VenueSimulationPreset[] = [
  {
    id: 'loft-1976', label: 'Artist loft', place: 'NoHo', year: '1976', capacity: 80,
    monthlyRent: 1800, fixedOperatingCost: 2200, attendanceRate: 0.7,
    note: 'Illustrative low-overhead loft: mixed living, rehearsal and performance use.',
    sources: [{ label: 'NYC Planning · SoHo/NoHo artist live-work history', url: 'https://www.nyc.gov/assets/planning/download/pdf/about/cpc/800458.pdf' }],
  },
  {
    id: 'les-2007', label: 'Downtown club', place: 'Lower East Side', year: '2007', capacity: 130,
    monthlyRent: 11500, fixedOperatingCost: 9000, attendanceRate: 0.68,
    note: 'Illustrative licensed club: higher rent, staffing, insurance and service costs.',
    sources: [{ label: 'NYC Comptroller · long-term storefront vacancy context', url: 'https://comptroller.nyc.gov/reports/whos-minding-the-storefronts/' }],
  },
  {
    id: 'brooklyn-now', label: 'Community room', place: 'Central Brooklyn', year: 'Present', capacity: 95,
    monthlyRent: 7200, fixedOperatingCost: 7600, attendanceRate: 0.72,
    note: 'Illustrative contemporary room balancing access, artist pay and regular programming.',
    sources: [{ label: 'NYC Planning · citywide storefront activity', url: 'https://www.nyc.gov/assets/planning/download/pdf/planning-level/housing-economy/nyc_dcp_storefront_report_1024.pdf' }],
  },
];

export const EXHIBIT_VENUE_IDS = CLUB_EXHIBITS.map((club) => club.venueId);
