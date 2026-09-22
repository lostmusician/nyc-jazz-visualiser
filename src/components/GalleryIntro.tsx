import React from 'react';
import { getHoldProgress, getHoldReleaseOutcome } from '../gallery/entry-state';

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
  const holdingRef = React.useRef(false);
  const armedRef = React.useRef(false);
  const startedAtRef = React.useRef(0);
  const frameRef = React.useRef<number | null>(null);
  const progressPathRef = React.useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = React.useState(1);

  React.useLayoutEffect(() => {
    setPathLength(progressPathRef.current?.getTotalLength() ?? 1);
  }, []);

  const clearFrame = React.useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const startHold = React.useCallback(() => {
    if (holdingRef.current) return;
    clearFrame();
    holdingRef.current = true;
    armedRef.current = false;
    startedAtRef.current = performance.now();
    setProgress(0);
    onHoldStart();
    const tick = (now: number) => {
      if (!holdingRef.current) return;
      const next = getHoldProgress(now - startedAtRef.current);
      setProgress(next);
      if (next >= 1) armedRef.current = true;
      else frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [clearFrame, onHoldStart]);

  const endHold = React.useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    clearFrame();
    if (armedRef.current || getHoldReleaseOutcome(performance.now() - startedAtRef.current) === 'enter') {
      setProgress(1);
      onEnter();
    } else {
      setProgress(0);
      onHoldAbort();
    }
  }, [clearFrame, onEnter, onHoldAbort]);

  const cancelHold = React.useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    armedRef.current = false;
    clearFrame();
    setProgress(0);
    onHoldAbort();
  }, [clearFrame, onHoldAbort]);

  React.useEffect(() => () => clearFrame(), [clearFrame]);

  return (
    <main className="gallery-intro">
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-ritual">
        <button
          type="button"
          className={`hold-enter${progress > 0 && progress < 1 ? ' is-holding' : ''}${progress >= 1 ? ' is-ready' : ''}`}
          aria-label="Press and hold for four seconds to enter the gallery with audio"
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
              className="hold-progress"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength * (1 - progress)}
              style={{ opacity: progress === 0 ? 0 : 1 }}
              d="M1 44A43 43 0 0 1 44 1H256A43 43 0 0 1 299 44A43 43 0 0 1 256 87H44A43 43 0 0 1 1 44"
            />
          </svg>
          <span>{progress >= 1 ? 'release to enter' : 'press and hold'}</span>
        </button>
        <p>this is an audiovisual tour of the jazz clubs in New York. Turn on your audio as we zoom over the decades and listen to music that helped build New York City.</p>
        <span className="sr-status" role="status" aria-live="polite">
          {audioStatus === 'error' ? 'Audio is unavailable. You can still hold to enter the gallery.' : progress >= 1 ? 'Ready. Release to enter.' : ''}
        </span>
      </div>
    </main>
  );
}
