export type SceneMovement =
  | 'harlem_jazz'
  | 'bebop_mainstream'
  | 'loft_jazz'
  | 'downtown_avant_garde'
  | 'brooklyn_continuation'
  | 'mainstream_jazz';

export type VenueStatus = 'open' | 'closed' | 'relocated' | 'unknown';

export interface VenueProperties {
  id: string;
  name: string;
  venue_type: 'commercial_club' | 'loft' | 'avant_garde';
  scene_movement: SceneMovement;
  borough: 'Manhattan' | 'Brooklyn' | 'Queens' | 'Bronx';
  neighborhood: string;
  address: string;
  open_year: number | null;
  close_year: number | null;
  status: VenueStatus;
  closing_reason: string | null;
  quote?: string;
  notes?: string;
  source_url?: string;
  source_publisher?: string;
}

export type VenueFeature = GeoJSON.Feature<GeoJSON.Point, VenueProperties>;

export interface MapCameraState {
  center: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
}
