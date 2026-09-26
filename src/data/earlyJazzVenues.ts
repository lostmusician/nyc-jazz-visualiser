import type { VenueFeature } from '../types';

/**
 * Sourced additions for the Harlem Renaissance, Swing Street, and early bebop.
 *
 * Dates are kept at year precision because the gallery filters by decade. Where
 * a source documents a venue's era but not a precise final night, the record
 * uses the conservative year found in the cited institutional history. Closure
 * reasons are included only where a separate source documents them directly.
 */
export const EARLY_JAZZ_VENUE_IMPORT = {
  accessedOn: '2026-09-22',
  importedCount: 9,
  scope: 'Prominent Manhattan jazz clubs and ballrooms opened from 1923 through 1948.',
} as const;

const LPC_SOURCE = {
  source_url: 'https://s-media.nyc.gov/agencies/lpc/lp/2671.pdf',
  source_publisher: 'NYC Landmarks Preservation Commission',
} as const;

export const EARLY_JAZZ_VENUES: VenueFeature[] = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9364, 40.8198] },
    properties: {
      id: 'early-cotton-club', name: 'Cotton Club (Harlem)', venue_type: 'commercial_club',
      scene_movement: 'harlem_jazz', borough: 'Manhattan', neighborhood: 'Harlem',
      address: '644 Lenox Ave (at W 142nd St)', open_year: 1923, close_year: 1936,
      status: 'relocated', closing_reason: null,
      quote: 'A nationally broadcast showcase for Duke Ellington and Cab Calloway, performed by Black artists for a segregated white audience.',
      notes: 'The original Harlem room operated from 1923 to 1936 before the Cotton Club name moved downtown. Closure economics are not inferred.',
      ...LPC_SOURCE,
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9467, 40.8112] },
    properties: {
      id: 'early-connies-inn', name: "Connie's Inn", venue_type: 'commercial_club',
      scene_movement: 'harlem_jazz', borough: 'Manhattan', neighborhood: 'Harlem',
      address: '2221 7th Ave (at W 131st St)', open_year: 1923, close_year: 1934,
      status: 'relocated',
      closing_reason: 'The Depression and repeal of Prohibition weakened Harlem nightclub business; Connie’s Inn left Harlem for a downtown location.',
      quote: 'A major Prohibition-era Harlem cabaret whose stage featured Fats Waller, Fletcher Henderson, and Louis Armstrong.',
      notes: 'The LPC report dates the Harlem venue to 1923–1934; James Haskins documents the economic pressures and the move downtown.',
      source_url: 'https://ufl.pb.unizin.org/cottonclub/chapter/chapter-5-prohibition-is-repealed-and-the-depression-deepens/',
      source_publisher: 'University of Florida Pressbooks',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.94417, 40.81528] },
    properties: {
      id: 'early-smalls-paradise', name: "Small's Paradise", venue_type: 'commercial_club',
      scene_movement: 'harlem_jazz', borough: 'Manhattan', neighborhood: 'Harlem',
      address: '2294 7th Ave (at W 135th St)', open_year: 1925, close_year: 1986,
      status: 'closed', closing_reason: 'The business went bankrupt and its furniture was sold.',
      quote: 'Ed Smalls created a Black-owned, racially integrated Harlem nightclub that endured across six decades.',
      notes: 'The LPC report identifies a 1925 opening; Leonard Feather reported the 1986 bankruptcy after speaking with John Hammond.',
      source_url: 'https://www.latimes.com/archives/la-xpm-1986-05-11-ca-5382-story.html',
      source_publisher: 'Los Angeles Times',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9369, 40.8177] },
    properties: {
      id: 'early-savoy-ballroom', name: 'Savoy Ballroom', venue_type: 'commercial_club',
      scene_movement: 'harlem_jazz', borough: 'Manhattan', neighborhood: 'Harlem',
      address: '596–600 Lenox Ave (W 140th–141st Sts)', open_year: 1926, close_year: 1958,
      status: 'closed',
      closing_reason: 'Postwar Harlem decline and the waning popularity of big-band jazz made bookings harder; the site was then cleared for the Delano Village housing project.',
      quote: 'The integrated “Home of Happy Feet” made Chick Webb’s orchestra, battles of the bands, and the Lindy Hop central to swing culture.',
      notes: 'The LPC report dates the Savoy to 1926–1958; the Encyclopedia of African-American Culture and History documents its commercial decline and redevelopment.',
      source_url: 'https://www.encyclopedia.com/history/encyclopedias-almanacs-transcripts-and-maps/savoy-ballroom',
      source_publisher: 'Encyclopedia of African-American Culture and History',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9812, 40.7622] },
    properties: {
      id: 'early-hickory-house', name: 'Hickory House', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Midtown',
      address: '144 W 52nd St', open_year: 1933, close_year: 1968,
      status: 'closed', closing_reason: null,
      quote: 'A long-running Swing Street steakhouse and jazz room associated with Joe Marsala and, later, Marian McPartland.',
      notes: 'A 1963 New Yorker profile records that the owners rented and rebuilt the room in 1933, then marked its thirtieth anniversary.',
      source_url: 'https://www.newyorker.com/magazine/1963/02/23/talent-scout-2',
      source_publisher: 'The New Yorker',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.97735, 40.76002] },
    properties: {
      id: 'early-jimmy-ryans', name: "Jimmy Ryan's", venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Midtown',
      address: '53 W 52nd St', open_year: 1934, close_year: 1962,
      status: 'relocated', closing_reason: null,
      quote: 'A 52nd Street center for traditional jazz and Sunday jam sessions that outlasted most of its Swing Street neighbors.',
      notes: 'The record describes the original 52nd Street room only; it relocated to West 54th Street in 1962. LOC photographs document its 1940s jazz program.',
      source_url: 'https://www.loc.gov/item/2023868400/',
      source_publisher: 'Library of Congress',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.97815, 40.76025] },
    properties: {
      id: 'early-three-deuces', name: 'Three Deuces', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Midtown',
      address: '72 W 52nd St', open_year: 1937, close_year: 1950,
      status: 'closed', closing_reason: null,
      quote: 'A cellar club where the Swing Street audience heard the emerging language of bebop at close range.',
      notes: 'The operating span is normalized to the established 1937–1950 chronology; LOC records directly document Miles Davis, Coleman Hawkins, Charlie Parker, and others at the club in 1947.',
      source_url: 'https://www.loc.gov/item/2023867832/',
      source_publisher: 'Library of Congress',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.97795, 40.76017] },
    properties: {
      id: 'early-downbeat-club', name: 'Downbeat Club', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Midtown',
      address: '66 W 52nd St', open_year: 1944, close_year: 1948,
      status: 'closed', closing_reason: null,
      quote: 'A compact 52nd Street room photographed with Billie Holiday, Sarah Vaughan, Dizzy Gillespie, and Art Tatum on its stage.',
      notes: 'The Library of Congress identifies the Downbeat Club at this address from 1944 to 1948.',
      source_url: 'https://www.loc.gov/static/collections/gerry-mulligan/articles-and-essays/jeru-in-the-words-of-gerry-mulligan/charlie-parker.html',
      source_publisher: 'Library of Congress',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9852, 40.7592] },
    properties: {
      id: 'early-royal-roost', name: 'Royal Roost', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Times Square',
      address: '1580 Broadway (at W 47th St)', open_year: 1948, close_year: 1950,
      status: 'closed',
      closing_reason: 'Ralph Watkins left to open the better-funded Bop City; the Roost could not compete for acts and soon closed.',
      quote: 'The “Metropolitan Bopera House” gave bebop a Broadway home and carried its performances over Symphony Sid’s radio broadcasts.',
      notes: 'JazzTimes traces the club’s 1948 bebop breakthrough and the ownership split that preceded its closure.',
      source_url: 'https://www.jazztimes.com/features/profiles/after-hours-new-yorks-jazz-joints-through-the-ages/',
      source_publisher: 'JazzTimes',
    },
  },
];
