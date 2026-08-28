import type { ChapterStep } from '../types';

export const NARRATIVE_CHAPTERS: ChapterStep[] = [
  {
    id: 'chapter-1950s',
    indexNumber: '01',
    decade: '1950s–60s',
    title: 'Culture needs a room',
    subtitle: 'A scene is an urban ecology, not simply a genre',
    narrative_body: [
      'Lower Manhattan jazz depended on a dense, low-overhead network of clubs, rehearsal rooms, bars and informal encounters. Musicians could test unfinished work, find collaborators and build audiences within the same neighbourhood.',
      'The music was rooted locally because its production was rooted locally. What the city sustained was not only performance, but the repeated social contact through which a vernacular culture could develop.'
    ],
    quote: {
      text: 'You could walk down the street and hear Monk from the sidewalk, then step two doors down for Art Blakey.',
      author: 'Archival Oral History',
      source: 'Institute of Jazz Studies'
    },
    framework: {
      scholar: 'The project’s premise',
      concept: 'Cultural infrastructure',
      reading: 'Distinct culture requires affordable spaces for production, experimentation and community—not only stages for finished work.'
    },
    map_camera: {
      center: [-73.946, 40.812],
      zoom: 13.5,
      pitch: 35,
      bearing: -15
    },
    active_venue_ids: ['0001', '0002', '0020'],
    year_range: [1950, 1959]
  },
  {
    id: 'chapter-1970s',
    indexNumber: '02',
    decade: '1970s',
    title: 'The rent gap opens',
    subtitle: 'Disinvestment creates autonomy—and an opportunity for capital',
    narrative_body: [
      'Deindustrialisation left centrally located lofts underused and comparatively cheap. Musicians converted this neglected building stock into self-run venues such as Studio Rivbea, gaining space outside the commercial club circuit.',
      'Yet the same gap that made experimentation possible also made Lower Manhattan attractive for reinvestment. Cultural use occupied the interval between a property’s depressed present return and its more profitable imagined future.'
    ],
    quote: {
      text: 'We had no grants and no commercial sponsors. We had raw floorboards, two amplifiers, and complete acoustic autonomy.',
      author: 'Sam Rivers',
      source: 'Studio Rivbea Archive'
    },
    framework: {
      scholar: 'Neil Smith',
      concept: 'Rent gap theory',
      reading: 'Capital returns when the difference between current ground rent and potential ground rent becomes large enough to capture.'
    },
    map_camera: {
      center: [-73.993, 40.726],
      zoom: 14.8,
      pitch: 45,
      bearing: 25
    },
    active_venue_ids: ['0011', '0012', '0013', '0014', '0015'],
    year_range: [1970, 1979]
  },
  {
    id: 'chapter-1990s',
    indexNumber: '03',
    decade: '1990s–2000s',
    title: 'Culture becomes value',
    subtitle: 'Downtown distinction is translated into real-estate demand',
    narrative_body: [
      'Artists and venues made disinvested districts legible as creative, authentic and desirable. That symbolic value travelled outward—from the scene into restaurant branding, lifestyle media, property marketing and the expectations of new residents.',
      'The neighbourhood could then profit from the image of cultural vitality while becoming less able to host its production. Rising leases, redevelopment and noise conflict removed venues one by one.'
    ],
    quote: {
      text: 'Apartment high-rises went up on either side of the club. The new leases were engineered to price out culture.',
      author: 'John Zorn',
      source: 'Tonic Farewell Dispatch'
    },
    framework: {
      scholar: 'Sharon Zukin',
      concept: 'Artistic mode of production',
      reading: 'Culture helps revalorise urban space; the creators of that value are rarely positioned to retain it.'
    },
    map_camera: {
      center: [-73.988, 40.721],
      zoom: 14.0,
      pitch: 30,
      bearing: -5
    },
    active_venue_ids: ['0006', '0018', '0019'],
    year_range: [1990, 2009]
  },
  {
    id: 'chapter-present',
    indexNumber: '04',
    decade: '2000s–Present',
    title: 'The scene becomes a product',
    subtitle: 'Jazz remains visible as its local conditions disappear',
    narrative_body: [
      'Some grassroots activity moved into Brooklyn, but relocation is only part of the story. Jazz was also consolidated in conservatories, major institutions, festivals and destination venues: more stable, legible and polished forms of presentation.',
      'The city continues to circulate jazz as heritage and global cultural prestige while shedding many of the inexpensive rooms that once generated new scenes. Production becomes precarious; the finished cultural commodity travels.'
    ],
    quote: {
      text: 'When Manhattan turned its back on the music, Brooklyn welcomed the masters home.',
      author: 'Viola Plummer',
      source: 'Sistas\' Place Oral History'
    },
    framework: {
      scholar: 'Saskia Sassen',
      concept: 'The global city',
      reading: 'Urban restructuring concentrates command, capital and prestige while displacing lower-overhead local functions.'
    },
    map_camera: {
      center: [-73.962, 40.690],
      zoom: 13.0,
      pitch: 20,
      bearing: 10
    },
    active_venue_ids: ['0016', '0017'],
    year_range: [2010, 2026]
  }
];
