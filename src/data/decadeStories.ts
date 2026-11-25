import type { Decade } from '../gallery/model';
import type { DecadeStory, MapCameraState, StoryBeat, StoryPullQuote, StorySource } from '../types';
import { GALLERY_PROFILE_BY_ID } from './clubProfiles';

const NYC: MapCameraState = { center: [-73.98, 40.735], zoom: 10.35, pitch: 18, bearing: 0 };
const HARLEM: MapCameraState = { center: [-73.943, 40.818], zoom: 13.25, pitch: 34, bearing: -12 };
const MIDTOWN: MapCameraState = { center: [-73.9797, 40.761], zoom: 15.05, pitch: 43, bearing: 20 };
const VILLAGE: MapCameraState = { center: [-73.999, 40.733], zoom: 14.1, pitch: 38, bearing: 12 };
const DOWNTOWN: MapCameraState = { center: [-73.993, 40.722], zoom: 13.8, pitch: 42, bearing: -16 };
const BROOKLYN: MapCameraState = { center: [-73.958, 40.68], zoom: 12.2, pitch: 38, bearing: -12 };
const OUTER_BOROUGHS: MapCameraState = { center: [-73.91, 40.75], zoom: 10.65, pitch: 30, bearing: -8 };

const LPC_JAZZ = 'https://s-media.nyc.gov/agencies/lpc/lp/2671.pdf';
const LPC_HARLEM = 'https://s-media.nyc.gov/agencies/lpc/lp/2607.pdf';
const LOC_RENT = 'https://www.loc.gov/item/wpalh001365/';
const LOC_HARD_TIMES = 'https://www.loc.gov/collections/federal-writers-project/articles-and-essays/hard-times-in-the-city/';
const SMITHSONIAN_RENT = 'https://www.si.edu/sites/default/files/s3e15_singing_the_gender-bending_blues_transcript.pdf';
const LOFT_JAZZ = 'https://www.si.edu/object/loft-jazz-improvising-new-york-1970s-michael-c-heller%3Asiris_sil_1078879';
const NIGHTLIFE = 'https://www.nyc.gov/assets/mome/pdf/NYC_Nightlife_Economic_Impact_Report_2019_digital.pdf';
const BLS = 'https://www.bls.gov/cpi/factsheets/purchasing-power-constant-dollars.htm';
const NEH_52ND_STREET = 'https://www.neh.gov/humanities/2010/mayjune/curio/tenor-the-times';
const MOMA_FIVE_SPOT = 'https://press.moma.org/wp-content/uploads/2018/01/7_judson_sectionsubsectiontexts.pdf';
const SMALLS_HISTORY = 'https://www.smallslive.com/about-us/';
const WNYC_CABARET = 'https://wnyc.org/story/cabaret-cards-repealed/';
const SAVOY_MARKER = 'https://www.savoyplaque.org/ceremony.htm';
const NYT_RIVBEA = 'https://www.nytimes.com/2023/09/22/arts/music/sam-rivers-centennial-studio-rivbea.html';

type BeatDraft = Omit<StoryBeat, 'id' | 'image' | 'imageAlt' | 'rentContext'> & {
  image?: string;
  imageAlt?: string;
};
interface StoryDraft {
  title: string;
  subtitle: string;
  historicalPhase: string;
  sources: StorySource[];
  beats: [BeatDraft, BeatDraft, BeatDraft, BeatDraft];
}

const source = (label: string, url: string): StorySource => ({ label, url });
const preRent = { state: 'unavailable' as const, note: 'Comparable tract-level rent data in this map begins in 1980; this earlier housing context comes from the cited historical record.' };
const rentFor = (decade: Decade) => decade < 1980 ? preRent : {
  state: 'available' as const,
  year: decade as 1980 | 1990 | 2000 | 2010 | 2020,
  note: `Map shading shows median residential contract rent in constant 2020 dollars for ${decade}. It indicates neighbourhood pressure, not a club’s commercial lease or a proven reason for closure.`,
};
const quote = (text: string, speaker: string, sourceName: string, url: string): StoryPullQuote => ({ text, speaker, source: sourceName, url });

const DRAFTS: Record<Decade, StoryDraft> = {
  1920: {
    title: 'Harlem Ignites a New Century of Sound',
    subtitle: 'Welcome to the tour: The Great Migration and Harlem Renaissance make New York a capital of jazz',
    historicalPhase: 'The Harlem Renaissance',
    sources: [source('NYC Landmarks: Jazz in Harlem', LPC_JAZZ), source('Library of Congress: Harlem rent parties', LOC_RENT), source('Smithsonian: Gladys Bentley and rent parties', SMITHSONIAN_RENT)],
    beats: [
      { role: 'migration', eyebrow: 'Welcome to New York', historicalContext: 'Great Migration · Harlem Renaissance', title: 'Welcome to New York: The Great Migration', body: 'Welcome to New York City! Over the next hundred years, you will travel from hidden speakeasies to midnight lofts to see how jazz shaped the city, and why its venues stayed vulnerable. Our tour begins in 1920s Harlem. Hundreds of thousands of African Americans moved north during the Great Migration, bringing deep musical traditions with them. Here, jazz blossomed as part of the Harlem Renaissance: an era of Black literature, poetry, painting, and civic life.', venueIds: ['early-cotton-club', 'early-savoy-ballroom', 'early-smalls-paradise'], camera: HARLEM, image: '/images/eras/1920.jpg', imageAlt: 'Winold Reiss artwork Harlem at Night, capturing the Harlem Renaissance soundscape.' },
      { role: 'housing', eyebrow: 'Harlem Apartments', historicalContext: 'Housing discrimination · household survival', title: 'Rent parties: Turning Harlem apartments into stages', body: 'High rents and discriminatory housing made life in Harlem expensive. To keep a roof over their heads, neighbours turned private apartments into rent parties: families cleared the furniture, charged a modest 25-cent entrance fee, served home-cooked food, and hired stride pianists to play all night. Those gatherings helped cover the rent while giving musicians like Fats Waller and Willie "the Lion" Smith an intimate laboratory for new rhythms.', venueIds: ['early-smalls-paradise'], camera: HARLEM, pullQuote: quote('The houserent party was a social institution in Harlem.', 'Frank Byrd', 'WPA Harlem Rent Parties manuscript', LOC_RENT) },
      { role: 'commercial_nightlife', eyebrow: 'Prohibition Speakeasies', historicalContext: 'Prohibition · segregated audiences', title: 'The Cotton Club: Splendour behind closed doors', body: 'During Prohibition, selling alcohol was illegal, making glamorous speakeasies hugely profitable. At the Cotton Club, young bandleader Duke Ellington broadcast his orchestral jazz to radio listeners nationwide. Yet behind the acclaim lay strict segregation: wealthy white patrons flocked uptown to be entertained while Black patrons were barred from entering the front door.', venueIds: ['early-cotton-club', 'early-connies-inn'], camera: HARLEM },
      { role: 'alternative_social_space', eyebrow: 'Harlem Dance Floors', historicalContext: 'Integrated floors · house parties · queer performance', title: 'The Savoy Ballroom: Where the city danced together', body: 'Just down the avenue, other doors opened differently. At the Savoy Ballroom, known as the "Home of Happy Feet," and Black-owned Small’s Paradise, mixed crowds packed the dance floor side by side. Dancing the Lindy Hop to thunderous brass sections, New Yorkers shared integrated floors that much of the city still refused elsewhere.', venueIds: ['early-savoy-ballroom', 'early-smalls-paradise'], camera: HARLEM },
    ],
  },
  1930: {
    title: 'Hard Times, Legal Drinks, and Swing Street',
    subtitle: 'The Great Depression hits Harlem, while Repeal shifts commercial clubs toward Midtown',
    historicalPhase: 'The Swing Era',
    sources: [source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('Library of Congress: Hard Times in the City', LOC_HARD_TIMES), source('NYC Landmarks: Jazz in Harlem', LPC_JAZZ)],
    beats: [
      { role: 'economic_crisis', eyebrow: 'The Great Depression', historicalContext: 'Great Depression · unequal unemployment', title: 'The crash shakes the neighbourhood', body: 'The roaring twenties ended abruptly when the stock market crashed. The Great Depression hit Harlem harder and faster, driving steep unemployment and threatening the theatres, ballrooms, and households that supported local music. Even so, players and residents kept sessions going inside crowded apartments and neighbourhood clubs to survive the city’s hardest economic years.', venueIds: ['early-savoy-ballroom', 'early-smalls-paradise', '0001'], camera: HARLEM },
      { role: 'housing', eyebrow: 'Community Survival', historicalContext: 'Rent parties · relief · mutual support', title: 'Rent parties keep families and players going', body: 'Throughout the Depression, Harlem families still relied on rent parties and neighbourhood clubs like Small’s Paradise to close monthly budget gaps. Musicians were working people first: they traded songs for hot meals, pooled tips, and played benefit concerts in spaces where pleasure, crowding, and economic necessity sat side by side.', venueIds: ['early-smalls-paradise'], camera: HARLEM },
      { role: 'development', eyebrow: 'Prohibition Repealed', historicalContext: 'End of Prohibition · changing club geography', title: 'West 52nd Street: The birth of Swing Street', body: 'In 1933, the United States repealed Prohibition, making alcohol legal again. Basement speakeasies on West 52nd Street in Midtown opened to the sidewalk as legitimate clubs. Within a few blocks, spots like the Onyx, the Famous Door, and Hickory House turned this narrow strip into "Swing Street" as commercial club work shifted south from Harlem.', venueIds: ['0021', '0022', 'early-hickory-house'], camera: MIDTOWN },
      { role: 'commercial_nightlife', eyebrow: 'Mass Culture', historicalContext: 'Mass culture · political awakening', title: 'Swing booms while Harlem protests', body: 'Powered by live radio broadcasts, 16-piece swing big bands led by Duke Ellington, Count Basie, and Benny Goodman became America’s dominant popular music. Yet as swing grew into a national business, Black artists and Harlem residents demanded fair pay, jobs, housing, and relief. Those tensions surfaced in union organising and the 1935 Harlem uprising.', venueIds: ['early-savoy-ballroom', '0021', '0022'], camera: NYC, image: '/images/eras/1930.jpg', imageAlt: 'Benny Goodman and his swing orchestra, exemplifying the nationwide mass-culture big band era.' },
    ],
  },
  1940: {
    title: 'War Curfews Ignite the Bebop Revolution',
    subtitle: 'Wartime dance taxes push musicians off the bandstands and into late-night musical laboratories',
    historicalPhase: 'Wartime transformation',
    sources: [source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('NYC Landmarks: Minton’s Playhouse', LPC_JAZZ), source('Smithsonian: Mary Lou Williams recordings', 'https://folkways-media.si.edu/docs/folkways/artwork/FW02966.pdf')],
    beats: [
      { role: 'wartime', eyebrow: 'Wartime New York', historicalContext: 'Defence economy · continuing discrimination', title: 'A city mobilised for World War II', body: 'World War II transformed New York as troops passed through city harbours and factories ran day and night, yet many war contractors still discriminated against Black workers and housing stayed segregated. At the same time, a 20-percent federal cabaret tax on clubs with dance floors and gas rations hit big bands hard, opening space for smaller groups.', venueIds: ['0003', 'outer-845-club'], camera: NYC, image: '/images/eras/1940.jpg', imageAlt: 'Musicians on 52nd Street in New York, photographed by William P. Gottlieb, ca. 1948.' },
      { role: 'experimentation', eyebrow: 'After-Hours Laboratory', historicalContext: 'Minton’s · apartments · musicians’ networks', title: 'Minton’s Playhouse: Reinventing music after hours', body: 'Up on 118th Street in Harlem, musicians gathered at Minton’s Playhouse and in private apartments like Mary Lou Williams’s Hamilton Terrace home after their regular paying jobs. Players including Dizzy Gillespie, Thelonious Monk, and Charlie Parker pushed tempos, harmonies, and phrasing into bebop, building a new language out of late-night exchange.', venueIds: ['0003'], camera: HARLEM, pullQuote: quote('wonderfully exciting', 'Dizzy Gillespie, recalling the sessions', 'NYC Landmarks designation report', LPC_JAZZ) },
      { role: 'commercial_nightlife', eyebrow: 'Midtown Crossroads', historicalContext: 'Harlem · 52nd Street · wartime audiences', title: 'The bebop lightning hits 52nd Street', body: 'By mid-decade, this Harlem sound travelled downtown to 52nd Street. At the Three Deuces and Downbeat Club, audiences crammed into smoke-filled basements to hear Charlie Parker’s solos. Musicians rushed between Harlem jam sessions, Midtown recording studios, and Broadway theatres, linking uptown and downtown in a nightly circuit.', venueIds: ['early-three-deuces', 'early-downbeat-club', '0022', '0003'], camera: MIDTOWN },
      { role: 'postwar_change', eyebrow: 'Postwar Turn', historicalContext: 'Postwar bebop · radio and records', title: 'After 1945, bebop enters public view', body: 'When the war ended in 1945, bebop stepped onto larger commercial stages. Clubs like the Royal Roost on Broadway billed modern jazz to wider crowds while record labels pressed vinyl discs sent overseas, bringing years of wartime club work and late-night sessions into international circulation.', venueIds: ['early-royal-roost', 'early-three-deuces', '0003'], camera: MIDTOWN },
    ],
  },
  1950: {
    title: 'Bulldozers in Midtown, Basements in the Village',
    subtitle: 'Cabaret cards police the stage while 52nd Street gives way to corporate towers',
    historicalPhase: 'Postwar City & Cabaret Policing',
    sources: [source('NYC Landmarks: Jazz in Harlem', LPC_JAZZ), source('NEH: 52nd Street', NEH_52ND_STREET), source('WNYC: Cabaret cards repealed', WNYC_CABARET), source('NYC Landmarks: Gillespie residence', 'https://www.nyc.gov/site/lpc/about/pr2023/lpc-designates-three-sites-with-ties-to-jazz-history.page')],
    beats: [
      { role: 'postwar_change', eyebrow: 'A Changing City', historicalContext: 'Prosperity · police cabaret cards · exclusion', title: 'Postwar prestige and police scrutiny', body: 'The 1950s brought economic growth to New York, yet police licensing controlled who was allowed to perform. From 1943 to 1967, club musicians had to carry an NYPD-issued Cabaret Card, a system used to bar artists such as Thelonious Monk and Billie Holiday from New York stages for years even as their recordings entered the canon.', venueIds: ['0003', '0002'], camera: HARLEM, image: '/images/eras/1950.jpg', imageAlt: 'Thelonious Monk and Howard McGhee at the piano, photographed by William P. Gottlieb.' },
      { role: 'commercial_nightlife', eyebrow: 'Broadway Flagship', historicalContext: 'Birdland · seated listening · commercial hierarchy', title: 'Birdland: The jazz corner of the world', body: 'Opened in 1949 and named in honour of Charlie "Bird" Parker, Birdland became the most famous jazz club in Midtown Manhattan. With live radio broadcasts and celebrities packed into tiered booths, Birdland sold modern jazz as chic metropolitan nightlife while economics concentrated attention on fewer flagship clubs.', venueIds: ['0020', 'early-royal-roost'], camera: MIDTOWN },
      { role: 'decentralization', eyebrow: 'Greenwich Village', historicalContext: 'Village clubs · Queens homes and rehearsals', title: 'The Village Vanguard: A subterranean haven', body: 'As Midtown grew more corporate, Greenwich Village basements carried much of the daily work. In 1957, the triangular cellar at the Village Vanguard turned fully to jazz, hosting landmark live albums by Sonny Rollins and John Coltrane while nearby clubs like Café Bohemia offered intimate stages on tighter budgets.', venueIds: ['0004', '0025', 'outer-845-club'], camera: VILLAGE, pullQuote: quote('probably my most profound learning experience', 'Junior Mance, on rehearsing with Dizzy Gillespie', 'NYC Landmarks Preservation Commission', 'https://www.nyc.gov/site/lpc/about/pr2023/lpc-designates-three-sites-with-ties-to-jazz-history.page') },
      { role: 'development', eyebrow: 'Wrecking Balls & Queens Homes', historicalContext: 'Office construction · changing entertainment markets', title: '52nd Street falls as musicians look to Queens', body: 'By the end of the 1950s, developers bulldozed the old brownstones of 52nd Street to put up corporate skyscrapers. Legends including Louis Armstrong, Dizzy Gillespie, and John Coltrane turned family homes in Queens neighbourhoods like Corona and St. Albans into rehearsal workshops, yet tearing down Swing Street broke apart a public club district that private homes could not replace.', venueIds: ['0021', '0022', '0020'], camera: OUTER_BOROUGHS },
    ],
  },
  1960: {
    title: 'Civil Rights, Breaking Rules, and the East Village',
    subtitle: 'Experimental clubs, political urgency, and urban renewal reshaping Black New York',
    historicalPhase: 'The Avant-Garde & Civil Rights',
    sources: [source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('MoMA: Five Spot history', MOMA_FIVE_SPOT), source('Savoy Ballroom Commemorative Marker', SAVOY_MARKER), source('Library of Congress: Jazzmobile', 'https://www.loc.gov/loc/lcib/0105/jazz_archives.html')],
    beats: [
      { role: 'postwar_change', eyebrow: 'Music of the Movement', historicalContext: 'Political expression · changing institutions', title: 'The soundtrack of Civil Rights', body: 'As the Civil Rights Movement gathered momentum across the country, jazz artists took an explicit public stand. Max Roach, Abbey Lincoln, Charles Mingus, and Nina Simone wrote music addressing racial injustice, African independence, and freedom, challenging who controlled jazz and whom it served.', venueIds: ['0004', '0003'], camera: NYC, image: '/images/eras/1960.jpg', imageAlt: 'John Coltrane in 1963, representing the spiritual and political awakening of 1960s jazz.' },
      { role: 'experimentation', eyebrow: 'Shaking the Foundation', historicalContext: 'Village clubs · East Side experiments', title: 'The Five Spot: Monk returns and Coleman breaks rules', body: 'In the East Village at the Five Spot Café, Thelonious Monk returned to club work after regaining his cabaret card, and Ornette Coleman arrived with a white plastic saxophone to upend conventional harmony. Painters and poets packed into the small club nightly, even while short leases and Cooper Square redevelopment left downtown venues vulnerable.', venueIds: ['0025', '0004', '0018', '0026'], camera: DOWNTOWN },
      { role: 'development', eyebrow: 'Gritty East Village', historicalContext: 'Manufacturing loss · urban renewal', title: 'Slugs’ Saloon: Raw genius on Avenue B', body: 'Out on the neglected blocks of Avenue B, Slugs’ Saloon became a proving ground for intense, exploratory players like Albert Ayler, Sun Ra, and Lee Morgan. With sawdust on the floor and inexpensive drinks, Slugs’ gave uncompromising musicians space to play extended sets that commercial Manhattan venues rarely booked.', venueIds: ['0026', '0018'], camera: DOWNTOWN },
      { role: 'alternative_social_space', eyebrow: 'Loss & Public Space', historicalContext: 'Savoy demolition · Jazzmobile · commemoration', title: 'Urban renewal clears the Savoy; Jazzmobile hits the street', body: 'As redevelopment cleared blocks, closing Harlem’s Savoy Ballroom in 1958 and demolishing it in 1959 for Delano Village, pianist Billy Taylor co-founded Jazzmobile to carry a flatbed stage straight into neighbourhoods. Decades later, a 2002 plaque would honour the Savoy in the past tense, underscoring how commemoration alone could not save living gathering places.', venueIds: ['0003', '0026', 'early-savoy-ballroom'], camera: HARLEM },
    ],
  },
  1970: {
    title: 'Fiscal Crisis and the Loft Jazz Revolution',
    subtitle: 'When New York stood on the brink of bankruptcy, musicians turned empty lofts into artist-run venues',
    historicalPhase: 'The Loft Jazz Movement',
    sources: [source('Smithsonian Libraries: Loft Jazz', LOFT_JAZZ), source('New York Times: Studio Rivbea', NYT_RIVBEA), source('Smithsonian oral history: SoHo lofts', 'https://www.aaa.si.edu/collections/interviews/oral-history-interview-deborah-remington-13319')],
    beats: [
      { role: 'economic_crisis', eyebrow: 'A City in Crisis', historicalContext: 'Disinvestment · a weak commercial market', title: 'Empty factories become cheap venues', body: 'In the mid-1970s, New York City faced deindustrialisation and its worst fiscal crisis in history, teetering near bankruptcy. As manufacturing fled, it left behind deserted cast-iron buildings across Lower Manhattan. In SoHo and NoHo, low rents created a temporary opening: affordability born from economic distress rather than lasting support for artists.', venueIds: ['0011', '0012', '0013'], camera: DOWNTOWN, image: '/images/eras/1970.jpg', imageAlt: 'Loft jazz musicians performing in an intimate Lower Manhattan improvised loft setting.' },
      { role: 'alternative_social_space', eyebrow: 'Musician-Run Havens', historicalContext: 'Live-work lofts · self-production', title: 'Studio Rivbea: Sam Rivers takes control', body: 'Tired of exploitative club owners and indifferent record labels, saxophonist Sam Rivers and his wife Bea founded Studio Rivbea in a Bond Street loft. They lived, taught, rehearsed, and ran concerts in one place, while nearby drummer Rashied Ali opened Ali’s Alley, proving artists could run venues on their own terms.', venueIds: ['0011', '0012'], camera: DOWNTOWN },
      { role: 'experimentation', eyebrow: 'A Creative Network', historicalContext: 'SoHo · NoHo · Lower East Side', title: 'The loft network: Environ, Ladies’ Fort, and Studio We', body: 'Within walking distance, spaces like Ladies’ Fort, Studio We, and Environ sprang up. Audiences climbed steep freight stairs to sit on mismatched thrift sofas, listening to hours of creative music in buildings where rehearsal hall, residence, and concert venue overlapped.', venueIds: ['0013', '0014', '0015'], camera: DOWNTOWN },
      { role: 'development', eyebrow: 'The Cycle of Change', historicalContext: 'Public grants · residential conversion', title: 'The pioneer’s dilemma: SoHo prices out Studio Rivbea', body: 'The cultural energy of the lofts soon drew art dealers and residential landlords. Public grants and ticket subsidies, including support around the 1972 New York Musicians’ Festival, helped artists stage shows, yet once landlords could convert buildings for higher-paying residential tenants, venues like Studio Rivbea closed by 1978. New York kept the neighbourhood’s cachet while pricing out its makers.', venueIds: ['0011', '0012', '0013', '0014'], camera: NYC },
    ],
  },
  1980: {
    title: 'Young Lions, Downtown Noise, and Rising Rents',
    subtitle: 'Acoustic revival uptown, experimental clubs downtown, and leases tightening everywhere',
    historicalPhase: 'The Neo-Bop & Downtown Renaissance',
    sources: [source('JazzTimes: original Knitting Factory', 'https://www.jazztimes.com/features/interviews/remembering-the-original-knitting-factory/'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'affordability', eyebrow: 'The Cost of Living', historicalContext: 'Post-fiscal reinvestment · rising commercial rents', title: 'Rising rents squeeze Lower Manhattan clubs', body: 'Entering the 1980s, New York’s economic rebound drove residential and commercial rents sharply upward across Lower Manhattan. As landlords sought higher returns, surviving small clubs faced tighter margins, needing loyal regulars or tourist crowds just to keep their doors open.', venueIds: ['0019', '0005'], camera: NYC, image: '/images/eras/1980.jpg', imageAlt: 'East Village and Lower East Side nightclub nightlife during the 1980s.' },
      { role: 'experimentation', eyebrow: 'Cross-Genre Energy', historicalContext: 'Jazz · rock · noise · performance art', title: 'The Knitting Factory: Where jazz met punk and poetry', body: 'On Houston Street, the original Knitting Factory became the epicentre of downtown experimental music. Uninterested in strict genre rules, musicians like John Zorn mixed free jazz with punk rock, noise, and spoken word in a cramped club built for adventurous crowds.', venueIds: ['0019'], camera: DOWNTOWN },
      { role: 'commercial_nightlife', eyebrow: 'Village Bastions', historicalContext: 'Surviving clubs · new small venues', title: 'The Village Vanguard & 55 Bar: Holding the line', body: 'Across town, longtime Village basements held on. Lorraine Gordon steered the Village Vanguard as an acoustic sanctuary, while the subterranean 55 Bar on Christopher Street hosted intimate nightly guitar sessions, surviving through dedicated owners and steady neighbourhood regulars.', venueIds: ['0004', '0005', '0023', '0018'], camera: VILLAGE },
      { role: 'development', eyebrow: 'Influence vs. Leases', historicalContext: 'Redevelopment · insecure cultural space', title: 'Global reach doesn’t guarantee a Manhattan lease', body: 'At the same time, young virtuosos led by trumpeter Wynton Marsalis sparked a worldwide "Young Lions" return to acoustic swing. Yet whether players chased experimental noise or classic swing, international acclaim still couldn’t pay commercial rent or shield small downtown venues from rising property values.', venueIds: ['0019', '0005', '0023'], camera: NYC },
    ],
  },
  1990: {
    title: 'Basement Classrooms for a New Generation',
    subtitle: 'As Manhattan rents climb, young players gather late at night in shrinking basement clubs',
    historicalPhase: 'The 1990s Underground',
    sources: [source('Smalls: club history', SMALLS_HISTORY), source('JazzTimes: New York jazz joints', 'https://www.jazztimes.com/features/profiles/after-hours-new-yorks-jazz-joints-through-the-ages/'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'affordability', eyebrow: 'Real Estate Pressure', historicalContext: '1990s boom · redevelopment', title: 'High rents push jazz deeper underground', body: 'The 1990s brought Wall Street windfalls and rapid gentrification across Manhattan. Residential and commercial rents surged, squeezing musicians and small venues alike. With prime street-level storefronts unaffordable, scenes retreated into cramped basements where rent was lower and late-night sound stayed contained.', venueIds: ['0024', '0005', '0006'], camera: NYC, image: '/images/eras/1990.jpg', imageAlt: 'New York City skyline and streetlights in the 1990s.' },
      { role: 'alternative_social_space', eyebrow: 'The All-Night Classroom', historicalContext: 'Long sets · jam sessions · young players', title: 'Smalls: Ten dollars, free juice, and music until dawn', body: 'In 1994, Mitch Borden opened Smalls down a steep set of stairs on West 10th Street. With no liquor licence, a $10 cover, and complimentary juice, Smalls stayed open until 6 in the morning. Young players like pianist Brad Mehldau and guitarist Kurt Rosenwinkel played marathon sets, turning a cramped cellar into an informal school.', venueIds: ['0024', '0005'], camera: VILLAGE },
      { role: 'experimentation', eyebrow: 'Lower East Side Edge', historicalContext: 'Lower East Side · cross-genre venues', title: 'Tonic: Free expression on Norfolk Street', body: 'Late in the decade, Tonic opened in a former kosher winery on Norfolk Street, giving experimental improvisers, avant-garde klezmer players, and free-jazz pioneers a vital downtown home. Tonic prioritised artistic freedom over profit even as luxury development began transforming the blocks around it.', venueIds: ['0006', '0019'], camera: DOWNTOWN },
      { role: 'development', eyebrow: 'Fragile Margins', historicalContext: 'Independent owners · short leases', title: 'A global sound hanging on fragile leases', body: 'By the end of the decade, New York jazz depended less on major record contracts or Broadway marquees than on tight-knit circles of independent owners, bartenders, and young players. Yet dedication alone could not protect clubs when a single lease hike or downturn arrived.', venueIds: ['0024', '0006', '0005'], camera: NYC },
    ],
  },
  2000: {
    title: 'Beyond Manhattan: Closures, Brooklyn, and Queens',
    subtitle: 'Post-9/11 shock and luxury high-rises close downtown clubs while outer-borough scenes grow',
    historicalPhase: 'The Multi-Borough Transition',
    sources: [source('Smalls: club history', SMALLS_HISTORY), source('New York Times: Tonic closes', 'https://www.nytimes.com/2007/04/16/arts/music/16toni.html'), source('Flushing Town Hall history', 'https://www.flushingtownhall.org/mission-and-history'), source('Terraza 7', 'https://www.terraza7.com/')],
    beats: [
      { role: 'economic_crisis', eyebrow: 'Downtown Shocks', historicalContext: 'September 11 aftermath · luxury condos', title: 'September 11 and Norfolk Street high-rises close Tonic', body: 'The attacks of September 11, 2001 dealt a sharp economic blow to Lower Manhattan nightlife. Tourism evaporated overnight, forcing Smalls into bankruptcy before it later reopened. Five years later, Tonic closed in 2007 after luxury apartment high-rises drove commercial rents beyond what an experimental venue could pay.', venueIds: ['0006', '0024', '0005'], camera: DOWNTOWN },
      { role: 'commercial_nightlife', eyebrow: 'Non-Profit Sanctuaries', historicalContext: 'Prestige clubs · non-profit presenters', title: 'The Jazz Gallery: Non-profits cushion some stages', body: 'Facing rising commercial costs, artists and supporters built non-profit venues like The Jazz Gallery in SoHo to commission new work and mentor emerging players. Grants and philanthropy eased bar-sales pressure, yet could not protect independent clubs citywide from a changing property market.', venueIds: ['current-jazz-gallery', '0004', '0024'], camera: VILLAGE },
      { role: 'decentralization', eyebrow: 'Crossing the East River', historicalContext: 'Industrial space · artist-led continuation', title: 'Brooklyn grows, without replacing lost Manhattan venues', body: 'Pushed by steep Manhattan living costs, musicians increasingly worked in Williamsburg, Crown Heights, and Bed-Stuy alongside spaces like Williamsburg Music Center and Barbès. Moving across the river kept new music alive, even though it could not restore the lost venues and relationships of Lower Manhattan.', venueIds: ['0016', '0017', 'outer-williamsburg-music-center'], camera: BROOKLYN },
      { role: 'decentralization', eyebrow: 'Queens Legacies', historicalContext: 'Community institutions · diasporic programming', title: 'Queens: Global crossroads and community anchors', body: 'In Queens, historic stages like Flushing Town Hall and grassroots neighbourhood clubs like Terraza 7 connected jazz to Latin American and global diasporas alongside local borough talent. Their programmes built on Queens’s own long jazz history rather than simply substituting for Manhattan closures.', venueIds: ['outer-terraza-7', 'outer-flushing-town-hall'], camera: OUTER_BOROUGHS },
    ],
  },
  2010: {
    title: 'A Wider Map, Tighter Leases',
    subtitle: 'From Brooklyn neighbourhood bars to Lincoln Center, new clubs open while commercial rents squeeze the city',
    historicalPhase: 'The Modern Archipelago',
    sources: [source('NYC nightlife economic-impact study', NIGHTLIFE), source('Flushing Town Hall history', 'https://www.flushingtownhall.org/mission-and-history'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'affordability', eyebrow: 'The Affordability Puzzle', historicalContext: 'Nightlife economy · commercial rent pressure', title: 'Nightlife thrives, yet 87 percent cite rising rent', body: 'By the 2010s, New York City nightlife contributed billions to the local economy, yet 87 percent of owners and operators surveyed in the city’s 2019 study named commercial rent a top challenge. Musicians partnered with neighbourhood bars, community centres, and non-profits to keep music accessible, helpful stopgaps that still left underlying leases exposed.', venueIds: ['0027', '0028', 'outer-lunatico'], camera: NYC, image: '/images/eras/2010.jpg', imageAlt: 'Live jazz performance at NYC Winter Jazzfest, showcasing the polyphonic energy of the 2010s.' },
      { role: 'decentralization', eyebrow: 'Brooklyn Community', historicalContext: 'Neighbourhood venues · rezoning pressure', title: 'Bar LunÀtico & ShapeShifter Lab: Brooklyn draws clubs, and rezoning', body: 'In Bedford-Stuyvesant, touring musicians opened Bar LunÀtico, pairing jazz with West African highlife and Brazilian rhythms, while ShapeShifter Lab opened inside a converted Gowanus warehouse. Brooklyn became essential to contemporary jazz, yet rezoning and rising property values soon followed venues across the river too.', venueIds: ['outer-lunatico', '0027', '0028', '0016'], camera: BROOKLYN },
      { role: 'contemporary_ecology', eyebrow: 'Manhattan Flagships', historicalContext: 'Destination clubs · non-profits · artist-led venues', title: 'Dizzy’s Club: Institutional polish at Columbus Circle', body: 'High above Columbus Circle, Dizzy’s Club at Jazz at Lincoln Center offered acoustic clarity, skyline views, and headline masters. Institutional backing kept jazz visible at Manhattan’s centre, widening the gap between major stages and small artist-led clubs scraping by below.', venueIds: ['current-dizzys-club', 'current-jazz-gallery', 'outer-soapbox-gallery'], camera: MIDTOWN },
      { role: 'decentralization', eyebrow: 'The Connected Archipelago', historicalContext: 'Queens continuity · Brooklyn visibility', title: 'Five boroughs of jazz, still bound by rent', body: 'By the end of the decade, musicians travelled by subway between Flushing Town Hall, Columbus Circle, and Brooklyn jams, blending jazz with hip-hop, electronics, and global rhythms. Spreading across the boroughs opened new stages, yet commercial rent still decided which venues could endure.', venueIds: ['outer-flushing-town-hall', 'outer-terraza-7', 'outer-williamsburg-music-center'], camera: OUTER_BOROUGHS },
    ],
  },
  2020: {
    title: 'The pandemic empties the clubs',
    subtitle: 'Shutdown, uneven recovery, and the fight to keep space for living jazz',
    historicalPhase: 'Pandemic & Uneven Recovery',
    sources: [source('NYC Office of Nightlife report', 'https://www.nyc.gov/site/mome/news/06102021-office-of-nightlife-report.page'), source('Bronx Music Hall history', 'https://bronxmusichall.org/bronx-music-history/'), source('NYC nightlife economic-impact study', NIGHTLIFE), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'economic_crisis', eyebrow: 'The Great Silence', historicalContext: 'Shutdown · relief · livestreaming', title: 'The pandemic shuts the doors', body: 'In March 2020, COVID-19 shuttered nightclubs, ballrooms, and theatres across New York overnight. Livestreams at Smalls and emergency relief kept some artists afloat, yet prolonged shutdowns piled up commercial rent debt, eventually forcing longtime clubs like 55 Bar to close after thirty-nine years.', venueIds: ['0004', '0024', 'current-jazz-gallery', '0005'], camera: NYC, image: '/images/eras/2020.jpg', imageAlt: 'Musicians performing live outdoor jazz in New York City during pandemic recovery.' },
      { role: 'affordability', eyebrow: 'Street Survival', historicalContext: 'Sidewalk gigs · unequal resources', title: 'Stoops, parklets, and temporary survival', body: 'Shut out of indoor venues, musicians carried drum sets onto brownstone stoops and played from fire escapes and sidewalk dining sheds, while Bushwick’s Ornithology Jazz Club kept no-cover nightly sets alive. Outdoor playing bought time, though it could not resolve high housing costs or commercial lease arrears.', venueIds: ['outer-ornithology', 'current-blue-note', 'current-dizzys-club'], camera: BROOKLYN },
      { role: 'contemporary_ecology', eyebrow: 'Uneven Reopening', historicalContext: 'Curated destinations · community institutions', title: 'Reopening into a high-rent city', body: 'As venues reopened, listeners returned eagerly, yet recovery looked starkly different across the city. Polished supper clubs like The Django and well-backed stages returned to an already unaffordable market alongside small DIY venues and non-profits still struggling with rising costs and thin margins.', venueIds: ['current-django', 'current-jazz-gallery', 'outer-ornithology', 'outer-flushing-town-hall'], camera: DOWNTOWN },
      { role: 'decentralization', eyebrow: 'Keeping Space for Makers', historicalContext: 'Bronx · Queens · Brooklyn continuity', title: 'Keeping jazz alive means keeping space for its makers', body: 'A century after stride pianos played in 1920s Harlem rent parties, spaces like Bronx Music Hall extend jazz across every borough. Yet celebrating jazz as heritage is never enough on its own: sustaining living music means keeping affordable spaces where artists and audiences can inhabit and shape the city without being priced out or policed.', venueIds: ['outer-bronx-music-hall', 'outer-845-club', 'outer-flushing-town-hall', 'outer-terraza-7', 'outer-ornithology'], camera: OUTER_BOROUGHS },
    ],
  },
};

const IDS = ['overview', 'location-1', 'location-2', 'impact'] as const;

export const DECADE_STORIES = Object.fromEntries(
  (Object.entries(DRAFTS) as [string, StoryDraft][]).map(([rawDecade, draft]) => {
    const decade = Number(rawDecade) as Decade;
    const beats = draft.beats.map((item, index) => {
      const profile = GALLERY_PROFILE_BY_ID.get(item.venueIds[0]);
      return {
        ...item,
        id: `${decade}-${IDS[index]}`,
        image: item.image ?? profile?.image,
        imageAlt: item.imageAlt ?? profile?.imageAlt,
        sources: item.sources ?? draft.sources,
        rentContext: rentFor(decade),
      } satisfies StoryBeat;
    });
    return [decade, { decade, title: draft.title, subtitle: draft.subtitle, historicalPhase: draft.historicalPhase, beats } satisfies DecadeStory];
  }),
) as Record<Decade, DecadeStory>;
