import React from 'react';
import { ClubDetail } from './components/ClubDetail';
import { ClubIndex } from './components/ClubIndex';
import { DecadeTimeline } from './components/DecadeTimeline';
import { GalleryIntro } from './components/GalleryIntro';
import { GALLERY_PROFILE_BY_ID, GALLERY_VENUE_IDS } from './data/clubProfiles';
import { NYC_JAZZ_VENUES } from './data/venues';
import { filterGalleryVenues, overlapsDecade, SCENES, type Decade } from './gallery/model';
import { InfiniteCanvas } from './infinite-canvas';
import type { ClubMediaItem } from './infinite-canvas/types';
import type { SceneMovement } from './types';

const CentralMap = React.lazy(() => import('./components/CentralMap').then((module) => ({ default: module.CentralMap })));

export const App = () => {
  const [hasEntered, setHasEntered] = React.useState(false);
  const [decade, setDecade] = React.useState<Decade>(1970);
  const [scene, setScene] = React.useState<SceneMovement | 'all'>('all');
  const [hoveredVenueId, setHoveredVenueId] = React.useState<string | null>(null);
  const [selectedVenueId, setSelectedVenueId] = React.useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = React.useState<string | null>(null);
  const [browserOpen, setBrowserOpen] = React.useState(false);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  const galleryVenues = React.useMemo(
    () => filterGalleryVenues(NYC_JAZZ_VENUES, GALLERY_VENUE_IDS, decade, scene),
    [decade, scene],
  );
  const media = React.useMemo<ClubMediaItem[]>(() => galleryVenues.flatMap((venue) => {
    const profile = GALLERY_PROFILE_BY_ID.get(venue.properties.id);
    return profile ? [{ venue, profile, width: 768, height: 1000 }] : [];
  }), [galleryVenues]);
  const selectedVenue = selectedVenueId
    ? NYC_JAZZ_VENUES.find((venue) => venue.properties.id === selectedVenueId) ?? null
    : null;

  const selectScene = (nextScene: SceneMovement | 'all') => {
    setScene(nextScene);
    setHoveredVenueId(null);
    setPlayingTrackId(null);
    if (selectedVenueId) {
      const venue = NYC_JAZZ_VENUES.find((candidate) => candidate.properties.id === selectedVenueId);
      if (venue && nextScene !== 'all' && venue.properties.scene_movement !== nextScene) setSelectedVenueId(null);
    }
  };

  const selectDecade = (nextDecade: Decade) => {
    setDecade(nextDecade);
    setHoveredVenueId(null);
    setPlayingTrackId(null);
    if (selectedVenue && !overlapsDecade(selectedVenue, nextDecade)) {
      setSelectedVenueId(null);
      window.requestAnimationFrame(() => returnFocusRef.current?.focus());
    }
  };

  const openVenue = React.useCallback((venueId: string) => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedVenueId(venueId);
  }, []);

  const closeVenue = React.useCallback(() => {
    setSelectedVenueId(null);
    setPlayingTrackId(null);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);

  React.useEffect(() => {
    if (!browserOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !selectedVenueId) setBrowserOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [browserOpen, selectedVenueId]);

  if (!hasEntered) return <GalleryIntro onEnter={() => setHasEntered(true)} />;

  return (
    <main className="gallery-app">
      <a className="skip-link" href="#club-index">Skip to filters and club index</a>
      <InfiniteCanvas media={media} hoveredVenueId={hoveredVenueId} onHoverVenue={setHoveredVenueId} onSelectVenue={openVenue} />
      <div className="atmosphere" aria-hidden="true" />
      <React.Suspense fallback={<section className="central-map map-loading" aria-label="Loading the New York jazz-club map">Mapping the night…</section>}>
        <CentralMap venues={NYC_JAZZ_VENUES} decade={decade} scene={scene} hoveredVenueId={hoveredVenueId} selectedVenueId={selectedVenueId} onHoverVenue={setHoveredVenueId} onSelectVenue={openVenue} />
      </React.Suspense>
      <button className="browser-toggle" type="button" data-ui-layer aria-label="Browse and filter clubs" aria-expanded={browserOpen} aria-controls="club-browser" onClick={() => setBrowserOpen((open) => !open)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" /></svg>
        <span>{galleryVenues.length}</span>
      </button>
      <aside id="club-browser" className={`club-browser${browserOpen ? ' is-open' : ''}`} data-ui-layer aria-hidden={!browserOpen}>
        <div className="browser-heading"><span>Find a room</span><button type="button" aria-label="Close filters" onClick={() => setBrowserOpen(false)}>×</button></div>
        <nav className="scene-nav" aria-label="Scenes and places">
          {SCENES.map((item) => <button key={item.id} type="button" className={scene === item.id ? 'active' : ''} style={{ '--scene-accent': item.accent } as React.CSSProperties} onClick={() => selectScene(item.id)}><i />{item.shortLabel}</button>)}
        </nav>
        <div id="club-index"><ClubIndex venues={galleryVenues} onHover={setHoveredVenueId} onSelect={openVenue} /></div>
      </aside>
      <DecadeTimeline value={decade} onChange={selectDecade} />
      {selectedVenue && <ClubDetail venue={selectedVenue} profile={GALLERY_PROFILE_BY_ID.get(selectedVenue.properties.id)} playingTrackId={playingTrackId} onPlayTrack={setPlayingTrackId} onClose={closeVenue} />}
    </main>
  );
};

export default App;
