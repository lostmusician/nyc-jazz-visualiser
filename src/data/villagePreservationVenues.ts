import type { VenueFeature } from '../types';

/**
 * A focused import from Village Preservation's public jazz-map directory.
 *
 * Scope: performance venues in Greenwich Village, the East Village, and NoHo.
 * Homes, recording studios, parks, and records that merge several incarnations
 * of a venue were deliberately excluded. The source supplies discovery facts
 * (name, address, and operating-date label), not a verified cause of closure.
 */
export const VILLAGE_PRESERVATION_IMPORT = {
  sourceUrl: 'https://jazzmap.villagepreservation.org/',
  sourcePublisher: 'Village Preservation Jazz Map',
  accessedOn: '2026-09-21',
  importedCount: 18,
  scope: 'Performance venues only; residences, studios, parks, and ambiguous revivals excluded.',
} as const;

const sourceNote = (dateLabel: string) =>
  `Village Preservation directory date label: ${dateLabel}. Address and dates are source-derived; no cause of closure is inferred.`;

export const VILLAGE_PRESERVATION_VENUES: VenueFeature[] = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.003453, 40.733208] },
    properties: {
      id: 'vp-arthurs-tavern', name: "Arthur's Tavern", venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'West Village',
      address: '57 Grove St', open_year: 1937, close_year: null, status: 'open', closing_reason: null,
      notes: sourceNote('1937–present'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.00469, 40.733813] },
    properties: {
      id: 'vp-boomers', name: "Boomer's", venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'West Village',
      address: '340 Bleecker St', open_year: 1969, close_year: 1977, status: 'closed', closing_reason: null,
      notes: sourceNote('1969–1977'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.99501, 40.729177] },
    properties: {
      id: 'vp-bottom-line', name: 'The Bottom Line', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '15 W 4th St', open_year: 1974, close_year: 2004, status: 'closed', closing_reason: null,
      notes: sourceNote('1974–2004'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.999618, 40.728122] },
    properties: {
      id: 'vp-cafe-au-go-go', name: 'Caf\u00e9 Au Go Go / Gaslight at the Au Go Go', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '152 Bleecker St', open_year: 1964, close_year: 1970, status: 'closed', closing_reason: null,
      notes: sourceNote('1964–1970'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.001946, 40.732823] },
    properties: {
      id: 'vp-cafe-society', name: 'Caf\u00e9 Society', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'West Village',
      address: '2 Sheridan Square', open_year: 1938, close_year: 1948, status: 'closed', closing_reason: null,
      notes: sourceNote('1938–1948'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.988642, 40.727841] },
    properties: {
      id: 'vp-central-plaza', name: 'Central Plaza', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'East Village',
      address: '111 2nd Ave', open_year: 1949, close_year: 1963, status: 'closed', closing_reason: null,
      notes: sourceNote('1949–1963'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.994089, 40.731694] },
    properties: {
      id: 'vp-cookery', name: 'The Cookery', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '21 University Pl', open_year: 1970, close_year: 1984, status: 'closed', closing_reason: null,
      notes: sourceNote('1970–1984'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.984038, 40.725862] },
    properties: {
      id: 'vp-east-village-in', name: 'East Village In / Jazzboat', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'East Village',
      address: '101 Avenue A', open_year: 1968, close_year: 1979, status: 'closed', closing_reason: null,
      notes: sourceNote('late 1960s–late 1970s (normalized to 1968–1979)'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.997217, 40.729437] },
    properties: {
      id: 'vp-eddie-condons', name: "Eddie Condon's", venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '47 W 3rd St', open_year: 1945, close_year: 1961, status: 'closed', closing_reason: null,
      notes: sourceNote('1945–1961'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.001656, 40.728141] },
    properties: {
      id: 'vp-hot-feet-club', name: 'Hot Feet Club', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '142 W Houston St', open_year: 1928, close_year: 1933, status: 'closed', closing_reason: null,
      notes: sourceNote('approximately 1928–1933'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.985883, 40.727592] },
    properties: {
      id: 'vp-jazz-gallery', name: 'Jazz Gallery', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'East Village',
      address: '78–80 St Marks Pl', open_year: 1959, close_year: 1964, status: 'closed', closing_reason: null,
      notes: sourceNote('1959–1964; the address later became Theater 80'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.99995, 40.7288] },
    properties: {
      id: 'vp-lush-life', name: 'Lush Life', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '184 Thompson St', open_year: 1981, close_year: 1985, status: 'closed', closing_reason: null,
      notes: sourceNote('1981–1985'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.002402, 40.734738] },
    properties: {
      id: 'vp-nicks-tavern', name: "Nick's Tavern", venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'West Village',
      address: '140 7th Ave S', open_year: 1922, close_year: 1963, status: 'closed', closing_reason: null,
      notes: sourceNote('1922–1963'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.99705, 40.72961] },
    properties: {
      id: 'vp-open-door', name: 'Open Door', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '55 W 3rd St', open_year: 1950, close_year: 1959, status: 'closed', closing_reason: null,
      notes: sourceNote('1950s (normalized to 1950–1959)'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.000621, 40.73126] },
    properties: {
      id: 'vp-pepper-pot', name: 'The Pepper Pot / Club Chantilly', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '146 W 4th St', open_year: 1918, close_year: 1949, status: 'closed', closing_reason: null,
      notes: sourceNote('1918–late 1940s (normalized to 1949)'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.004469, 40.730269] },
    properties: {
      id: 'vp-seventh-avenue-south', name: 'Seventh Avenue South', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'West Village',
      address: '21 7th Ave S', open_year: 1977, close_year: 1987, status: 'closed', closing_reason: null,
      notes: sourceNote('1977–1987'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.987023, 40.728844] },
    properties: {
      id: 'vp-stuyvesant-casino', name: 'Stuyvesant Casino', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'East Village',
      address: '140–142 2nd Ave', open_year: 1910, close_year: 1959, status: 'closed', closing_reason: null,
      notes: sourceNote('1910–1950s (normalized to 1959)'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.991741, 40.725659] },
    properties: {
      id: 'vp-tin-palace', name: 'Tin Palace', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'East Village',
      address: '325 Bowery', open_year: 1973, close_year: 1979, status: 'closed', closing_reason: null,
      notes: sourceNote('1973–1979'), source_url: VILLAGE_PRESERVATION_IMPORT.sourceUrl,
      source_publisher: VILLAGE_PRESERVATION_IMPORT.sourcePublisher,
    },
  },
];
