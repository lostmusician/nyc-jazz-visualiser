import type { AssetCredit, LayeredSceneAsset } from '../types';

export const ASSET_CREDITS: AssetCredit[] = [
  { id:'remembered-street',creator:'Original procedural Blender street, hand and ticket',date:'2026',rightsStatus:'original',requiredCredit:'Illustrative reconstruction for A Night Remembered.',classification:'illustrative' },
  {
    id: 'night-archive-foyer',
    creator: 'Original project artwork, procedurally modelled in Blender',
    date: '2026',
    rightsStatus: 'original',
    requiredCredit: 'Illustrative reconstruction created for Fifths & Sevenths.',
    classification: 'illustrative',
  },
  ...(['listening', 'clubs', 'economics', 'map'] as const).map((room) => ({
    id: `night-archive-${room}`,
    creator: 'Original project artwork, procedurally modelled in Blender',
    date: '2026',
    rightsStatus: 'original' as const,
    requiredCredit: 'Illustrative reconstruction created for Fifths & Sevenths.',
    classification: 'illustrative' as const,
  })),
];

export const MEMORY_STREET: LayeredSceneAsset = {
  id:'remembered-street',label:'An imagined New York street, seen through an older visitor’s wordless memory',status:'illustrative',credit:'Original Blender artwork, 2026. Illustrative reconstruction.',
  layers:['far','middle','foreground','door-light','hand','ticket'].map((id,depth)=>({id,src:`/art/street/${id}.webp`,alt:'',depth})),
};

export const FOYER_SCENE: LayeredSceneAsset = {
  id: 'night-archive-foyer',
  label: 'An imagined four-room museum seen as an architectural cutaway',
  status: 'illustrative',
  credit: 'Original project artwork, procedurally modelled in Blender, 2026.',
  layers: [
    {
      id: 'architecture',
      src: '/art/foyer/foyer-night-archive.png',
      alt: '',
      depth: 0,
    },
  ],
};

export const ROOM_SCENES = {
  listening: {
    id: 'night-archive-listening', label: 'Two anonymous listening stations divided by a central screen', status: 'illustrative',
    credit: 'Original project artwork, procedurally modelled in Blender, 2026.',
    layers: [{ id: 'tableau', src: '/art/rooms/listening-room.png', alt: '', depth: 0 }],
  },
  clubs: {
    id: 'night-archive-clubs', label: 'A small jazz stage waiting in a dark room', status: 'illustrative',
    credit: 'Original project artwork, procedurally modelled in Blender, 2026.',
    layers: [{ id: 'tableau', src: '/art/rooms/clubs-room.png', alt: '', depth: 0 }],
  },
  economics: {
    id: 'night-archive-economics', label: 'A ledger desk, four decision weights and an unstable balance', status: 'illustrative',
    credit: 'Original project artwork, procedurally modelled in Blender, 2026.',
    layers: [{ id: 'tableau', src: '/art/rooms/economics-room.png', alt: '', depth: 0 }],
  },
  map: {
    id: 'night-archive-map', label: 'An illuminated map table surrounded by archive drawers', status: 'illustrative',
    credit: 'Original project artwork, procedurally modelled in Blender, 2026.',
    layers: [{ id: 'tableau', src: '/art/rooms/archive-room.png', alt: '', depth: 0 }],
  },
} satisfies Record<'listening' | 'clubs' | 'economics' | 'map', LayeredSceneAsset>;
