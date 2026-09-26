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
    title: 'Harlem builds a cultural capital', subtitle: 'Migration, housing pressure, and parallel nightlife systems', historicalPhase: 'Prewar metropolis',
    sources: [source('NYC Landmarks: Jazz in Harlem', LPC_JAZZ), source('Library of Congress: Harlem rent parties', LOC_RENT), source('Smithsonian: Gladys Bentley and rent parties', SMITHSONIAN_RENT)],
    beats: [
      { role: 'migration', eyebrow: 'Great Migration', historicalContext: 'Great Migration · Harlem Renaissance', title: 'A neighborhood becomes a cultural center', body: 'The Great Migration enlarged Harlem’s Black population while New York’s publishing, theater, recording, and radio industries offered unusual cultural reach. Jazz became part of a wider Harlem Renaissance created through churches, newspapers, stages, homes, and civic organizations—not nightlife alone.', venueIds: ['early-cotton-club', 'early-savoy-ballroom', 'early-smalls-paradise'], camera: HARLEM },
      { role: 'housing', eyebrow: 'Housing', historicalContext: 'Housing discrimination · household survival', title: 'The party could also pay the rent', body: 'Segregated housing access concentrated demand and helped landlords charge Black tenants heavily for crowded rooms. Some households answered with rent parties: guests paid admission and bought food or drink, turning a private apartment into both a survival strategy and a place for stride pianists and performers to test material.', venueIds: ['early-smalls-paradise'], camera: HARLEM, pullQuote: quote('The houserent party was a social institution in Harlem.', 'Frank Byrd', 'WPA Harlem Rent Parties manuscript', LOC_RENT) },
      { role: 'commercial_nightlife', eyebrow: 'Destination clubs', historicalContext: 'Prohibition · segregated audiences', title: 'Black performance, restricted access', body: 'The Cotton Club broadcast Duke Ellington and other Black artists to national audiences while generally refusing admission to Black patrons. Its success made Harlem commercially legible to downtown visitors, but the revenue, ownership, and freedom experienced by performers and neighborhood residents were sharply unequal.', venueIds: ['early-cotton-club', 'early-connies-inn'], camera: HARLEM },
      { role: 'alternative_social_space', eyebrow: 'After hours', historicalContext: 'Integrated floors · private rooms · queer performance', title: 'Other rooms allowed different possibilities', body: 'The integrated Savoy, Black-owned Small’s Paradise, speakeasies, buffet flats, and rent parties formed a varied social geography beside the marquee clubs. These spaces were not uniformly free or safe, but they could be less formally policed and less commercially scripted, leaving more room for improvisation, queer performance, and neighborhood social life.', venueIds: ['early-savoy-ballroom', 'early-smalls-paradise'], camera: HARLEM },
    ],
  },
  1930: {
    title: 'Hard times reorganize the nightlife economy', subtitle: 'Depression, repeal, swing, and political mobilization', historicalPhase: 'Depression and political mobilization',
    sources: [source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('Library of Congress: Hard Times in the City', LOC_HARD_TIMES), source('NYC Landmarks: Jazz in Harlem', LPC_JAZZ)],
    beats: [
      { role: 'economic_crisis', eyebrow: 'Depression', historicalContext: 'Great Depression · unequal unemployment', title: 'The crash deepens an existing inequality', body: 'The Depression struck Black New Yorkers from a more precarious starting point. In Harlem, severe unemployment, foreclosures, and housing insecurity narrowed audiences’ spending power and destabilized the businesses and households that sustained nightlife.', venueIds: ['early-savoy-ballroom', 'early-smalls-paradise', '0001'], camera: HARLEM },
      { role: 'housing', eyebrow: 'Household economy', historicalContext: 'Rent parties · relief · mutual support', title: 'Music remains part of household survival', body: 'Rent parties persisted because a night of music could help close a monthly budget gap. Their creativity mattered, but it did not erase the hardship that produced them; oral histories describe entertainment, overcrowding, and economic necessity in the same rooms.', venueIds: ['early-smalls-paradise'], camera: HARLEM },
      { role: 'development', eyebrow: 'Repeal', historicalContext: 'End of Prohibition · changing club geography', title: 'Legal alcohol changes the map', body: 'Repeal in 1933 removed the speakeasy’s central business premise. Some Harlem rooms closed or changed form, while clubs and theater-restaurants gathered closer to Midtown’s entertainment industries and West 52nd Street developed into a compact jazz corridor.', venueIds: ['0021', '0022', 'early-hickory-house'], camera: MIDTOWN },
      { role: 'commercial_nightlife', eyebrow: 'Swing', historicalContext: 'Mass culture · political awakening', title: 'Swing grows as Harlem organizes', body: 'Broadcasts, ballrooms, films, and touring bands made swing mass culture during the Depression. At the same time, the 1935 Harlem uprising and New Deal-era organizing sharpened campaigns over work, housing, welfare, and policing. Cultural visibility and material equality did not advance at the same rate.', venueIds: ['early-savoy-ballroom', '0021', '0022'], camera: NYC },
    ],
  },
  1940: {
    title: 'War and bebop transform the city’s sound', subtitle: 'Wartime inequality, after-hours experiments, and a postwar turn', historicalPhase: 'Wartime transformation',
    sources: [source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('NYC Landmarks: Minton’s Playhouse', LPC_JAZZ), source('Smithsonian: Mary Lou Williams recordings', 'https://folkways-media.si.edu/docs/folkways/artwork/FW02966.pdf')],
    beats: [
      { role: 'wartime', eyebrow: 'Wartime city', historicalContext: 'Defense economy · continuing discrimination', title: 'Mobilization expands work unevenly', body: 'World War II accelerated New York’s economy and brought new workers to the city, yet many war contractors continued discriminatory hiring. Harlem residents also confronted segregated public accommodations and housing, conditions exposed by the 1943 uprising.', venueIds: ['0003', 'outer-845-club'], camera: NYC },
      { role: 'experimentation', eyebrow: 'After hours', historicalContext: 'Minton’s · apartments · musicians’ networks', title: 'A new language develops after the regular job', body: 'At Minton’s, musicians used late sessions to work through faster tempos, displaced accents, and complex harmonies. Similar exchanges ran through 52nd Street and private apartments, including Mary Lou Williams’s Hamilton Terrace home. Bebop emerged from a network, not a single legendary night.', venueIds: ['0003'], camera: HARLEM, pullQuote: quote('wonderfully exciting', 'Dizzy Gillespie, recalling the sessions', 'NYC Landmarks designation report', LPC_JAZZ) },
      { role: 'commercial_nightlife', eyebrow: 'Across Manhattan', historicalContext: 'Harlem · 52nd Street · wartime audiences', title: 'The working circuit connects uptown and Midtown', body: 'Musicians moved between Harlem jobs, jam sessions, Midtown clubs, radio work, and domestic rehearsals. This dense circuit let ideas travel quickly, even while individual venues and audiences retained unequal admission practices.', venueIds: ['0003', '0022', 'early-three-deuces', 'early-downbeat-club'], camera: MIDTOWN },
      { role: 'postwar_change', eyebrow: 'After 1945', historicalContext: 'Postwar bebop · radio and records', title: 'The experiment enters public view', body: 'After the war, bebop gained a larger audience through clubs such as the Royal Roost, broadcasts, concerts, and recordings. Its visibility did not mark a clean break: swing remained active, and the music heard publicly after 1945 had been developed through years of wartime work and exchange.', venueIds: ['early-royal-roost', 'early-three-deuces', '0003'], camera: MIDTOWN },
    ],
  },
  1950: {
    title: 'Postwar prestige meets an unequal city', subtitle: 'Modern jazz, redevelopment, and a dispersing circuit', historicalPhase: 'Postwar city and cultural mainstream',
    sources: [source('NYC Landmarks: Jazz in Harlem', LPC_JAZZ), source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('NYC Landmarks: Gillespie residence', 'https://www.nyc.gov/site/lpc/about/pr2023/lpc-designates-three-sites-with-ties-to-jazz-history.page')],
    beats: [
      { role: 'postwar_change', eyebrow: 'Postwar city', historicalContext: 'Prosperity · segregation · industrial decline', title: 'Growth does not arrive evenly', body: 'New York entered the postwar era with expanding cultural prestige, but housing segregation endured and factory employment began a long decline. Harlem’s Black population grew even as stable industrial work—the economic base for many households—started to contract.', venueIds: ['0003', '0002'], camera: HARLEM },
      { role: 'commercial_nightlife', eyebrow: 'Destination rooms', historicalContext: 'Birdland · modern metropolitan culture', title: 'Jazz becomes a symbol of sophisticated New York', body: 'Birdland and other listening rooms marketed modern jazz as essential metropolitan culture. The format moved attention from the ballroom toward seated listening, named headliners, records, and critics, while the economics favored a smaller number of destination venues.', venueIds: ['0020', 'early-royal-roost'], camera: MIDTOWN },
      { role: 'decentralization', eyebrow: 'A wider circuit', historicalContext: 'Village clubs · Queens homes and rehearsals', title: 'The scene disperses rather than disappears', body: 'As 52nd Street faded, performance shifted to Times Square, Greenwich Village, and other neighborhoods. Musicians also made homes into working centers: Dizzy Gillespie’s Corona basement was one node in a substantial Queens jazz community.', venueIds: ['0004', '0025', 'outer-845-club'], camera: OUTER_BOROUGHS, pullQuote: quote('probably my most profound learning experience', 'Junior Mance, on rehearsing with Dizzy Gillespie', 'NYC Landmarks Preservation Commission', 'https://www.nyc.gov/site/lpc/about/pr2023/lpc-designates-three-sites-with-ties-to-jazz-history.page') },
      { role: 'development', eyebrow: 'Redevelopment', historicalContext: 'Office construction · changing entertainment markets', title: 'A famous street loses its rooms', body: 'The disappearance of Swing Street was spatial, not artistic. Brownstone clubs gave way to larger office development and changing entertainment markets, while musicians continued in a more dispersed network of clubs, concert halls, studios, and homes.', venueIds: ['0021', '0022', '0020'], camera: MIDTOWN },
    ],
  },
  1960: {
    title: 'No single street owns the music', subtitle: 'Civil rights, avant-garde practice, and urban renewal', historicalPhase: 'Postwar city and cultural mainstream',
    sources: [source('NYC Landmarks: Central Harlem history', LPC_HARLEM), source('Library of Congress: Jazzmobile', 'https://www.loc.gov/loc/lcib/0105/jazz_archives.html'), source('NYC Landmarks: South Village', 'https://s-media.nyc.gov/agencies/lpc/lp/2546.pdf')],
    beats: [
      { role: 'postwar_change', eyebrow: 'Civil rights', historicalContext: 'Political expression · changing institutions', title: 'The music’s public role becomes more explicit', body: 'Jazz musicians increasingly connected their work to civil-rights struggles, African independence, and Black cultural self-determination. Concerts, records, benefits, and community programs widened the settings in which the music carried political meaning.', venueIds: ['0004', '0003'], camera: NYC },
      { role: 'experimentation', eyebrow: 'Avant-garde', historicalContext: 'Village listening rooms · East Side experiments', title: 'Small rooms support radical forms', body: 'The Five Spot and other downtown rooms gave sustained exposure to musicians testing form, timbre, and collective improvisation. Their influence exceeded their physical scale, but short leases and narrow margins made this ecosystem unstable.', venueIds: ['0004', '0018', '0025', '0026'], camera: DOWNTOWN },
      { role: 'development', eyebrow: 'Urban change', historicalContext: 'Manufacturing loss · urban renewal', title: 'The postwar economy reshapes cultural neighborhoods', body: 'Manufacturing losses weakened a major source of household stability, while urban-renewal projects and redevelopment cleared buildings and displaced residents and businesses. Venue loss therefore sat inside a broader remaking of Black and working-class New York.', venueIds: ['early-savoy-ballroom', 'early-cotton-club', '0003'], camera: HARLEM },
      { role: 'alternative_social_space', eyebrow: 'Community presentation', historicalContext: 'Jazzmobile · nonprofit and public space', title: 'Presenters bring jazz beyond the club', body: 'Projects such as Jazzmobile took performances into streets and neighborhoods, while artist and nonprofit organizations offered alternatives to conventional nightclub economics. These models would become increasingly important as jazz lost its earlier mass-nightlife position.', venueIds: ['0003', '0026'], camera: NYC },
    ],
  },
  1970: {
    title: 'Artists build their own rooms', subtitle: 'Fiscal crisis, loft jazz, and temporary affordability', historicalPhase: 'Fiscal crisis and artist-run alternatives',
    sources: [source('Smithsonian Libraries: Loft Jazz', LOFT_JAZZ), source('Smithsonian oral history: SoHo lofts', 'https://www.aaa.si.edu/collections/interviews/oral-history-interview-deborah-remington-13319')],
    beats: [
      { role: 'economic_crisis', eyebrow: 'Fiscal crisis', historicalContext: 'Disinvestment · a weak commercial market', title: 'Economic contraction opens precarious space', body: 'New York’s fiscal crisis, disinvestment, and the decline of manufacturing left portions of Lower Manhattan with vacant or inexpensive industrial space. The same conditions damaged neighborhoods and public services; affordability here was produced by crisis, not enlightened cultural policy.', venueIds: ['0011', '0012', '0013'], camera: DOWNTOWN },
      { role: 'alternative_social_space', eyebrow: 'Artist-run rooms', historicalContext: 'Live-work lofts · self-production', title: 'The venue becomes part home, part workshop', body: 'Musicians converted lofts into places to live, rehearse, present concerts, and record. Studio Rivbea and Ali’s Alley reduced dependence on conventional club bookers and placed artists closer to the production of their own work.', venueIds: ['0011', '0013'], camera: DOWNTOWN },
      { role: 'experimentation', eyebrow: 'Loft network', historicalContext: 'SoHo · NoHo · Lower East Side', title: 'A network replaces the single jazz street', body: 'Environ, Ladies’ Fort, Studio We, and related rooms formed a loose circuit rather than a centralized entertainment district. Audiences followed musicians through converted industrial buildings, and the distinction between rehearsal, residence, gallery, and club became porous.', venueIds: ['0012', '0014', '0015'], camera: DOWNTOWN },
      { role: 'development', eyebrow: 'The next cycle', historicalContext: 'Cultural value · redevelopment pressure', title: 'Temporary affordability contains its own limit', body: 'The lofts made disinvested districts culturally visible. As investment returned, code enforcement, conversion, and higher property values threatened spaces whose autonomy had depended on low costs and informal use.', venueIds: ['0011', '0012', '0013', '0014'], camera: NYC },
    ],
  },
  1980: {
    title: 'Cultural influence separates from security', subtitle: 'Downtown pluralism and the first mapped rent snapshot', historicalPhase: 'Redevelopment and rising costs',
    sources: [source('JazzTimes: original Knitting Factory', 'https://www.jazztimes.com/features/interviews/remembering-the-original-knitting-factory/'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'affordability', eyebrow: 'Rent context', historicalContext: '1980 rent snapshot · residential context', title: 'The map gains an affordability measure', body: 'For the first time in this story, census tract data permits a comparable rent layer. Values are converted to 2020 dollars so neighborhoods can be read across decades, but residential contract rent is only a surrounding pressure—not the commercial lease paid by a club.', venueIds: ['0019', '0005'], camera: NYC },
      { role: 'experimentation', eyebrow: 'Downtown pluralism', historicalContext: 'Jazz · rock · noise · performance art', title: 'Downtown rooms ignore inherited categories', body: 'The Knitting Factory and related rooms mixed improvisation with rock, funk, noise, poetry, and performance art. Their programming expanded the audience for experimental work while relying on small, mutable spaces.', venueIds: ['0019'], camera: DOWNTOWN },
      { role: 'commercial_nightlife', eyebrow: 'Village circuit', historicalContext: 'Surviving rooms · new small clubs', title: 'Continuity depends on particular owners and rooms', body: 'The Village Vanguard endured while smaller rooms such as 55 Bar supported close-range performance and repeat appearances. Survival reflected stewardship and circumstance as much as cultural importance.', venueIds: ['0004', '0005', '0023', '0018'], camera: VILLAGE },
      { role: 'development', eyebrow: 'Fragility', historicalContext: 'Redevelopment · insecure cultural space', title: 'Influence no longer guarantees a lease', body: 'Downtown music remained internationally influential, but the rooms producing it were increasingly exposed to redevelopment and operating costs. Cultural prominence and real-estate security had begun to move in opposite directions.', venueIds: ['0019', '0005', '0023'], camera: NYC },
    ],
  },
  1990: {
    title: 'Small rooms raise a generation', subtitle: 'Dense social networks under growing pressure', historicalPhase: 'Redevelopment and rising costs',
    sources: [source('Smalls: club history', 'https://www.smallslive.com/about-us/'), source('JazzTimes: New York jazz joints', 'https://www.jazztimes.com/features/profiles/after-hours-new-yorks-jazz-joints-through-the-ages/'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'affordability', eyebrow: 'Rising costs', historicalContext: '1990 rent snapshot · redevelopment', title: 'Pressure grows around the rooms', body: 'Inflation-adjusted residential rents rise unevenly across the map. The layer cannot identify a venue’s lease, but it shows the neighborhood context in which owners, musicians, and audiences were making decisions.', venueIds: ['0024', '0005', '0006'], camera: NYC },
      { role: 'alternative_social_space', eyebrow: 'Informal school', historicalContext: 'Long sets · jam sessions · young players', title: 'A basement functions as a classroom', body: 'Smalls emphasized long nights, repeat playing, and proximity between generations. The model helped emerging musicians develop through practice and peer contact rather than through a formal institution.', venueIds: ['0024', '0005'], camera: VILLAGE },
      { role: 'experimentation', eyebrow: 'Downtown persistence', historicalContext: 'Lower East Side · cross-genre rooms', title: 'Experiment survives in a thinner network', body: 'Tonic and the remaining downtown circuit supported improvisers whose work crossed genre boundaries. Enforcement, redevelopment, and operating costs reduced the supply of informal spaces that earlier scenes had used.', venueIds: ['0006', '0019'], camera: DOWNTOWN },
      { role: 'development', eyebrow: 'Narrow margins', historicalContext: 'Exceptional owners · fragile continuity', title: 'A scene survives without a dominant district', body: 'By the end of the decade, jazz depended less on one famous street than on social networks and unusually committed operators. This produced artistic continuity, but it left venues vulnerable to a single lease, ownership change, or downturn.', venueIds: ['0024', '0006', '0005'], camera: NYC },
    ],
  },
  2000: {
    title: 'The scene becomes harder to locate', subtitle: 'Post-9/11 shock, closures, and borough-wide continuity', historicalPhase: 'Redevelopment and rising costs',
    sources: [source('New York Times: Tonic closes', 'https://www.nytimes.com/2007/04/16/arts/music/16toni.html'), source('Flushing Town Hall history', 'https://www.flushingtownhall.org/mission-and-history'), source('Terraza 7', 'https://www.terraza7.com/'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'economic_crisis', eyebrow: 'Downtown shock', historicalContext: 'September 11 aftermath · operating pressure', title: 'A sudden downturn compounds a long squeeze', body: 'The post-September 11 downturn reduced audiences and revenue for downtown rooms already facing thin margins. Smalls temporarily closed and Tonic later lost its space, but neither story can be reduced to one citywide rent statistic.', venueIds: ['0024', '0006', '0005'], camera: DOWNTOWN },
      { role: 'commercial_nightlife', eyebrow: 'Manhattan institutions', historicalContext: 'Prestige rooms · nonprofit presenters', title: 'Visibility concentrates in durable formats', body: 'Manhattan retained prestigious clubs and nonprofit presenters able to draw destination audiences or philanthropic support. Their endurance kept jazz visible while widening the gap between institutionally supported rooms and informal spaces.', venueIds: ['0004', '0024', 'current-jazz-gallery'], camera: VILLAGE },
      { role: 'decentralization', eyebrow: 'Brooklyn', historicalContext: 'Industrial space · artist-led continuation', title: 'Another cluster becomes more visible', body: 'Artists and presenters increasingly used Brooklyn rooms, continuing a borough history that predated the decade. The change was not jazz leaving Manhattan wholesale, but a broader and less centralized performance ecology.', venueIds: ['0016', '0017', 'outer-williamsburg-music-center'], camera: BROOKLYN },
      { role: 'decentralization', eyebrow: 'Queens', historicalContext: 'Community institutions · diasporic programming', title: 'Queens sustains its own lineages', body: 'Flushing Town Hall and Terraza 7 represent different Queens models: a nonprofit cultural institution and a musician-founded club. Their programming connects jazz to borough communities and global diasporas rather than treating Queens as a new frontier.', venueIds: ['outer-terraza-7', 'outer-flushing-town-hall'], camera: OUTER_BOROUGHS },
    ],
  },
  2010: {
    title: 'Growth and displacement coexist', subtitle: 'Diverging venue models across the boroughs', historicalPhase: 'Contemporary decentralization',
    sources: [source('NYC nightlife economic-impact study', NIGHTLIFE), source('Flushing Town Hall history', 'https://www.flushingtownhall.org/mission-and-history'), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'affordability', eyebrow: 'Commercial pressure', historicalContext: '2010 rent snapshot · nightlife economics', title: 'A successful sector reports a structural problem', body: 'New York’s nightlife generated substantial employment and cultural value. In the city’s 2019 study, 87 percent of surveyed owners and operators identified rising commercial rent as a challenge. The residential layer shows related neighborhood change, not their actual leases.', venueIds: ['0027', '0028', 'outer-lunatico'], camera: NYC },
      { role: 'decentralization', eyebrow: 'Brooklyn networks', historicalContext: 'Neighborhood rooms · nonprofit stages', title: 'The borough map grows denser', body: 'Brooklyn venues ranged from nonprofit and purpose-built performance spaces to bars using donations or food and drink to support music. No single format replaced the Manhattan club; several models coexisted with different levels of security and access.', venueIds: ['0027', '0028', '0016', 'outer-lunatico'], camera: BROOKLYN },
      { role: 'contemporary_ecology', eyebrow: 'Different economics', historicalContext: 'Destination clubs · nonprofits · artist-led rooms', title: 'Jazz is presented through unequal business models', body: 'High-service destination clubs, nonprofit incubators, cultural centers, and musician-led neighborhood rooms served different audiences and carried different costs. Contemporary polish should not be read automatically as exclusion, nor informality as financial stability.', venueIds: ['current-dizzys-club', 'current-jazz-gallery', 'outer-soapbox-gallery'], camera: NYC },
      { role: 'decentralization', eyebrow: 'Long borough histories', historicalContext: 'Queens continuity · Brooklyn visibility', title: 'Decentralization is a change in emphasis', body: 'Queens and Brooklyn had long jazz histories before their twenty-first-century venues drew wider notice. The meaningful change was the growing importance of borough-wide networks as Manhattan’s small-room ecosystem became harder to sustain.', venueIds: ['outer-flushing-town-hall', 'outer-terraza-7', 'outer-williamsburg-music-center'], camera: OUTER_BOROUGHS },
    ],
  },
  2020: {
    title: 'A rupture reveals the value of the room', subtitle: 'Pandemic loss, uneven recovery, and a wider map', historicalPhase: 'Contemporary decentralization',
    sources: [source('NYC Office of Nightlife report', 'https://www.nyc.gov/site/mome/news/06102021-office-of-nightlife-report.page'), source('Bronx Music Hall history', 'https://bronxmusichall.org/bronx-music-history/'), source('NYC nightlife economic-impact study', NIGHTLIFE), source('BLS: constant-dollar method', BLS)],
    beats: [
      { role: 'economic_crisis', eyebrow: 'Pandemic rupture', historicalContext: 'Shutdown · relief · livestreaming', title: 'The audience disappears overnight', body: 'COVID-19 removed the close, recurring audiences on which clubs depended. Livestreams, donations, relief programs, and nonprofit structures helped some rooms survive, while closures exposed how little financial margin many venues possessed.', venueIds: ['0004', '0024', 'current-jazz-gallery', '0005'], camera: NYC },
      { role: 'affordability', eyebrow: 'Uneven recovery', historicalContext: '2020 rent snapshot · commercial vulnerability', title: 'Recovery begins from unequal positions', body: 'The latest comparable census snapshot shows high residential costs across much of the city. It does not measure pandemic-era commercial arrears or ticket affordability, but it locates venue recovery within a broader affordability crisis.', venueIds: ['current-blue-note', 'current-dizzys-club', 'outer-ornithology'], camera: NYC },
      { role: 'contemporary_ecology', eyebrow: 'Contrasting rooms', historicalContext: 'Curated destinations · community institutions', title: 'No single venue model defines the present', body: 'Contemporary jazz appears in carefully curated supper clubs, intimate listening rooms, nonprofit incubators, free-entry bars, and cultural centers. The result is artistically broad but economically stratified, with access and working conditions varying by room.', venueIds: ['current-django', 'current-jazz-gallery', 'outer-ornithology', 'outer-flushing-town-hall'], camera: NYC },
      { role: 'decentralization', eyebrow: 'A wider city', historicalContext: 'Bronx · Queens · Brooklyn continuity', title: 'The map expands by reconnecting existing histories', body: 'Bronx Music Hall, Queens institutions, and Brooklyn artist-led rooms make the current geography more visibly borough-wide. They represent renewed infrastructure around places with older jazz histories—not a simple migration from a city center to previously empty ground.', venueIds: ['outer-bronx-music-hall', 'outer-845-club', 'outer-flushing-town-hall', 'outer-terraza-7', 'outer-ornithology'], camera: OUTER_BOROUGHS },
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
