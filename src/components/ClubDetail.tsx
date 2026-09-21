import React from 'react';
import type { ClubProfile } from '../gallery/model';
import type { VenueFeature } from '../types';

const relationshipLabel = {
  'recorded-at-venue': 'Recorded here',
  'documented-performance': 'Documented connection',
  'representative-of-scene': 'Representative listening',
} as const;

export function ClubDetail({ venue, profile, playingTrackId, onPlayTrack, onClose }: {
  venue: VenueFeature;
  profile?: ClubProfile;
  playingTrackId: string | null;
  onPlayTrack: (trackId: string | null) => void;
  onClose: () => void;
}) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const properties = venue.properties;
  const description = profile?.description ?? properties.notes ?? properties.quote ?? 'This venue remains part of the citywide research dataset.';
  return (
    <div className="club-dialog-backdrop" data-ui-layer onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <article ref={dialogRef} className="club-dialog" role="dialog" aria-modal="true" aria-labelledby="club-dialog-title">
        <button ref={closeRef} className="dialog-close" type="button" onClick={onClose} aria-label="Close club details">×</button>
        <div className="club-dialog-image">
          {profile ? <img src={profile.image} alt={profile.imageAlt} /> : <div className="club-dialog-placeholder">ARCHIVE<br />RECORD</div>}
          <span>{properties.scene_movement.replace(/_/g, ' ')}</span>
        </div>
        <div className="club-dialog-copy">
          <p className="eyebrow">{properties.neighborhood} · {properties.borough}</p>
          <h2 id="club-dialog-title">{properties.name}</h2>
          <p className="club-years">{properties.open_year ?? 'Unknown'} — {properties.close_year ?? 'Present'} · {properties.status}</p>
          <p className="club-description">{description}</p>
          {properties.closing_reason && <section><h3>Why the room changed</h3><p>{properties.closing_reason}</p></section>}
          {properties.quote && <blockquote>“{properties.quote}”</blockquote>}
          {profile?.tracks.length ? (
            <section className="listening-shelf" aria-label="Listening selections">
              <h3>Records from this orbit</h3>
              <div className="record-list">
                {profile.tracks.map((track) => (
                  <a
                    key={track.id}
                    className={playingTrackId === track.id ? 'record is-playing' : 'record'}
                    href={track.listenUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onPlayTrack(track.id)}
                    aria-label={`Listen to ${track.title} by ${track.artist}`}
                  >
                    <i aria-hidden="true"><b /></i>
                    <span><strong>{track.title}</strong><em>{track.artist} · {track.year ?? 'date unknown'}</em><small>{relationshipLabel[track.relationship]} ↗</small></span>
                  </a>
                ))}
              </div>
              <p className="listening-note">Selections open at their listening source. “Representative” tracks evoke a documented performer or scene and are not claimed as recordings made in this room.</p>
            </section>
          ) : <p className="no-audio">Listening research for this venue is still in progress.</p>}
          <footer>
            <span>{properties.address}</span>
            {properties.source_url && <a href={properties.source_url} target="_blank" rel="noreferrer">Venue source ↗</a>}
            {profile && <a href={profile.imageSourceUrl} target="_blank" rel="noreferrer">Image context ↗</a>}
          </footer>
        </div>
      </article>
    </div>
  );
}
