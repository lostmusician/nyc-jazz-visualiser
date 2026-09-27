import type { VenueFeature } from '../types';

/**
 * A focused import from Village Preservation's public jazz-map directory.
 *
 * Scope: performance venues in Greenwich Village, the East Village, and NoHo.
 * Homes, recording studios, parks, and records that merge several incarnations
 * of a venue were deliberately excluded. The directory supplies discovery facts
 * (name, address, and operating-date label); closure reasons are added only when
 * a separate source documents them directly.
 */
export const VILLAGE_PRESERVATION_IMPORT = {
  sourceUrl: 'https://jazzmap.villagepreservation.org/',
  sourcePublisher: 'Village Preservation Jazz Map',
  accessedOn: '2026-09-21',
  importedCount: 18,
  scope: 'Performance venues only; residences, studios, parks, and ambiguous revivals excluded.',
} as const;

const sourceNote = (dateLabel: string) =>
  `Village Preservation directory date label: ${dateLabel}. Address and dates are source-derived.`;

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
      description: "Established in 1937 at 57 Grove Street in the West Village, Arthur's Tavern is one of New York's oldest continuous music bars, housed in a historic 19th-century building with classic dark wood paneling and an intimate bar setup.\n\nNotable Musicians: Roy Hargrove, Harold Mabern, Jimmy Ryan regulars, and the Grove Street Stompers.\n\nMusic: Famous for its long-running weeknight residencies of Dixieland swing, blues, and straight-ahead jazz, including the Grove Street Stompers who performed every Monday for decades."
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
      description: "Operating from 1969 to 1977 at 340 Bleecker Street in the West Village, Boomer's was a warm, brick-walled club that paired food service with hard bop and modern jazz.\n\nNotable Musicians: Cedar Walton, Buster Williams, Junior Cook, Woody Shaw, and Houston Person.\n\nMusic: Pianist Cedar Walton recorded the live albums Firm Roots and Pit Inn at Boomer's, documenting the club's acoustic hard bop program in the 1970s."
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.99501, 40.729177] },
    properties: {
      id: 'vp-bottom-line', name: 'The Bottom Line', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '15 W 4th St', open_year: 1974, close_year: 2004, status: 'closed',
      closing_reason: 'New York University evicted the club after failed lease negotiations and roughly $190,000 in back rent.',
      notes: `${sourceNote('1974–2004')}. Contemporary reporting documents the rent dispute and eviction.`,
      source_url: 'https://www.latimes.com/archives/la-xpm-2003-dec-23-et-duke23-story.html',
      source_publisher: 'Los Angeles Times',
      description: "Operating from 1974 to 2004 at 15 W 4th Street, The Bottom Line was a 400-seat Greenwich Village cabaret hub where major jazz figures, rock icons, and folk songwriters performed on a state-of-the-art stage.\n\nNotable Musicians: Miles Davis, Charles Mingus, Sonny Rollins, Weather Report, and Brecker Brothers.\n\nMusic: The club hosted historic fusion and modern jazz sets, including Miles Davis’ mid-1970s electric groups and Charles Mingus’ late career big band performances."
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
      description: "Located at 152 Bleecker Street from 1964 to 1970, this subterranean Greenwich Village venue was a famous counterculture hub for folk, comedy, blues, and avant-garde jazz.\n\nNotable Musicians: Bill Evans, Stan Getz, Astrud Gilberto, Roland Kirk, and John Handy.\n\nMusic: Stan Getz and Astrud Gilberto recorded Getz Au Go Go here in 1964, helping propel the bossa nova sound across America alongside Bill Evans' delicate trio performances."
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.001946, 40.732823] },
    properties: {
      id: 'vp-cafe-society', name: 'Caf\u00e9 Society', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'West Village',
      address: '2 Sheridan Square', open_year: 1938, close_year: 1949, status: 'closed',
      closing_reason: 'HUAC-era guilt-by-association attacks over owner Barney Josephson’s brother caused attendance to collapse and forced the club out of business.',
      notes: `${sourceNote('1938–1948')}. Later scholarship dates the downtown club’s final closure to March 1949.`,
      source_url: 'https://core.ac.uk/download/56111693.pdf',
      source_publisher: 'University of Maryland dissertation via CORE',
      description: "Founded in 1938 by Barney Josephson at 2 Sheridan Square in the West Village, Café Society was America's first intentionally racially integrated nightclub outside Harlem, operating under the slogan \"The Wrong Place for the Right People.\"\n\nNotable Musicians: Billie Holiday, Sarah Vaughan, Hazel Scott, Lena Horne, Teddy Wilson, and Big Joe Turner.\n\nMusic: Billie Holiday debuted her landmark anti-lynching anthem \"Strange Fruit\" here in 1939, performing it under a spotlight in total silence as the club's signature ritual."
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
      description: "Operating from 1949 to 1963 at 111 2nd Avenue in the East Village, Central Plaza was a second-floor hall famous for weekend traditional jazz revivals that brought together veteran swing stars and enthusiastic college crowds.\n\nNotable Musicians: Willie \"The Lion\" Smith, Conrad Janis, Jimmy McPartland, Max Kaminsky, and Pee Wee Russell.\n\nMusic: The hall specialized in high-energy Dixieland jam sessions, brass battles, and festive traditional swing dance parties."
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.994089, 40.731694] },
    properties: {
      id: 'vp-cookery', name: 'The Cookery', venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '21 University Pl', open_year: 1970, close_year: 1984, status: 'closed',
      closing_reason: 'Owner Barney Josephson had grown weary of the club business and of contemporary musical styles he did not wish to program.',
      notes: `${sourceNote('1970–1984')}. Josephson later described why he ended his final music venue.`,
      source_url: 'https://www.latimes.com/archives/la-xpm-1988-10-01-mn-3945-story.html',
      source_publisher: 'Los Angeles Times',
      description: "Opened in 1970 by Barney Josephson at 21 University Place in Greenwich Village, The Cookery was an intimate restaurant-club that helped bring renewed attention to veteran jazz and blues women.\n\nNotable Musicians: Alberta Hunter, Mary Lou Williams, Rose Murphy, Helen Humes, and Ellis Larkins.\n\nMusic: Blues singer Alberta Hunter began a widely celebrated comeback residency here in 1977 at age 82, performing regularly until shortly before her death in 1984."
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
      description: "Located at 101 Avenue A in the East Village from 1968 to 1979, this neighborhood venue served as an informal, soul-jazz and hard-bop sanctuary during the downtown artistic transformation of the late 1960s and 1970s.\n\nNotable Musicians: Harold Mabern, Lee Morgan, Cedar Walton, Junior Cook, and Blue Mitchell.\n\nMusic: Known for intense, groove-driven hard bop jam sessions that drew local East Village musicians and neighborhood jazz aficionados."
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.997217, 40.729437] },
    properties: {
      id: 'vp-eddie-condons', name: "Eddie Condon's", venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '47 W 3rd St', open_year: 1945, close_year: 1958, status: 'relocated',
      closing_reason: 'The West 3rd Street lease expired, and Condon moved the club to 330 E 56th St.',
      notes: `${sourceNote('1945–1961')}. The original downtown room actually ended in 1958; the later date conflates it with the uptown incarnation.`,
      source_url: 'https://chiaroscurojazz.org/eddie-condon/',
      source_publisher: 'Chiaroscuro Jazz / WVIA Public Media',
      description: "Established in 1945 by rhythm guitarist Eddie Condon at 47 W 3rd Street, this Greenwich Village club was the World War II and postwar headquarters for Condon-style Chicago and traditional Dixieland jazz.\n\nNotable Musicians: Eddie Condon, Wild Bill Davison, Pee Wee Russell, Bud Freeman, and Edmond Hall.\n\nMusic: Famed for ensemble counterpoint, blistering tempos, and unscripted jam sessions that kept traditional swing alive during the height of the bebop era."
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
      description: "Operating from 1928 to 1933 at 142 W Houston Street on the Greenwich Village border, the Hot Feet Club was an early speakeasy cabaret that brought Harlem-style jazz and blues performance into lower Manhattan.\n\nNotable Musicians: Fats Waller, James P. Johnson, and local stride pianists.\n\nMusic: Focused on late-night Prohibition stride piano, blues accompaniment, and energetic acoustic dance music."
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
      description: "Located at 78–80 St. Marks Place from 1959 to 1964, the original Jazz Gallery was a spacious, influential East Village club run by the Termini brothers of Five Spot fame.\n\nNotable Musicians: Thelonious Monk, John Coltrane, Horace Silver, Miles Davis, and Charles Mingus.\n\nMusic: Thelonious Monk held major extended residencies here, and Lord Buckley recorded his live comedy-jazz albums on its stage."
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.99995, 40.7288] },
    properties: {
      id: 'vp-lush-life', name: 'Lush Life', venue_type: 'commercial_club',
      scene_movement: 'downtown_avant_garde', borough: 'Manhattan', neighborhood: 'Greenwich Village',
      address: '184 Thompson St', open_year: 1981, close_year: 1985, status: 'closed',
      closing_reason: 'New York City’s cabaret “no-horns” restriction prevented its horn-led live-jazz program; the space became a restaurant.',
      notes: `${sourceNote('1981–1985')}. Leonard Feather identified the no-horns rule as the cause.`,
      source_url: 'https://www.latimes.com/archives/la-xpm-1986-05-11-ca-5382-story.html',
      source_publisher: 'Los Angeles Times',
      description: "Operating from 1981 to 1985 at 184 Thompson Street in Greenwich Village, Lush Life was a contemporary jazz room that presented established modern jazz artists before closing under NYC cabaret restrictions.\n\nNotable Musicians: McCoy Tyner, Chet Baker, Bobby Hutcherson, Joe Henderson, and Gary Burton.\n\nMusic: Focused on acoustic small groups, including residencies by McCoy Tyner and Chet Baker’s return engagements in New York."
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.002402, 40.734738] },
    properties: {
      id: 'vp-nicks-tavern', name: "Nick's Tavern", venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream', borough: 'Manhattan', neighborhood: 'West Village',
      address: '140 7th Ave S', open_year: 1922, close_year: 1963, status: 'closed',
      closing_reason: 'The final incarnation lost its lease after years of waning demand for Dixieland jazz.',
      notes: `${sourceNote('1922–1963')}. The directory record combines several locations; the documented closure concerns the final Seventh Avenue South room.`,
      source_url: 'https://www.villagevoice.com/dixieland-in-the-village-old-nicks-is-nixed/',
      source_publisher: 'The Village Voice',
      description: "Founded in 1922 by Nick Rongetti at 140 7th Ave South, Nick's was a cornerstone West Village institution for traditional Dixieland jazz, thick steaks, and hot jam sessions for over four decades.\n\nNotable Musicians: Muggsy Spanier, Bobby Hackett, Pee Wee Russell, Eddie Condon, and Miff Mole.\n\nMusic: Muggsy Spanier’s Ragtime Band made historic recordings associated with the room, defining the crisp, driving \"Nicksieland\" sound."
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
      description: "Located at 55 W 3rd Street in Greenwich Village during the 1950s, the Open Door was a casual, bohemian jazz room favored by Charlie Parker and young bebop players.\n\nNotable Musicians: Charlie Parker, Thelonious Monk, Roy Haynes, Charles Mingus, and Art Blakey.\n\nMusic: Charlie Parker performed numerous Sunday afternoon jam sessions here, recorded on rare bootleg tapes that capture his late-period live brilliance."
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
      description: "Operating from 1918 to 1949 at 146 W 4th Street, The Pepper Pot was an early bohemian Greenwich Village tearoom and speakeasy that hosted early jazz trios, stride pianists, and literary figures.\n\nNotable Musicians: Early Village stride pianists and acoustic swing guitarists.\n\nMusic: Featured intimate, unamplified background jazz, blues, and ragtime that set the tone for Greenwich Village nightlife in the 1920s and 30s."
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
      description: "Founded in 1977 by brothers Michael and Randy Brecker at 21 7th Ave South, Seventh Avenue South was the flagship West Village room for 1970s and 80s jazz-fusion, funk-jazz, and studio virtuosity.\n\nNotable Musicians: The Brecker Brothers, Jaco Pastorius, Mike Stern, Dave Weckl, Bob Mintzer, and Steps Ahead.\n\nMusic: The club was the incubator for the electric fusion supergroup Steps Ahead and hosted Jaco Pastorius’ late-night jam sessions."
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
      description: "Located at 140–142 2nd Avenue in the East Village, this historic catering hall hosted landmark traditional jazz revival concerts from 1945 into the 1950s.\n\nNotable Musicians: Bunk Johnson, Sidney Bechet, George Lewis, Baby Dodds, and Wild Bill Davison.\n\nMusic: Bunk Johnson’s 1945 return engagements here sparked the national New Orleans jazz revival movement, introducing original traditional jazz styles to post-war NYC."
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
      description: "Located at 325 Bowery at 2nd Street from 1973 to 1979, Tin Palace was a vibrant artist hangout that served as a crucial bridge between avant-garde loft jazz and neighborhood venue presentation.\n\nNotable Musicians: Stanley Cowell, Charles Tyler, Roswell Rudd, Jimmy Giuffre, and David Murray.\n\nMusic: Hosted the World Saxophone Quartet’s early rehearsals and performances, along with poetry-and-jazz series that defined the 1970s Bowery arts scene."
    },
  },
];
