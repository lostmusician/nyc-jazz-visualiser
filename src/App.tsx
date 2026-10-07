import React from 'react';
import { ClubDetail } from './components/ClubDetail';
import { ClubIndex } from './components/ClubIndex';
import { DecadeStory } from './components/DecadeStory';
import { DecadeTimeline } from './components/DecadeTimeline';
import { GalleryIntro } from './components/GalleryIntro';
import { GalleryTour } from './components/GalleryTour';
import { SoundtrackToggle } from './components/SoundtrackToggle';
import { GALLERY_PROFILE_BY_ID, GALLERY_VENUE_IDS } from './data/clubProfiles';
import { DECADE_STORIES } from './data/decadeStories';
import { NYC_JAZZ_VENUES } from './data/venues';
import { filterGalleryVenues, overlapsDecade, SCENES, type Decade } from './gallery/model';
import { InfiniteCanvas } from './infinite-canvas';
import type { ClubMediaItem } from './infinite-canvas/types';
import { useGallerySoundtrack } from './hooks/useGallerySoundtrack';
import type { SceneMovement } from './types';

const CentralMap = React.lazy(() => import('./components/CentralMap').then((module) => ({ default: module.CentralMap })));
const TOUR_STORAGE_KEY = 'nyc-jazz-gallery-tour-v2';

export const App = () => {
  const [entryPhase, setEntryPhase] = React.useState<'intro' | 'transitioning' | 'gallery'>('intro');
  const [decade, setDecade] = React.useState<Decade>(1970);
  const [storyDecade, setStoryDecade] = React.useState<Decade | null>(null);
  const [soundtrackSelection, setSoundtrackSelection] = React.useState<Decade | 'gallery'>('gallery');
  const [activeStoryBeat, setActiveStoryBeat] = React.useState(0);
  const [scene, setScene] = React.useState<SceneMovement | 'all'>('all');
  const [hoveredVenueId, setHoveredVenueId] = React.useState<string | null>(null);
  const [selectedVenueId, setSelectedVenueId] = React.useState<string | null>(null);
  const [browserOpen, setBrowserOpen] = React.useState(false);
  const [tourStep, setTourStep] = React.useState<number | null>(null);
  const [tourRequired, setTourRequired] = React.useState(false);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const transitionTimerRef = React.useRef<number | null>(null);
  const tourTimerRef = React.useRef<number | null>(null);
  const reducedMotion = React.useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const audio = useGallerySoundtrack(soundtrackSelection, setSoundtrackSelection);
  const { status: soundtrackStatus, startIntro, beginHold, abortHold, continueIntoGallery } = audio;

  React.useEffect(() => startIntro(), [startIntro]);

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
  const story = storyDecade === null ? null : DECADE_STORIES[storyDecade];
  const storyBeat = story?.beats[activeStoryBeat] ?? null;

  const selectScene = (nextScene: SceneMovement | 'all') => {
    setScene(nextScene);
    setHoveredVenueId(null);
    if (selectedVenueId) {
      const venue = NYC_JAZZ_VENUES.find((candidate) => candidate.properties.id === selectedVenueId);
      if (venue && nextScene !== 'all' && venue.properties.scene_movement !== nextScene) setSelectedVenueId(null);
    }
  };

  const selectDecade = (nextDecade: Decade) => {
    if (document.activeElement instanceof HTMLElement) returnFocusRef.current = document.activeElement;
    setDecade(nextDecade);
    setStoryDecade(nextDecade);
    setSoundtrackSelection(nextDecade);
    setActiveStoryBeat(0);
    setBrowserOpen(false);
    setHoveredVenueId(null);
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

  React.useEffect(() => () => {
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    if (tourTimerRef.current !== null) window.clearTimeout(tourTimerRef.current);
  }, []);

  const enterGallery = React.useCallback(() => {
    continueIntoGallery();
    setEntryPhase('transitioning');
    transitionTimerRef.current = window.setTimeout(() => setEntryPhase('gallery'), reducedMotion ? 80 : 900);
    tourTimerRef.current = window.setTimeout(() => {
      try {
        if (window.localStorage.getItem(TOUR_STORAGE_KEY) !== 'complete') {
          setTourRequired(true);
          setTourStep(0);
        }
      } catch {
        setTourRequired(true);
        setTourStep(0);
      }
    }, reducedMotion ? 180 : 1250);
  }, [continueIntoGallery, reducedMotion]);

  const finishTour = React.useCallback(() => {
    setTourStep(null);
    if (!tourRequired) return;
    try { window.localStorage.setItem(TOUR_STORAGE_KEY, 'complete'); } catch { /* completion lasts for this visit */ }
    setTourRequired(false);
    setDecade(1920);
    setStoryDecade(1920);
    setSoundtrackSelection(1920);
    setActiveStoryBeat(0);
  }, [tourRequired]);

  const exploreStory = React.useCallback(() => {
    setStoryDecade(null);
    setActiveStoryBeat(0);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-decade="${decade}"]`)?.focus();
    });
  }, [decade]);

  return (
    <div className="experience-shell">
    {entryPhase !== 'intro' && <main className={`gallery-app${entryPhase === 'transitioning' ? ' is-entering' : ''}${story ? ' has-story' : ''}`}>
      <div className="gallery-surface" inert={tourStep !== null && tourRequired ? true : undefined}>
      <a className="skip-link" href="#club-index">Skip to filters and club index</a>
      {!story && <InfiniteCanvas media={media} hoveredVenueId={hoveredVenueId} onHoverVenue={setHoveredVenueId} onSelectVenue={openVenue} entryDepthImpulse={reducedMotion ? 0 : 1.45} />}
      <div className="atmosphere" aria-hidden="true" />
      <React.Suspense fallback={<section className={`central-map${story ? ' central-map--story' : ''} map-loading`} aria-label="Loading the New York jazz-club map">Mapping the night…</section>}>
        <CentralMap
          venues={NYC_JAZZ_VENUES}
          decade={decade}
          scene={story ? 'all' : scene}
          hoveredVenueId={hoveredVenueId}
          selectedVenueId={selectedVenueId}
          mode={story ? 'story' : 'gallery'}
          cameraTarget={storyBeat?.camera}
          highlightedVenueIds={storyBeat?.venueIds}
          interactionEnabled={!story}
          reducedMotion={reducedMotion}
          onHoverVenue={setHoveredVenueId}
          onSelectVenue={openVenue}
        />
      </React.Suspense>
      <DecadeTimeline value={decade} activeBeat={story ? activeStoryBeat : undefined} beatCount={story?.beats.length} onChange={selectDecade} />
      <SoundtrackToggle audio={audio} decade={decade} />
      {!story && <>
      <button className="browser-toggle" type="button" data-ui-layer data-tour="filter" aria-label="Browse and filter clubs" aria-expanded={browserOpen} aria-controls="club-browser" onClick={() => setBrowserOpen((open) => !open)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" /></svg>
        <span>{galleryVenues.length}</span>
      </button>
      <button className="tour-toggle" type="button" data-ui-layer aria-label="Show gallery tour" onClick={() => { setBrowserOpen(false); setTourRequired(false); setTourStep(0); }}>?</button>
      <aside id="club-browser" className={`club-browser${browserOpen ? ' is-open' : ''}`} data-ui-layer aria-hidden={!browserOpen}>
        <div className="browser-heading"><span>Find a room</span><button type="button" aria-label="Close filters" onClick={() => setBrowserOpen(false)}>×</button></div>
        <nav className="scene-nav" aria-label="Scenes and places">
          {SCENES.map((item) => <button key={item.id} type="button" className={scene === item.id ? 'active' : ''} style={{ '--scene-accent': item.accent } as React.CSSProperties} onClick={() => selectScene(item.id)}><i />{item.shortLabel}</button>)}
        </nav>
        <div id="club-index"><ClubIndex venues={galleryVenues} onHover={setHoveredVenueId} onSelect={openVenue} /></div>
      </aside>
      {selectedVenue && <ClubDetail venue={selectedVenue} profile={GALLERY_PROFILE_BY_ID.get(selectedVenue.properties.id)} onClose={closeVenue} />}
      </>}
      {story && (
        <DecadeStory
          story={story}
          activeBeat={activeStoryBeat}
          onActiveBeat={setActiveStoryBeat}
          onExplore={exploreStory}
        />
      )}
      </div>
      {tourStep !== null && <GalleryTour step={tourStep} required={tourRequired} onStep={setTourStep} onFinish={finishTour} />}
    </main>}
    {entryPhase !== 'gallery' && (
      <div className={`intro-layer${entryPhase === 'transitioning' ? ' is-leaving' : ''}`}>
        <GalleryIntro audioStatus={soundtrackStatus} onHoldStart={beginHold} onHoldAbort={abortHold} onEnter={enterGallery} />
      </div>
    )}
    </div>
  );
};

export default App;
