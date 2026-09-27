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
      description: "Operating from 1923 to 1936 at 644 Lenox Avenue (at 142nd St), the original Harlem Cotton Club was a nationally known Prohibition-era nightspot that presented Black performers to segregated, predominantly white audiences in a jungle-themed showroom.\n\nNotable Musicians: Duke Ellington, Cab Calloway, Ethel Waters, Ivie Anderson, and Louis Armstrong.\n\nMusic: Duke Ellington’s residency from 1927 to 1931 developed his \"jungle style\" compositions and reached nationwide audiences through NBC radio broadcasts."
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
      description: "Founded in 1923 by Connie and George Immerman at 2221 7th Avenue (at 131st St), Connie’s Inn was a major Prohibition-era cabaret known for elaborate musical revues and prominent jazz headliners.\n\nNotable Musicians: Louis Armstrong, Fats Waller, Fletcher Henderson, Earl Hines, and Don Redman.\n\nMusic: The venue premiered Fats Waller's musical revue Hot Chocolates in 1929, featuring Louis Armstrong’s solo performance of \"Ain't Misbehavin'\"."
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
      description: "Established in 1925 by Ed Smalls at 2294 7th Avenue (at 135th St), Small's Paradise was a Black-owned Harlem nightclub that operated for six decades. Unlike the Cotton Club, it welcomed integrated audiences and became known for its dancing waiters and after-hours jam sessions.\n\nNotable Musicians: Willie \"The Lion\" Smith, James P. Johnson, Roy Eldridge, Ray Charles, and King Curtis.\n\nMusic: Hosted Harlem stride piano battles in the 1920s and 1930s, then became a setting for organ-trio soul jazz in the 1950s and 1960s."
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
      description: "Opened in 1926 at 596 Lenox Avenue in Harlem, the Savoy Ballroom was a major swing dance palace. Spanning an entire city block, the integrated \"Home of Happy Feet\" hosted up to 4,000 dancers a night with two side-by-side bandstands.\n\nNotable Musicians: Chick Webb, Ella Fitzgerald, Count Basie, Benny Goodman, and Erskine Hawkins.\n\nMusic: Its double-bandstand \"battle of the bands\" featured Chick Webb's orchestra and helped establish swing rhythm and the Lindy Hop as central forms of Harlem dance culture."
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
      description: "Operating from 1933 to 1968 at 144 W 52nd St, Hickory House was a popular Swing Street steakhouse where patrons sat around a large circular bar with an elevated bandstand built right in the center.\n\nNotable Musicians: Joe Marsala, Marian McPartland, Adele Girard, Mary Lou Williams, and J.C. Higginbotham.\n\nMusic: Clarinetist Joe Marsala led one of 52nd Street’s early integrated swing groups here in the 1930s, and pianist Marian McPartland maintained a celebrated long-term trio residency through the 1950s and 1960s."
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
      description: "Located at 53 W 52nd St from 1934 to 1962, Jimmy Ryan’s was the steadfast home for Dixieland, traditional New Orleans, and Chicago-style swing on a street that increasingly favored modern bebop.\n\nNotable Musicians: Sidney Bechet, Roy Eldridge, Coleman Hawkins, Zutty Singleton, and Wilbur De Paris.\n\nMusic: Dedicated to unamplified traditional jazz, the club was famous for its energetic Sunday jam sessions and Sidney Bechet’s soaring soprano saxophone performances."
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
      description: "Situated at 72 W 52nd St from 1937 to 1950, the Three Deuces was a compact basement club that played a pivotal role in transitioning Swing Street into the incubator for modern bebop.\n\nNotable Musicians: Charlie Parker, Miles Davis, Coleman Hawkins, Art Tatum, Erroll Garner, and George Shearing.\n\nMusic: Coleman Hawkins recorded his historic 1939 masterpiece \"Body and Soul\" shortly after appearing here, and Charlie Parker and Miles Davis co-led groundbreaking 1947 bebop quintet sets on its stage."
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
      description: "Operating from 1944 to 1948 at 66 W 52nd St, the Downbeat Club was a mid-1940s Swing Street venue where established swing musicians and younger bebop players shared the same bill.\n\nNotable Musicians: Billie Holiday, Dizzy Gillespie, Sarah Vaughan, Coleman Hawkins, and Art Tatum.\n\nMusic: The club hosted vocal sets by Billie Holiday and Sarah Vaughan, as well as early small-group bebop showcases photographed extensively by William P. Gottlieb."
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
      description: "Located at 1580 Broadway (at 47th St) from 1948 to 1950, the Royal Roost was dubbed the \"Metropolitan Bopera House.\" It was the first Broadway-area venue to explicitly feature bebop as its primary attraction.\n\nNotable Musicians: Miles Davis, Charlie Parker, Tadd Dameron, Dexter Gordon, and Fats Navarro.\n\nMusic: Broadcaster Symphony Sid Torin broadcast live nightly sets over WMCA radio from the club, and Miles Davis debuted his nine-piece Birth of the Cool nonet on this stage in September 1948."
    },
  },
];
