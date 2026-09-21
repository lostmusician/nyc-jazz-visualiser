import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import {
  GREENE_ARCHIVAL_ASSETS,
  GREENE_ARCHIVE_HOTSPOTS,
  GREENE_FACADE_COMPARISON,
  GREENE_SOURCES,
  GREENE_VENUE_RELATIONSHIPS,
} from '../data/greeneStreet';
import type { ArchivalAsset, NightAllocation, NightAllocationCategory } from '../types';
import { addressBeatFromHash } from '../utils/addressJourney';
import { calculateNightOutcome, moveNightStub, NIGHT_MINIMUMS } from '../utils/nightAllocation';
import { FacadeComparison } from './FacadeComparison';
import { WindowMotif } from './WindowMotif';

const InteractiveDataMap = lazy(() => import('./InteractiveDataMap').then((module) => ({ default: module.InteractiveDataMap })));

const CATEGORIES: Array<{ id: NightAllocationCategory; label: string; short: string }> = [
  { id: 'property', label: 'Property and rent', short: 'Property' },
  { id: 'artists', label: 'Artists', short: 'Artists' },
  { id: 'room', label: 'Room and workers', short: 'Room' },
  { id: 'future', label: 'The next experimental night', short: 'Next night' },
];

const INITIAL_ALLOCATION: NightAllocation = { property: 2, artists: 4, room: 2, future: 2 };
const LOFT_NETWORK_IDS = ['0011', '0012', '0013', '0014', '0015'];

function asset(id: string): ArchivalAsset {
  const item = GREENE_ARCHIVAL_ASSETS.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown archival asset: ${id}`);
  return item;
}

function ArchiveImage({ item, eager = false, className = '' }: { item: ArchivalAsset; eager?: boolean; className?: string }) {
  return (
    <picture className={className}>
      <source media="(max-width: 720px)" srcSet={item.mobileSrc} />
      <img
        src={item.src}
        alt={item.alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        style={{ objectPosition: `${item.focalPoint.x}% ${item.focalPoint.y}%` }}
      />
    </picture>
  );
}

export function AddressJourney() {
  const [allocation, setAllocation] = useState<NightAllocation>(INITIAL_ALLOCATION);
  const [selectedStub, setSelectedStub] = useState<NightAllocationCategory | null>(null);
  const [draggedStub, setDraggedStub] = useState<NightAllocationCategory | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [roomLight, setRoomLight] = useState({ x: 68, y: 48, active: false });
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [mapReady, setMapReady] = useState(() => addressBeatFromHash(window.location.hash) === 'city');
  const [progress, setProgress] = useState(0);
  const mapApproachRef = useRef<HTMLDivElement>(null);
  const initialHashSettledRef = useRef(false);
  const sourcesButtonRef = useRef<HTMLButtonElement>(null);
  const sourcesCloseRef = useRef<HTMLButtonElement>(null);
  const outcome = useMemo(() => calculateNightOutcome(allocation), [allocation]);

  const moveStub = (from: NightAllocationCategory, to: NightAllocationCategory) => {
    setAllocation((current) => moveNightStub(current, from, to));
    setSelectedStub(null);
    setDraggedStub(null);
  };

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      if (!initialHashSettledRef.current) return;
      const marker = window.innerHeight * 0.45;
      const current = Array.from(document.querySelectorAll<HTMLElement>('[data-address-beat]'))
        .find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= marker && rect.bottom > marker;
        });
      if (!current) return;
      const hash = current.id === 'city' ? '#map' : `#${current.id}`;
      if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!sourcesOpen) return;
    sourcesCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setSourcesOpen(false);
      sourcesButtonRef.current?.focus();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [sourcesOpen]);

  useEffect(() => {
    const node = mapApproachRef.current;
    if (!node || mapReady) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setMapReady(true);
    }, { rootMargin: '900px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [mapReady]);

  useEffect(() => {
    const scrollToHash = () => {
      initialHashSettledRef.current = false;
      const targetId = addressBeatFromHash(window.location.hash);
      if (targetId === 'city') setMapReady(true);
      requestAnimationFrame(() => {
        const root = document.documentElement;
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
        requestAnimationFrame(() => {
          root.style.scrollBehavior = previousBehavior;
          initialHashSettledRef.current = true;
          const hash = targetId === 'city' ? '#map' : `#${targetId}`;
          if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
        });
      });
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <main className="address-journey">
      <a className="address-skip-link" href="#address">Skip to story</a>
      <nav className="address-nav" aria-label="Story navigation">
        <a href="#address" className="address-nav-title"><span>Fifths &amp; Sevenths</span><b>Priced to the Nines</b></a>
        <div className="address-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
        <button ref={sourcesButtonRef} type="button" onClick={() => setSourcesOpen(true)}>Sources</button>
        <a href="#map" onClick={() => setMapReady(true)}>Skip to map</a>
      </nav>

      <section id="address" data-address-beat className="address-beat address-opening" aria-labelledby="address-title">
        <ArchiveImage item={asset('greene-tax-1940')} eager className="address-opening-image" />
        <div className="address-scrim" />
        <WindowMotif section="address" tone="dark" opacity={0.12} />
        <div className="address-opening-copy">
          <p>New York City</p>
          <h1 id="address-title"><span>77</span> Greene Street</h1>
          <ol className="address-timeline" aria-label="Address timeline">
            <li><b>1877</b><span>the building</span></li>
            <li><b>1973</b><span>the loft opens</span></li>
            <li><b>1979</b><span>Ali’s Alley closes</span></li>
            <li><b>Now</b><span>the same windows</span></li>
          </ol>
        </div>
        <a className="address-scroll-cue" href="#room">Enter the address <span>↓</span></a>
      </section>

      <section id="room" data-address-beat className="address-beat room-made" aria-labelledby="room-title">
        <div
          className={`room-made-sticky ${roomLight.active || activeHotspot ? 'has-room-light' : ''}`}
          style={{ '--light-x': `${roomLight.x}%`, '--light-y': `${roomLight.y}%` } as CSSProperties}
          onPointerMove={(event) => {
            if (event.pointerType === 'touch') return;
            const rect = event.currentTarget.getBoundingClientRect();
            setRoomLight({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100, active: true });
          }}
          onPointerLeave={() => setRoomLight((current) => ({ ...current, active: false }))}
        >
          <ArchiveImage item={asset('alis-alley-cyrille')} className="room-performance" />
          <div className="room-shadow" />
          <div className="room-archive-light" aria-hidden="true" />
          <WindowMotif section="room" tone="dark" opacity={0.12} />
          <div className="room-copy">
            <p className="eyebrow">1973–1979 · Studio 77 / Ali’s Alley</p>
            <h2 id="room-title">The room<br />is made.</h2>
            <div className="room-lines">
              <p>In 1973, Rashied Ali opened his home to the music commercial clubs would not hold.</p>
              <p>The loft became a stage, kitchen, meeting place, and the base of Survival Records.</p>
            </div>
          </div>
          <figure className="room-poster">
            <ArchiveImage item={asset('rashied-ali-poster')} />
            <figcaption>Ali’s Alley · 1978</figcaption>
          </figure>
          <div className="room-hotspots" aria-label="Archival traces in the room">
            {GREENE_ARCHIVE_HOTSPOTS.map((hotspot, index) => (
              <button
                key={hotspot.id}
                type="button"
                className={`room-object ${activeHotspot === hotspot.id ? 'is-active' : ''}`}
                style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}
                onFocus={() => { setActiveHotspot(hotspot.id); setRoomLight({ ...hotspot.lightPosition, active: true }); }}
                onBlur={() => { setActiveHotspot(null); setRoomLight((current) => ({ ...current, active: false })); }}
                onClick={() => { const next = activeHotspot === hotspot.id ? null : hotspot.id; setActiveHotspot(next); setRoomLight({ ...hotspot.lightPosition, active: Boolean(next) }); }}
                aria-pressed={activeHotspot === hotspot.id}
              >
                <span>0{index + 1}</span><b>{hotspot.label}</b><small>{hotspot.date}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="allocation" data-address-beat className="address-beat allocation-section" aria-labelledby="allocation-title">
        <header className="allocation-heading">
          <p className="eyebrow">An illustrative sold-out night</p>
          <h2 id="allocation-title">Ten shares.<br />Who keeps the room open?</h2>
          <p>Each stub is 10% of the door. The building and essential operations claim their minimums first.</p>
        </header>

        <div className="allocation-board">
          <div className="allocation-stage" aria-hidden="true" style={{
            '--artist-light': `${Math.min(1, allocation.artists / 4)}`,
            '--room-light': `${Math.min(1, allocation.room / 4)}`,
            '--future-light': `${Math.min(1, allocation.future / 3)}`,
            '--property-pressure': `${Math.min(1, allocation.property / 5)}`,
          } as CSSProperties}>
            <WindowMotif section="allocation" tone="dark" opacity={0.16} />
            <div className="stage-doorway" />
            <div className="stage-date">{allocation.future >= 2 ? 'NEXT DATE / HELD' : 'NEXT DATE / —'}</div>
            <div className="stage-beam" />
            <div className="stage-player">●</div>
            <div className="stage-chairs">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
            <div className="stage-workers">ROOM / {allocation.room >= 3 ? 'FULL CREW' : 'ESSENTIAL CREW'}</div>
          </div>

          <div className="allocation-ledger" aria-label="Allocate ten ticket stubs">
            {CATEGORIES.map((category, categoryIndex) => (
              <div
                className={`allocation-row allocation-${category.id}`}
                key={category.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => draggedStub && moveStub(draggedStub, category.id)}
              >
                <div className="allocation-row-label">
                  <span>0{categoryIndex + 1}</span>
                  <h3>{category.label}</h3>
                  <b>{allocation[category.id] * 10}%</b>
                </div>
                <div className="ticket-stubs">
                  {Array.from({ length: allocation[category.id] }, (_, index) => {
                    const locked = index < NIGHT_MINIMUMS[category.id];
                    return (
                      <motion.button
                        type="button"
                        key={`${category.id}-${index}`}
                        layout
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className={`ticket-stub ${locked ? 'is-claimed' : ''} ${selectedStub === category.id && !locked ? 'is-selected' : ''}`}
                        draggable={!locked}
                        onDragStart={() => setDraggedStub(category.id)}
                        onClick={() => !locked && setSelectedStub(selectedStub === category.id ? null : category.id)}
                        onKeyDown={(event) => {
                          if (locked || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
                          event.preventDefault();
                          const direction = event.key === 'ArrowRight' ? 1 : -1;
                          const next = CATEGORIES[(categoryIndex + direction + CATEGORIES.length) % CATEGORIES.length].id;
                          moveStub(category.id, next);
                        }}
                        aria-label={`${locked ? 'Claimed' : 'Movable'} 10% ticket stub for ${category.label}. ${locked ? 'Minimum allocation.' : 'Use left and right arrows to move it.'}`}
                      ><span>77</span><small>10%</small></motion.button>
                    );
                  })}
                  {selectedStub && selectedStub !== category.id && (
                    <button type="button" className="place-stub" onClick={() => moveStub(selectedStub, category.id)}>
                      Move 10% here
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="missing-stub" aria-hidden="true"><span>11</span><small>the share that is not there</small></div>
            <p className="sr-only">Eleven target shares compete for ten available ticket stubs, so every priority cannot be fully protected.</p>
            <p className="allocation-help">Drag a movable stub, tap it then choose a destination, or use ← and →.</p>
          </div>
        </div>
        <p className="allocation-outcome" role="status">{outcome.resultSentence}</p>
      </section>

      <section id="present" data-address-beat className="address-beat present-section" aria-labelledby="present-title">
        <div className="present-sticky">
          <FacadeComparison comparison={GREENE_FACADE_COMPARISON} />
          <div className="present-copy">
            <p className="eyebrow">The same windows · 2021</p>
            <h2 id="present-title">The address survived.<br /><em>What it could afford to hold changed.</em></h2>
            <div className="present-facts" aria-label="Present-day building facts">
              <span>High-end retail below</span>
              <span>Four renovated lofts above</span>
            </div>
          </div>
        </div>
      </section>

      <div ref={mapApproachRef} className="map-approach" aria-hidden="true"><span>77 Greene Street</span><WindowMotif section="city" tone="map" opacity={0.62} /></div>
      <section id="city" data-address-beat className="address-beat city-section" aria-labelledby="city-title">
        <header className="city-intro">
          <p className="eyebrow">From one address to the city</p>
          <h2 id="city-title">The room was not alone.</h2>
          <p>Begin with the downtown lofts. Then open the archive.</p>
        </header>
        {mapReady ? (
          <Suspense fallback={<div className="map-loading" role="status">Opening the city archive…</div>}>
            <InteractiveDataMap visitedVenueIds={LOFT_NETWORK_IDS} initialScene="loft_jazz" initialYear={1976} focusGreeneStreet relationships={GREENE_VENUE_RELATIONSHIPS} />
          </Suspense>
        ) : <div className="map-loading" role="status">The city archive will load as you approach.</div>}
        <p className="city-question">How many other rooms changed with the city?</p>
      </section>

      {sourcesOpen && (
        <div className="sources-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSourcesOpen(false)}>
          <section className="sources-drawer" role="dialog" aria-modal="true" aria-labelledby="sources-title">
            <button ref={sourcesCloseRef} type="button" className="sources-close" onClick={() => { setSourcesOpen(false); sourcesButtonRef.current?.focus(); }} aria-label="Close sources">×</button>
            <p className="eyebrow">Archive drawer</p>
            <h2 id="sources-title">Sources &amp; method</h2>
            <p>The ten-stub model is illustrative, not a reconstruction of Ali’s Alley bookkeeping. Property and essential room operations each claim a two-stub minimum. Targets are three stubs each for property reserve, artists, and room/workers, and two for another experimental night. Eleven target stubs are competing for ten.</p>
            <div className="source-contact-sheet">
              {GREENE_ARCHIVAL_ASSETS.map((item) => (
                <a key={item.id} href={item.sourceUrl} target="_blank" rel="noreferrer" className="source-object">
                  <ArchiveImage item={item} />
                  <span>{item.role.replace(/-/g, ' ')}</span>
                  <b>{item.date}</b>
                  <small>{item.creator}</small>
                </a>
              ))}
            </div>
            <p className="facade-method-note">{GREENE_FACADE_COMPARISON.alignmentNote}</p>
            <div className="source-index">{GREENE_SOURCES.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.kind}</span>{source.label} ↗</a>)}</div>
            <div className="relationship-sources">
              <p className="eyebrow">Documented connections</p>
              {GREENE_VENUE_RELATIONSHIPS.map((relationship) => <p key={relationship.id}><b>{relationship.label}</b>{relationship.evidenceNote}<a href={relationship.source.url} target="_blank" rel="noreferrer">{relationship.source.locator} ↗</a></p>)}
            </div>
            <div className="source-credits">{GREENE_ARCHIVAL_ASSETS.map((item) => <p key={item.id}><b>{item.date}</b> {item.credit} {item.rightsNote}</p>)}</div>
          </section>
        </div>
      )}
    </main>
  );
}
