export const HOLD_DURATION_MS = 4000;

export const getHoldProgress = (elapsedMs: number) =>
  Math.min(Math.max(elapsedMs / HOLD_DURATION_MS, 0), 1);

export const getHoldReleaseOutcome = (elapsedMs: number) =>
  elapsedMs >= HOLD_DURATION_MS ? 'enter' as const : 'drop-and-reset' as const;

export const shouldSoundtrackBeAudible = ({
  status,
  manualMuted,
  recordPaused,
  pageHidden,
}: {
  status: string;
  manualMuted: boolean;
  recordPaused: boolean;
  pageHidden: boolean;
}) => status === 'playing' && !manualMuted && !recordPaused && !pageHidden;

export const wrapLoopCursor = (cursor: number, finalSampleIndex: number) =>
  finalSampleIndex > 0 && cursor >= finalSampleIndex ? cursor % finalSampleIndex : Math.max(cursor, 0);
