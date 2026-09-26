import type { ClubProfile } from '../gallery/model';
import { NYC_JAZZ_VENUES } from './venues';

const youtubeSearch = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export const CLUB_PROFILES: ClubProfile[] = [
  {
    venueId: '0001',
    description: 'A Harlem Art Deco room whose Zebra Room made elegance, intimacy, and late-night improvisation part of the same ritual.',
    image: '/images/jazz-club-scenes-1940s-01.jpg', imageAlt: 'A crowded mid-century jazz room in performance.',
    imageCredit: 'Project archival study image', imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [{ id: 'lenox-holiday', title: 'God Bless the Child', artist: 'Billie Holiday', year: 1941, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Billie Holiday God Bless the Child official audio'), evidenceUrl: 'https://www.cbsnews.com/newyork/news/historic-lenox-lounge-in-harlem-to-close-on-new-years-eve/', note: 'Holiday performed at the Lenox Lounge; this recording evokes the room rather than documenting a specific set.' }],
  },
  {
    venueId: '0002', description: 'A Sugar Hill neighborhood room remembered for Monday jam sessions that carried several generations into the early morning.',
    image: '/images/jazz-club-scenes-1940s-08.jpg', imageAlt: 'Jazz musicians performing closely together in a nightclub.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [{ id: 'stnicks-jam', title: 'After Hours', artist: 'The Three Sounds', year: 1961, relationship: 'representative-of-scene', listenUrl: youtubeSearch('The Three Sounds After Hours'), evidenceUrl: 'https://www.theguardian.com/music/2015/oct/06/new-york-city-jazz-venues-gentrification-indie-clubs', note: 'A representative late-night jam selection; no claim is made that this take was recorded at St. Nick’s.' }],
  },
  {
    venueId: '0003', description: 'The musicians’ workshop where Thelonious Monk, Dizzy Gillespie, Charlie Christian, and others tested the language that became bebop.',
    image: '/images/jazz-club-scenes-1940s-03.jpg', imageAlt: 'A small jazz ensemble performing in a crowded room.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [{ id: 'mintons-epistrophy', title: 'Epistrophy', artist: 'Thelonious Monk', year: 1948, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Thelonious Monk Epistrophy 1948'), evidenceUrl: 'https://www.nps.gov/articles/000/minton-s-playhouse.htm', note: 'Monk was central to Minton’s house band; this studio performance represents music forged in those sessions.' }],
  },
  {
    venueId: '0020', description: 'The original “Jazz Corner of the World,” named for Charlie Parker and built around a nightly collision of bebop stars and big-band royalty.',
    image: '/images/jazz-club-scenes-1940s-12.jpg', imageAlt: 'A saxophonist under a nightclub spotlight.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [{ id: 'birdland-lullaby', title: 'Lullaby of Birdland', artist: 'George Shearing', year: 1952, relationship: 'documented-performance', listenUrl: youtubeSearch('George Shearing Lullaby of Birdland 1952'), evidenceUrl: 'https://www.birdlandjazz.com/history', note: 'Written for the club and its radio broadcast; this is the venue’s signature composition.' }],
  },
  {
    venueId: '0021', description: 'A musician-backed 52nd Street room whose door carried the signatures of the players who made Swing Street legendary.',
    image: '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(16).jpg', imageAlt: 'A singer performing with a jazz ensemble.', imageCredit: 'William P. Gottlieb collection study image', imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [{ id: 'famous-door-basie', title: "One O’Clock Jump", artist: 'Count Basie Orchestra', year: 1937, relationship: 'documented-performance', listenUrl: youtubeSearch('Count Basie One O Clock Jump 1937'), evidenceUrl: 'https://www.jazzwax.com/2014/04/the-famous-door-1935-60.html', note: 'Count Basie’s orchestra held a celebrated Famous Door engagement; this was its theme.' }],
  },
  {
    venueId: '0022', description: 'A narrow 52nd Street club where swing gave way to the sharper contours of modern jazz in the mid-1940s.',
    image: '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(29).jpg', imageAlt: 'Jazz artists gathered around a nightclub microphone.', imageCredit: 'William P. Gottlieb collection study image', imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [{ id: 'onyx-tunisia', title: 'A Night in Tunisia', artist: 'Dizzy Gillespie', year: 1946, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Dizzy Gillespie A Night in Tunisia 1946'), evidenceUrl: 'https://www.jazzhistorytree.com/onyx-club/', note: 'Gillespie led a modern-jazz group at the Onyx; this recording represents that emerging vocabulary.' }],
  },
  {
    venueId: '0004', description: 'The triangular basement whose close acoustics turned live albums into architecture and made continuity itself part of the club’s legend.',
    image: '/images/jazz-club-scenes-1940s-09.jpg', imageAlt: 'A pianist performing in an intimate jazz club.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://www.villagevanguard.com/',
    tracks: [{ id: 'vanguard-spiritual', title: 'Spiritual', artist: 'John Coltrane', year: 1961, relationship: 'recorded-at-venue', listenUrl: youtubeSearch('John Coltrane Spiritual Live at the Village Vanguard'), evidenceUrl: 'https://www.johncoltrane.com/music/live-at-the-village-vanguard', note: 'Recorded at the Village Vanguard in November 1961.' }],
  },
  {
    venueId: '0025', description: 'A Cooper Square room where Monk’s return, Coltrane’s development, and Ornette Coleman’s arrival made listening feel confrontational and new.',
    image: '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(32).jpg', imageAlt: 'Musicians performing before a tightly packed audience.', imageCredit: 'William P. Gottlieb collection study image', imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [{ id: 'five-spot-monks-mood', title: "Monk’s Mood", artist: 'Thelonious Monk with John Coltrane', year: 1957, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Thelonious Monk John Coltrane Monks Mood 1957'), evidenceUrl: 'https://www.loc.gov/item/ihas.200182840/', note: 'Monk and Coltrane’s Five Spot residency defined this partnership; the surviving recording was made elsewhere.' }],
  },
  {
    venueId: '0026', description: 'An Avenue B proving ground where hard bop, free jazz, writers, and neighborhood life pressed against one another nightly.',
    image: '/images/jazz-club-scenes-1940s-02.jpg', imageAlt: 'A horn player performing in a dark, intimate room.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [{ id: 'slugs-search', title: 'Search for the New Land', artist: 'Lee Morgan', year: 1964, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Lee Morgan Search for the New Land'), evidenceUrl: 'https://www.nytimes.com/2022/03/22/arts/music/lee-morgan-slugs-saloon.html', note: 'Morgan was a regular at Slugs’; this selection represents the searching hard-bop language heard there.' }],
  },
  {
    venueId: '0011', description: 'Sam and Beatrice Rivers’ Bond Street home became a musician-run laboratory and the symbolic center of New York’s loft-jazz network.',
    image: '/images/jazz-club-scenes-1940s-08.jpg', imageAlt: 'Musicians and listeners gathered inside an intimate performance room.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://daily.bandcamp.com/lists/loft-jazz-list',
    tracks: [{ id: 'rivbea-wildflowers', title: 'Hues of Melanin', artist: 'Sam Rivers', year: 1976, relationship: 'recorded-at-venue', listenUrl: youtubeSearch('Sam Rivers Hues of Melanin Wildflowers Loft Jazz'), evidenceUrl: 'https://daily.bandcamp.com/lists/loft-jazz-list', note: 'Recorded during the Wildflowers sessions at Studio Rivbea.' }],
  },
  {
    venueId: '0012', description: 'Rashied Ali’s Greene Street loft joined performance, rehearsal, recording, and community in one artist-controlled room.',
    image: '/archive/greene/rashied-ali-poster.webp', imageAlt: 'A period Rashied Ali performance poster.', imageCredit: 'Thomas Ager archival material', imageSourceUrl: 'https://rashiedali.org/',
    tracks: [{ id: 'alis-alley-duo', title: 'Duo Exchange', artist: 'Rashied Ali & Frank Lowe', year: 1973, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Rashied Ali Frank Lowe Duo Exchange'), evidenceUrl: 'https://rashiedali.org/', note: 'Issued on Ali’s Survival Records and representative of the music surrounding his loft practice.' }],
  },
  {
    venueId: '0006', description: 'A Lower East Side home for experimental music whose final night became a protest against the economics remaking the neighborhood.',
    image: '/images/jazz-club-scenes-1940s-03.jpg', imageAlt: 'An experimental ensemble playing to an attentive club audience.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://en.wikipedia.org/wiki/Tonic_(music_venue)',
    tracks: [{ id: 'tonic-zorn', title: 'Cobra', artist: 'John Zorn', year: 1987, relationship: 'representative-of-scene', listenUrl: youtubeSearch('John Zorn Cobra live'), evidenceUrl: 'https://www.nytimes.com/2007/04/16/arts/music/16toni.html', note: 'Zorn was closely associated with Tonic; this game piece represents the collaborative practice it supported.' }],
  },
  {
    venueId: '0019', description: 'The original Houston Street room put improvisers, composers, noise bands, and downtown experimenters onto the same tiny stage.',
    image: '/images/jazz-club-scenes-1940s-12.jpg', imageAlt: 'A downtown ensemble performing under hard stage light.', imageCredit: 'Project archival study image', imageSourceUrl: 'https://knittingfactory.com/',
    tracks: [{ id: 'knitting-naked-city', title: 'Batman', artist: 'Naked City', year: 1989, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Naked City Batman John Zorn'), evidenceUrl: 'https://www.jazztimes.com/features/profiles/after-hours-new-yorks-jazz-joints-through-the-ages/', note: 'Representative of the genre collisions associated with the original Knitting Factory.' }],
  },
  {
    venueId: '0016', description: 'A Black community space in Bedford-Stuyvesant where music, political education, and neighborhood stewardship remain inseparable.',
    image: '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(23).jpg', imageAlt: 'A jazz vocalist performing with a small ensemble.', imageCredit: 'William P. Gottlieb collection study image', imageSourceUrl: 'https://sistasplace.org/',
    tracks: [{ id: 'sistas-hi-fly', title: 'Hi-Fly', artist: 'Randy Weston', year: 1958, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Randy Weston Hi-Fly'), evidenceUrl: 'https://sistasplace.org/jazz-history-in-bedford-stuyvesant/', note: 'Weston’s Brooklyn-rooted music represents the community lineage sustained by Sistas’ Place.' }],
  },
  {
    venueId: '0017', description: 'A Park Slope back room built for adventurous, border-crossing music, from jazz improvisation to global folk traditions.',
    image: '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(24).jpg', imageAlt: 'Musicians sharing a small stage in a close room.', imageCredit: 'William P. Gottlieb collection study image', imageSourceUrl: 'https://www.barbesbrooklyn.com/about',
    tracks: [{ id: 'barbes-slavic', title: 'Taketron', artist: 'Slavic Soul Party!', year: 2015, relationship: 'documented-performance', listenUrl: youtubeSearch('Slavic Soul Party Taketron'), evidenceUrl: 'https://www.barbesbrooklyn.com/about', note: 'Slavic Soul Party!’s long-running Barbès residency embodies the room’s cross-genre identity.' }],
  },
  {
    venueId: '0027', description: 'A composer-led experimental institution whose move to Brooklyn gave ambitious new music a permanent hall and public archive.',
    image: '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(5).jpg', imageAlt: 'An experimental jazz group performing onstage.', imageCredit: 'William P. Gottlieb collection study image', imageSourceUrl: 'https://roulette.org/',
    tracks: [{ id: 'roulette-braxton', title: 'Composition 23B', artist: 'Anthony Braxton', year: 1974, relationship: 'representative-of-scene', listenUrl: youtubeSearch('Anthony Braxton Composition 23B'), evidenceUrl: 'https://roulette.org/about/', note: 'Braxton is central to the experimental-composer community Roulette has presented; this is a representative work.' }],
  },
];

export const CLUB_PROFILE_BY_ID = new Map(CLUB_PROFILES.map((profile) => [profile.venueId, profile]));
export const FEATURED_VENUE_IDS = new Set(CLUB_PROFILES.map((profile) => profile.venueId));

const STUDY_IMAGES = [
  '/images/jazz-club-scenes-1940s-01.jpg',
  '/images/jazz-club-scenes-1940s-02.jpg',
  '/images/jazz-club-scenes-1940s-03.jpg',
  '/images/jazz-club-scenes-1940s-08.jpg',
  '/images/jazz-club-scenes-1940s-09.jpg',
  '/images/jazz-club-scenes-1940s-12.jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(5).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(8).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(16).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(23).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(24).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(29).jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(32).jpg',
] as const;

const imageIndexForVenue = (venueId: string) => {
  let hash = 0;
  for (const character of venueId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash % STUDY_IMAGES.length;
};

const fallbackProfile = (venue: (typeof NYC_JAZZ_VENUES)[number]): ClubProfile => {
  const { properties } = venue;
  const kind = properties.venue_type.replace(/_/g, ' ');
  const years = `${properties.open_year ?? 'an unknown date'} to ${properties.close_year ?? 'the present'}`;
  return {
    venueId: properties.id,
    description: properties.quote
      ?? `${properties.name} was a ${kind} at ${properties.address} in ${properties.neighborhood}, documented as operating from ${years}.`,
    image: STUDY_IMAGES[imageIndexForVenue(properties.id)],
    imageAlt: `Archival jazz performance study image representing the era of ${properties.name}.`,
    imageCredit: 'William P. Gottlieb Collection archival study image; not presented as a photograph of this venue.',
    imageSourceUrl: 'https://www.loc.gov/collections/william-p-gottlieb-jazz-photos/',
    tracks: [],
  };
};

/** All sourced venues receive a card; the 16 records above retain richer research. */
export const GALLERY_PROFILES: ClubProfile[] = NYC_JAZZ_VENUES.map((venue) =>
  CLUB_PROFILE_BY_ID.get(venue.properties.id) ?? fallbackProfile(venue));
export const GALLERY_PROFILE_BY_ID = new Map(GALLERY_PROFILES.map((profile) => [profile.venueId, profile]));
export const GALLERY_VENUE_IDS = new Set(GALLERY_PROFILES.map((profile) => profile.venueId));
