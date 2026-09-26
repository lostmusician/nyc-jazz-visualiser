import type { VenueFeature } from '../types';

/**
 * Representative Brooklyn, Queens, and Bronx additions supplied during the outer-borough research
 * pass. Each venue is verified against an official site or a dated jazz/local
 * source, and coordinates come from NYC GeoSearch. Jazz listening bars without
 * live performance programming are outside this collection's scope.
 */
export const OUTER_BOROUGH_JAZZ_VENUE_IMPORT = {
  geocoderUrl: 'https://geosearch.planninglabs.nyc/',
  accessedOn: '2026-09-23',
  importedCount: 12,
  scope: 'Representative outer-borough jazz spaces absent from the existing dataset; this is not a comprehensive venue census.',
} as const;

export const OUTER_BOROUGH_JAZZ_VENUES: VenueFeature[] = [
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.947054, 40.681571] },
    properties: {
      id: 'outer-brownstonejazz', name: 'BrownstoneJAZZ', venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation', borough: 'Brooklyn', neighborhood: 'Bedford-Stuyvesant',
      address: '107 Macon St', open_year: 2009, close_year: null, status: 'open', closing_reason: null,
      quote: 'Weekend jazz turns the parlor of an 1887 family brownstone into a living link to Bedford-Stuyvesant’s mid-century club culture.',
      notes: 'Debbie McClain and bassist Eric Lemons established the parlor series in 2009; it remains an intimate, Black-owned cultural preservation space.',
      source_url: 'https://jjajazzawards.org/2025-jazz-hero-debbie-mcclain/', source_publisher: 'Jazz Journalists Association',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.963105, 40.711286] },
    properties: {
      id: 'outer-williamsburg-music-center', name: 'Williamsburg Music Center', venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation', borough: 'Brooklyn', neighborhood: 'Williamsburg',
      address: '367 Bedford Ave', open_year: 1981, close_year: null, status: 'open', closing_reason: null,
      quote: 'Brooklyn’s long-running Black-owned jazz institution centers the African musical diaspora and provides musicians with a neighborhood stage.',
      notes: 'Composer and musician Gerry Eastman opened the venue in 1981 as a safe performance space for musicians of color.',
      source_url: 'https://wmcjazz.com/about-us-1', source_publisher: 'Williamsburg Music Center',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.969282, 40.680216] },
    properties: {
      id: 'outer-soapbox-gallery', name: 'Soapbox Gallery', venue_type: 'avant_garde',
      scene_movement: 'brooklyn_continuation', borough: 'Brooklyn', neighborhood: 'Prospect Heights',
      address: '636 Dean St', open_year: 2018, close_year: null, status: 'open', closing_reason: null,
      quote: 'A purpose-built acoustic gallery where contemporary jazz, solo piano, visual art, and live-streamed performance share one experimental room.',
      notes: 'The former sculpture studio began its present music-focused chapter after renovation and installation of its Yamaha C7 grand piano in 2018.',
      source_url: 'https://www.jazztimes.com/festivals-events/scenes/the-scene-brooklyns-soapbox-gallery/', source_publisher: 'JazzTimes',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.955827, 40.712601] },
    properties: {
      id: 'outer-st-mazie', name: 'St. Mazie Bar & Supper Club', venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation', borough: 'Brooklyn', neighborhood: 'Williamsburg',
      address: '345 Grand St', open_year: 2013, close_year: null, status: 'open', closing_reason: null,
      quote: 'A candlelit Williamsburg supper club that keeps early jazz, swing, and acoustic ensemble music in a neighborhood nightlife setting.',
      notes: 'Contemporary listings establish the venue at this address in 2013; its official site continues to advertise live music and daily service.',
      source_url: 'https://www.timeout.com/newyork/bars/st-mazie', source_publisher: 'Time Out New York',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.934682, 40.683398] },
    properties: {
      id: 'outer-lunatico', name: 'LunÀtico', venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation', borough: 'Brooklyn', neighborhood: 'Bedford-Stuyvesant',
      address: '486 Halsey St', open_year: 2015, close_year: null, status: 'open', closing_reason: null,
      quote: 'A musician-run Bed-Stuy room where jazz shares a tiny stage with global roots music, funk, flamenco, and singer-songwriters every night.',
      notes: 'Opened in 2015 by touring musicians; the owners continue to support performers through nightly programming and audience donations.',
      source_url: 'https://www.jazztimes.com/festivals-events/scenes/the-scene-brooklyns-bar-lunatico/', source_publisher: 'JazzTimes',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.951007, 40.662018] },
    properties: {
      id: 'outer-bar-bayeux', name: 'Bar Bayeux', venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation', borough: 'Brooklyn', neighborhood: 'Prospect Lefferts Gardens',
      address: '1066 Nostrand Ave', open_year: 2018, close_year: null, status: 'open', closing_reason: null,
      quote: 'A small neighborhood cocktail bar that has become a serious modern-jazz room through musician-led booking and close audience contact.',
      notes: 'Opened on New Year’s Eve 2018; bassist-owner Jeremy Stratton describes the club as a Brooklyn successor to the East Village’s Grassroots Tavern community.',
      source_url: 'https://jazzgeneration.org/blog/venueprofiles-barbayeux', source_publisher: 'Jazz Generation',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.932079, 40.695475] },
    properties: {
      id: 'outer-ornithology', name: 'Ornithology Jazz Club', venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation', borough: 'Brooklyn', neighborhood: 'Bushwick',
      address: '6 Suydam St', open_year: 2021, close_year: null, status: 'open', closing_reason: null,
      quote: 'A no-cover Bushwick club built around nightly live jazz, open jams, and a grand piano rather than a conventional ticketed-room model.',
      notes: 'Mitchell Borden and Rie Yamaguchi-Borden opened Ornithology in October 2021 with support from the Gotham Yardbird Sanctuary.',
      source_url: 'https://bushwickdaily.com/arts-culture/bushwicks-ornithology-jazz-club-serves-up-vegan-food-and-free-nightly-jam-sessions/', source_publisher: 'Bushwick Daily',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.923588, 40.708234] },
    properties: {
      id: 'outer-red-pavilion', name: 'The Red Pavilion', venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation', borough: 'Brooklyn', neighborhood: 'Bushwick',
      address: '1241 Flushing Ave', open_year: 2023, close_year: null, status: 'open', closing_reason: null,
      quote: 'An AAPI-focused neo-noir cabaret where a house jazz band, concerts, theater, and nightlife place Asian artists at the center of the program.',
      notes: 'Opened in March 2023 and continues to present live jazz alongside cabaret and other cultural programming.',
      source_url: 'https://www.theredpavilion.com/', source_publisher: 'The Red Pavilion',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.8856, 40.7444] },
    properties: {
      id: 'outer-terraza-7', name: 'Terraza 7', venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation', borough: 'Queens', neighborhood: 'Elmhurst',
      address: '40-19 Gleane St', open_year: 2002, close_year: null, status: 'open', closing_reason: null,
      notes: 'A musician-founded Queens venue presenting jazz and music from across Latin America and the wider diaspora.',
      source_url: 'https://www.terraza7.com/', source_publisher: 'Terraza 7', operating_model: 'artist_led',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.8308, 40.7638] },
    properties: {
      id: 'outer-flushing-town-hall', name: 'Flushing Town Hall', venue_type: 'cultural_center',
      scene_movement: 'brooklyn_continuation', borough: 'Queens', neighborhood: 'Flushing',
      address: '137-35 Northern Blvd', open_year: 1979, close_year: null, status: 'open', closing_reason: null,
      notes: 'A nonprofit cultural institution with a restored theater, jazz programming, and the Queens Jazz Orchestra.',
      source_url: 'https://www.flushingtownhall.org/mission-and-history', source_publisher: 'Flushing Town Hall', operating_model: 'nonprofit',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.9007, 40.8213] },
    properties: {
      id: 'outer-845-club', name: '845 Club', venue_type: 'commercial_club',
      scene_movement: 'harlem_jazz', borough: 'Bronx', neighborhood: 'Longwood',
      address: '845 Prospect Ave', open_year: 1940, close_year: 1960, status: 'closed', closing_reason: null,
      notes: 'One of the Boston Road-area rooms remembered in Bronx music history for appearances by musicians including Dizzy Gillespie and Art Blakey.',
      source_url: 'https://bronxmusichall.org/bronx-music-history/', source_publisher: 'Bronx Music Hall', operating_model: 'commercial',
    },
  },
  {
    type: 'Feature', geometry: { type: 'Point', coordinates: [-73.9081, 40.8239] },
    properties: {
      id: 'outer-bronx-music-hall', name: 'Bronx Music Hall', venue_type: 'cultural_center',
      scene_movement: 'brooklyn_continuation', borough: 'Bronx', neighborhood: 'Melrose',
      address: '438 E 163rd St', open_year: 2024, close_year: null, status: 'open', closing_reason: null,
      notes: 'A community cultural center presenting Bronx music history and contemporary programs, including Latin jazz.',
      source_url: 'https://bronxmusichall.org/', source_publisher: 'Bronx Music Hall', operating_model: 'nonprofit',
    },
  },
];
