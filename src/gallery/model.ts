import type { SceneMovement, VenueFeature } from '../types';

export const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020] as const;
export type Decade = (typeof DECADES)[number];

export type VenueEraStatus = 'active' | 'closed' | 'future';

export interface ListeningTrack {
  id: string;
  title: string;
  artist: string;
  year: number | null;
  relationship: 'recorded-at-venue' | 'documented-performance' | 'representative-of-scene';
  listenUrl: string;
  evidenceUrl: string;
  note: string;
}

export interface ClubProfile {
  venueId: string;
  description: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  tracks: ListeningTrack[];
}

export interface SceneDefinition {
  id: SceneMovement | 'all';
  label: string;
  shortLabel: string;
  accent: string;
}

export const SCENES: SceneDefinition[] = [
  { id: 'all', label: 'All scenes', shortLabel: 'All', accent: '#e8c578' },
  { id: 'harlem_jazz', label: 'Harlem after hours', shortLabel: 'Harlem', accent: '#f0a35b' },
  { id: 'bebop_mainstream', label: 'Swing Street & the Village', shortLabel: 'Swing Street', accent: '#e8c578' },
  { id: 'loft_jazz', label: 'Loft jazz', shortLabel: 'Lofts', accent: '#d56d4c' },
  { id: 'downtown_avant_garde', label: 'Downtown avant-garde', shortLabel: 'Downtown', accent: '#c95646' },
  { id: 'brooklyn_continuation', label: 'Brooklyn continuation', shortLabel: 'Brooklyn', accent: '#75a092' },
  { id: 'mainstream_jazz', label: 'Contemporary rooms', shortLabel: 'Contemporary', accent: '#8fa9c2' },
];

export function overlapsDecade(venue: VenueFeature, decade: Decade): boolean {
  const start = venue.properties.open_year ?? Number.NEGATIVE_INFINITY;
  const end = venue.properties.close_year ?? Number.POSITIVE_INFINITY;
  return start <= decade + 9 && end >= decade;
}

export function statusForDecade(venue: VenueFeature, decade: Decade): VenueEraStatus {
  const opened = venue.properties.open_year;
  const closed = venue.properties.close_year;
  if (opened !== null && opened > decade + 9) return 'future';
  if (closed !== null && closed < decade) return 'closed';
  return 'active';
}

export function filterGalleryVenues(
  venues: VenueFeature[],
  featuredIds: Set<string>,
  decade: Decade,
  scene: SceneMovement | 'all',
): VenueFeature[] {
  return venues.filter((venue) =>
    featuredIds.has(venue.properties.id)
    && overlapsDecade(venue, decade)
    && (scene === 'all' || venue.properties.scene_movement === scene));
}
