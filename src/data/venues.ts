import type { VenueFeature } from '../types';
import { EARLY_JAZZ_VENUES } from './earlyJazzVenues';
import { VILLAGE_PRESERVATION_VENUES } from './villagePreservationVenues';
import { CURRENT_JAZZ_VENUES } from './currentJazzVenues';
import { OUTER_BOROUGH_JAZZ_VENUES } from './outerBoroughJazzVenues';

export const NYC_JAZZ_VENUES: VenueFeature[] = [
  // ── HARLEM RENAISSANCE & POST-WAR HARLEM ──────────────────────────
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9442, 40.8081] },
    properties: {
      id: '0001',
      name: 'Lenox Lounge',
      venue_type: 'commercial_club',
      scene_movement: 'harlem_jazz',
      borough: 'Manhattan',
      neighborhood: 'Harlem',
      address: '288 Malcolm X Blvd',
      open_year: 1939,
      close_year: 2012,
      status: 'closed',
      closing_reason: 'Rent escalation ($20,000/month rent demand by new landlord)',
      quote: 'The Zebra Room was not just a stage; it was the acoustic living room of Harlem.',
      notes: 'Art Deco landmark interior stripped after landlord rent dispute in 2012; building demolished in 2017 for retail redevelopment.',
      description: "An Art Deco jazz venue established in 1939, Lenox Lounge was known for its Zebra Room and functioned as both a performance space and a Harlem gathering place. Writers James Baldwin and Langston Hughes, along with political activist Malcolm X, were regular patrons.\n\nNotable Musicians: Billie Holiday, Miles Davis, John Coltrane, and Danny Mixon.\n\nMusic: The club presented bebop, hard bop, and regular weekend jazz programs, with later events organized under the musical direction of Danny Mixon."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9482, 40.8228] },
    properties: {
      id: '0002',
      name: "St. Nick's Pub",
      venue_type: 'commercial_club',
      scene_movement: 'harlem_jazz',
      borough: 'Manhattan',
      neighborhood: 'Harlem',
      address: '773 St Nicholas Ave',
      open_year: 1940,
      close_year: 2011,
      status: 'closed',
      closing_reason: 'Ownership dispute & building sale amid Sugar Hill property price surge',
      quote: 'Monday night jam sessions ran until 4 AM with generations of masters trading choruses.',
      notes: 'Historic Sugar Hill cornerstone dating back to the late 1930s (formerly Duke’s Bar).',
      description: "Located in the historic Sugar Hill neighborhood, this venue served as an informal jazz gathering place. Its Monday night jam sessions ran late and emphasized direct, energetic ensemble playing.\n\nNotable Musicians: Olu Dara, James Carter, Bill Saxton, Hamiet Bluiett, and Patience Higgins.\n\nMusic: Patience Higgins and his Sugar Hill Quartet recorded Live In Harlem at the club, including performances of Thelonious Monk's \"Let's Cool One\" and Sonny Rollins' \"Sonny Moon For Two\". The room was known for a raw acoustic environment and what observers called \"no-nonsense blowing\"."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9535, 40.8055] },
    properties: {
      id: '0003',
      name: "Minton's Playhouse",
      venue_type: 'commercial_club',
      scene_movement: 'harlem_jazz',
      borough: 'Manhattan',
      neighborhood: 'Harlem',
      address: '210 W 118th St',
      open_year: 1938,
      close_year: 1974,
      status: 'closed',
      closing_reason: 'Building fire and neighborhood commercial disinvestment in the 1970s',
      quote: 'Where Thelonious Monk, Charlie Parker, and Dizzy Gillespie forged the vocabulary of Bebop.',
      notes: 'A central site for Bebop jam sessions in the 1940s; later restored as an upscale venue in the 2000s.',
      description: "Operating out of the ground floor of the Cecil Hotel starting in 1938, Minton's became an important after-hours workshop for the development of bebop. House musicians and visitors used demanding tempos, harmonies, and rhythmic ideas to test new approaches beyond their regular band jobs.\n\nNotable Musicians: Thelonious Monk, Charlie Parker, Dizzy Gillespie, Charlie Christian, and Kenny Clarke.\n\nMusic: Monk's \"52nd Street Theme,\" first known as \"Bip Bop,\" became associated with the sessions. Kenny Clarke's ride-cymbal pulse and irregular bass-drum accents also formed part of the rhythmic vocabulary musicians developed and exchanged there."
    }
  },

  // ── 52ND STREET & TIMES SQUARE (SWING STREET) ─────────────────────
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9834, 40.7624] },
    properties: {
      id: '0020',
      name: 'Birdland (Original Location)',
      venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream',
      borough: 'Manhattan',
      neighborhood: 'Times Square',
      address: '1678 Broadway',
      open_year: 1949,
      close_year: 1965,
      status: 'closed',
      closing_reason: 'Punitive commercial rent increases & Broadway theater district rezoning',
      quote: 'The Jazz Corner of the World. Count Basie, Lester Young, and Charlie Parker played here nightly.',
      notes: 'Named in honor of Charlie "Bird" Parker. Forced to close in 1965 when Broadway real estate values soared.',
      description: "Opening in December 1949 just off Broadway, Birdland proudly called itself \"The Jazz Corner of the World\". Named in honor of alto saxophonist Charlie \"Bird\" Parker, it was the public proving ground where the raw art form created in Harlem was presented to mainstream midtown audiences.\n\nNotable Musicians: Charlie Parker, John Coltrane, Count Basie, Art Blakey, Miles Davis, and Bud Powell all performed and recorded historic sessions here.\n\nMusic: Count Basie and his Orchestra recorded Live from Birdland in the 1950s and immortalized the venue by recording the famous \"Lullaby of Birdland\" on site. Broadcaster Symphony Sid also famously broadcast live sets from the club over the radio, bringing the venue's live energy directly into American living rooms."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9786, 40.7602] },
    properties: {
      id: '0021',
      name: 'The Famous Door (52nd St)',
      venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream',
      borough: 'Manhattan',
      neighborhood: 'Midtown',
      address: '56 W 52nd St',
      open_year: 1935,
      close_year: 1950,
      status: 'closed',
      closing_reason: 'Demolition of 52nd Street brownstones for modern corporate skyscraper office towers',
      quote: 'A musician-backed Swing Street room where Billie Holiday and Count Basie drew large audiences.',
      notes: 'Part of the mid-century corporate clearing of 52nd Street for CBS Black Rock and corporate headquarters.',
      description: "A crown jewel of the heavily concentrated \"Swing Street\" (52nd Street), this compact venue blurred the line between audience and bandstand, generating an electric, intimate atmosphere. Because clubs were stacked so closely together, musicians could easily finish a set here and walk across the street to jump into another jam session.\n\nNotable Musicians: Count Basie, Billie Holiday, Lester Young, Art Tatum, and Coleman Hawkins.\n\nMusic: With the help of agent Willard Alexander, Count Basie secured a national NBC radio wire for the club, broadcasting his band's signature \"flagwavers\"—blistering, fast-paced tunes like \"Jumpin' at the Woodside\" designed specifically to feature soloists like Lester Young and excite the crowd. Billie Holiday also delivered profoundly emotional performances of classics like \"Strange Fruit\" and \"God Bless the Child\" in this very room."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9798, 40.7608] },
    properties: {
      id: '0022',
      name: 'The Onyx Club (52nd St)',
      venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream',
      borough: 'Manhattan',
      neighborhood: 'Midtown',
      address: '62 W 52nd St',
      open_year: 1927,
      close_year: 1949,
      status: 'closed',
      closing_reason: '52nd Street corporate redevelopment and post-war tax pressures',
      quote: 'Dizzy Gillespie and Max Roach led the first modern bebop combos here in 1944.',
      notes: 'Demolished alongside neighboring clubs for Rockefeller Center expansion.',
      description: "Opened initially as a musicians' speakeasy in 1927 at 62 W 52nd St, the Onyx Club became a central room on Midtown Manhattan’s Swing Street. The intimate cellar club served as a meeting place for studio and big-band instrumentalists before becoming one of the first 52nd Street spaces to host early bebop groups.\n\nNotable Musicians: Dizzy Gillespie, Max Roach, Art Tatum, Stuff Smith, and Roy Eldridge.\n\nMusic: In 1944, Dizzy Gillespie and Max Roach co-led an early modern bebop combo on 52nd Street here, introducing compositions including \"Woody 'n' You\" and \"Night in Tunisia\" to Manhattan audiences."
    }
  },

  // ── GREENWICH VILLAGE & EAST VILLAGE SANCTUARIES ──────────────────
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.0016, 40.7337] },
    properties: {
      id: '0004',
      name: 'Village Vanguard',
      venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream',
      borough: 'Manhattan',
      neighborhood: 'Greenwich Village',
      address: '178 7th Ave S',
      open_year: 1935,
      close_year: null,
      status: 'open',
      closing_reason: null,
      quote: 'The triangular basement whose acoustic resonance shaped the sound of modern recorded jazz for ninety years.',
      notes: 'Historic survivor operating continuously under the Gordon family stewardship.',
      description: "Founded in 1935 by Max Gordon in a triangular Greenwich Village basement at 178 7th Ave South, the Village Vanguard is one of New York's longest-running jazz clubs. Its acoustic resonance and close seating have made it a favored site for live jazz recording.\n\nNotable Musicians: John Coltrane, Sonny Rollins, Bill Evans, Miles Davis, Thelonious Monk, Dexter Gordon, and Wynton Marsalis.\n\nMusic: The venue hosted landmark recordings including John Coltrane’s 1961 Live at the Village Vanguard, Sonny Rollins’ 1957 trio sets, and Bill Evans’ 1961 Sunday at the Village Vanguard."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.0028, 40.7339] },
    properties: {
      id: '0005',
      name: '55 Bar',
      venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream',
      borough: 'Manhattan',
      neighborhood: 'Greenwich Village',
      address: '55 Christopher St',
      open_year: 1983,
      close_year: 2022,
      status: 'closed',
      closing_reason: 'Pandemic commercial rent debt & landlord refused lease extension after 39 years',
      quote: 'A dive-bar sanctuary where fusion guitarists and straight-ahead titans traded 12-bar blues five feet from the bar.',
      notes: 'Beloved Greenwich Village institution whose abrupt 2022 closure triggered widespread mourning across NYC jazz.',
      description: "Tucked into a Greenwich Village basement at 55 Christopher Street, this informal dive bar operated from 1983 until 2022. Listeners sat just feet from the performers in a narrow, wood-paneled room that functioned as a gathering place for downtown musicians.\n\nNotable Musicians: Mike Stern, Wayne Krantz, Leni Stern, Jaco Pastorius, Chris Potter, and Jim Campilongo.\n\nMusic: Known for high-energy blues, funk, and modern fusion guitar residencies, the 55 Bar paired early acoustic sets with electric late-night performances."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9972, 40.7323] },
    properties: {
      id: '0018',
      name: "Bradley's",
      venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream',
      borough: 'Manhattan',
      neighborhood: 'Greenwich Village',
      address: '70 University Pl',
      open_year: 1969,
      close_year: 1996,
      status: 'closed',
      closing_reason: 'Astronomical University Place retail rent escalation following Bradley Cunningham’s death',
      quote: 'An after-hours gathering place for pianists and bassists including Hank Jones, Tommy Flanagan, and Kenny Barron.',
      notes: 'Its cedar-paneled room was known for impromptu late-night duets and unannounced guest appearances.',
      description: "Operating from 1969 to 1996 at 70 University Place, Bradley’s became known as an \"after-hours university\" for jazz pianists and bassists. Founded by Bradley Cunningham, the cedar-paneled room drew musicians after midnight to hear duos exchange ideas at close range.\n\nNotable Musicians: Hank Jones, Tommy Flanagan, Kenny Barron, Ray Brown, Jimmy Rowles, Kirk Lightsey, and Red Mitchell.\n\nMusic: Bradley’s focused on acoustic piano-and-bass duets, with unannounced guest sit-ins and a Bösendorfer grand piano that visiting musicians regularly praised."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.0020, 40.7333] },
    properties: {
      id: '0023',
      name: 'Sweet Basil',
      venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream',
      borough: 'Manhattan',
      neighborhood: 'Greenwich Village',
      address: '88 7th Ave S',
      open_year: 1974,
      close_year: 2001,
      status: 'closed',
      closing_reason: 'Sharp commercial rent escalation and post-9/11 downturn in downtown nightlife',
      quote: 'A weekly residence for Gil Evans and Art Blakey’s Jazz Messengers throughout the 1980s.',
      notes: 'Produced an extensive catalog of live recordings before losing its lease.',
      description: "Opened in 1974 at 88 7th Ave South in Greenwich Village, Sweet Basil was a prominent jazz supper club through the 1980s and 1990s. The room paired an intimate wood-and-brick interior with acoustics suited to small groups and big bands.\n\nNotable Musicians: Art Blakey & The Jazz Messengers, Gil Evans, McCoy Tyner, David Murray, and Cedar Walton.\n\nMusic: The club served as the weekend home for the Gil Evans Orchestra and Art Blakey's Jazz Messengers, yielding live recordings such as Art Blakey's Album of the Year and Gil Evans' Live at Sweet Basil."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.0024, 40.7345] },
    properties: {
      id: '0024',
      name: 'Smalls Jazz Club',
      venue_type: 'commercial_club',
      scene_movement: 'bebop_mainstream',
      borough: 'Manhattan',
      neighborhood: 'Greenwich Village',
      address: '183 W 10th St',
      open_year: 1994,
      close_year: null,
      status: 'open',
      closing_reason: null,
      quote: 'Subterranean bastion of the late-night jam tradition, sustaining young prodigies through live streaming.',
      notes: 'Founded by Mitch Borden; survived pandemic pressure through non-profit foundation listener support.',
      description: "Founded in 1994 by Mitch Borden in a cellar at 183 W 10th Street, Smalls became the epicenter of a late-night subculture for young jazz prodigies in Greenwich Village. Operating into the morning hours with a low admission fee and no commercial pressure, it nurtured a whole generation of modern jazz leaders.\n\nNotable Musicians: Kurt Rosenwinkel, Brad Mehldau, Roy Hargrove, Mark Turner, Guillermo Klein, and Omer Avital.\n\nMusic: Known for marathon jam sessions that ran until 6 AM, Smalls developed a distinctive 1990s hard bop and modern jazz vocabulary, later becoming a pioneer in high-definition global live streaming for jazz."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9904, 40.7291] },
    properties: {
      id: '0025',
      name: 'The Five Spot Café',
      venue_type: 'avant_garde',
      scene_movement: 'downtown_avant_garde',
      borough: 'Manhattan',
      neighborhood: 'East Village',
      address: '5 Cooper Square',
      open_year: 1956,
      close_year: 1976,
      status: 'closed',
      closing_reason: 'Demolition of Bowery/Cooper Square tenements for urban development',
      quote: 'Where Thelonious Monk and John Coltrane spent the summer of 1957 changing the course of Western music.',
      notes: 'The spiritual birthplace of free jazz where Ornette Coleman made his explosive New York debut in 1959.',
      description: "The Five Spot began at 5 Cooper Square in 1956 and later continued at 2 St. Marks Place. Run by the Termini brothers, it brought abstract expressionist painters, Beat writers, and avant-garde jazz musicians into the same informal room and supported extended engagements.\n\nNotable Musicians: Thelonious Monk, John Coltrane, Ornette Coleman, Cecil Taylor, and Eric Dolphy.\n\nMusic: Thelonious Monk and John Coltrane's documented 1957 residency became an important chapter in both musicians' development, while Ornette Coleman's 1959 engagement introduced his quartet to New York audiences."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9804, 40.7222] },
    properties: {
      id: '0026',
      name: "Slugs' Saloon",
      venue_type: 'avant_garde',
      scene_movement: 'downtown_avant_garde',
      borough: 'Manhattan',
      neighborhood: 'East Village',
      address: '242 E 3rd St',
      open_year: 1964,
      close_year: 1972,
      status: 'closed',
      closing_reason: 'Neighborhood crime wave and the tragic backstage death of trumpeter Lee Morgan in 1972',
      quote: 'The fiercest proving ground for hard bop and avant-garde pioneers like Albert Ayler and Sun Ra.',
      notes: 'Avenue B hangout for bohemian writers, artists, and musicians.',
      description: "Operating from 1964 to 1972 at 242 E 3rd Street in the East Village/Lower East Side, Slugs' was a dark, gritty saloon that became a crucial proving ground for hard bop and avant-garde jazz. Despite its hazardous neighborhood location, musicians revered the room for its long sets and uncompromising crowd.\n\nNotable Musicians: Lee Morgan, Albert Ayler, Sun Ra, Wayne Shorter, Freddie Hubbard, and McCoy Tyner.\n\nMusic: Known for ferocious, extended solos and raw acoustic projection, Slugs' hosted Sun Ra’s Arkestra on Monday nights and was the venue where trumpeter Lee Morgan performed his final sets in 1972."
    }
  },

  // ── 1970s SOHO / NOHO LOFT JAZZ RESISTANCE ────────────────────────
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9931, 40.7265] },
    properties: {
      id: '0011',
      name: 'Studio Rivbea',
      venue_type: 'loft',
      scene_movement: 'loft_jazz',
      borough: 'Manhattan',
      neighborhood: 'NoHo',
      address: '24 Bond St',
      open_year: 1970,
      close_year: 1980,
      status: 'closed',
      closing_reason: 'SoHo/NoHo industrial real estate re-zoning & conversion into multi-million dollar luxury lofts',
      quote: 'Sam and Bea Rivers turned a derelict garment warehouse into the international nucleus of free improvisation.',
      notes: 'Center of the 1976 Wildflowers loft jazz festival series.',
      description: "Established in 1970 by saxophonist Sam Rivers and his wife Beatrice at 24 Bond Street in NoHo, Studio Rivbea was the preeminent multi-level loft venue of New York's 1970s loft jazz movement. It provided complete creative and financial autonomy to improvising artists outside commercial club networks.\n\nNotable Musicians: Sam Rivers, Dave Holland, Anthony Braxton, Arthur Blythe, Sunny Murray, and Hamiet Bluiett.\n\nMusic: Studio Rivbea hosted the landmark 1976 Wildflowers loft jazz festival, recorded across five live albums that captured the explosive growth of free improvisation and avant-garde composition."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-74.0006, 40.7231] },
    properties: {
      id: '0012',
      name: "Ali's Alley",
      venue_type: 'loft',
      scene_movement: 'loft_jazz',
      borough: 'Manhattan',
      neighborhood: 'SoHo',
      address: '77 Greene St',
      open_year: 1973,
      close_year: 1979,
      status: 'closed',
      closing_reason: 'SoHo Cast-Iron district commercial rent boom & building acquisition',
      quote: 'Coltrane drummer Rashied Ali created an artist-run sanctuary without commercial gatekeepers.',
      notes: 'Now an ultra-luxury designer retail boutique on Greene Street.',
      description: "Founded in 1973 by master drummer Rashied Ali at 77 Greene Street, Ali’s Alley was an artist-run SoHo loft that combined a performance hall, rehearsal room, and musician hangout. It exemplified the DIY spirit of 1970s deindustrialized Manhattan before SoHo turned into a commercial shopping district.\n\nNotable Musicians: Rashied Ali, David Murray, Oliver Lake, James \"Blood\" Ulmer, and Billy Bang.\n\nMusic: Centered around Ali’s intense, multi-directional rhythmic approach developed with John Coltrane, the club featured uninhibited modal and free jazz jams without commercial time constraints or gatekeepers."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9934, 40.7262] },
    properties: {
      id: '0013',
      name: "Ladies' Fort",
      venue_type: 'loft',
      scene_movement: 'loft_jazz',
      borough: 'Manhattan',
      neighborhood: 'NoHo',
      address: '2 Bond St',
      open_year: 1976,
      close_year: 1979,
      status: 'closed',
      closing_reason: 'Eviction for luxury loft conversion as Bond Street transformed into Manhattan’s priciest strip',
      quote: 'Run by percussionist Montego Joe; known for raw, marathon jam sessions with zero acoustic compromise.',
      notes: 'Direct neighbor to Studio Rivbea during the height of the 1970s loft movement.',
      description: "Run by vocalist Joe Lee Wilson and percussionist Montego Joe at 2 Bond Street in NoHo from 1976 to 1979, Ladies' Fort was a vibrant, basement loft jazz space right next door to Studio Rivbea. It was famed for its intense summer festivals and welcoming collective energy.\n\nNotable Musicians: Joe Lee Wilson, Archie Shepp, Montego Joe, Sheila Jordan, and Clifford Jordan.\n\nMusic: The loft specialized in vocal jazz innovation, extended blues jams, and African percussion explorations, hosting non-stop holiday marathons during the height of the downtown loft era."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9912, 40.7217] },
    properties: {
      id: '0014',
      name: 'Studio We',
      venue_type: 'loft',
      scene_movement: 'loft_jazz',
      borough: 'Manhattan',
      neighborhood: 'Lower East Side',
      address: '193 Eldridge St',
      open_year: 1970,
      close_year: 1980,
      status: 'closed',
      closing_reason: 'Lower East Side building real estate consolidation & loss of DIY operating autonomy',
      quote: 'One of the earliest artist-run collectives in the Lower East Side, hosting free community concerts.',
      notes: 'Co-founded by James DuBoise to give disenfranchised avant-garde artists performance autonomy.',
      description: "Co-founded in 1970 by trumpeter James DuBoise and Juma Sultan at 193 Eldridge Street, Studio We was one of the earliest Lower East Side loft spaces dedicated to artist self-determination, youth education, and community-driven music.\n\nNotable Musicians: James DuBoise, Juma Sultan, Noah Howard, Frank Lowe, and Dewey Redman.\n\nMusic: Studio We hosted free outdoor neighborhood street festivals and indoor avant-garde workshops, blending free jazz with Afro-Caribbean rhythms and political education."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9995, 40.7214] },
    properties: {
      id: '0015',
      name: 'Environ',
      venue_type: 'loft',
      scene_movement: 'loft_jazz',
      borough: 'Manhattan',
      neighborhood: 'SoHo',
      address: '476 Broadway',
      open_year: 1976,
      close_year: 1980,
      status: 'closed',
      closing_reason: 'SoHo commercial zoning shifts that priced out DIY artist cooperatives',
      quote: 'Pianist John Fischer’s loft showcased the Composers in Performance series and avant-garde multimedia art.',
      notes: 'Hosted multi-day loft marathons during the peak of downtown deindustrialization.',
      description: "Established in 1976 by pianist John Fischer at 476 Broadway in SoHo, Environ was a multi-disciplinary loft space that integrated free jazz performance with contemporary classical composition, performance art, and graphic design.\n\nNotable Musicians: John Fischer, Marion Brown, Lester Bowie, Wadada Leo Smith, and Perry Robinson.\n\nMusic: Known for hosting the Composers in Performance series, Environ provided a sonic laboratory for electro-acoustic experimentation, graphic scores, and microtonal improvisation."
    }
  },

  // ── DOWNTOWN AVANT-GARDE & LES (1990s–2000s) ──────────────────────
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9882, 40.7210] },
    properties: {
      id: '0006',
      name: 'Tonic',
      venue_type: 'avant_garde',
      scene_movement: 'downtown_avant_garde',
      borough: 'Manhattan',
      neighborhood: 'Lower East Side',
      address: '107 Norfolk St',
      open_year: 1998,
      close_year: 2007,
      status: 'closed',
      closing_reason: 'Luxury high-rise condo boom on Norfolk St & exponential commercial lease renegotiation',
      quote: 'Apartment high-rises went up on either side of the club. The new leases were engineered to price out culture.',
      notes: 'Musicians including John Zorn and Marc Ribot staged a historic sit-in protest on the final night.',
      description: "Operating from 1998 to 2007 at 107 Norfolk Street in a former kosher wine cellar, Tonic was the flagship performance space for the Lower East Side avant-garde, experimental jazz, and Radical Jewish Culture movements.\n\nNotable Musicians: John Zorn, Marc Ribot, Medeski Martin & Wood, Laurie Anderson, and Vijay Iyer.\n\nMusic: Tonic hosted John Zorn’s curated series and marathon benefit concerts, fostering genre-defying collaborations between jazz improvisers, noise artists, and experimental rock musicians until gentrification forced its closure."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9944, 40.7247] },
    properties: {
      id: '0019',
      name: 'The Knitting Factory (Original)',
      venue_type: 'loft',
      scene_movement: 'downtown_avant_garde',
      borough: 'Manhattan',
      neighborhood: 'Lower East Side',
      address: '47 E Houston St',
      open_year: 1987,
      close_year: 1994,
      status: 'relocated',
      closing_reason: 'Rapid commercial growth & relocation to Tribeca, later migrating across to Williamsburg Brooklyn',
      quote: 'The 1980s intersection of jazz improvisation, noise rock, and downtown downtown art culture.',
      notes: 'Its migration from Houston St to Leonard St and eventually Brooklyn mirrored the spatial trajectory of NYC artists.',
      description: "Opened in 1987 at 47 E Houston Street, the original Knitting Factory was a groundbreaking multi-level downtown club where jazz, punk, avant-garde noise, and visual art intersected in late-1980s Manhattan.\n\nNotable Musicians: Bill Frisell, Wayne Horvitz, Cassandra Wilson, Ronald Shannon Jackson, and Thomas Chapin.\n\nMusic: The venue pioneered eclectic genre-crossing programming, launching its own record label and festival series that defined the late-80s \"Knitting Factory sound\" of electric, boundary-pushing jazz."
    }
  },

  // ── BROOKLYN ACOUSTIC DIASPORA (1995–PRESENT) ─────────────────────
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9501, 40.6806] },
    properties: {
      id: '0016',
      name: "Sistas' Place",
      venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation',
      borough: 'Brooklyn',
      neighborhood: 'Bedford-Stuyvesant',
      address: '456 Nostrand Ave',
      open_year: 1995,
      close_year: null,
      status: 'open',
      closing_reason: null,
      quote: 'African American culture and political struggle preserved in the heart of Bed-Stuy as Manhattan rents peaked.',
      notes: 'Designated an official Historic Landmark; founded by civil rights activist Viola Plummer.',
      description: "Founded in 1995 by civil rights activist Viola Plummer at 456 Nostrand Avenue in Bedford-Stuyvesant, Sistas' Place is a historic Black-owned cultural institution and designated landmark that links jazz performance directly to African American political struggle and community empowerment.\n\nNotable Musicians: Randy Weston, Ahmed Abdullah, Reggie Workman, Craig Harris, and Charles Tolliver.\n\nMusic: Operating under the banner \"Jazz: A Music of the African Diaspora,\" the club hosts Saturday night performance series featuring straight-ahead, hard bop, and spiritual jazz masters."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9840, 40.6681] },
    properties: {
      id: '0017',
      name: 'Barbès',
      venue_type: 'commercial_club',
      scene_movement: 'brooklyn_continuation',
      borough: 'Brooklyn',
      neighborhood: 'Park Slope',
      address: '376 9th St',
      open_year: 2002,
      close_year: null,
      status: 'open',
      closing_reason: null,
      quote: 'A back-room sanctuary nurturing cross-genre brass bands and avant-garde improvisers across the river.',
      notes: 'Became an indispensable incubator for Brooklyn’s creative music renaissance.',
      description: "Opened in 2002 by French musicians Olivier Conan and Vincent Douglas at 376 9th Street in Park Slope, Barbès became an essential Brooklyn incubator for creative music, pairing an intimate performance back-room with a neighborhood bar vibe.\n\nNotable Musicians: Stephane Wrembel, Guillermo Klein, Slavic Soul Party!, Sexmob, and Tony Scherr.\n\nMusic: Barbès fostered eclectic multi-genre residencies, ranging from Gypsy swing and Brooklyn brass ensembles to modern jazz improvisation and South American chicha."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9822, 40.6853] },
    properties: {
      id: '0027',
      name: 'Roulette Intermedium (Brooklyn)',
      venue_type: 'avant_garde',
      scene_movement: 'brooklyn_continuation',
      borough: 'Brooklyn',
      neighborhood: 'Downtown Brooklyn',
      address: '509 Atlantic Ave',
      open_year: 2010,
      close_year: null,
      status: 'open',
      closing_reason: null,
      quote: 'Operating in SoHo since 1978, Roulette migrated to an Art Deco ballroom in Brooklyn when Manhattan rents exploded.',
      notes: 'Performing arts incubator for experimental music, improvisation, and avant-garde jazz.',
      description: "Founded in SoHo in 1978 and relocated in 2010 to a renovated 1920s Art Deco theater at 509 Atlantic Avenue in Downtown Brooklyn, Roulette is a nonprofit venue for experimental music, avant-garde jazz, and interdisciplinary art.\n\nNotable Musicians: Anthony Braxton, Henry Threadgill, Wadada Leo Smith, Roscoe Mitchell, and Zeena Parkins.\n\nMusic: Its theater supports premieres, multi-day composer retrospectives, electroacoustic work, and high-fidelity archival recordings of contemporary creative music."
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.9877, 40.6761] },
    properties: {
      id: '0028',
      name: 'ShapeShifter Lab',
      venue_type: 'avant_garde',
      scene_movement: 'brooklyn_continuation',
      borough: 'Brooklyn',
      neighborhood: 'Gowanus',
      address: '18 Whitwell Pl',
      open_year: 2011,
      close_year: 2021,
      status: 'closed',
      closing_reason: 'Gowanus massive neighborhood re-zoning & pandemic commercial lease non-renewal',
      quote: 'Founded by bassist Matthew Garrison as a 4,000-sq-ft haven for genre-defying creative experimentation.',
      notes: 'Industrial Gowanus space displaced when industrial properties were rezoned for high-density luxury residential.',
      description: "Co-founded in 2011 by electric bassist Matthew Garrison and Fortuna Sung at 18 Whitwell Place in Gowanus, ShapeShifter Lab converted a 4,000-square-foot industrial warehouse into a flexible, artist-driven performance and recording space.\n\nNotable Musicians: Matthew Garrison, Jack DeJohnette, Ravi Coltrane, John McLaughlin, and Nicholas Payton.\n\nMusic: Designed for pristine acoustic clarity and digital multimedia integration, the space hosted innovative electronic jazz, complex rhythm workshops, and large ensemble performances."
    }
  },
  ...EARLY_JAZZ_VENUES,
  ...VILLAGE_PRESERVATION_VENUES,
  ...CURRENT_JAZZ_VENUES,
  ...OUTER_BOROUGH_JAZZ_VENUES,
];
