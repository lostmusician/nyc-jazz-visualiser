import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { NARRATIVE_CHAPTERS } from '../data/chapters';
import { SaxophoneSketch } from './sketches/SaxophoneSketch';
import { PianoSketch } from './sketches/PianoSketch';
import { DrumKitSketch } from './sketches/DrumKitSketch';
import { UprightBassSketch } from './sketches/UprightBassSketch';

const TRACKS = [
  { id: 'ambience', src: '/audio/web/bar-ambience.mp3' },
  { id: 'bass', src: '/audio/web/bass.mp3' },
  { id: 'drums', src: '/audio/web/drums.mp3' },
  { id: 'piano', src: '/audio/web/piano.mp3' },
  { id: 'sax', src: '/audio/web/sax.mp3' },
] as const;

const CHAPTER_IMAGES = [
  ['/images/jazz-club-scenes-1940s-01.jpg', '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(16).jpg'],
  ['/images/jazz-club-scenes-1940s-08.jpg', '/images/jazz-club-scenes-1940s-12.jpg'],
  ['/images/jazz-club-scenes-1940s-03.jpg', '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(29).jpg'],
  ['/images/jazz-club-scenes-1940s-09.jpg', '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(32).jpg'],
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const bell = (progress: number, centre: number, width: number) => clamp(1 - Math.abs(progress - centre) / width);

interface AudioConductorProps {
  progress: MotionValue<number>;
}

const AudioConductor: React.FC<AudioConductorProps> = ({ progress }) => {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainRefs = useRef<Record<string, GainNode>>({});
  const masterGainRef = useRef<GainNode | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const enabledRef = useRef(false);

  const setStemVolumes = (position: number) => {
    const context = audioContextRef.current;
    if (!context) return;
    const levels: Record<string, number> = {
      ambience: 0.24,
      bass: 0.28 + bell(position, 0.18, 0.32) * 0.3 + bell(position, 0.86, 0.25) * 0.14,
      drums: 0.18 + bell(position, 0.22, 0.22) * 0.28 + bell(position, 0.5, 0.18) * 0.18,
      piano: 0.14 + bell(position, 0.18, 0.25) * 0.24 + bell(position, 0.48, 0.2) * 0.16,
      sax: bell(position, 0.12, 0.18) * 0.56 + bell(position, 0.76, 0.2) * 0.36,
    };

    Object.entries(levels).forEach(([id, volume]) => {
      const gain = gainRefs.current[id];
      if (gain) {
        gain.gain.setTargetAtTime(clamp(volume, 0, 0.78), context.currentTime, 0.08);
      }
    });
  };

  useMotionValueEvent(progress, 'change', setStemVolumes);

  const initializeMixer = () => {
    if (audioContextRef.current) return audioContextRef.current;

    const context = new AudioContext();
    const masterCompressor = context.createDynamicsCompressor();
    const masterGain = context.createGain();

    masterCompressor.threshold.value = -10;
    masterCompressor.knee.value = 10;
    masterCompressor.ratio.value = 4;
    masterCompressor.attack.value = 0.005;
    masterCompressor.release.value = 0.22;

    masterGain.gain.value = 0;

    masterCompressor.connect(masterGain).connect(context.destination);
    masterGainRef.current = masterGain;

    TRACKS.forEach(({ id }) => {
      const player = audioRefs.current[id];
      if (!player) return;
      const source = context.createMediaElementSource(player);
      const gain = context.createGain();
      gain.gain.value = 0;
      source.connect(gain).connect(masterCompressor);
      gainRefs.current[id] = gain;
    });

    audioContextRef.current = context;
    return context;
  };

  const startAudio = async () => {
    const players = TRACKS.map(({ id }) => audioRefs.current[id]).filter(Boolean) as HTMLAudioElement[];
    if (!players.length) return;

    const context = initializeMixer();
    if (context.state === 'suspended') {
      try {
        await context.resume();
      } catch {
        setStarted(false);
        return;
      }
    }

    const anchorTime = players[0].currentTime || 0;
    players.forEach((player) => {
      if (Math.abs(player.currentTime - anchorTime) > 0.08) player.currentTime = anchorTime;
    });

    const results = await Promise.allSettled(players.map((player) => player.play()));
    if (!results.some((result) => result.status === 'fulfilled')) {
      setStarted(false);
      return;
    }

    enabledRef.current = true;
    setEnabled(true);
    setStarted(true);
    setStemVolumes(progress.get());

    const masterGain = masterGainRef.current;
    if (masterGain) {
      const now = context.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(1.12, now + (started ? 0.45 : 3.4));
    }
  };

  const stopAudio = () => {
    enabledRef.current = false;
    setEnabled(false);
    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (context && masterGain) {
      masterGain.gain.setTargetAtTime(0, context.currentTime, 0.08);
    }
  };

  useEffect(() => {
    const handleStartEvent = () => void startAudio();
    window.addEventListener('start-immersive-audio', handleStartEvent);
    return () => window.removeEventListener('start-immersive-audio', handleStartEvent);
    // This legacy event bridge intentionally binds once; audio refs provide current state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => {
    void audioContextRef.current?.close();
    audioContextRef.current = null;
  }, []);

  return (
    <>
      {TRACKS.map(({ id, src }) => (
        <audio
          key={id}
          ref={(node) => { audioRefs.current[id] = node; }}
          src={src}
          loop
          preload="none"
          playsInline
        />
      ))}
      <button
        type="button"
        onClick={enabled && started ? stopAudio : startAudio}
        className="listening-sound-control"
        aria-pressed={enabled && started}
        aria-label={enabled && started ? 'Mute audio' : 'Start audio'}
        title={enabled && started ? 'Mute audio' : 'Start audio'}
      >
        <span className={`sound-bars ${enabled && started ? 'is-playing' : 'is-muted'}`} aria-hidden="true">
          <i /><i /><i />
        </span>
      </button>
    </>
  );
};

interface ChapterSceneProps {
  chapter: (typeof NARRATIVE_CHAPTERS)[number];
  index: number;
  progress: MotionValue<number>;
}

const ChapterScene: React.FC<ChapterSceneProps> = ({ chapter, index, progress }) => {
  const isSecond = index === 1;
  const isThird = index === 2;
  const isFourth = index === 3;
  const images = CHAPTER_IMAGES[index] ?? CHAPTER_IMAGES[0];

  const layerOneOffset = useTransform(progress, [0, 1], index % 2 === 0 ? ['0%', '-12%'] : ['0%', '10%']);
  const layerTwoOffset = useTransform(progress, [0, 1], index % 2 === 0 ? ['0%', '8%'] : ['0%', '-8%']);

  return (
    <article className={`listening-scene listening-scene-${index + 1}`} aria-label={`${chapter.decade} narrative`}>
      <span className="scene-era font-display" aria-hidden="true">
        {chapter.decade}
      </span>

      <div className="scene-photographs" aria-hidden="true">
        <motion.div style={{ x: layerOneOffset }} className="scene-photo scene-photo-primary">
          <img src={images[0]} alt="" loading="lazy" />
        </motion.div>
        <motion.div style={{ x: layerTwoOffset }} className="scene-photo scene-photo-secondary">
          <img src={images[1]} alt="" loading="lazy" />
        </motion.div>
      </div>

      <div className="scene-world" aria-hidden="true">
        {index === 0 && (
          <>
            <div className="club-window window-1" />
            <div className="club-window window-2" />
            <div className="club-window window-3" />
            <span className="venue-fragment venue-1">COOPER SQ · FIVE SPOT</span>
            <span className="venue-fragment venue-2">7TH AVE · VILLAGE VANGUARD</span>
          </>
        )}
        {isSecond && (
          <>
            <div className="loft-beam beam-1" />
            <div className="loft-beam beam-2" />
            <div className="loft-cable" />
            <div className="rent-receipt">
              <span>SAM RIVERS · STUDIO RIVBEA</span>
              <br />
              <span>BOND ST · <b>$150/MO</b></span>
            </div>
          </>
        )}
        {isThird && (
          <>
            <div className="pressure-block block-1" />
            <div className="pressure-block block-2" />
            <div className="pressure-block block-3" />
            <span className="lease-figure lease-1">TONIC · EXP. 2007</span>
            <span className="lease-figure lease-2">TRIPLE NET LEASE +340%</span>
          </>
        )}
        {isFourth && (
          <>
            <div className="river-line" />
            <span className="borough-label manhattan-label">LOCAL PRODUCTION</span>
            <span className="borough-label brooklyn-label">GLOBAL CULTURAL MARKET</span>
            <div className="new-light light-1" />
            <div className="new-light light-2" />
            <div className="new-light light-3" />
          </>
        )}
      </div>

      <div className="scene-instrument" aria-hidden="true">
        {index === 0 && <SaxophoneSketch className="h-full w-full" />}
        {isSecond && <PianoSketch className="h-full w-full" />}
        {isThird && <DrumKitSketch className="h-full w-full" />}
        {isFourth && <UprightBassSketch className="h-full w-full" />}
      </div>

      <div className="scene-copy">
        <div className="scene-index font-typewriter">
          Chapter {chapter.indexNumber} · {chapter.decade}
        </div>
        <h2 className="font-display">{chapter.title}</h2>
        <p className="scene-subtitle font-serif">{chapter.subtitle}</p>
        <p className="scene-narrative font-sans">{chapter.narrative_body[0]}</p>

        {chapter.framework && (
          <div className="scene-framework">
            <span className="font-typewriter">{chapter.framework.scholar}</span>
            <strong className="font-serif">{chapter.framework.concept}</strong>
          </div>
        )}
      </div>
    </article>
  );
};

export const HorizontalTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0vw', '-400vw']);
  const progressPercent = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={containerRef}
      className="listening-passage relative h-[480vh] bg-[#0c0a09]"
      aria-label="Chronological listening journey"
    >
      <AudioConductor progress={scrollYProgress} />

      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="listening-grain" aria-hidden="true" />
        <div className="listening-vignette" aria-hidden="true" />

        <div className="dust-field" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 17) % 96}%`,
                top: `${(i * 23) % 92}%`,
                animationDelay: `${(i * 0.6) % 6}s`,
                animationDuration: `${8 + (i % 5)}s`,
              }}
            />
          ))}
        </div>

        <motion.div style={{ x }} className="flex h-full w-[500vw]">
          {NARRATIVE_CHAPTERS.map((chapter, index) => (
            <ChapterScene
              key={chapter.id}
              chapter={chapter}
              index={index}
              progress={scrollYProgress}
            />
          ))}

          {/* Transition into Map Section */}
          <div className="evidence-handoff listening-scene listening-scene-5 relative">
            <div className="evidence-river" aria-hidden="true" />
            <div className="evidence-copy">
              <span className="font-typewriter">From atmosphere to argument</span>
              <h2 className="font-display">Four mechanisms shaped this change.</h2>
              <p>
                Before the map, isolate the links between affordable space, cultural value, reinvestment and institutionalisation.
              </p>
              <div className="evidence-enter">
                <span>Continue into the listening notes</span>
                <b aria-hidden="true">↓</b>
              </div>
            </div>
            <div className="evidence-coordinates font-typewriter" aria-hidden="true">
              40.7128° N, 74.0060° W<br />
              IPUMS NHGIS TRACT SURVEY
            </div>
          </div>
        </motion.div>

        <div className="listening-progress font-typewriter" aria-hidden="true">
          <span>Local ecology</span>
          <div>
            <motion.i style={{ scaleX: progressPercent }} />
          </div>
          <span>Global commodity</span>
        </div>
      </div>
    </section>
  );
};
