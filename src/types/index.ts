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
  venue_type: 'commercial_club' | 'loft' | 'avant_garde' | 'cultural_center';
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
  operating_model?: 'commercial' | 'nonprofit' | 'artist_led' | 'community' | 'mixed';
  audience_access_note?: string;
  price_evidence?: string;
  closure_evidence_url?: string;
}

export type VenueFeature = GeoJSON.Feature<GeoJSON.Point, VenueProperties>;

export interface MapCameraState {
  center: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface StorySource {
  label: string;
  url: string;
}

export type StoryRole =
  | 'migration'
  | 'housing'
  | 'commercial_nightlife'
  | 'alternative_social_space'
  | 'economic_crisis'
  | 'wartime'
  | 'experimentation'
  | 'postwar_change'
  | 'development'
  | 'affordability'
  | 'decentralization'
  | 'contemporary_ecology';

export interface StoryPullQuote {
  text: string;
  speaker: string;
  source: string;
  url: string;
}

export interface StoryRentContext {
  state: 'unavailable' | 'available';
  year?: 1980 | 1990 | 2000 | 2010 | 2020;
  note: string;
}

export interface StoryBeat {
  id: string;
  role: StoryRole;
  eyebrow: string;
  historicalContext: string;
  title: string;
  body: string;
  venueIds: string[];
  camera: MapCameraState;
  image?: string;
  imageAlt?: string;
  sources?: StorySource[];
  pullQuote?: StoryPullQuote;
  rentContext?: StoryRentContext;
}

export interface DecadeStory {
  decade: number;
  historicalPhase: string;
  title: string;
  subtitle: string;
  beats: StoryBeat[];
}
