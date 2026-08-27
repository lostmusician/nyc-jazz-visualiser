import type { ChapterStep } from '../types';

export const NARRATIVE_CHAPTERS: ChapterStep[] = [
  {
    id: 'chapter-1950s',
    indexNumber: '01',
    decade: '1950s',
    title: 'The Golden Epicenter',
    subtitle: 'Harlem Ballrooms & 52nd Street',
    narrative_body: [
      'Over 80 dedicated venues vibrated between 110th and 145th Streets in Harlem, while 52nd Street served as "Swing Street."',
    ],
    quote: {
      text: 'You could walk down the street and hear Monk from the sidewalk, then step two doors down for Art Blakey.',
      author: 'Archival Oral History',
      source: 'Institute of Jazz Studies'
    },
    key_statistic: {
      value: '84+',
      label: 'Active jazz venues in Manhattan'
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
    title: 'The Loft Resistance',
    subtitle: 'Bond Street & Industrial Lower Manhattan',
    narrative_body: [
      'Deserted manufacturing floors in NoHo and SoHo became artist-run cooperatives, birthing the free jazz revolution.'
    ],
    quote: {
      text: 'We had no grants and no commercial sponsors. We had raw floorboards, two amplifiers, and complete acoustic autonomy.',
      author: 'Sam Rivers',
      source: 'Studio Rivbea Archive'
    },
    key_statistic: {
      value: '62%',
      label: 'Musician-operated experimental spaces'
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
    title: 'The Rezoning Avalanche',
    subtitle: 'Downtown Hyper-Gentrification',
    narrative_body: [
      'Landmarks were pushed out by triple-net commercial leases and residential noise complaints.'
    ],
    quote: {
      text: 'Apartment high-rises went up on either side of the club. The new leases were engineered to price out culture.',
      author: 'John Zorn',
      source: 'Tonic Farewell Dispatch'
    },
    key_statistic: {
      value: '-73%',
      label: 'Decline in independent downtown venues'
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
    decade: '2010s–Present',
    title: 'Acoustic Diaspora',
    subtitle: 'Cross-River Migration to Brooklyn',
    narrative_body: [
      'The epicenter of live jazz migrated across the East River into Bed-Stuy, Crown Heights, and Gowanus.'
    ],
    quote: {
      text: 'When Manhattan turned its back on the music, Brooklyn welcomed the masters home.',
      author: 'Viola Plummer',
      source: 'Sistas\' Place Oral History'
    },
    key_statistic: {
      value: '4.8 mi',
      label: 'Average eastward centroid shift of NYC jazz'
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
