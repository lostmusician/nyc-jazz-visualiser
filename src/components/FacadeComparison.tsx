import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import type { FacadeComparison as FacadeComparisonData } from '../types';
import { clampFacadeReveal } from '../utils/addressJourney';
import { WindowMotif } from './WindowMotif';

export function FacadeComparison({ comparison }: { comparison: FacadeComparisonData }) {
  const [position, setPosition] = useState(comparison.initialPosition);
  const [failed, setFailed] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const updateFromPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(clampFacadeReveal(((event.clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    updateFromPointer(event);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next: number | null = null;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = position - 2;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = position + 2;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 100;
    if (next === null) return;
    event.preventDefault();
    setPosition(clampFacadeReveal(next));
  };

  if (failed) {
    return (
      <div className="facade-fallback" role="group" aria-label="Historic and present views of 77 Greene Street">
        {[comparison.historic, comparison.present].map((variant, index) => (
          <figure key={variant.src}>
            <picture><source media="(max-width: 720px)" srcSet={variant.mobileSrc} /><img src={variant.src} alt={variant.alt} /></picture>
            <figcaption>{index === 0 ? 'c. 1940' : '2021'}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div ref={frameRef} className="facade-comparison" style={{ '--reveal-position': `${position}%` } as React.CSSProperties}>
      <picture className="facade-layer facade-historic">
        <source media="(max-width: 720px)" srcSet={comparison.historic.mobileSrc} />
        <img src={comparison.historic.src} alt={comparison.historic.alt} loading="lazy" onError={() => setFailed(true)} />
      </picture>
      <picture className="facade-layer facade-current">
        <source media="(max-width: 720px)" srcSet={comparison.present.mobileSrc} />
        <img src={comparison.present.src} alt={comparison.present.alt} loading="lazy" onError={() => setFailed(true)} />
      </picture>
      <WindowMotif section="present" tone="dark" opacity={0.24} />
      <span className="facade-era facade-era-historic">c. 1940</span>
      <span className="facade-era facade-era-current">2021</span>
      <button
        type="button"
        className="facade-seam"
        style={{ left: `${position}%` }}
        role="slider"
        aria-label="Compare the historic and present façade"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)} percent historic, ${Math.round(100 - position)} percent present`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      >
        <span aria-hidden="true">‹&nbsp;&nbsp;›</span>
      </button>
      <p className="facade-instruction">Drag the seam · use arrow keys</p>
    </div>
  );
}
