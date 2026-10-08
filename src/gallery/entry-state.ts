export const HOLD_DURATION_MS = 3500;
export const HOLD_THRESHOLD_WINDOW_MS = 500;

export const getHoldProgress = (elapsedMs: number) => {
  const linearProgress = Math.min(Math.max(elapsedMs / HOLD_DURATION_MS, 0), 1);
  return Math.pow(linearProgress, 1.5) * (2.4 - 1.4 * linearProgress);
};

export const HOLD_READY_PROGRESS = getHoldProgress(HOLD_DURATION_MS - HOLD_THRESHOLD_WINDOW_MS);

export const getVisualHoldProgress = (progress: number) =>
  Math.min(Math.max(progress / HOLD_READY_PROGRESS, 0), 1);

export const getHoldReleaseOutcome = (elapsedMs: number) =>
  elapsedMs >= HOLD_DURATION_MS - HOLD_THRESHOLD_WINDOW_MS ? 'enter' as const : 'drop-and-reset' as const;

export const wrapLoopCursor = (cursor: number, finalSampleIndex: number) =>
  finalSampleIndex > 0 && cursor >= finalSampleIndex ? cursor % finalSampleIndex : Math.max(cursor, 0);

export const getTurntableSpeed = (from: number, to: number, progress: number) => {
  const amount = Math.min(Math.max(progress, 0), 1);
  const eased = to >= from ? 1 - Math.pow(1 - amount, 3) : Math.pow(1 - amount, 3);
  return to >= from
    ? from + (to - from) * eased
    : to + (from - to) * eased;
};
