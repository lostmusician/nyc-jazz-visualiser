import type { VenueFeature } from '../types';

export function ClubIndex({ venues, onHover, onSelect }: {
  venues: VenueFeature[];
  onHover: (venueId: string | null) => void;
  onSelect: (venueId: string) => void;
}) {
  return (
    <section className="club-index" aria-labelledby="club-index-heading">
      <div className="club-index-heading" id="club-index-heading"><span>Club index</span><b>{venues.length}</b></div>
      <div className="club-index-list">
        {venues.length === 0 && <p>No featured clubs overlap this decade and scene.</p>}
        {venues.map((venue) => (
          <button
            key={venue.properties.id}
            type="button"
            onFocus={() => onHover(venue.properties.id)}
            onBlur={() => onHover(null)}
            onMouseEnter={() => onHover(venue.properties.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(venue.properties.id)}
          >
            <span>{venue.properties.open_year ?? '—'}–{venue.properties.close_year ?? 'now'}</span>
            <strong>{venue.properties.name}</strong>
            <small>{venue.properties.neighborhood}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
