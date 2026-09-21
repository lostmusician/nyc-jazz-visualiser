import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SaxophoneSketch } from './sketches/SaxophoneSketch';
import { PianoSketch } from './sketches/PianoSketch';
import { DrumKitSketch } from './sketches/DrumKitSketch';
import { UprightBassSketch } from './sketches/UprightBassSketch';
import { CLUB_EXHIBITS } from '../data/exhibits';
import { useMuseumVisit } from '../context/useMuseumVisit';

const MIXER_TRACKS = [
  ['bass', '/audio/web/bass.mp3'], ['drums', '/audio/web/drums.mp3'],
  ['piano', '/audio/web/piano.mp3'], ['sax', '/audio/web/sax.mp3'],
] as const;
const SOCIAL_CONDITIONS = [
  ['Space', 'Time', 'Audience'],
  ['Time', 'Audience'],
  ['Space', 'Control'],
  ['Audience', 'Stewardship'],
] as const;

export const ClubExhibits: React.FC = () => {
  const { visitVenue, visitedVenueIds, completeExhibit, claimAudio, activeAudioId, audioMuted, prepareMusic } = useMuseumVisit();
  const [selectedMoment, setSelectedMoment] = useState<Record<string, string>>({});
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set());
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const passageRef=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();
  const [wide,setWide]=useState(()=>matchMedia('(min-width: 1100px) and (min-height: 760px)').matches);
  const [inspecting,setInspecting]=useState(false);
  const {scrollYProgress}=useScroll({target:passageRef,offset:['start start','end end']});
  const x=useTransform(scrollYProgress,[0,1],['0%','-75%']);
  useEffect(()=>{const query=matchMedia('(min-width: 1100px) and (min-height: 760px)');const change=()=>setWide(query.matches);query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
  const horizontal=wide&&!reduced;

  useEffect(() => {
    const elements = CLUB_EXHIBITS.map((club) => document.getElementById(`club-${club.id}`)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
        const venueId = entry.target.getAttribute('data-venue-id');
        if (venueId) visitVenue(venueId);
      });
    }, { threshold: .45 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [visitVenue]);

  useEffect(() => {
    if (CLUB_EXHIBITS.every((club) => visitedVenueIds.includes(club.venueId))) completeExhibit('clubs');
  }, [completeExhibit, visitedVenueIds]);

  useEffect(() => {
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (!audio) return;
      audio.muted = audioMuted;
      if (activeAudioId !== 'club-mixer' || !activeLayers.has(id)) audio.pause();
    });
  }, [activeAudioId, activeLayers, audioMuted]);

  useEffect(() => () => Object.values(audioRefs.current).forEach((audio) => audio?.pause()), []);

  const selectMoment = (clubId: string, momentId: string) => {setInspecting(true);setSelectedMoment((current) => ({ ...current, [clubId]: momentId }));};

  const toggleLayer = async (id: string) => {
    claimAudio('club-mixer');
    const audio = audioRefs.current[id];
    if (!audio) return;
    const next = new Set(activeLayers);
    if (next.has(id)) { next.delete(id); audio.pause(); }
    else {
      const playing=Object.values(audioRefs.current).find(track=>track&&!track.paused);
      audio.currentTime=playing?.currentTime||0;
      next.add(id); audio.loop = true; audio.muted = audioMuted;
      try { if(!audioMuted){await prepareMusic(audio);await audio.play();} } catch { /* Controls remain available if autoplay policy blocks playback. */ }
    }
    setActiveLayers(next);
  };

  return (
    <section id="club-exhibits" className="club-exhibits" aria-labelledby="clubs-title">
      <header className="club-exhibits-intro museum-room">
        <div className="room-number">02 — Gather</div>
        <p>A scene is a relationship, repeated.</p>
        <h2 id="clubs-title" className="font-display" data-route-heading tabIndex={-1}>What makes a room become a scene?</h2>
        <span>Four clubs. Five conditions: space, time, control, audience, and stewardship.</span>
      </header>

      <div ref={passageRef} className={`club-memory-passage ${horizontal?'is-horizontal':''} ${inspecting?'is-inspecting':''}`}>
      <div className="club-memory-sticky"><motion.div className="club-memory-track" style={horizontal?{x}:undefined}>
      {CLUB_EXHIBITS.map((club, index) => {
        const selected = club.moments.find((moment) => moment.id === selectedMoment[club.id]) || club.moments[0];
        return (
          <article id={`club-${club.id}`} data-venue-id={club.venueId} key={club.id} className={`club-scene club-scene-${club.interaction}`} style={{ '--club-accent': club.accent } as React.CSSProperties} onFocusCapture={()=>{if(horizontal && passageRef.current){const el=passageRef.current;const top=scrollY+el.getBoundingClientRect().top;window.scrollTo({top:top+(el.offsetHeight-innerHeight)*index/3,behavior:'instant'});}}}>
            <div className="club-scene-inner">
              <div className="club-image" aria-hidden="true"><img src={club.image} alt="" /><span>{String(index + 1).padStart(2, '0')}</span>
                <div className={`club-artifacts artifacts-${club.interaction}`}>
                  {club.interaction==='jam-table' && club.moments.map((m,i)=><div key={m.id} className={`memory-chair ${selected.id===m.id?'lit':''}`} style={{'--i':i} as React.CSSProperties}><i/><b>{m.label}</b></div>)}
                  {club.interaction==='handbills' && <div className="memory-handbill" key={selected.id}><small>THE FIVE SPOT CAFÉ</small><strong>{selected.title}</strong><em>{selected.label}</em></div>}
                  {club.interaction==='loft-mixer' && <div className="instrument-assembly">{[UprightBassSketch,DrumKitSketch,PianoSketch,SaxophoneSketch].map((Sketch,i)=><div key={i} className={activeLayers.has(MIXER_TRACKS[i][0])?'playing-layer':''}><Sketch animate={false}/></div>)}</div>}
                  {club.interaction==='community-wall' && <div className="community-constellation">{club.moments.map((m,i)=><div key={m.id} className={selected.id===m.id?'lit':''} style={{'--i':i} as React.CSSProperties}><i/><span>{m.title}</span></div>)}</div>}
                </div>
              </div>
              <div className="club-copy">
                <div className="font-typewriter club-room-label">{club.roomLabel}</div>
                <h3 className="font-display">{club.name}</h3>
                <p className="club-meta">{club.years}<br />{club.neighborhood}</p>
                <div className="social-conditions" aria-label="Conditions this venue foregrounds">{SOCIAL_CONDITIONS[index].map(condition=><span key={condition}>{condition}</span>)}</div>
                <p className="club-prompt">{club.prompt}</p>

                <div className={`club-interaction ${club.interaction}`} role="group" aria-label={`${club.name} interactive objects`} onFocus={()=>setInspecting(true)}>
                  {club.moments.map((moment) => (
                    <motion.button
                      type="button" key={moment.id}
                      onClick={() => club.interaction === 'loft-mixer' ? void toggleLayer(moment.id) : selectMoment(club.id, moment.id)}
                      className={(club.interaction === 'loft-mixer' ? activeLayers.has(moment.id) : selected.id === moment.id) ? 'is-selected' : ''}
                      whileTap={{ scale: .97 }}
                      aria-pressed={club.interaction === 'loft-mixer' ? activeLayers.has(moment.id) : selected.id === moment.id}
                    >
                      <span>{club.interaction === 'jam-table' ? '◯' : club.interaction === 'handbills' ? '▤' : club.interaction === 'loft-mixer' ? '◒' : '✦'}</span>
                      <b>{moment.label}</b>
                    </motion.button>
                  ))}
                </div>

                <div className="club-object-label" aria-live="polite">
                  {club.interaction === 'loft-mixer' ? (
                    <><span className="font-typewriter">{activeLayers.size}/4 LAYERS IN THE ROOM</span><strong className="font-display">{activeLayers.size ? 'The loft is sounding.' : 'The floor is waiting.'}</strong><p>{activeLayers.size ? 'No single layer is the room. Add and remove parts to hear how collective space is assembled.' : 'Activate a part. Every instrument is controlled independently.'}</p></>
                  ) : (
                    <><span className="font-typewriter">OBJECT LABEL</span><strong className="font-display">{selected.title}</strong><p>{selected.detail}</p></>
                  )}
                </div>

                <p className="club-wall-label">{club.wallLabel}</p>
                {inspecting && <button className="resume-memory" onClick={()=>setInspecting(false)}>Let the memory move ↗</button>}
                <details className="club-sources"><summary>Sources and curatorial notes</summary>{club.sources.map((source) => <a key={source.label} href={source.url} target={source.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{source.label}</a>)}</details>
              </div>
            </div>
          </article>
        );
      })}
      </motion.div></div></div>

      <div aria-hidden="true">
        {MIXER_TRACKS.map(([id, src]) => <audio key={id} ref={(node) => { audioRefs.current[id] = node; }} src={src} preload="none" playsInline />)}
      </div>
    </section>
  );
};
