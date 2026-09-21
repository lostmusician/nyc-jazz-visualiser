import type * as THREE from 'three';
import type { ClubProfile } from '../gallery/model';
import type { VenueFeature } from '../types';

export interface ClubMediaItem {
  venue: VenueFeature;
  profile: ClubProfile;
  width: number;
  height: number;
}

export interface InfiniteCanvasProps {
  media: ClubMediaItem[];
  hoveredVenueId: string | null;
  onHoverVenue: (venueId: string | null) => void;
  onSelectVenue: (venueId: string) => void;
  onTextureProgress?: (progress: number) => void;
  showControls?: boolean;
  cameraFov?: number;
  cameraNear?: number;
  cameraFar?: number;
  fogNear?: number;
  fogFar?: number;
  backgroundColor?: string;
  fogColor?: string;
}

export interface ChunkData { key: string; cx: number; cy: number; cz: number }

export interface PlaneData {
  id: string;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  mediaIndex: number;
}
