export const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(Math.max(Number.isFinite(value) ? value : minimum, minimum), maximum);

export const seekTimeForProgress = (progress: number, duration: number) =>
  Number.isFinite(duration) && duration > 0 ? clamp(progress) * duration : 0;

export const progressForTime = (currentTime: number, duration: number) =>
  Number.isFinite(duration) && duration > 0 ? clamp(currentTime / duration) : 0;

export const formatPlaybackTime = (seconds: number) => {
  const wholeSeconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const minutes = Math.floor(wholeSeconds / 60);
  return `${minutes}:${String(wholeSeconds % 60).padStart(2, '0')}`;
};

export const crossfadeLevels = (progress: number) => {
  const amount = clamp(progress);
  return { incoming: amount, outgoing: 1 - amount };
};
