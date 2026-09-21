export const CHAPTERS = ['prologue', 'listening', 'clubs', 'economics', 'map'] as const;
export type JourneyChapter = typeof CHAPTERS[number];
export type SoundBus = 'ambient' | 'music' | 'interaction';
export interface JourneyProgress { chapter: JourneyChapter; progress: number; overall: number }
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const chapterFromHash = (hash: string): JourneyChapter => {
  const value = hash.replace(/^#(?:room\/)?/, '');
  return CHAPTERS.includes(value as JourneyChapter) ? value as JourneyChapter : 'prologue';
};
export const chapterProgress = (top: number, height: number, viewport: number) => clamp(-top / Math.max(1, height - viewport));
