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

type BeatDraft = Omit<StoryBeat, 'id' | 'image' | 'imageAlt' | 'rentContext'>;
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
  note: `Map shading shows median residential contract rent in constant 2020 dollars for ${decade}. It indicates neighborhood pressure, not a club’s commercial lease or a proven reason for closure.`,
};
const quote = (text: string, speaker: string, sourceName: string, url: string): StoryPullQuote => ({ text, speaker, source: sourceName, url });

const DRAFTS: Record<Decade, StoryDraft> = {
  1920: {
    title: 'Harlem Ignites a New Century of Sound',
    subtitle: 'Welcome to the tour: The Great Migration and Harlem Renaissance make New York the capital of jazz',
    historicalPhase: 'The Harlem Renaissance',
    sources: [source('NYC Landmarks: Jazz in Harlem', LPC_JAZZ), source('Library of Congress: Harlem rent parties', LOC_RENT), source('Smithsonian: Gladys Bentley and rent parties', SMITHSONIAN_RENT)],
    beats: [
      { role: 'migration', eyebrow: 'Welcome to New York', historicalContext: 'Great Migration · Harlem Renaissance', title: 'Welcome to New York: The Great Migration', body: 'Welcome to New York City! Over the next hundred years, you will travel from hidden speakeasies to midnight lofts to discover how jazz became the heartbeat of this city. Our tour begins in 1920s Harlem. Hundreds of thousands of African Americans moved north during the Great Migration, bringing deep musical traditions with them. Here, jazz blossomed as part of the Harlem Renaissance; a golden age of Black literature, poetry, painting, and pride.', venueIds: ['early-cotton-club', 'early-savoy-ballroom', 'early-smalls-paradise'], camera: HARLEM },
      { role: 'housing', eyebrow: 'Harlem Living Rooms', historicalContext: 'Housing discrimination · household survival', title: 'Rent parties: Turning living rooms into stages', body: 'High rents and discriminatory housing made life in Harlem expensive. To keep a roof over their heads, neighbours invented an ingenious community tradition: rent parties. Families cleared the furniture, charged a modest 25-cent entrance fee, served home-cooked food, and hired virtuosic stride pianists to play all night. These rent parties gave musicians like Fats Waller and Willie "the Lion" Smith an intimate laboratory to test brand-new rhythms.', venueIds: ['early-smalls-paradise'], camera: HARLEM, pullQuote: quote('The houserent party was a social institution in Harlem.', 'Frank Byrd', 'WPA Harlem Rent Parties manuscript', LOC_RENT) },
      { role: 'commercial_nightlife', eyebrow: 'Prohibition Speakeasies', historicalContext: 'Prohibition · segregated audiences', title: 'The Cotton Club: Splendour behind closed doors', body: 'During Prohibition, selling alcohol was against the law, making glamorous illegal nightclubs (called speakeasies) hugely profitable. At the famed Cotton Club, brilliant young bandleader Duke Ellington broadcast his innovative orchestral jazz to radio listeners nationwide. Yet behind the glamour lay harsh segregation: wealthy white patrons flocked uptown to be entertained, while Black patrons were barred from entering the front door.', venueIds: ['early-cotton-club', 'early-connies-inn'], camera: HARLEM },
      { role: 'alternative_social_space', eyebrow: 'Harlem Dance Floors', historicalContext: 'Integrated floors · private rooms · queer performance', title: 'The Savoy Ballroom: Where the city danced together', body: 'Just down the avenue, other doors opened wide. At the legendary Savoy Ballroom, also known as the "Home of Happy Feet", and Black-owned Small’s Paradise, mixed crowds packed the dance floor side by side. Here, dancing the energetic Lindy Hop to thunderous brass sections, ordinary New Yorkers proved that music could break social barriers that the outside world still struggled to cross.', venueIds: ['early-savoy-ballroom', 'early-smalls-paradise'], camera: HARLEM },
    ],
  },
  1930: {
    title: 'Hard Times, Legal Drinks, and Swing Street',
    subtitle: 'The Great Depression hits Harlem, but the repeal of Prohibition creates a legendary block of jazz in Midtown',
    historicalPhase: 'The Swing Era',
    sources: [source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('Library of Congress: Hard Times in the City', LOC_HARD_TIMES), source('NYC Landmarks: Jazz in Harlem', LPC_JAZZ)],
    beats: [
      { role: 'economic_crisis', eyebrow: 'The Great Depression', historicalContext: 'Great Depression · unequal unemployment', title: 'The crash shakes the neighbourhood', body: 'The roaring twenties came to an abrupt halt when the stock market crashed. The Great Depression hit Harlem with devastating speed, creating widespread unemployment and threatening the theatres, ballrooms, and households that nurtured local music. Yet despite immense hardship, jazz never stopped playing. Instead, it became an essential lifeline of joy and community solace during the city’s darkest economic days.', venueIds: ['early-savoy-ballroom', 'early-smalls-paradise', '0001'], camera: HARLEM },
      { role: 'housing', eyebrow: 'Community Survival', historicalContext: 'Rent parties · relief · mutual support', title: 'Music keeps moving', body: 'Throughout the Depression, Harlem families still relied on rent parties and neighbourhood clubs like Small’s Paradise to survive monthly budget gaps. Musicians were working people first: they traded songs for hot meals, pooled tips, and played benefit concerts. These gatherings proved that jazz was not a luxury for the rich, but a vital neighbourhood survival strategy.', venueIds: ['early-smalls-paradise'], camera: HARLEM },
      { role: 'development', eyebrow: 'Prohibition Repealed', historicalContext: 'End of Prohibition · changing club geography', title: 'West 52nd Street: The birth of Swing Street', body: 'In 1933, the United States repealed Prohibition, making alcohol legal again. Secret basement speakeasies on West 52nd Street in Midtown suddenly opened their doors to the sidewalk as legitimate clubs. Within a few blocks, spots like the Onyx, the Famous Door, and Hickory House turned this narrow strip into "Swing Street": the densest concentration of live music on earth.', venueIds: ['0021', '0022', 'early-hickory-house'], camera: MIDTOWN },
      { role: 'commercial_nightlife', eyebrow: 'Mass Culture', historicalContext: 'Mass culture · political awakening', title: 'Swing becomes the city\'s core', body: 'Powered by live radio broadcasts, 16-piece swing big bands led by Duke Ellington, Count Basie, and Benny Goodman became America’s dominant popular music. But as swing grew into a commercial empire, Black artists fought continually for fair pay and dignity, using Harlem rallies and union organising to demand the respect their artistry deserved.', venueIds: ['early-savoy-ballroom', '0021', '0022'], camera: NYC },
    ],
  },
  1940: {
    title: 'War Curfews Ignite the Bebop Revolution',
    subtitle: 'Wartime dance taxes push musicians off the bandstands and into late-night musical laboratories',
    historicalPhase: 'Wartime transformation',
    sources: [source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('NYC Landmarks: Minton’s Playhouse', LPC_JAZZ), source('Smithsonian: Mary Lou Williams recordings', 'https://folkways-media.si.edu/docs/folkways/artwork/FW02966.pdf')],
    beats: [
      { role: 'wartime', eyebrow: 'Wartime New York', historicalContext: 'Defense economy · continuing discrimination', title: 'A city mobilized for World War II', body: 'World War II completely transformed New York. Tens of thousands of troops passed through city harbors, factories ran day and night, and late-night entertainment boomed. But wartime brought steep challenges: the federal government slapped a 20-percent tax on clubs with dance floors, and gas rations made touring with a giant 16-piece orchestra almost impossible. Big bands began to fold, opening the door for smaller, agile groups.', venueIds: ['0003', 'outer-845-club'], camera: NYC },
      { role: 'experimentation', eyebrow: 'After-Hours Laboratory', historicalContext: 'Minton’s · apartments · musicians’ networks', title: 'Minton’s Playhouse: Re-inventing music after hours', body: 'Up on 118th Street in Harlem, at a cozy spot called Minton’s Playhouse, something revolutionary was brewing. After finishing their regular paying jobs, visionary young players like trumpeter Dizzy Gillespie, pianist Thelonious Monk, and saxophonist Charlie Parker gathered in the middle of the night. Free from the constraints of commercial swing bands, they invented bebop: A dizzyingly fast and complex new jazz style that elevated jazz past popular dance music.', venueIds: ['0003'], camera: HARLEM, pullQuote: quote('wonderfully exciting', 'Dizzy Gillespie, recalling the sessions', 'NYC Landmarks designation report', LPC_JAZZ) },
      { role: 'commercial_nightlife', eyebrow: 'Midtown Crossroads', historicalContext: 'Harlem · 52nd Street · wartime audiences', title: 'The bebop lightning hits 52nd Street', body: 'By mid-decade, this Harlem sound traveled downtown to 52nd Street. At the Three Deuces and Downbeat Club, audiences crammed into smoke-filled basements to hear Charlie Parker’s breathtaking solos. Musicians rushed between Harlem jam sessions, Midtown recording studios, and Broadway theaters, creating a breathless 24-hour creative loop across Manhattan.', venueIds: ['0003', '0022', 'early-three-deuces', 'early-downbeat-club'], camera: MIDTOWN },
      { role: 'postwar_change', eyebrow: 'Postwar Explosion', historicalContext: 'Postwar bebop · radio and records', title: 'The underground secret conquers the world', body: 'When the war ended in 1945, bebop stepped onto the global stage. New clubs like the Royal Roost on Broadway advertised modern jazz to curious crowds, while record labels pressed vinyl discs that traveled across the Atlantic. What began as an after-hours Harlem experiment had permanently changed how the world understood modern music.', venueIds: ['early-royal-roost', 'early-three-deuces', '0003'], camera: MIDTOWN },
    ],
  },
  1950: {
    title: 'Bulldozers in Midtown, Basements in the Village',
    subtitle: 'As 52nd Street is razed for modern skyscrapers, jazz finds refuge in Village alleys and outer-borough homes',
    historicalPhase: 'The Postwar Golden Age',
    sources: [source('NYC Landmarks: Jazz in Harlem', LPC_JAZZ), source('NEH: 52nd Street', NEH_52ND_STREET), source('NYC Landmarks: Gillespie residence', 'https://www.nyc.gov/site/lpc/about/pr2023/lpc-designates-three-sites-with-ties-to-jazz-history.page')],
    beats: [
      { role: 'postwar_change', eyebrow: 'A Changing City', historicalContext: 'Prosperity · segregation · industrial decline', title: 'Postwar prosperity and police scrutiny', body: 'The 1950s brought economic boom times to New York, but also tightening controls. Nightclub musicians were forced to carry a police-issued "Cabaret Card" to perform, a bureaucratic system that the NYPD weaponized to harass and blacklist Black artists like Thelonious Monk and Billie Holiday. Despite these obstacles, modern jazz entered its golden artistic age, evolving into cool, soulful, and hard bop sounds.', venueIds: ['0003', '0002'], camera: HARLEM },
      { role: 'commercial_nightlife', eyebrow: 'Broadway Flagship', historicalContext: 'Birdland · modern metropolitan culture', title: 'Birdland: The jazz corner of the world', body: 'Opened in 1949 and named in honor of Charlie "Bird" Parker, Birdland became the most famous jazz club in midtown Manhattan. With an announcer broadcasting live over national radio and celebrities packed into tiered booths, Birdland treated jazz with concert-hall respect, cementing New York as the undisputed capital of the musical universe.', venueIds: ['0020', 'early-royal-roost'], camera: MIDTOWN },
      { role: 'decentralization', eyebrow: 'Greenwich Village', historicalContext: 'Village clubs · Queens homes and rehearsals', title: 'The Village Vanguard: A subterranean haven', body: 'As midtown became increasingly corporate, bohemian Greenwich Village welcomed the music underground. In 1957, the triangular basement of the Village Vanguard dedicated itself exclusively to jazz, hosting legendary live recordings by Sonny Rollins and John Coltrane. Nearby at Cafe Bohemia, artists enjoyed intimate spaces where nuance and experimental acoustics could live and thrive.', venueIds: ['0004', '0025', 'outer-845-club'], camera: VILLAGE, pullQuote: quote('probably my most profound learning experience', 'Junior Mance, on rehearsing with Dizzy Gillespie', 'NYC Landmarks Preservation Commission', 'https://www.nyc.gov/site/lpc/about/pr2023/lpc-designates-three-sites-with-ties-to-jazz-history.page') },
      { role: 'development', eyebrow: 'Wrecking Balls & Queens Homes', historicalContext: 'Office construction · changing entertainment markets', title: '52nd Street falls, but Queens welcomes the giants', body: 'By the end of the 1950s, real estate developers bulldozed the old brownstones of 52nd Street to erect glassy corporate skyscrapers. Yet the music simply migrated: legends like Louis Armstrong, Dizzy Gillespie, and John Coltrane bought family homes in quiet Queens neighbourhoods like Corona and St. Albans, turning residential living rooms into the new workshops of American music.', venueIds: ['0021', '0022', '0020'], camera: OUTER_BOROUGHS },
    ],
  },
  1960: {
    title: 'Civil Rights, Breaking Rules, and the East Village',
    subtitle: 'The soundtrack to a revolution: How jazz broke free from traditional harmonies on the Lower East Side',
    historicalPhase: 'The Avant-Garde & Civil Rights',
    sources: [source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('MoMA: Five Spot history', MOMA_FIVE_SPOT), source('Library of Congress: Jazzmobile', 'https://www.loc.gov/loc/lcib/0105/jazz_archives.html')],
    beats: [
      { role: 'postwar_change', eyebrow: 'Music of the Movement', historicalContext: 'Political expression · changing institutions', title: 'The soundtrack of Civil Rights', body: 'As the Civil Rights Movement gathered momentum across the country, jazz artists took a bold stance. Max Roach, Abbey Lincoln, Charles Mingus, and Nina Simone wrote music directly addressing racial injustice, police violence, and freedom. The music was no longer just entertainment for a night on the town—it was a powerful political statement of Black cultural pride and self-determination.', venueIds: ['0004', '0003'], camera: NYC },
      { role: 'experimentation', eyebrow: 'Shaking the Foundation', historicalContext: 'Village listening rooms · East Side experiments', title: 'The Five Spot: Ornette Coleman shatters the mold', body: 'In the East Village, at the Five Spot Cafe, saxophonist Ornette Coleman arrived with a white plastic saxophone and shattered conventional harmony, inventing "free jazz." Giant painters like Willem de Kooning and poets like Frank O’Hara squeezed into the tiny room every night. Critics fought in the aisles, but Coleman proved that jazz could constantly reinvent its own language.', venueIds: ['0004', '0018', '0025', '0026'], camera: DOWNTOWN },
      { role: 'development', eyebrow: 'Gritty East Village', historicalContext: 'Manufacturing loss · urban renewal', title: 'Slugs’ Saloon: Raw genius on Avenue B', body: 'Far out on the gritty, neglected blocks of Avenue B, Slugs’ Saloon became the ultimate testing ground for intense, exploratory players like Albert Ayler, Sun Ra, and Lee Morgan. With sawdust on the floor and inexpensive drinks, Slugs’ offered a haven where visionary musicians could play extended, fiery sets that mainstream uptown clubs were too cautious to book.', venueIds: ['0026', '0018'], camera: DOWNTOWN },
      { role: 'alternative_social_space', eyebrow: 'Music to the People', historicalContext: 'Jazzmobile · nonprofit and public space', title: 'Jazzmobile: Taking the stage to the streets', body: 'With traditional neighborhood clubs closing under urban renewal and urban highway projects, visionary pianist Billy Taylor co-founded Jazzmobile. Converting a flatbed truck into a mobile bandstand, Jazzmobile rolled straight into Harlem and the Bronx, bringing free, world-class jazz directly to stoops and sidewalk audiences who couldn’t afford expensive downtown club covers.', venueIds: ['0003', '0026'], camera: NYC },
    ],
  },
  1970: {
    title: 'Fiscal Crisis and the Loft Jazz Revolution',
    subtitle: 'When New York stood on the brink of bankruptcy, musicians reclaimed empty industrial lofts to take control of their destiny',
    historicalPhase: 'The Loft Jazz Movement',
    sources: [source('Smithsonian Libraries: Loft Jazz', LOFT_JAZZ), source('Smithsonian oral history: SoHo lofts', 'https://www.aaa.si.edu/collections/interviews/oral-history-interview-deborah-remington-13319')],
    beats: [
      { role: 'economic_crisis', eyebrow: 'A City in Crisis', historicalContext: 'Disinvestment · a weak commercial market', title: 'Empty factories become open doors', body: 'In the mid-1970s, New York City faced deep deindustrialization and its worst fiscal crisis in history, teetering near bankruptcy. While manufacturing fled the city, it left behind vast, deserted cast-iron industrial buildings in Lower Manhattan. In neighborhoods soon christened SoHo and NoHo, low rents created a rare silver lining: vast, cheap spaces waiting to be reborn.', venueIds: ['0011', '0012', '0013'], camera: DOWNTOWN },
      { role: 'alternative_social_space', eyebrow: 'Musician-Run Havens', historicalContext: 'Live-work lofts · self-production', title: 'Studio Rivbea: Sam Rivers takes control', body: 'Tired of exploitative nightclub owners and indifferent record labels, saxophonist Sam Rivers and his wife Bea founded Studio Rivbea in a Bond Street loft. Musicians lived upstairs, rehearsed downstairs, sold home-cooked refreshments, and presented their own concerts. Nearby, drummer Rashied Ali opened Ali’s Alley, proving that artists could own and operate their own performance homes.', venueIds: ['0011', '0013'], camera: DOWNTOWN },
      { role: 'experimentation', eyebrow: 'A Creative Network', historicalContext: 'SoHo · NoHo · Lower East Side', title: 'The loft network: Environ, Ladies’ Fort, and Studio We', body: 'Within walking distance, spaces like Environ, Ladies’ Fort, and Studio We sprang up. Audiences climbed steep freight stairs to sit on mismatched thrift sofas, listening to hours of uncompromising creative music. The living room became a rehearsal hall and concert stage all at once.', venueIds: ['0012', '0014', '0015'], camera: DOWNTOWN },
      { role: 'development', eyebrow: 'The Cycle of Change', historicalContext: 'Cultural value · redevelopment pressure', title: 'The pioneer’s dilemma: SoHo prices out its artists', body: 'The vibrant cultural energy of the lofts soon caught the attention of commercial art dealers and developers. By the end of the decade, soaring property values, stricter building codes, and luxury residential conversions began pushing the very musicians who revitalised SoHo out of their spaces. It was an early chapter in a cycle that would repeat across New York.', venueIds: ['0011', '0012', '0013', '0014'], camera: NYC },
    ],
  },
  1980: {
    title: 'Young Lions, Downtown Noise, and Rising Rents',
    subtitle: 'The scene splits in two: Acoustic tradition revives uptown, while experimental energy sparks on the Lower East Side',
    historicalPhase: 'The Neo-Bop & Downtown Renaissance',
    sources: [source('JazzTimes: original Knitting Factory', 'https://www.jazztimes.com/features/interviews/remembering-the-original-knitting-factory/'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'affordability', eyebrow: 'The Cost of Living', historicalContext: '1980 rent snapshot · residential context', title: 'Mapping the city’s rising rent squeeze', body: 'Entering the 1980s, New York began rebounding economically, but that recovery brought escalating living costs. For the first time on our map, tract-level rent data lets us track neighborhood pressure across the city. As rents climbed, surviving clubs faced tighter margins, requiring exceptional community devotion or tourist appeal to keep their doors open.', venueIds: ['0019', '0005'], camera: NYC },
      { role: 'experimentation', eyebrow: 'Cross-Genre Energy', historicalContext: 'Jazz · rock · noise · performance art', title: 'The Knitting Factory: Where jazz met punk and poetry', body: 'On Houston Street, the original Knitting Factory became the epicenter of the downtown experimental music explosion. Uninterested in strict genre rules, musicians like John Zorn blended free jazz with punk rock, avant-garde noise, and spoken word. The cramped club proved that young audiences were eager for adventurous, boundary-pushing music.', venueIds: ['0019'], camera: DOWNTOWN },
      { role: 'commercial_nightlife', eyebrow: 'Village Bastions', historicalContext: 'Surviving rooms · new small clubs', title: 'The Village Vanguard & 55 Bar: Guardians of groove', body: 'Across town, timeless Village basements held the line. Lorraine Gordon steered the Village Vanguard into an acoustic sanctuary, while the subterranean 55 Bar on Christopher Street hosted blisteringly intimate nightly guitar sessions. These cozy neighborhood rooms offered a relaxed warmth that larger, expensive commercial venues could never replicate.', venueIds: ['0004', '0005', '0023', '0018'], camera: VILLAGE },
      { role: 'development', eyebrow: 'Tradition Meets Future', historicalContext: 'Redevelopment · insecure cultural space', title: 'The Young Lions bring acoustic swing back', body: 'At the same time, a new generation of virtuosos led by trumpeter Wynton Marsalis sparked a worldwide "Young Lions" movement, championing a return to acoustic swing, sharp suits, and classic jazz mastery. With one camp pushing the experimental outer limits and another revering the ancestors, New York proved it had room for every facet of the jazz spectrum.', venueIds: ['0019', '0005', '0023'], camera: NYC },
    ],
  },
  1990: {
    title: 'Basement Classrooms for a New Generation',
    subtitle: 'Facing climbing Manhattan rents, young acoustic wizards build an all-night community at Smalls',
    historicalPhase: 'The 1990s Underground',
    sources: [source('Smalls: club history', 'https://www.smallslive.com/about-us/'), source('JazzTimes: New York jazz joints', 'https://www.jazztimes.com/features/profiles/after-hours-new-yorks-jazz-joints-through-the-ages/'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'affordability', eyebrow: 'Real Estate Pressure', historicalContext: '1990 rent snapshot · redevelopment', title: 'High rents close in on the Village', body: 'The 1990s brought Wall Street windfalls and rapid gentrification to Manhattan. Residential and commercial rents surged, squeezing musicians and small venues alike. With prime street-level real estate unaffordable, jazz retreated deeper underground, finding sanctuary in basement spaces where rent was manageable and acoustic insulation kept neighbors happy.', venueIds: ['0024', '0005', '0006'], camera: NYC },
      { role: 'alternative_social_space', eyebrow: 'The All-Night Classroom', historicalContext: 'Long sets · jam sessions · young players', title: 'Smalls: Ten dollars, free juice, and music until dawn', body: 'In 1994, Mitch Borden opened Smalls down a steep set of stairs on West 10th Street. With no liquor license, a $10 cover, and complimentary juice, Smalls stayed open until 6 in the morning. Young geniuses like pianist Brad Mehldau and guitarist Kurt Rosenwinkel played marathon sets, turning this cramped basement into the definitive musical laboratory of the 1990s.', venueIds: ['0024', '0005'], camera: VILLAGE },
      { role: 'experimentation', eyebrow: 'Lower East Side Edge', historicalContext: 'Lower East Side · cross-genre rooms', title: 'Tonic: Free expression on Norfolk Street', body: 'Over on the Lower East Side, Tonic opened in a former kosher winery, providing an adventurous home for experimental improvisers, avant-garde klezmer players, and free-jazz pioneers. Tonic prioritized artistic freedom over commercial profit, giving daring musicians a place to push sonic boundaries in a neighbourhood that was rapidly gentrifying around them.', venueIds: ['0006', '0019'], camera: DOWNTOWN },
      { role: 'development', eyebrow: 'A Resilient Brotherhood', historicalContext: 'Exceptional owners · fragile continuity', title: 'A global sound rooted in tiny rooms', body: 'By the end of the century, New York jazz was no longer defined by major record contracts or splashy Broadway marquees. It was carried forward by a tight-knit community of dedicated club owners, bartenders, and young musicians who lived to play. They proved that great art doesn’t require a fortune. They simply needed a room and an unwavering dedication to the groove.', venueIds: ['0024', '0006', '0005'], camera: NYC },
    ],
  },
  2000: {
    title: 'Crossing the River: Brooklyn and Queens Take Center Stage',
    subtitle: 'Post-9/11 shock and soaring Manhattan prices accelerate the great migration across the East River',
    historicalPhase: 'The Multi-Borough Transition',
    sources: [source('Smalls: club history', SMALLS_HISTORY), source('New York Times: Tonic closes', 'https://www.nytimes.com/2007/04/16/arts/music/16toni.html'), source('Flushing Town Hall history', 'https://www.flushingtownhall.org/mission-and-history'), source('Terraza 7', 'https://www.terraza7.com/')],
    beats: [
      { role: 'economic_crisis', eyebrow: 'Downtown Shocks', historicalContext: 'September 11 aftermath · operating pressure', title: 'September 11 and the downtown crisis', body: 'The tragic terrorist attacks of September 11, 2001, dealt a staggering economic blow to Lower Manhattan nightlife. Tourism evaporated overnight, audiences stayed home, and small independent clubs found themselves on the brink of financial collapse. Iconic rooms like Smalls were forced into temporary closure, and Tonic fought a valiant but losing battle against skyrocketing rents on Norfolk Street.', venueIds: ['0024', '0006', '0005'], camera: DOWNTOWN },
      { role: 'commercial_nightlife', eyebrow: 'Nonprofit Sanctuaries', historicalContext: 'Prestige rooms · nonprofit presenters', title: 'The Jazz Gallery: Nonprofits champion the new voice', body: 'In response to relentless commercial pressures, artists established nonprofit sanctuaries like The Jazz Gallery in SoHo. Dedicated to commissioning original compositions and offering mentorship to emerging voices, nonprofits gave younger musicians room to take creative risks without having to worry about selling out tables of expensive drinks.', venueIds: ['0004', '0024', 'current-jazz-gallery'], camera: VILLAGE },
      { role: 'decentralization', eyebrow: 'The Brooklyn Awakening', historicalContext: 'Industrial space · artist-led continuation', title: 'Brooklyn becomes the musicians’ true home', body: 'Faced with astronomical Manhattan living costs, hundreds of musicians packed up their horns and drum sets and moved across the East River. Neighborhoods like Williamsburg, Crown Heights, and Bed-Stuy became vibrant creative clusters. Spaces like the Williamsburg Music Center and future homes for Roulette proved that Brooklyn was becoming grounds for music creation.', venueIds: ['0016', '0017', 'outer-williamsburg-music-center'], camera: BROOKLYN },
      { role: 'decentralization', eyebrow: 'Queens Legacies', historicalContext: 'Community institutions · diasporic programming', title: 'Queens: Global crossroads and community anchors', body: 'Out in Queens, historic venues like Flushing Town Hall and grassroots neighbourhood gems like Terraza 7 in Jackson Heights showcased a dazzling array of global jazz, Latin improvisation, and local borough talent. These community spaces reminded everyone that New York jazz had always been a multi-borough story, fed by cultures from every corner of the planet.', venueIds: ['outer-terraza-7', 'outer-flushing-town-hall'], camera: OUTER_BOROUGHS },
    ],
  },
  2010: {
    title: 'A City of Many Centers: Bed-Stuy to Lincoln Center',
    subtitle: 'From intimate Brooklyn neighborhood cafes to soaring glass palaces, jazz thrives across five boroughs',
    historicalPhase: 'The Modern Archipelago',
    sources: [source('NYC nightlife economic-impact study', NIGHTLIFE), source('Flushing Town Hall history', 'https://www.flushingtownhall.org/mission-and-history'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'affordability', eyebrow: 'The Affordability Puzzle', historicalContext: '2010 rent snapshot · nightlife economics', title: 'High costs, higher creativity', body: 'By the 2010s, New York City nightlife contributed billions to the local economy, yet nearly nine out of ten club operators reported commercial rents as their biggest hurdle. In response to Manhattan’s relentless cost of doing business, musicians developed flexible, independent business models like partnering with local neighbourhood bars, community centers, and nonprofit foundations to keep ticket prices accessible.', venueIds: ['0027', '0028', 'outer-lunatico'], camera: NYC },
      { role: 'decentralization', eyebrow: 'Brooklyn Community', historicalContext: 'Neighborhood rooms · nonprofit stages', title: 'Bar LunÀtico: Musician-owned magic in Bed-Stuy', body: 'In Bedford-Stuyvesant, a trio of touring musicians opened Bar LunÀtico, which became a warm, intimate neighbourhood bar where world-class jazz, West African highlife, and Brazilian rhythms are performed live. In Gowanus, ShapeShifter Lab gave composers a high-tech experimental stage. Brooklyn had blossomed into the vibrant creative capital of contemporary jazz.', venueIds: ['0027', '0028', '0016', 'outer-lunatico'], camera: BROOKLYN },
      { role: 'contemporary_ecology', eyebrow: 'Manhattan Flagships', historicalContext: 'Destination clubs · nonprofits · artist-led rooms', title: 'Dizzy’s Club: Jazz in the palace of glass', body: 'High above Columbus Circle, Dizzy’s Club at Jazz at Lincoln Center provided a breathtaking counterpoint: impeccable acoustic clarity, panoramic views of the Manhattan skyline, and performances by the world’s most acclaimed masters. Manhattan maintained its crown for spectacular, institutional jazz presentation, attracting listeners from across the globe.', venueIds: ['current-dizzys-club', 'current-jazz-gallery', 'outer-soapbox-gallery'], camera: NYC },
      { role: 'decentralization', eyebrow: 'The Connected Archipelago', historicalContext: 'Queens continuity · Brooklyn visibility', title: 'A subway network of endless styles', body: 'By the close of the decade, New York jazz was richer and more diverse than ever before. Musicians hopped the subway between an afternoon masterclass at Flushing Town Hall, an early set at Dizzy’s, and an all-night jam in Brooklyn. The music had expanded into a great variety of styles, welcoming hip-hop beats, electronic synths, and international rhythms into its ever-evolving vocabulary.', venueIds: ['outer-flushing-town-hall', 'outer-terraza-7', 'outer-williamsburg-music-center'], camera: OUTER_BOROUGHS },
    ],
  },
  2020: {
    title: 'The pandemic empties the rooms',
    subtitle: 'When COVID-19 silenced the city, jazz musicians took to the sidewalks, stoops, and livestreams to keep the spirit alive',
    historicalPhase: 'Pandemic & Polycentric Rebirth',
    sources: [source('NYC Office of Nightlife report', 'https://www.nyc.gov/site/mome/news/06102021-office-of-nightlife-report.page'), source('Bronx Music Hall history', 'https://bronxmusichall.org/bronx-music-history/'), source('NYC nightlife economic-impact study', NIGHTLIFE), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'economic_crisis', eyebrow: 'The Great Silence', historicalContext: 'Shutdown · relief · livestreaming', title: 'The pandemic', body: 'In March 2020, the bustling soundtrack of New York City ground to a sudden halt. COVID-19 shuttered every nightclub, ballroom, and theatre in the city overnight. For musicians whose livelihood depended on packed rooms and shared breath, the crisis was devastating. Yet even in silence, community endurance surfaced: clubs like Smalls streamed archival concerts, and emergency funds kept struggling artists fed and housed.', venueIds: ['0004', '0024', 'current-jazz-gallery', '0005'], camera: NYC },
      { role: 'affordability', eyebrow: 'Street Resilience', historicalContext: '2020 rent snapshot · commercial vulnerability', title: 'Stoops, parklets, and outdoor jam sessions', body: 'Denying despair, New York jazz stepped directly into the fresh air. Musicians dragged drum sets onto brownstone stoops, played saxophones on apartment fire escapes, and serenaded masked neighbors from sidewalk dining sheds. In Bushwick, Ornithology Jazz Club offered vegan fare, outdoor seating, and live acoustic music every single night of the week.', venueIds: ['current-blue-note', 'current-dizzys-club', 'outer-ornithology'], camera: NYC },
      { role: 'contemporary_ecology', eyebrow: 'Reopening the Doors', historicalContext: 'Curated destinations · community institutions', title: 'A joyous return to the bandstands', body: 'As vaccines rolled out and safety restrictions lifted, audiences returned to the clubs with overwhelming gratitude and renewed hunger for live music. From the opulent subterranean stage of The Django in Tribeca to grassroots listening rooms across Brooklyn and Queens, the magic of shared music and culture reminded New Yorkers why they fell in love with their city in the first place.', venueIds: ['current-django', 'current-jazz-gallery', 'outer-ornithology', 'outer-flushing-town-hall'], camera: NYC },
      { role: 'decentralization', eyebrow: 'The Century Unbroken', historicalContext: 'Bronx · Queens · Brooklyn continuity', title: 'A century later, the music lives everywhere', body: 'A hundred years after the first stride pianos echoed in 1920s Harlem rent parties, jazz remains the beating soul of New York City. With landmark new homes like the Bronx Music Hall opening alongside historic venues, the music is now alive in every borough. As long as New York is still alive, jazz will never stop being an integral part of its culture and heritage.', venueIds: ['outer-bronx-music-hall', 'outer-845-club', 'outer-flushing-town-hall', 'outer-terraza-7', 'outer-ornithology'], camera: OUTER_BOROUGHS },
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
        image: profile?.image,
        imageAlt: profile?.imageAlt,
        sources: item.sources ?? draft.sources,
        rentContext: rentFor(decade),
      } satisfies StoryBeat;
    });
    return [decade, { decade, title: draft.title, subtitle: draft.subtitle, historicalPhase: draft.historicalPhase, beats } satisfies DecadeStory];
  }),
) as Record<Decade, DecadeStory>;
