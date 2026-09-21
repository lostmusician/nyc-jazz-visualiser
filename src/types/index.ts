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

export type ExhibitId = 'listening' | 'clubs' | 'economics' | 'map';
export type AudioPreference = 'unasked' | 'on' | 'off';

export type MuseumRoute = 'entrance' | 'foyer' | ExhibitId;

export interface MuseumRoomDefinition {
  id: ExhibitId;
  number: string;
  title: string;
  shortTitle: string;
  question: string;
  accent: string;
  objectLabel: string;
}

export interface SceneLayer {
  id: string;
  src: string;
  mobileSrc?: string;
  alt: string;
  depth: number;
  opacity?: number;
  blendMode?: 'normal' | 'screen' | 'multiply' | 'overlay';
}

export interface LayeredSceneAsset {
  id: string;
  label: string;
  status: 'illustrative' | 'archival';
  layers: SceneLayer[];
  credit?: string;
}

export interface AssetCredit {
  id: string;
  sourceUrl?: string;
  creator: string;
  date?: string;
  rightsStatus: 'public-domain' | 'cc0' | 'cleared' | 'prototype' | 'original';
  requiredCredit: string;
  classification: 'archival' | 'illustrative';
}

export interface AudioCredit {
  title: string;
  artist: string;
  date: string;
  sourceUrl?: string;
  license: string;
  attribution: string;
  description: string;
  rightsStatus: 'cleared' | 'prototype';
}

export interface ListeningOption {
  id: 'a' | 'b';
  label: string;
  src: string;
  excerpt: [number, number];
  credit: AudioCredit;
}

export interface ListeningPair {
  id: string;
  prompt: string;
  reflection: string;
  options: [ListeningOption, ListeningOption];
}

export interface ClubMoment {
  id: string;
  label: string;
  title: string;
  detail: string;
}

export interface ExhibitSource {
  label: string;
  url: string;
}

export interface ClubExhibit {
  id: string;
  venueId: string;
  roomLabel: string;
  name: string;
  years: string;
  neighborhood: string;
  interaction: 'jam-table' | 'handbills' | 'loft-mixer' | 'community-wall';
  prompt: string;
  wallLabel: string;
  image: string;
  accent: string;
  moments: ClubMoment[];
  sources: ExhibitSource[];
}

export interface VenueSimulationPreset {
  id: string;
  label: string;
  place: string;
  year: string;
  capacity: number;
  monthlyRent: number;
  fixedOperatingCost: number;
  attendanceRate: number;
  note: string;
  sources: ExhibitSource[];
}

export interface VenueSimulationInput {
  ticketPrice: number;
  performancesPerWeek: number;
  attendanceRate: number;
  artistShare: number;
}

export interface VenueSimulationResult {
  monthlyRevenue: number;
  artistPay: number;
  operatingCosts: number;
  monthlyBalance: number;
  audienceCost: number;
  experimentalNights: number;
}

export type AddressBeatId = 'address' | 'room' | 'allocation' | 'present' | 'city';

export interface ArchivalAsset {
  id: string;
  src: string;
  mobileSrc: string;
  sourceUrl: string;
  creator: string;
  date: string;
  credit: string;
  rightsNote: string;
  alt: string;
  focalPoint: { x: number; y: number };
  role: 'historic-facade' | 'performance' | 'ephemera' | 'present-facade';
}

export interface AddressBeat {
  id: AddressBeatId;
  assetIds: string[];
  visibleLine: string;
  scrollTreatment: 'hold' | 'accumulate' | 'interact' | 'align' | 'expand';
}

export type NightAllocationCategory = 'property' | 'artists' | 'room' | 'future';

export type NightAllocation = Record<NightAllocationCategory, number>;

export interface NightOutcome {
  protectedPriorities: NightAllocationCategory[];
  sacrificedPriorities: NightAllocationCategory[];
  resultSentence: string;
}

export interface FacadeVariant {
  src: string;
  mobileSrc: string;
  alt: string;
}

export interface FacadeComparison {
  historicAssetId: string;
  presentAssetId: string;
  historic: FacadeVariant;
  present: FacadeVariant;
  initialPosition: number;
  alignmentNote: string;
}

export interface ArchiveHotspot {
  id: string;
  label: string;
  date: string;
  sourceId: string;
  position: { x: number; y: number };
  lightPosition: { x: number; y: number };
}

export type VenueRelationshipType = 'collective-organizing' | 'artist-organizer-continuity';

export interface VenueRelationshipSource {
  title: string;
  publisher: string;
  url: string;
  locator: string;
  evidenceExcerpt: string;
}

export interface VenueRelationship {
  id: string;
  fromVenueId: string;
  toVenueId: string;
  type: VenueRelationshipType;
  label: string;
  evidenceNote: string;
  source: VenueRelationshipSource;
  confirmed: boolean;
}

export interface WindowMotifState {
  section: AddressBeatId;
  progress: number;
  opacity: number;
  tone: 'dark' | 'paper' | 'map';
}
