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
      notes: 'Art Deco landmark interior stripped after landlord rent dispute in 2012; building demolished in 2017 for retail redevelopment.'
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
      notes: 'Historic Sugar Hill cornerstone dating back to the late 1930s (formerly Duke’s Bar).'
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
      notes: 'The undisputed cradle of Bebop jam sessions in the 1940s; later restored as an upscale venue in the 2000s.'
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
      notes: 'Named in honor of Charlie "Bird" Parker. Forced to close in 1965 when Broadway real estate values soared.'
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
      quote: 'One of the legendary speakeasies on Swing Street where Billie Holiday and Count Basie broke box office records.',
      notes: 'Part of the mid-century corporate clearing of 52nd Street for CBS Black Rock and corporate headquarters.'
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
      notes: 'Demolished alongside neighboring clubs for Rockefeller Center expansion.'
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
      notes: 'Historic survivor operating continuously under the Gordon family stewardship.'
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
      notes: 'Beloved Greenwich Village institution whose abrupt 2022 closure triggered widespread mourning across NYC jazz.'
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
      quote: 'The ultimate after-hours university for piano masters—Hank Jones, Tommy Flanagan, and Kenny Barron.',
      notes: 'Its cedar-paneled room was famous for impromptu 3 AM duets by unannounced world masters.'
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
      notes: 'Recorded hundreds of legendary live albums before losing its lease.'
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
      notes: 'Founded by Mitch Borden; survived pandemic pressure through non-profit foundation listener support.'
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
      notes: 'The spiritual birthplace of free jazz where Ornette Coleman made his explosive New York debut in 1959.'
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
      notes: 'Legendary Avenue B hangout for bohemian writers, artists, and musicians.'
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
      notes: 'Center of the 1976 Wildflowers loft jazz festival series.'
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
      notes: 'Now an ultra-luxury designer retail boutique on Greene Street.'
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
      notes: 'Direct neighbor to Studio Rivbea during the height of the 1970s loft movement.'
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
      notes: 'Co-founded by James DuBoise to give disenfranchised avant-garde artists performance autonomy.'
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
      notes: 'Hosted multi-day loft marathons during the peak of downtown deindustrialization.'
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
      notes: 'Musicians including John Zorn and Marc Ribot staged a historic sit-in protest on the final night.'
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
      notes: 'Its migration from Houston St to Leonard St and eventually Brooklyn mirrored the spatial trajectory of NYC artists.'
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
      notes: 'Designated an official Historic Landmark; founded by civil rights activist Viola Plummer.'
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
      notes: 'Became an indispensable incubator for Brooklyn’s creative music renaissance.'
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
      notes: 'Premier performing arts incubator for experimental music, improvisation, and avant-garde jazz.'
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
      notes: 'Industrial Gowanus space displaced when industrial properties were rezoned for high-density luxury residential.'
    }
  },
  ...EARLY_JAZZ_VENUES,
  ...VILLAGE_PRESERVATION_VENUES,
  ...CURRENT_JAZZ_VENUES,
  ...OUTER_BOROUGH_JAZZ_VENUES,
];
