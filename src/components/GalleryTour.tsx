import React from 'react';

const STEPS = [
  {
    target: '[data-tour="controls"]',
    title: 'Move around',
    copy: 'Drag to pan. Scroll—or pinch—to move through depth. A keyboard works too: WASD and Q/E.',
    preferred: 'top',
  },
  {
    target: '[data-tour="timeline"]',
    title: 'Move through time',
    copy: 'Pick a decade and the cards, map markers, and rent layer all change with it.',
    preferred: 'top',
  },
  {
    target: '[data-tour="filter"]',
    title: 'Find a room',
    copy: 'Filter by scene, or open the club index when you already know where you want to go.',
    preferred: 'bottom-left',
  },
  {
    target: '[data-tour="map"]',
    title: 'Watch the map',
    copy: 'Hover a card and its club lights up here. Markers also show what was open, closed, or still to come.',
    preferred: 'right',
  },
] as const;

type Placement = { top: number; left: number; target: DOMRect | null };

export function GalleryTour({ step, onStep, onFinish }: {
  step: number;
  onStep: (step: number) => void;
  onFinish: () => void;
}) {
  const calloutRef = React.useRef<HTMLElement>(null);
  const actionRef = React.useRef<HTMLButtonElement>(null);
  const [placement, setPlacement] = React.useState<Placement>({ top: 24, left: 24, target: null });
  const current = STEPS[step];

  React.useLayoutEffect(() => {
    const target = document.querySelector<HTMLElement>(current.target);
    const update = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const width = Math.min(calloutRef.current?.offsetWidth ?? 304, viewportWidth - 24);
      const height = calloutRef.current?.offsetHeight ?? 190;
      const rect = target?.getBoundingClientRect() ?? null;
      if (!rect || rect.width === 0 || rect.height === 0) {
        setPlacement({ top: Math.max(12, (viewportHeight - height) / 2), left: Math.max(12, (viewportWidth - width) / 2), target: null });
        return;
      }
      const gap = 14;
      let top = rect.top - height - gap;
      let left = rect.left + rect.width / 2 - width / 2;
      if (current.preferred === 'bottom-left') {
        top = rect.bottom + gap;
        left = rect.right - width;
      } else if (current.preferred === 'right') {
        top = rect.top + rect.height / 2 - height / 2;
        left = rect.right + gap;
      }
      if (top < 12) top = Math.min(viewportHeight - height - 12, rect.bottom + gap);
      if (top + height > viewportHeight - 12) top = Math.max(12, rect.top - height - gap);
      if (left < 12) left = 12;
      if (left + width > viewportWidth - 12) left = viewportWidth - width - 12;
      setPlacement({ top, left, target: rect });
    };
    update();
    const observer = target ? new ResizeObserver(update) : null;
    if (target) observer?.observe(target);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    actionRef.current?.focus();
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [current]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onFinish();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onFinish]);

  const last = step === STEPS.length - 1;
  return (
    <div className="gallery-tour" data-ui-layer>
      {placement.target && (
        <div
          className="tour-spotlight"
          aria-hidden="true"
          style={{
            top: placement.target.top - 6,
            left: placement.target.left - 6,
            width: placement.target.width + 12,
            height: placement.target.height + 12,
          }}
        />
      )}
      <aside ref={calloutRef} className="tour-callout" role="dialog" aria-modal="false" aria-labelledby="tour-title" style={{ top: placement.top, left: placement.left }}>
        <div className="tour-count">{String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</div>
        <h2 id="tour-title">{current.title}</h2>
        <p>{current.copy}</p>
        <div className="tour-actions">
          <button type="button" className="tour-skip" onClick={onFinish}>Skip</button>
          <span />
          {step > 0 && <button type="button" onClick={() => onStep(step - 1)}>Back</button>}
          <button ref={actionRef} type="button" onClick={() => last ? onFinish() : onStep(step + 1)}>{last ? 'Done' : 'Next'}</button>
        </div>
      </aside>
    </div>
  );
}
