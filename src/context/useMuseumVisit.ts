import { createContext, useContext } from 'react';
import type { ExhibitId } from '../types';
import type { PersistedMuseumVisit } from '../utils/museumVisitState';
import type { JourneyChapter } from '../utils/journey';

export interface MuseumVisitContextValue extends PersistedMuseumVisit {
  audioMuted: boolean;
  activeAudioId: string | null;
  completeExhibit: (id: ExhibitId) => void;
  visitVenue: (id: string) => void;
  setPollChoice: (choice: 'a' | 'b') => void;
  toggleMuted: () => void;
  playClip: (id: string, src: string, excerpt: [number, number]) => Promise<void>;
  stopAudio: () => void;
  claimAudio: (id: string) => void;
  enterSoundScene: (scene: JourneyChapter) => void;
  leaveSoundScene: (scene: JourneyChapter) => void;
  playInteraction: (kind: 'step' | 'paper' | 'door') => void;
  prepareMusic: (audio: HTMLMediaElement) => Promise<void>;
}

export const MuseumVisitContext = createContext<MuseumVisitContextValue | null>(null);

export const useMuseumVisit = () => {
  const context = useContext(MuseumVisitContext);
  if (!context) throw new Error('useMuseumVisit must be used inside MuseumVisitProvider');
  return context;
};
