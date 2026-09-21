import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMuseumVisit } from '../context/useMuseumVisit';
import { MuseumFoyer } from './MuseumFoyer';
import { MemoryStage } from './MemoryStage';
import { MemoryPrologue } from './MemoryPrologue';
import { MemoryPassage } from './MemoryPassage';
import { CHAPTERS, chapterFromHash, chapterProgress, type JourneyChapter, type JourneyProgress } from '../utils/journey';
import { ListeningBooth as Listening } from './ListeningBooth';
import { ClubExhibits as Clubs } from './ClubExhibits';
import { VenueEconomics as Economics } from './VenueEconomics';
const Map = lazy(() => import('./InteractiveDataMap').then(m => ({ default: m.InteractiveDataMap })));
const LABELS = ['The street remembers', 'Before the labels', 'Rooms within rooms', 'The cost of a night', 'A city still sounding'];
export function Journey() {
  const reduced = useReducedMotion();
  const { audioMuted, toggleMuted, visitedVenueIds, completeExhibit, stopAudio, enterSoundScene, leaveSoundScene } = useMuseumVisit();
  const [position, setJourneyProgress] = useState<JourneyProgress>({ chapter: 'prologue', progress: 0, overall: 0 });
  const [indexOpen, setIndexOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [replay, setReplay] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const mapGate = useRef<HTMLElement>(null);
  const initialHash=useRef(location.hash);
  const scrollToChapter = useCallback((chapter: JourneyChapter) => {
    if (chapter === 'map') setMapReady(true);
    setIndexOpen(false);
    history.pushState(null, '', `#${chapter}`);
    document.getElementById(`journey-${chapter}`)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
    document.querySelector<HTMLElement>(`#journey-${chapter} [data-route-heading]`)?.focus({ preventScroll: true });
  }, [reduced]);
  useEffect(() => {
    let frame = 0;
    let ready=false;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let chapter: JourneyChapter = 'prologue';
        let progress = 0;
        CHAPTERS.forEach(id => {
          const el = document.getElementById(`journey-${id}`);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          if (rect.top <= innerHeight * .42) { chapter = id; progress = chapterProgress(rect.top, rect.height, innerHeight); }
        });
        const overall = Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
        setJourneyProgress({ chapter, progress, overall });
        if (ready && location.hash !== '#foyer') history.replaceState(null, '', `#${chapter}`);
      });
    };
    const sync = () => {
      if (location.hash === '#foyer') { setIndexOpen(true); return; }
      const target = chapterFromHash(location.hash);
      if (target === 'map') setMapReady(true);
      document.getElementById(`journey-${target}`)?.scrollIntoView({behavior:'instant'});
    };
    let cancelled=false;
    void document.fonts.ready.then(()=>{if(cancelled)return;history.replaceState(null,'',initialHash.current||'#prologue');sync();ready=true;});
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update);
    addEventListener('popstate', sync); addEventListener('hashchange', sync);
    return () => { cancelled=true;cancelAnimationFrame(frame); removeEventListener('scroll', update); removeEventListener('resize', update); removeEventListener('popstate', sync); removeEventListener('hashchange', sync); };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) setMapReady(true); }, { rootMargin: '700px' });
    if (mapGate.current) observer.observe(mapGate.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (indexOpen) dialog.current?.showModal(); else dialog.current?.close(); }, [indexOpen]);
  useEffect(() => { stopAudio(); }, [position.chapter, stopAudio]);
  useEffect(() => { if(!audioMuted) enterSoundScene(position.chapter);return()=>leaveSoundScene(position.chapter); },[position.chapter,audioMuted,enterSoundScene,leaveSoundScene]);
  const openArchiveIndex = () => setIndexOpen(true);
  return <div className="remembered-journey" data-chapter={position.chapter}>
    <MemoryStage position={position} paused={indexOpen} />
    <nav className="journey-rail" aria-label="Journey navigation">
      <button onClick={openArchiveIndex}>Index</button><span>{LABELS[CHAPTERS.indexOf(position.chapter)]}</span>
      <progress aria-label="Journey progress" max="1" value={position.overall} />
      <button onClick={toggleMuted} aria-pressed={!audioMuted}>{audioMuted ? 'Sound off' : 'Sound on'}</button>
      <small>{String(CHAPTERS.indexOf(position.chapter) + 1).padStart(2, '0')} / 05</small>
    </nav>
    <main>
      <MemoryPrologue onComplete={() => scrollToChapter('listening')} replay={replay} suspended={indexOpen || position.chapter !== 'prologue'} />
      <section id="journey-listening" className="journey-act"><Suspense fallback={<p>Opening the listening room…</p>}><Listening /></Suspense></section>
      <section id="journey-clubs" className="journey-act"><Suspense fallback={<p>Opening the clubs…</p>}><Clubs /></Suspense></section>
      <MemoryPassage kind="receipt" />
      <section id="journey-economics" className="journey-act"><Suspense fallback={<p>Unfolding the ledger…</p>}><Economics /></Suspense></section>
      <MemoryPassage kind="city" />
      <section id="journey-map" ref={mapGate} className="journey-act journey-map"><p className="dawn-question">Which rooms are still being kept open?</p>{mapReady && <Suspense fallback={<p className="map-loading" role="status">The city comes into view…</p>}><Map visitedVenueIds={visitedVenueIds} onEnter={() => completeExhibit('map')} /></Suspense>}<button className="restart-journey" onClick={() => {setReplay(n=>n+1);scrollToChapter('prologue');}}>Return to the room ↑</button></section>
    </main>
    <dialog ref={dialog} className="archive-index" onCancel={() => setIndexOpen(false)} onClose={() => setIndexOpen(false)}>
      <button className="index-close" onClick={() => setIndexOpen(false)} autoFocus>Close index ×</button>
      <MuseumFoyer onEnterRoom={scrollToChapter} /><button className="index-replay" onClick={() => {setReplay(n=>n+1);scrollToChapter('prologue');}}>Return to the room</button>
      <p className="index-art-credit">The street, figures, hands, ticket, and room environments are original illustrative reconstructions, not documentary images. Ambient sound is synthesized for this experience; the wordless visitor is imagined, not an oral-history witness.</p>
    </dialog>
  </div>;
}
