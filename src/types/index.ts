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

export interface ChapterStep {
  id: string;
  indexNumber: string;         // e.g. "01", "02"
  decade: string;              // e.g. "1950s"
  title: string;
  subtitle: string;
  narrative_body: string[];    // Multi-paragraph archival text
  quote?: {
    text: string;
    author: string;
    source?: string;
  };
  key_statistic?: {
    value: string;
    label: string;
  };
  framework?: {
    scholar: string;
    concept: string;
    reading: string;
  };
  map_camera: {
    center: [number, number];  // [lng, lat]
    zoom: number;
    pitch: number;
    bearing: number;
  };
  active_venue_ids: string[];  // Highlighted venues for this chapter
  year_range: [number, number];
}

export interface MapCameraState {
  center: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
}
