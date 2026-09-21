import React from 'react';
import { ClubDetail } from './components/ClubDetail';
import { ClubIndex } from './components/ClubIndex';
import { DecadeTimeline } from './components/DecadeTimeline';
import { CLUB_PROFILE_BY_ID, FEATURED_VENUE_IDS } from './data/clubProfiles';
import { NYC_JAZZ_VENUES } from './data/venues';
import { filterGalleryVenues, overlapsDecade, SCENES, type Decade } from './gallery/model';
import { InfiniteCanvas } from './infinite-canvas';
import type { ClubMediaItem } from './infinite-canvas/types';
import type { SceneMovement } from './types';

const CentralMap = React.lazy(() => import('./components/CentralMap').then((module) => ({ default: module.CentralMap })));

export const App = () => {
  const [decade, setDecade] = React.useState<Decade>(1970);
  const [scene, setScene] = React.useState<SceneMovement | 'all'>('all');
  const [hoveredVenueId, setHoveredVenueId] = React.useState<string | null>(null);
  const [selectedVenueId, setSelectedVenueId] = React.useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = React.useState<string | null>(null);
  const [textureProgress, setTextureProgress] = React.useState(0);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  const galleryVenues = React.useMemo(
    () => filterGalleryVenues(NYC_JAZZ_VENUES, FEATURED_VENUE_IDS, decade, scene),
    [decade, scene],
  );
  const media = React.useMemo<ClubMediaItem[]>(() => galleryVenues.flatMap((venue) => {
    const profile = CLUB_PROFILE_BY_ID.get(venue.properties.id);
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

  return (
    <main className="gallery-app">
      <a className="skip-link" href="#club-index">Skip to club index</a>
      <InfiniteCanvas media={media} hoveredVenueId={hoveredVenueId} onHoverVenue={setHoveredVenueId} onSelectVenue={openVenue} onTextureProgress={setTextureProgress} />
      <div className="atmosphere" aria-hidden="true" />
      <header className="gallery-header" data-ui-layer>
        <div><p>New York City · 1950–2029</p><h1>Rooms That Held the Night</h1></div>
        <div className="loading-readout" aria-live="polite"><span style={{ width: `${textureProgress}%` }} /> archive {textureProgress}%</div>
      </header>
      <nav className="scene-nav" data-ui-layer aria-label="Jazz scenes">
        {SCENES.map((item) => <button key={item.id} type="button" className={scene === item.id ? 'active' : ''} style={{ '--scene-accent': item.accent } as React.CSSProperties} onClick={() => selectScene(item.id)}><i />{item.shortLabel}</button>)}
      </nav>
      <React.Suspense fallback={<section className="central-map map-loading" aria-label="Loading the New York jazz-club map">Mapping the night…</section>}>
        <CentralMap venues={NYC_JAZZ_VENUES} decade={decade} scene={scene} hoveredVenueId={hoveredVenueId} selectedVenueId={selectedVenueId} onHoverVenue={setHoveredVenueId} onSelectVenue={openVenue} />
      </React.Suspense>
      <div id="club-index"><ClubIndex venues={galleryVenues} onHover={setHoveredVenueId} onSelect={openVenue} /></div>
      <DecadeTimeline value={decade} onChange={selectDecade} />
      {selectedVenue && <ClubDetail venue={selectedVenue} profile={CLUB_PROFILE_BY_ID.get(selectedVenue.properties.id)} playingTrackId={playingTrackId} onPlayTrack={setPlayingTrackId} onClose={closeVenue} />}
    </main>
  );
};

export default App;
