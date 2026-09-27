import type { GallerySoundtrackController } from '../hooks/useGallerySoundtrack';

export function SoundtrackToggle({ audio }: { audio: GallerySoundtrackController }) {
  const isLoading = audio.status === 'loading';
  const isError = audio.status === 'error';
  const contextLabel = audio.activeTrack.decade ? `${audio.activeTrack.decade}s` : 'gallery';
  const label = isError
    ? `Retry ${contextLabel} soundtrack`
    : isLoading
      ? `Loading ${contextLabel} soundtrack`
      : audio.isAudible
        ? `Mute ${contextLabel} soundtrack`
        : `Play ${contextLabel} soundtrack`;

  return (
    <button
      className={`soundtrack-toggle${audio.isAudible ? ' is-playing' : ''}${isError ? ' has-error' : ''}`}
      type="button"
      data-ui-layer
      data-tour="soundtrack"
      data-audio-status={audio.status}
      data-audio-time={audio.currentTime.toFixed(2)}
      aria-label={label}
      title={`${audio.activeTrack.title} — ${audio.activeTrack.artist ?? 'Artist not supplied'}`}
      disabled={isLoading}
      onClick={isError ? audio.retry : audio.toggleMuted}
    >
      <svg className="turntable-icon" viewBox="0 0 64 64" aria-hidden="true">
        <g className="vinyl-disc">
          <circle className="vinyl-edge" cx="29" cy="32" r="24" />
          <path className="vinyl-grooves" d="M31 11a21 21 0 0 1 18 17M31 15a17 17 0 0 1 14 13M31 19a13 13 0 0 1 10 9M27 53A21 21 0 0 1 9 36M27 49a17 17 0 0 1-14-13M27 45a13 13 0 0 1-10-9" />
          <circle className="vinyl-label" cx="29" cy="32" r="8.5" />
          <circle className="vinyl-spindle" cx="29" cy="32" r="1.7" />
        </g>
        <g className="tonearm">
          <circle className="tonearm-pivot" cx="53" cy="12" r="3.2" />
          <path d="M53 13c1.2 14.5-2.8 27.2-12.6 34.2" />
          <path className="tonearm-head" d="m40.3 44.8 5.2 6.6-8.2 6.4-5.2-6.6z" />
        </g>
      </svg>
      <span className="sr-only" aria-live="polite">{isError ? 'Soundtrack unavailable' : ''}</span>
    </button>
  );
}
