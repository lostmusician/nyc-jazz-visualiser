import { DECADE_SOUNDTRACKS, GALLERY_SOUNDTRACK } from '../data/decadeSoundtracks';
import type { Decade } from '../gallery/model';
import type { GallerySoundtrackController } from '../hooks/useGallerySoundtrack';

export function SoundtrackToggle({
  audio,
  decade,
}: {
  audio: GallerySoundtrackController;
  decade?: Decade;
}) {
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

  const activeDecade = decade ?? (audio.activeTrack.decade ?? 1970);
  const eraTrack = DECADE_SOUNDTRACKS[activeDecade];
  const isGalleryTrackActive = audio.activeTrack.src === GALLERY_SOUNDTRACK.src;
  const isEraTrackActive = audio.activeTrack.src === eraTrack?.src;

  return (
    <div className="soundtrack-unit" data-ui-layer>
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

      <div className="soundtrack-popover" role="region" aria-label="Soundtrack selections">
        <div className="soundtrack-popover-header">
          <span className="soundtrack-popover-title">Soundtrack</span>
          <span className={`soundtrack-status-badge${audio.isAudible ? ' is-active' : ''}`}>
            {audio.status === 'loading' ? 'Loading…' : audio.isAudible ? 'Playing' : 'Muted'}
          </span>
        </div>

        <div className="soundtrack-track-list">
          {eraTrack && (
            <div className={`soundtrack-track-item${isEraTrackActive ? ' is-current' : ''}`}>
              <div className="soundtrack-track-meta">
                <div className="soundtrack-track-tag">{eraTrack.decade}s Soundtrack</div>
                <div className="soundtrack-track-name">{eraTrack.title}</div>
                <div className="soundtrack-track-artist">
                  {eraTrack.artist ?? 'Era Soundtrack'}{eraTrack.year ? ` · ${eraTrack.year}` : ''}
                </div>
              </div>
              {isEraTrackActive ? (
                <span className="soundtrack-track-playing-badge">Now playing</span>
              ) : (
                <button
                  type="button"
                  className="soundtrack-track-select-btn"
                  onClick={() => audio.selectTrack(activeDecade)}
                >
                  Play {activeDecade}s
                </button>
              )}
            </div>
          )}

          <div className={`soundtrack-track-item${isGalleryTrackActive ? ' is-current' : ''}`}>
            <div className="soundtrack-track-meta">
              <div className="soundtrack-track-tag">NYC Signature Theme</div>
              <div className="soundtrack-track-name">{GALLERY_SOUNDTRACK.title}</div>
              <div className="soundtrack-track-artist">
                {GALLERY_SOUNDTRACK.artist}{GALLERY_SOUNDTRACK.year ? ` · ${GALLERY_SOUNDTRACK.year}` : ''}
              </div>
            </div>
            {isGalleryTrackActive ? (
              <span className="soundtrack-track-playing-badge">Now playing</span>
            ) : (
              <button
                type="button"
                className="soundtrack-track-select-btn"
                onClick={() => audio.selectTrack('gallery')}
              >
                Play NYC Theme
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
