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
    summary: 'New Black communities, nightlife, publishing, dance, and music made Harlem an international cultural center. The Cotton Club, Connie’s Inn, Small’s Paradise, and the Savoy turned jazz into a defining sound of modern New York—though the most famous rooms often profited from Black talent while segregating their audiences.',
    cityImpact: 'Jazz helped make uptown nightlife a citywide destination and tied New York’s cultural identity to Harlem. Radio and touring carried that identity far beyond the five boroughs.',
    sources: [
      { label: 'NYC Landmarks: Jazz in Harlem', url: LPC_MINTONS },
      { label: 'Smithsonian: 1933 Harlem nightclub map', url: 'https://www.si.edu/object/manhattan-vol-1-no-1-night-club-map-harlem%3Anmaahc_2020.26.34a-e' },
    ],
  },
  1930: {
    decade: 1930, phase: 'expansion', title: 'Swing crosses Manhattan', subtitle: 'Repeal · big bands · the birth of Swing Street',
    summary: 'After Prohibition ended in 1933, legal clubs multiplied and the center of gravity began moving from Harlem toward Midtown. Basement rooms on West 52nd Street placed small-group improvisation beside the city’s theater, radio, and publishing industries, while the Savoy kept Harlem central to swing culture.',
    cityImpact: 'Jazz became commercial mass culture during the Depression: dance halls, broadcasts, and integrated ensembles challenged social boundaries even as the city remained deeply segregated.',
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
    decade: 1950, phase: 'reinvention', title: 'The street fades; the circuit spreads', subtitle: 'Birdland · the Five Spot · the Village',
    summary: 'Jazz was artistically ascendant, but its famous two-block ecosystem began disappearing as Midtown brownstones gave way to larger office development. Listening shifted to destination clubs such as Birdland and to downtown rooms where hard bop, cool jazz, and the emerging avant-garde found distinct audiences.',
    cityImpact: 'The decline was spatial, not creative: New York lost one concentrated jazz district while gaining a dispersed circuit of clubs, concert halls, labels, and recording studios.',
    sources: [
      { label: 'The New Yorker: the end of 52nd Street', url: 'https://www.newyorker.com/magazine/1963/03/16/jazz-records' },
      { label: 'NYC Department of Records: Swing Street', url: 'https://www.nyc.gov/html/records/html/newsletter/may2005.html' },
    ],
  },
  1960: {
    decade: 1960, phase: 'displacement', title: 'No single street owns the music', subtitle: 'Avant-garde expansion · rock ascendance · club closures',
    summary: 'The last remnants of Swing Street vanished while the Five Spot, Village Gate, and other downtown rooms hosted Coltrane, Mingus, Coleman, and Monk. Rock captured a growing share of the youth market, and the economics of sustaining small jazz rooms became steadily harder.',
    cityImpact: 'Jazz remained crucial to New York’s artistic identity but lost the mass-nightlife position it held in the swing era. Its geography fragmented across the Village, Harlem, concert venues, and short-lived clubs.',
    sources: [
      { label: 'NYC Landmarks: South Village venues', url: 'https://s-media.nyc.gov/agencies/lpc/lp/2546.pdf' },
      { label: 'The New Yorker: Jazz Records, 1963', url: 'https://www.newyorker.com/magazine/1963/03/16/jazz-records' },
    ],
  },
  1970: {
    decade: 1970, phase: 'reinvention', title: 'Artists build their own rooms', subtitle: 'Loft jazz · self-determination · downtown deindustrialization',
    summary: 'With the commercial jazz economy flagging, improvisers converted inexpensive former factories and warehouses into places to live, rehearse, record, and perform. Studio Rivbea, Ali’s Alley, Environ, and related lofts replaced the nightclub gatekeeper with artist-run production.',
    cityImpact: 'Urban disinvestment created temporary cultural space. The lofts made Lower Manhattan a center of uncompromising music, but the same neighborhoods would soon attract redevelopment that threatened those spaces.',
    sources: [
      { label: 'Smithsonian Libraries: Loft Jazz', url: 'https://www.si.edu/object/loft-jazz-improvising-new-york-1970s-michael-c-heller%3Asiris_sil_1078879' },
      { label: 'Smithsonian oral history: living in SoHo lofts', url: 'https://www.aaa.si.edu/collections/interviews/oral-history-interview-deborah-remington-13319' },
    ],
  },
  1980: {
    decade: 1980, phase: 'reinvention', title: 'Downtown ignores the borders', subtitle: 'Post-punk energy · improvisation · the Knitting Factory',
    summary: 'A pluralistic downtown scene mixed jazz improvisation with rock, funk, noise, world music, poetry, and performance art. The Knitting Factory became its emblem: part club, part label, and part national distribution network for music that established jazz rooms often would not book.',
    cityImpact: 'The scene restored visibility to experimental players, but it was less a unified district than a network of small, fragile spaces—an early sign that cultural influence and real-estate security were separating.',
    sources: [
      { label: 'JazzTimes: Remembering the original Knitting Factory', url: 'https://www.jazztimes.com/features/interviews/remembering-the-original-knitting-factory/' },
      { label: 'Knitting Factory: venue history', url: 'https://www.knittingfactory.com/history/' },
    ],
  },
  1990: {
    decade: 1990, phase: 'displacement', title: 'Small rooms raise a generation', subtitle: 'Late-night sessions · young players · rising pressure',
    summary: 'Smalls and other intimate rooms made long sets and jam sessions an informal school for emerging musicians. At the same time, redevelopment, stricter nightlife enforcement, and higher operating costs weakened the improvised spaces that had supported earlier downtown scenes.',
    cityImpact: 'Jazz survived through dense social networks rather than a dominant entertainment district. The era produced a new generation of players while making venue survival increasingly dependent on exceptional owners and narrow margins.',
    sources: [
      { label: 'JazzTimes: New York jazz joints by decade', url: JAZZTIMES_HISTORY },
      { label: 'Smalls: club history', url: 'https://www.smallslive.com/about-us/' },
    ],
  },
  2000: {
    decade: 2000, phase: 'displacement', title: 'The scene crosses the river', subtitle: 'Post-9/11 shock · closures · Brooklyn continuation',
    summary: 'The post-9/11 downturn compounded long-running rent and operating pressures. Smalls briefly went bankrupt, Tonic closed in 2007, and experimental music increasingly followed affordable industrial space into Brooklyn, even as Manhattan retained prestigious destination clubs.',
    cityImpact: 'Jazz did not leave New York; its center became less legible. The split between high-cost Manhattan institutions and artist-led outer-borough rooms reshaped how audiences encountered the music.',
    sources: [
      { label: 'The New York Times: Tonic closes', url: 'https://www.nytimes.com/2007/04/16/arts/music/16toni.html' },
      { label: 'Smalls: post-9/11 history', url: 'https://www.smallslive.com/about-us/' },
    ],
  },
  2010: {
    decade: 2010, phase: 'displacement', title: 'Growth and displacement coexist', subtitle: 'Brooklyn networks · global jazz · rent pressure',
    summary: 'New rooms and nonprofit presenters appeared across Manhattan and Brooklyn while independent venues kept moving outward. By 2019, the city found nightlife to be a major economic engine—but 87% of surveyed owners and operators named commercial rent as their biggest challenge.',
    cityImpact: 'Jazz became more borough-wide and internationally connected, aided by streaming and nonprofit support. Yet the venues producing neighborhood culture were increasingly vulnerable to the value they helped create.',
    sources: [
      { label: 'NYC nightlife economic-impact study', url: 'https://www.nyc.gov/site/mome/news/01242019-nightlife-study.page' },
      { label: 'The Guardian: NYC jazz and gentrification', url: 'https://www.theguardian.com/music/2015/oct/06/new-york-city-jazz-venues-gentrification-indie-clubs' },
    ],
  },
  2020: {
    decade: 2020, phase: 'recovery', title: 'A rupture, then a fragile return', subtitle: 'Pandemic shutdown · streaming · cultural recovery',
    summary: 'COVID-19 shuttered or severely restricted nightlife, cutting clubs off from the close audiences on which their economics depend. Livestreams, relief campaigns, and nonprofit models kept some rooms alive, but closures and persistent storefront vacancies exposed how little margin independent venues possessed.',
    cityImpact: 'The crisis made nightlife’s civic value visible: New York began treating venues as cultural infrastructure and an economic sector, even as recovery remained uneven across neighborhoods.',
    sources: [
      { label: 'NYC Office of Nightlife: pandemic and reopening', url: 'https://www.nyc.gov/site/mome/news/06102021-office-of-nightlife-report.page' },
      { label: 'Smalls: foundation and pandemic response', url: 'https://www.smallslive.com/about-us/' },
    ],
  },
};

export const eraForDecade = (decade: Decade) => JAZZ_ERAS[decade];
