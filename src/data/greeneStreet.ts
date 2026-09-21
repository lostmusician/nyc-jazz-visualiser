import type { AddressBeat, ArchivalAsset, ArchiveHotspot, FacadeComparison, VenueRelationship } from '../types';

export const GREENE_ARCHIVAL_ASSETS: ArchivalAsset[] = [
  {
    id: 'greene-tax-1940',
    src: '/archive/greene/facade-1940.webp',
    mobileSrc: '/archive/greene/facade-1940-mobile.webp',
    sourceUrl: 'https://www.nyc.gov/assets/lpc/downloads/pdf/presentation-materials/20211005/77-Greene-Street.pdf',
    creator: 'New York City Department of Taxes / Municipal Archives',
    date: 'c. 1940',
    credit: 'Tax photograph, Manhattan Block 486, Lot 21.',
    rightsNote: 'NYC Municipal Archives image reproduced for classroom scholarship.',
    alt: 'Black-and-white tax photograph of the cast-iron buildings around 77 Greene Street.',
    focalPoint: { x: 56, y: 50 },
    role: 'historic-facade',
  },
  {
    id: 'alis-alley-cyrille',
    src: '/archive/greene/alis-alley-1978.webp',
    mobileSrc: '/archive/greene/alis-alley-1978-mobile.webp',
    sourceUrl: 'https://www.thomasager.com/photography-musicians',
    creator: 'Thomas Ager',
    date: '1978',
    credit: 'Andrew Cyrille at Rashied Ali’s club, Ali’s Alley, 77 Greene Street.',
    rightsNote: 'Copyright Thomas Ager; reproduced for classroom scholarship.',
    alt: 'Andrew Cyrille playing drums inside Ali’s Alley in 1978.',
    focalPoint: { x: 50, y: 42 },
    role: 'performance',
  },
  {
    id: 'rashied-ali-poster',
    src: '/archive/greene/rashied-ali-poster.webp',
    mobileSrc: '/archive/greene/rashied-ali-poster-mobile.webp',
    sourceUrl: 'https://www.thomasager.com/photography-musicians',
    creator: 'Thomas Ager',
    date: '1978',
    credit: 'Poster for Ali’s Alley.',
    rightsNote: 'Copyright Thomas Ager; reproduced for classroom scholarship.',
    alt: 'A black-and-white 1978 poster advertising Rashied Ali at Ali’s Alley.',
    focalPoint: { x: 50, y: 50 },
    role: 'ephemera',
  },
  {
    id: 'greene-present',
    src: '/archive/greene/facade-present.webp',
    mobileSrc: '/archive/greene/facade-present-mobile.webp',
    sourceUrl: 'https://www.nyc.gov/assets/lpc/downloads/pdf/presentation-materials/20211005/77-Greene-Street.pdf',
    creator: 'Landmarks Preservation Commission applicant materials',
    date: '2021',
    credit: 'Existing photograph of 77 Greene Street.',
    rightsNote: 'Public hearing record reproduced for classroom scholarship.',
    alt: 'Present-day view looking up at the five-storey cast-iron façade of 77 Greene Street.',
    focalPoint: { x: 55, y: 54 },
    role: 'present-facade',
  },
];

export const ADDRESS_BEATS: AddressBeat[] = [
  { id: 'address', assetIds: ['greene-tax-1940'], visibleLine: '77 Greene Street · New York City', scrollTreatment: 'hold' },
  { id: 'room', assetIds: ['alis-alley-cyrille', 'rashied-ali-poster'], visibleLine: 'The room is made.', scrollTreatment: 'accumulate' },
  { id: 'allocation', assetIds: [], visibleLine: 'One night. Ten shares.', scrollTreatment: 'interact' },
  { id: 'present', assetIds: ['greene-present'], visibleLine: 'The address survived. What it could afford to hold changed.', scrollTreatment: 'align' },
  { id: 'city', assetIds: [], visibleLine: 'From one address to the city.', scrollTreatment: 'expand' },
];

export const GREENE_FACADE_COMPARISON: FacadeComparison = {
  historicAssetId: 'greene-tax-1940',
  presentAssetId: 'greene-present',
  historic: {
    src: '/archive/greene/aligned/facade-1940-aligned.jpg',
    mobileSrc: '/archive/greene/aligned/facade-1940-aligned-mobile.jpg',
    alt: 'Aligned crop of the circa-1940 Greene Street tax photograph.',
  },
  present: {
    src: '/archive/greene/aligned/facade-present-aligned.jpg',
    mobileSrc: '/archive/greene/aligned/facade-present-aligned-mobile.jpg',
    alt: 'Aligned crop of the 2021 photograph of 77 Greene Street.',
  },
  initialPosition: 68,
  alignmentNote: 'The two photographs were made from different street positions. The comparison aligns the principal facade axis and window rhythm; it is not a pixel-exact reconstruction.',
};

export const GREENE_ARCHIVE_HOTSPOTS: ArchiveHotspot[] = [
  { id: 'stage', label: 'Performance room', date: '1978', sourceId: 'alis-alley-cyrille', position: { x: 66, y: 64 }, lightPosition: { x: 64, y: 54 } },
  { id: 'kitchen', label: 'Kitchen and gathering space', date: '1973–1979', sourceId: 'rashied-ali-bio', position: { x: 82, y: 76 }, lightPosition: { x: 78, y: 66 } },
  { id: 'survival', label: 'Survival Records', date: '1973', sourceId: 'rashied-ali-bio', position: { x: 72, y: 39 }, lightPosition: { x: 76, y: 39 } },
];

const HELLER_SOURCE = {
  title: 'Loft Jazz: Improvising New York in the 1970s',
  publisher: 'University of California Press',
  url: 'https://doi.org/10.1525/california/9780520285408.003.0003',
  locator: 'Chapter 3, “The Jazz Loft Era,” pp. 34–62',
  evidenceExcerpt: 'The chapter traces the 1972 New York Musicians’ Jazz Festival and the musician-organizers who established the city’s loft spaces.',
};

export const GREENE_VENUE_RELATIONSHIPS: VenueRelationship[] = [
  {
    id: 'alley-rivbea-organizing',
    fromVenueId: '0012',
    toVenueId: '0011',
    type: 'collective-organizing',
    label: 'Shared collective-organizing context',
    evidenceNote: 'Ali’s Alley and Studio Rivbea grew from the musician-organized loft network surrounding the 1972 New York Musicians’ Jazz Festival.',
    source: HELLER_SOURCE,
    confirmed: true,
  },
  {
    id: 'alley-ladies-fort-organizing',
    fromVenueId: '0012',
    toVenueId: '0013',
    type: 'collective-organizing',
    label: 'Shared collective-organizing context',
    evidenceNote: 'Ali’s Alley and Ladies’ Fort belonged to the same musician-run loft ecology; the line marks common organizing history, not institutional succession.',
    source: HELLER_SOURCE,
    confirmed: true,
  },
  {
    id: 'alley-sistas-abdullah',
    fromVenueId: '0012',
    toVenueId: '0016',
    type: 'artist-organizer-continuity',
    label: 'Artist and organizer continuity · Ahmed Abdullah',
    evidenceNote: 'Ahmed Abdullah described performing and recording at Ali’s Alley; he later served as artistic director at Sistas’ Place.',
    source: {
      title: 'Interview: Trumpeter Ahmed Abdullah Discusses Involvement with Sun Ra Arkestra, Arts Direction at Sistas’ Place',
      publisher: 'Jazz Right Now',
      url: 'https://www.jazzrightnow.com/interview-trumpeter-ahmed-abdullah-discusses-involvement-with-sun-ra-arkestra-arts-direction-at-sistas-place/',
      locator: 'Interview published March 7, 2016',
      evidenceExcerpt: 'Abdullah identifies Ali’s Alley at 77 Greene Street as the site of a week-long engagement and live recording, and discusses his arts direction at Sistas’ Place.',
    },
    confirmed: true,
  },
];

export const GREENE_SOURCES = [
  { id: 'greene-landmarks', kind: 'archival evidence', label: 'NYC Landmarks Preservation Commission — 77 Greene Street public hearing record', url: 'https://www.nyc.gov/assets/lpc/downloads/pdf/presentation-materials/20211005/77-Greene-Street.pdf' },
  { id: 'rashied-ali-bio', kind: 'archival evidence', label: 'Rashied Ali — official biography', url: 'https://www.rashiedali.org/bio' },
  { id: 'thomas-ager', kind: 'archival evidence', label: 'Thomas Ager — musicians portfolio', url: 'https://www.thomasager.com/photography-musicians' },
  { id: 'greene-property', kind: 'contextual data', label: 'StreetEasy — 77 Greene Street building record and dated rental history', url: 'https://streeteasy.com/building/77-greene-street-new_york' },
  { id: 'village-jazz-map', kind: 'contextual data', label: 'Village Preservation — interactive jazz map', url: 'https://jazzmap.villagepreservation.org/' },
  { id: 'heller-loft-era', kind: 'historical research', label: 'Michael C. Heller — The Jazz Loft Era', url: HELLER_SOURCE.url },
  { id: 'abdullah-interview', kind: 'oral history', label: 'Jazz Right Now — Ahmed Abdullah interview', url: GREENE_VENUE_RELATIONSHIPS[2].source.url },
];
