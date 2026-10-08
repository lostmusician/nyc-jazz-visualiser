import React from 'react';
import {
  getHoldProgress,
  getHoldReleaseOutcome,
  HOLD_READY_PROGRESS,
  getVisualHoldProgress,
} from '../gallery/entry-state';

export function GalleryIntro({
  audioStatus,
  onHoldStart,
  onHoldAbort,
  onEnter,
}: {
  audioStatus: 'idle' | 'loading' | 'playing' | 'dropping' | 'paused' | 'error';
  onHoldStart: () => void;
  onHoldAbort: () => void;
  onEnter: () => void;
}) {
  const [progress, setProgress] = React.useState(0);
  const [isHolding, setIsHolding] = React.useState(false);
  const progressRef = React.useRef(0);
  const holdingRef = React.useRef(false);
  const armedRef = React.useRef(false);
  const startedAtRef = React.useRef(0);
  const frameRef = React.useRef<number | null>(null);
  const progressPathRef = React.useRef<SVGPathElement>(null);
  const clickAudioRef = React.useRef<HTMLAudioElement>(null);
  const clickAudioPoolRef = React.useRef<HTMLAudioElement[]>([]);
  const clickAudioIndexRef = React.useRef(0);
  const [pathLength, setPathLength] = React.useState(694.18);

  React.useLayoutEffect(() => {
    const measured = progressPathRef.current?.getTotalLength();
    if (measured && measured > 0) setPathLength(measured);
  }, []);

  React.useEffect(() => {
    const seed = clickAudioRef.current;
    if (!seed) return;
    const pool = [seed, ...Array.from({ length: 5 }, () => {
      const audio = new Audio('/audio/spacebar-click.mp3');
      audio.preload = 'auto';
      audio.load();
      return audio;
    })];
    clickAudioPoolRef.current = pool;
    return () => {
      pool.forEach((audio, index) => {
        audio.pause();
        if (index > 0) {
          audio.removeAttribute('src');
          audio.load();
        }
      });
      clickAudioPoolRef.current = [];
    };
  }, []);

  const clearFrame = React.useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const startHold = React.useCallback(() => {
    if (holdingRef.current) return;
    clearFrame();
    holdingRef.current = true;
    setIsHolding(true);
    armedRef.current = false;
    startedAtRef.current = performance.now();
    progressRef.current = 0;
    setProgress(0);
    const pool = clickAudioPoolRef.current;
    const clickAudio = pool.length
      ? pool[clickAudioIndexRef.current++ % pool.length]
      : clickAudioRef.current;
    if (clickAudio) {
      clickAudio.pause();
      clickAudio.currentTime = 0;
      void clickAudio.play().catch(() => undefined);
    }
    onHoldStart();
    const tick = (now: number) => {
      if (!holdingRef.current) return;
      const elapsed = now - startedAtRef.current;
      const next = getHoldProgress(elapsed);
      progressRef.current = next;
      setProgress(next);
      if (getHoldReleaseOutcome(elapsed) === 'enter' || next >= HOLD_READY_PROGRESS) armedRef.current = true;
      if (next < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [clearFrame, onHoldStart]);

  const endHold = React.useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    setIsHolding(false);
    clearFrame();
    const elapsed = performance.now() - startedAtRef.current;
    const currentProgress = progressRef.current;
    if (armedRef.current || getHoldReleaseOutcome(elapsed) === 'enter' || currentProgress >= HOLD_READY_PROGRESS) {
      progressRef.current = 1;
      setProgress(1);
      onEnter();
    } else {
      onHoldAbort();
      const fromProgress = currentProgress;
      if (fromProgress <= 0) {
        progressRef.current = 0;
        setProgress(0);
        return;
      }
      const retractStart = performance.now();
      const retractDuration = Math.max(160, 400 * fromProgress);
      const tickRetract = (now: number) => {
        if (holdingRef.current) return;
        const t = Math.min((now - retractStart) / retractDuration, 1);
        const eased = 1 - t * t * (3 - 2 * t);
        const current = Math.max(0, fromProgress * eased);
        progressRef.current = current;
        setProgress(current);
        if (t < 1 && !holdingRef.current) {
          frameRef.current = requestAnimationFrame(tickRetract);
        } else if (!holdingRef.current) {
          progressRef.current = 0;
          setProgress(0);
          frameRef.current = null;
        }
      };
      frameRef.current = requestAnimationFrame(tickRetract);
    }
  }, [clearFrame, onEnter, onHoldAbort]);

  const cancelHold = React.useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    setIsHolding(false);
    clearFrame();
    armedRef.current = false;
    onHoldAbort();
    const fromProgress = progressRef.current;
    if (fromProgress <= 0) {
      progressRef.current = 0;
      setProgress(0);
      return;
    }
    const retractStart = performance.now();
    const retractDuration = Math.max(160, 400 * fromProgress);
    const tickRetract = (now: number) => {
      if (holdingRef.current) return;
      const t = Math.min((now - retractStart) / retractDuration, 1);
      const eased = 1 - t * t * (3 - 2 * t);
      const current = Math.max(0, fromProgress * eased);
      progressRef.current = current;
      setProgress(current);
      if (t < 1 && !holdingRef.current) {
        frameRef.current = requestAnimationFrame(tickRetract);
      } else if (!holdingRef.current) {
        progressRef.current = 0;
        setProgress(0);
        frameRef.current = null;
      }
    };
    frameRef.current = requestAnimationFrame(tickRetract);
  }, [clearFrame, onHoldAbort]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      event.preventDefault();
      if (!event.repeat) startHold();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      event.preventDefault();
      endHold();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', cancelHold);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', cancelHold);
    };
  }, [cancelHold, endHold, startHold]);

  React.useEffect(() => () => clearFrame(), [clearFrame]);

  const visualProgress = getVisualHoldProgress(progress);
  const isReady = visualProgress >= 1;

  return (
    <main className="gallery-intro">
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-ritual">
        <div className="launch-prompt">
          <span>Hold</span>
          <button
            type="button"
            className={`hold-enter${isHolding ? ' is-holding' : ''}${isReady ? ' is-ready' : ''}`}
            aria-label="Press and hold to enter the gallery with audio"
            aria-pressed={isHolding}
            data-hold-progress={progress.toFixed(4)}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              startHold();
            }}
            onPointerUp={endHold}
            onPointerCancel={cancelHold}
            onKeyDown={(event) => {
              if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
                event.preventDefault();
                startHold();
              }
            }}
            onKeyUp={(event) => {
              if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                endHold();
              }
            }}
          >
            <svg viewBox="0 0 300 88" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="hold-stroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#ff742f" />
                  <stop offset=".48" stopColor="#813d78" />
                  <stop offset="1" stopColor="#ff7a2f" />
                </linearGradient>
              </defs>
              <path className="hold-track" d="M1 44A43 43 0 0 1 44 1H256A43 43 0 0 1 299 44A43 43 0 0 1 256 87H44A43 43 0 0 1 1 44" />
              <path
                ref={progressPathRef}
                pathLength={pathLength}
                className="hold-progress"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength * (1 - visualProgress)}
                style={{ opacity: visualProgress <= 0.005 ? 0 : 1 }}
                d="M1 44A43 43 0 0 1 44 1H256A43 43 0 0 1 299 44A43 43 0 0 1 256 87H44A43 43 0 0 1 1 44"
              />
            </svg>
            <span>{isReady ? 'Release' : 'Spacebar'}</span>
          </button>
          <span>to launch gallery</span>
        </div>
        <audio ref={clickAudioRef} src="/audio/spacebar-click.mp3" preload="auto" aria-hidden="true" />
        <p>this is an audiovisual tour of the jazz clubs in New York. Turn on your audio as we zoom over the decades and listen to music that helped build New York City.</p>
        <span className="sr-status" role="status" aria-live="polite">
          {audioStatus === 'error' ? 'Audio is unavailable. You can still hold to enter the gallery.' : isReady ? 'Ready. Release to enter.' : ''}
        </span>
      </div>
    </main>
  );
}
