import type { Decade, DecadeSoundtrack, Soundtrack } from '../gallery/model';

export const GALLERY_SOUNDTRACK: Soundtrack = {
  title: 'Skating in Central Park',
  artist: 'Bill Evans & Jim Hall',
  year: 1962,
  src: '/audio/skating-in-central-park.mp3',
  credit: 'Bill Evans and Jim Hall — gallery soundtrack supplied for this project.',
  sourceFilename: 'skating-in-central-park.mp3',
};

export const DECADE_SOUNDTRACKS: Record<Decade, DecadeSoundtrack> = {
  1920: {
    decade: 1920,
    title: "Ain't Misbehavin'",
    artist: 'Louis Armstrong',
    year: 1929,
    src: '/audio/decades/1920-aint-misbehavin.mp3',
    credit: 'Louis Armstrong — master pressing supplied for this project.',
    sourceFilename: "1920s_Louis Armstrong - Ain't Misbehavin' (1929) [Master Pressing].mp3",
  },
  1930: {
    decade: 1930,
    title: "It Don’t Mean a Thing (If It Ain’t Got That Swing)",
    artist: 'Duke Ellington Orchestra · Ivie Anderson, vocal',
    src: '/audio/decades/1930-it-dont-mean-a-thing.mp3',
    credit: 'Duke Ellington Orchestra with Ivie Anderson — supplied for this project.',
    sourceFilename: '1930s_HITS ARCHIVE It Don’t Mean A Thing (If It Ain’t Got That Swing) - Duke Ellington (Ivie A, voc).mp3',
  },
  1940: {
    decade: 1940,
    title: "’Round Midnight",
    src: '/audio/decades/1940-round-midnight.mp3',
    credit: 'Artist metadata was not supplied with the project audio.',
    sourceFilename: "1940s_'Round Midnight (Remastered 2013).mp3",
  },
  1950: {
    decade: 1950,
    title: 'The Blue Room (Take 2)',
    artist: 'Miles Davis',
    src: '/audio/decades/1950-the-blue-room.mp3',
    credit: 'Miles Davis — supplied for this project.',
    sourceFilename: '1950s_Miles Davis - The Blue Room [Take 2] (Complete Prestige Recordings 1951-1956).mp3',
  },
  1960: {
    decade: 1960,
    title: 'Giant Steps (Alternate Version, Take 3, Incomplete)',
    artist: 'John Coltrane',
    src: '/audio/decades/1960-giant-steps.mp3',
    credit: 'John Coltrane — supplied for this project.',
    sourceFilename: '1960s_Giant Steps (Alternate Version, Take 3, Incomplete).mp3',
  },
  1970: {
    decade: 1970,
    title: 'Bitches Brew (Live in Copenhagen)',
    artist: 'Miles Davis',
    year: 1969,
    src: '/audio/decades/1970-bitches-brew-live.mp3',
    credit: 'Miles Davis — live Copenhagen performance supplied for this project.',
    sourceFilename: '1970s_Miles Davis - Bitches Brew (Live In Copenhagen, 1969).mp3',
  },
  1980: {
    decade: 1980,
    title: 'Cherokee (Live at Newport Jazz Festival)',
    artist: 'Wynton Marsalis',
    year: 1989,
    src: '/audio/decades/1980-cherokee-live.mp3',
    credit: 'Wynton Marsalis — Newport Jazz Festival performance supplied for this project.',
    sourceFilename: '1980s_Wynton Marsalis - Cherokee - 8 19 1989 - Newport Jazz Festival (Official).mp3',
  },
  1990: {
    decade: 1990,
    title: 'Work Song (Blood on the Fields)',
    artist: 'Wynton Marsalis',
    src: '/audio/decades/1990-work-song.mp3',
    credit: 'Wynton Marsalis — supplied for this project.',
    sourceFilename: '1990s_WORK SONG - Blood on the Fields by Wynton Marsalis.mp3',
  },
  2000: {
    decade: 2000,
    title: 'Mood',
    src: '/audio/decades/2000-mood.mp3',
    credit: 'Artist metadata was not supplied with the project audio.',
    sourceFilename: '2000s_Mood.mp3',
  },
  2010: {
    decade: 2010,
    title: 'Street Fighter Mas (Live at the Apollo Theater)',
    artist: 'Kamasi Washington',
    src: '/audio/decades/2010-street-fighter-mas-live.mp3',
    credit: 'Kamasi Washington — live Apollo Theater performance supplied for this project.',
    sourceFilename: '2010s_Kamasi Washington – Street Fighter Mas - Live At The Apollo Theater.mp3',
  },
  2020: {
    decade: 2020,
    title: 'Linger Awhile (Live at Montreal Jazz Festival)',
    artist: 'Samara Joy',
    src: '/audio/decades/2020-linger-awhile-live.mp3',
    credit: 'Samara Joy — live Montreal Jazz Festival performance supplied for this project.',
    sourceFilename: '2020s_Samara Joy - Linger Awhile Live at Montreal Jazz Festival.mp3',
  },
};

export const soundtrackForDecade = (decade: Decade) => DECADE_SOUNDTRACKS[decade];
