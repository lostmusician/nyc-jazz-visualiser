import type { Decade } from '../gallery/model';

export interface EraSource {
  label: string;
  url: string;
}

export interface JazzEra {
  decade: Decade;
  phase: 'formation' | 'expansion' | 'reinvention' | 'displacement' | 'recovery';
  title: string;
  subtitle: string;
  summary: string;
  cityImpact: string;
  sources: EraSource[];
}

const LPC_MINTONS = 'https://s-media.nyc.gov/agencies/lpc/lp/2671.pdf';
const JAZZTIMES_HISTORY = 'https://www.jazztimes.com/features/profiles/after-hours-new-yorks-jazz-joints-through-the-ages/';

export const JAZZ_ERAS: Record<Decade, JazzEra> = {
  1920: {
    decade: 1920, phase: 'formation', title: 'Harlem becomes a jazz capital', subtitle: 'The Harlem Renaissance · Prohibition · the Great Migration',
    summary: 'New Black communities, nightlife, publishing, dance, and music made Harlem an international cultural centre. The Cotton Club, Connie’s Inn, Small’s Paradise, and the Savoy turned jazz into a defining sound of modern New York, even as the most famous clubs often profited from Black talent while segregating their audiences.',
    cityImpact: 'Jazz helped make uptown nightlife a citywide destination and tied New York’s cultural identity to Harlem. Radio and touring carried that identity far beyond the five boroughs.',
    sources: [
      { label: 'NYC Landmarks: Jazz in Harlem', url: LPC_MINTONS },
      { label: 'Smithsonian: 1933 Harlem nightclub map', url: 'https://www.si.edu/object/manhattan-vol-1-no-1-night-club-map-harlem%3Anmaahc_2020.26.34a-e' },
    ],
  },
  1930: {
    decade: 1930, phase: 'expansion', title: 'Swing crosses Manhattan', subtitle: 'Repeal · big bands · the birth of Swing Street',
    summary: 'After Prohibition ended in 1933, legal clubs multiplied and the centre of gravity began moving from Harlem toward Midtown. Basement clubs on West 52nd Street placed small-group improvisation beside the city’s theatre, radio, and publishing industries, while the Savoy kept Harlem central to swing culture.',
    cityImpact: 'Jazz became commercial mass culture during the Depression: dance halls, broadcasts, and integrated ensembles crossed social boundaries even as the city remained deeply segregated.',
    sources: [
      { label: 'NYC Landmarks: Harlem to 52nd Street', url: LPC_MINTONS },
      { label: 'The New Yorker: Hickory House history', url: 'https://www.newyorker.com/magazine/1963/02/23/talent-scout-2' },
    ],
  },
  1940: {
    decade: 1940, phase: 'expansion', title: 'Bebop remakes the language', subtitle: 'Minton’s after hours · 52nd Street in full swing',
    summary: 'Musicians tested faster tempos, sharper harmonies, and new rhythmic ideas at Minton’s Playhouse, then carried bebop downtown to the Three Deuces, Onyx, Downbeat, and Royal Roost. A compact club geography let players hear one another nightly and turn experimentation into a movement.',
    cityImpact: 'New York displaced the big-band ballroom as jazz’s principal laboratory. The city’s clubs, record business, press, and radio made bebop a modern art music with global reach.',
    sources: [
      { label: 'Library of Congress: Bebop and 52nd Street', url: 'https://www.loc.gov/item/today-in-history/january-06' },
      { label: 'NYC Landmarks: Minton’s Playhouse', url: LPC_MINTONS },
    ],
  },
  1950: {
    decade: 1950, phase: 'reinvention', title: 'The street fades; cabaret cards police the stage', subtitle: 'Birdland · the Five Spot · the Village',
    summary: 'Jazz was artistically ascendant, but its famous two-block ecosystem began disappearing as Midtown brownstones gave way to larger office development and police cabaret cards barred players such as Thelonious Monk from nightclub stages. Listening shifted to destination clubs such as Birdland and downtown venues.',
    cityImpact: 'Office construction cleared one concentrated jazz district even as cabaret licensing controlled who could perform. The circuit spread across the city, yet losing shared venues carried real costs.',
    sources: [
      { label: 'The New Yorker: the end of 52nd Street', url: 'https://www.newyorker.com/magazine/1963/03/16/jazz-records' },
      { label: 'WNYC: Cabaret cards repealed', url: 'https://wnyc.org/story/cabaret-cards-repealed/' },
    ],
  },
  1960: {
    decade: 1960, phase: 'displacement', title: 'No single street owns the music', subtitle: 'Avant-garde expansion · urban renewal · club closures',
    summary: 'The last remnants of Swing Street vanished and the Savoy Ballroom was demolished for Delano Village, while the Five Spot, Village Gate, and other downtown clubs hosted Coltrane, Mingus, Coleman, and Monk. Rock captured a growing share of the youth market, and sustaining small venues grew steadily harder.',
    cityImpact: 'Jazz remained crucial to New York’s artistic identity even as urban renewal cleared historic gathering places and later tributes honoured vanished venues in memory without protecting living ones.',
    sources: [
      { label: 'NYC Landmarks: South Village venues', url: 'https://s-media.nyc.gov/agencies/lpc/lp/2546.pdf' },
      { label: 'The New Yorker: Jazz Records, 1963', url: 'https://www.newyorker.com/magazine/1963/03/16/jazz-records' },
    ],
  },
  1970: {
    decade: 1970, phase: 'reinvention', title: 'Artists build their own venues', subtitle: 'Loft jazz · self-determination · downtown deindustrialisation',
    summary: 'With the commercial jazz economy flagging, improvisers converted inexpensive former factories and warehouses into places to live, rehearse, record, and perform. Studio Rivbea, Ali’s Alley, Environ, and related lofts replaced the nightclub gatekeeper with artist-run production.',
    cityImpact: 'Urban disinvestment created temporary cultural space and public grants helped stage concerts, yet once investment returned, residential conversion closed lofts such as Studio Rivbea by 1978.',
    sources: [
      { label: 'Smithsonian Libraries: Loft Jazz', url: 'https://www.si.edu/object/loft-jazz-improvising-new-york-1970s-michael-c-heller%3Asiris_sil_1078879' },
      { label: 'Smithsonian oral history: living in SoHo lofts', url: 'https://www.aaa.si.edu/collections/interviews/oral-history-interview-deborah-remington-13319' },
    ],
  },
  1980: {
    decade: 1980, phase: 'reinvention', title: 'Downtown ignores the borders', subtitle: 'Post-punk energy · improvisation · the Knitting Factory',
    summary: 'A pluralistic downtown scene mixed jazz improvisation with rock, funk, noise, world music, poetry, and performance art. The Knitting Factory became its emblem: part club, part label, and part national distribution network for music that established jazz clubs often would not book.',
    cityImpact: 'The scene restored visibility to experimental players, but it was less a unified district than a network of small, fragile venues, an early sign that cultural influence and real-estate security were separating.',
    sources: [
      { label: 'JazzTimes: Remembering the original Knitting Factory', url: 'https://www.jazztimes.com/features/interviews/remembering-the-original-knitting-factory/' },
      { label: 'Knitting Factory: venue history', url: 'https://www.knittingfactory.com/history/' },
    ],
  },
  1990: {
    decade: 1990, phase: 'displacement', title: 'Small clubs raise a generation', subtitle: 'Late-night sessions · young players · rising pressure',
    summary: 'Smalls and other intimate clubs made long sets and jam sessions an informal school for emerging musicians. At the same time, redevelopment, stricter nightlife enforcement, and higher operating costs weakened the improvised spaces that had supported earlier downtown scenes.',
    cityImpact: 'Jazz survived through dense social networks rather than a dominant entertainment district. The era produced a new generation of players while making venue survival increasingly dependent on exceptional owners and narrow margins.',
    sources: [
      { label: 'JazzTimes: New York jazz joints by decade', url: JAZZTIMES_HISTORY },
      { label: 'Smalls: club history', url: 'https://www.smallslive.com/about-us/' },
    ],
  },
  2000: {
    decade: 2000, phase: 'displacement', title: 'The scene crosses the river', subtitle: 'Post-9/11 shock · closures · Brooklyn continuation',
    summary: 'The post-9/11 downturn compounded long-running rent and operating pressures. Smalls briefly went bankrupt, luxury high-rise redevelopment and steep lease hikes closed Tonic in 2007, and experimental music increasingly followed affordable industrial space into Brooklyn, even as Manhattan retained prestigious destination clubs.',
    cityImpact: 'Jazz did not leave New York, yet outer-borough continuity could not replace the relationships lost when Lower Manhattan venues closed. The split between institutional clubs and artist-led spaces deepened.',
    sources: [
      { label: 'The New York Times: Tonic closes', url: 'https://www.nytimes.com/2007/04/16/arts/music/16toni.html' },
      { label: 'Smalls: post-9/11 history', url: 'https://www.smallslive.com/about-us/' },
    ],
  },
  2010: {
    decade: 2010, phase: 'displacement', title: 'Growth and displacement coexist', subtitle: 'Brooklyn networks · global jazz · rent pressure',
    summary: 'New clubs and non-profit presenters appeared across Manhattan and Brooklyn while independent venues kept moving outward. By 2019, the city found nightlife to be a major economic engine, yet 87% of surveyed owners and operators named commercial rent as their biggest challenge.',
    cityImpact: 'Jazz became more borough-wide and internationally connected, aided by streaming and non-profit support. Yet the venues producing neighbourhood culture were increasingly vulnerable to the property values they helped create.',
    sources: [
      { label: 'NYC nightlife economic-impact study', url: 'https://www.nyc.gov/site/mome/news/01242019-nightlife-study.page' },
      { label: 'The Guardian: NYC jazz and gentrification', url: 'https://www.theguardian.com/music/2015/oct/06/new-york-city-jazz-venues-gentrification-indie-clubs' },
    ],
  },
  2020: {
    decade: 2020, phase: 'recovery', title: 'A rupture, then a fragile return', subtitle: 'Pandemic shutdown · streaming · cultural recovery',
    summary: 'COVID-19 shuttered or severely restricted nightlife, cutting clubs off from the close audiences on which their economics depend. Livestreams, relief campaigns, and non-profit models kept some venues alive, but closures and persistent storefront vacancies exposed how little margin independent clubs possessed.',
    cityImpact: 'The crisis showed that celebrating jazz as civic heritage does little to keep music alive unless cities protect affordable spaces across neighbourhoods for its makers to live, gather, and perform.',
    sources: [
      { label: 'NYC Office of Nightlife: pandemic and reopening', url: 'https://www.nyc.gov/site/mome/news/06102021-office-of-nightlife-report.page' },
      { label: 'Smalls: foundation and pandemic response', url: 'https://www.smallslive.com/about-us/' },
    ],
  },
};

export const eraForDecade = (decade: Decade) => JAZZ_ERAS[decade];
