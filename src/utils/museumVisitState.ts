import type { AudioPreference, ExhibitId } from '../types';

export interface PersistedMuseumVisit {
  completedExhibits: ExhibitId[];
  visitedVenueIds: string[];
  pollChoice: 'a' | 'b' | null;
  audioPreference: AudioPreference;
}

export const MUSEUM_VISIT_V1_KEY = 'nyc-jazz-museum-visit-v1';
export const MUSEUM_VISIT_V2_KEY = 'nyc-jazz-museum-visit-v2';

export const INITIAL_MUSEUM_VISIT: PersistedMuseumVisit = {
  completedExhibits: [],
  visitedVenueIds: [],
  pollChoice: null,
  audioPreference: 'unasked',
};

const EXHIBITS: ExhibitId[] = ['listening', 'clubs', 'economics', 'map'];

const safeParse = (value: string | null): Record<string, unknown> => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
};

const normalize = (saved: Record<string, unknown>, migrated = false): PersistedMuseumVisit => {
  const completedExhibits = Array.isArray(saved.completedExhibits)
    ? saved.completedExhibits.filter((id): id is ExhibitId => EXHIBITS.includes(id as ExhibitId))
    : [];
  const visitedVenueIds = Array.isArray(saved.visitedVenueIds)
    ? saved.visitedVenueIds.filter((id): id is string => typeof id === 'string')
    : [];
  const pollChoice = saved.pollChoice === 'a' || saved.pollChoice === 'b' ? saved.pollChoice : null;
  const explicitPreference = saved.audioPreference;
  const audioPreference: AudioPreference = explicitPreference === 'on' || explicitPreference === 'off' || explicitPreference === 'unasked'
    ? explicitPreference
    : migrated && saved.audioMuted === false ? 'unasked' : migrated && saved.audioMuted === true ? 'off' : 'unasked';
  return { completedExhibits, visitedVenueIds, pollChoice, audioPreference };
};

export const readMuseumVisit = (storage: Pick<Storage, 'getItem'>): PersistedMuseumVisit => {
  const v2 = storage.getItem(MUSEUM_VISIT_V2_KEY);
  return v2 ? normalize(safeParse(v2)) : normalize(safeParse(storage.getItem(MUSEUM_VISIT_V1_KEY)), true);
};

export const writeMuseumVisit = (storage: Pick<Storage, 'setItem'>, visit: PersistedMuseumVisit) => {
  storage.setItem(MUSEUM_VISIT_V2_KEY, JSON.stringify(visit));
};
