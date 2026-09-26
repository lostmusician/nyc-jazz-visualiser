import type { VenueFeature } from '../types';

/**
 * Curated contemporary additions discovered through Big Apple Jazz's actively
 * maintained Manhattan club directory. Restaurants with only occasional jazz,
 * event series, and duplicates of existing records are intentionally excluded.
 * Opening years and current addresses are cross-checked against the venue's own
 * history or a dated local/news source; coordinates come from NYC GeoSearch.
 */
export const CURRENT_JAZZ_VENUE_IMPORT = {
  directoryUrl: 'https://bigapplejazz.com/nyc-jazz-clubs/',
  directoryPublisher: 'Big Apple Jazz',
  geocoderUrl: 'https://geosearch.planninglabs.nyc/',
  accessedOn: '2026-09-23',
  importedCount: 15,
  scope: 'Dedicated or scene-defining Manhattan jazz rooms operating in 2026 and absent from the existing dataset.',
} as const;

export const CURRENT_JAZZ_VENUES: VenueFeature[] = [
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-74.000633, 40.730952] },
    properties: {
      id: 'current-blue-note', name: 'Blue Note New York', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '131 W 3rd St', open_year: 1981, close_year: null, status: 'open', closing_reason: null,
      quote: 'A globally recognized Village room that pairs established headliners with younger jazz, soul, and improvising artists.',
      notes: 'The official history dates the club to 1981; Big Apple Jazz lists it as operating seven days a week.',
      source_url: 'https://www.bluenotejazz.com/nyc/about/', source_publisher: 'Blue Note New York',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.989644, 40.759103] },
    properties: {
      id: 'current-birdland', name: 'Birdland Jazz Club & Theater', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'Midtown West',
      address: '315 W 44th St', open_year: 1986, close_year: null, status: 'open', closing_reason: null,
      quote: 'The revived Birdland carries the historic name into a contemporary Midtown club and theater program.',
      notes: 'Birdland records its 1986 reopening and identifies 315 W 44th St as its present address.',
      source_url: 'https://www.birdlandjazz.com/about/', source_publisher: 'Birdland Jazz Club & Theater',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.983274, 40.761757] },
    properties: {
      id: 'current-iridium', name: 'The Iridium', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'Midtown West',
      address: '1650 Broadway', open_year: 1994, close_year: null, status: 'open', closing_reason: null,
      quote: 'A Times Square listening room shaped by Les Paul’s long residency and a broad jazz, blues, and guitar program.',
      notes: 'Opened in 1994 on 63rd Street and moved to its present Broadway address in 2001.',
      source_url: 'https://www.theiridium.com/about', source_publisher: 'The Iridium',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.988604, 40.744561] },
    properties: {
      id: 'current-jazz-gallery', name: 'The Jazz Gallery', venue_type: 'avant_garde',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'NoMad',
      address: '1158 Broadway, 5th Floor', open_year: 1995, close_year: null, status: 'open', closing_reason: null,
      quote: 'A nonprofit incubator where emerging composers and improvisers develop ambitious new work before intimate audiences.',
      notes: 'Founded in 1995; the organization moved from SoHo to its present NoMad space in 2012.',
      source_url: 'https://jazzgallery.org/about-1', source_publisher: 'The Jazz Gallery',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.968364, 40.801174] },
    properties: {
      id: 'current-smoke', name: 'Smoke Jazz Club', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'Upper West Side',
      address: '2751 Broadway', open_year: 1999, close_year: null, status: 'open', closing_reason: null,
      quote: 'A classic Upper West Side listening room that continued the musical lineage of Augie’s and expanded after the pandemic.',
      notes: 'Opened April 9, 1999 and reopened after a major expansion in 2022.',
      source_url: 'https://www.wbgo.org/music/2022-06-06/smoke-jazz-club-reopens-after-its-pandemic-pause-bigger-and-better', source_publisher: 'WBGO',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.979693, 40.722524] },
    properties: {
      id: 'current-nublu', name: 'Nublu', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'East Village',
      address: '62 Avenue C', open_year: 2002, close_year: null, status: 'open', closing_reason: null,
      quote: 'An East Village clubhouse for jazz, electronic, Brazilian, and improvised music whose collaborations produced a distinct Nublu sound.',
      notes: 'The venue’s official history dates its opening to 2002.',
      source_url: 'https://nublu.net/article/309', source_publisher: 'Nublu',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.983181, 40.768554] },
    properties: {
      id: 'current-dizzys-club', name: "Dizzy's Club", venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'Columbus Circle',
      address: '10 Columbus Circle, 5th Floor', open_year: 2004, close_year: null, status: 'open', closing_reason: null,
      quote: 'Jazz at Lincoln Center’s intimate skyline room anchors nightly performance inside Frederick P. Rose Hall.',
      notes: 'Jazz at Lincoln Center documents the club’s opening in October 2004.',
      source_url: 'https://press.jazz.org/press/2014/09/dizzys-club-coca-cola-october-2014-lineup-announced/', source_publisher: 'Jazz at Lincoln Center',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-74.001929, 40.734592] },
    properties: {
      id: 'current-mezzrow', name: 'Mezzrow', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'West Village',
      address: '163 W 10th St', open_year: 2014, close_year: null, status: 'open', closing_reason: null,
      quote: 'An intimate piano room inspired by Bradley’s, built around close listening and acoustic small-group performance.',
      notes: 'SmallsLIVE dates the opening to September 2014.',
      source_url: 'https://www.smallslive.com/about/', source_publisher: 'SmallsLIVE',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-74.004787, 40.71939] },
    properties: {
      id: 'current-django', name: 'The Django', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'Tribeca',
      address: '2 Avenue of the Americas', open_year: 2015, close_year: null, status: 'open', closing_reason: null,
      quote: 'A vaulted cellar room in the Roxy Hotel presenting nightly jazz in a modern supper-club setting.',
      notes: 'A contemporary Tribeca report documents the club opening in September 2015.',
      source_url: 'https://tribecacitizen.com/2015/09/28/seen-heard-the-roxys-new-jazz-club-is-open/comment-page-1/', source_publisher: 'Tribeca Citizen',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-74.003153, 40.733793] },
    properties: {
      id: 'current-cellar-dog', name: 'Cellar Dog', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'West Village',
      address: '75 Christopher St', open_year: 2021, close_year: null, status: 'open', closing_reason: null,
      quote: 'The former Fat Cat basement returned after the pandemic with late-night jazz, games, and a deliberately casual social atmosphere.',
      notes: 'Opened as Cellar Dog in July 2021 in the former Fat Cat space.',
      source_url: 'https://www.timeout.com/newyork/news/fat-cat-reopens-as-cellar-dog-tomorrow-070621', source_publisher: 'Time Out New York',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.993759, 40.7455] },
    properties: {
      id: 'current-chelsea-table-stage', name: 'Chelsea Table + Stage', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'Chelsea',
      address: '152 W 26th St', open_year: 2021, close_year: null, status: 'open', closing_reason: null,
      quote: 'A pandemic-era opening that combines a purpose-built listening stage with dinner service and wide-ranging jazz and cabaret programming.',
      notes: 'Officially opened September 8, 2021 after a summer of preview performances.',
      source_url: 'https://chelseacommunitynews.com/2022/01/31/chelsea-table-stage-a-unique-new-neighborhood-venue/', source_publisher: 'Chelsea Community News',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.988664, 40.720808] },
    properties: {
      id: 'current-close-up', name: 'Close Up', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'Lower East Side',
      address: '154 Orchard St', open_year: 2024, close_year: null, status: 'open', closing_reason: null,
      quote: 'An artist-driven Lower East Side listening room pairing nightly sets and late jams with an emerging-musician focus.',
      notes: 'The New York City Jazz Record reported its first anniversary in July 2025, establishing a 2024 opening year.',
      source_url: 'https://nycjazzrecord.com/wp-content/uploads/2025/06/tnycjr202507_P04-05.pdf', source_publisher: 'The New York City Jazz Record',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-74.004872, 40.728839] },
    properties: {
      id: 'current-birds', name: 'Birds', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'West Village',
      address: '64 Downing St', open_year: 2025, close_year: null, status: 'open', closing_reason: null,
      quote: 'A compact West Village listening bar mixing jazz with funk, blues, piano-bar culture, and musician-led programming.',
      notes: 'Contemporary coverage documents its opening in September 2025.',
      source_url: 'https://observer.com/2025/09/birds-west-village-live-music-cocktail-bar-opening-new-york-city/', source_publisher: 'Observer',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.989656, 40.76077] },
    properties: {
      id: 'current-jazzcultural', name: 'Jazzcultural', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'Midtown West',
      address: '349 W 46th St', open_year: 2026, close_year: null, status: 'open', closing_reason: null,
      quote: 'A new Restaurant Row room created by the Smalls team as a tribute to Barry Harris and the community-centered bebop tradition.',
      notes: 'Opened March 20, 2026 in the former Swing 46 space.',
      source_url: 'https://ukjazznews.com/new-club-jazzcultural-opens-in-nyc/', source_publisher: 'UK Jazz News',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.98378, 40.757789] },
    properties: {
      id: 'current-pocket', name: 'The Pocket Jazz Club', venue_type: 'commercial_club',
      scene_movement: 'mainstream_jazz', borough: 'Manhattan', neighborhood: 'Midtown West',
      address: '130 W 46th St', open_year: 2026, close_year: null, status: 'open', closing_reason: null,
      quote: 'A new Midtown listening room designed to put major artists and rising musicians in close contact with its audience.',
      notes: 'Opened in May 2026 inside the Muse Hotel.',
      source_url: 'https://www.amny.com/entertainment/inside-the-pocket-jazz-musicians-new-york-city/', source_publisher: 'amNewYork',
    },
  },
];
