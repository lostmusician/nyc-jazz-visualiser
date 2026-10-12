import React from 'react';

type StepData = {
  id: string;
  target?: string;
  title: string;
  copy: string;
  showControls?: boolean;
};

const STEPS: StepData[] = [
  {
    id: 'intro',
    title: 'Move around',
    copy: "Explore a century of New York jazz through the clubs, stories and sounds that shaped the city. Here’s how to navigate the gallery.",
    showControls: true,
  },
  {
    id: 'filter',
    target: '[data-tour="filter"]',
    title: 'Search for venues',
    copy: "Try the highlighted filter icon at the top right to browse clubs by neighborhood or jazz scene. Select a venue to see its history, photos and listening recommendations.",
  },
  {
    id: 'soundtrack',
    target: '[data-tour="soundtrack"]',
    title: 'Sound controls',
    copy: "Try the highlighted vinyl icon at the top right to mute the music. Select it again to listen. The soundtrack changes with each decade.",
  },
  {
    id: 'map',
    target: '[data-tour="map"]',
    title: 'Read the map',
    copy: "The map at the top left shows where the clubs are. Pan or zoom to explore a neighborhood, and select a club to learn more. Brighter shading shows higher rents in the selected decade.",
  },
  {
    id: 'timeline',
    target: '[data-tour="timeline"]',
    title: 'Choose a decade',
    copy: "Select a year on the timeline at the top to open that decade’s story and music. Scroll through the story, then explore its clubs in the gallery.",
  },
];

export function GalleryTour({ step, required, onStep, onFinish }: {
  step: number;
  required: boolean;
  onStep: (step: number) => void;
  onFinish: (mode?: 'first-time' | 'explore' | 'done') => void;
}) {
  const calloutRef = React.useRef<HTMLElement>(null);
  const actionRef = React.useRef<HTMLButtonElement>(null);
  const [calloutPosition, setCalloutPosition] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const [spotlightRect, setSpotlightRect] = React.useState<DOMRect | null>(null);
  const current = STEPS[step] ?? STEPS[0];

  React.useLayoutEffect(() => {
    if (!current.target) {
      setSpotlightRect(null);
      setCalloutPosition(null);
      return;
    }
    const targetEl = document.querySelector<HTMLElement>(current.target);
    const update = () => {
      const rect = targetEl?.getBoundingClientRect() ?? null;
      if (rect && rect.width > 0 && rect.height > 0) {
        setSpotlightRect(rect);
        const margin = 16;
        const width = Math.min(400, window.innerWidth - margin * 2);
        const besideMap = current.id === 'map' && rect.right + width + margin * 2 <= window.innerWidth;
        const top = besideMap ? Math.max(margin, rect.top) : rect.bottom + margin;
        const left = besideMap ? rect.right + margin : Math.max(margin, Math.min(rect.right - width, window.innerWidth - width - margin));
        setCalloutPosition({ top, left, width });
      } else {
        setSpotlightRect(null);
      }
    };
    update();
    const observer = targetEl ? new ResizeObserver(update) : null;
    if (targetEl) observer?.observe(targetEl);
    observer?.observe(document.documentElement);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [current]);

  // Keep the real control and its preview panel interactive; quiet everything else.
  React.useLayoutEffect(() => {
    const surface = document.querySelector<HTMLElement>('.gallery-surface');
    if (!surface) return;
    const allowedSelector = [current.target, current.id === 'filter' ? '#club-browser, .club-dialog-backdrop' : null].filter(Boolean).join(', ');
    const originals = new Map<HTMLElement, boolean>();
    const update = () => {
      const allowed = allowedSelector ? [...surface.querySelectorAll(allowedSelector)] : [];
      for (const child of surface.children) {
        if (!(child instanceof HTMLElement)) continue;
        if (!originals.has(child)) originals.set(child, child.inert);
        const active = allowed.some((element) => child === element || child.contains(element));
        child.inert = !active;
        child.toggleAttribute('data-tour-active', active);
      }
    };
    surface.dataset.tourPreview = current.id;
    update();
    const observer = new MutationObserver(update);
    observer.observe(surface, { childList: true });
    const sizeObserver = new ResizeObserver(() => {
      surface.style.setProperty('--tour-guide-bottom', `${calloutRef.current?.getBoundingClientRect().bottom ?? 0}px`);
    });
    if (calloutRef.current) sizeObserver.observe(calloutRef.current);
    return () => {
      observer.disconnect();
      sizeObserver.disconnect();
      for (const [element, inert] of originals) {
        element.inert = inert;
        element.removeAttribute('data-tour-active');
      }
      delete surface.dataset.tourPreview;
      surface.style.removeProperty('--tour-guide-bottom');
    };
  }, [current, calloutPosition]);

  React.useEffect(() => {
    actionRef.current?.focus();
  }, [step]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector('.club-dialog-backdrop')) return;
      if (event.key === 'Escape' && document.querySelector('.club-browser.is-open')) return;
      if (event.key === 'Escape' && !required) onFinish('explore');
      if (event.key !== 'Tab' || !calloutRef.current) return;
      const roots = [calloutRef.current, ...document.querySelectorAll<HTMLElement>('.gallery-surface > [data-tour-active]')];
      const focusable = roots.flatMap((root) => [root, ...root.querySelectorAll<HTMLElement>('button, input, a[href], [tabindex]:not([tabindex="-1"])')])
        .filter((element) => element.tabIndex >= 0 && !element.hasAttribute('disabled') && !element.closest('[inert]') && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
      if (!focusable.length) return;
      event.preventDefault();
      const index = focusable.indexOf(document.activeElement as HTMLElement);
      const next = index < 0 ? 0 : (index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      focusable[next].focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onFinish, required, current]);

  const last = step === STEPS.length - 1;

  return (
    <div className={`gallery-tour${current.target ? " gallery-tour--preview" : ""}`} data-ui-layer data-required={required ? 'true' : 'false'}>
      <div className="tour-backdrop" onClick={required ? undefined : () => onFinish('explore')} aria-hidden="true" />
      {spotlightRect && (
        <div
          className="tour-spotlight"
          aria-hidden="true"
          style={{
            top: spotlightRect.top - 6,
            left: spotlightRect.left - 6,
            width: spotlightRect.width + 12,
            height: spotlightRect.height + 12,
          }}
        />
      )}
      <aside
        ref={calloutRef}
        className={`tour-callout${calloutPosition ? ' tour-callout--anchored' : ''}`}
        style={calloutPosition ? { ...calloutPosition, maxHeight: `calc(100dvh - ${calloutPosition.top + 16}px)` } : undefined}
        role="dialog"
        aria-modal={!current.target}
        aria-labelledby="tour-title"
        aria-describedby="tour-description"
      >
        <div className="tour-header">
          <div className="tour-count">Gallery guide · {step + 1} of {STEPS.length}</div>
          {!required && <button type="button" className="tour-close" onClick={() => onFinish('explore')}>Close</button>}
        </div>

        <h2 id="tour-title">{current.title}</h2>

        <div className="tour-body" id="tour-description">
          {current.copy
            .split('\n')
            .map((p) => p.trim())
            .filter(Boolean)
            .map((paragraph, idx) => (
              <p key={idx} className={paragraph.startsWith('•') ? 'tour-bullet' : 'tour-paragraph'}>
                {paragraph}
              </p>
            ))}
        </div>

        {current.showControls && (
          <dl className="tour-controls" aria-label="Gallery controls">
            <div><dt>Move around</dt><dd>Drag with your mouse or finger.</dd></div>
            <div><dt>Move through depth</dt><dd>Scroll with your mouse or pinch on touch.</dd></div>
            <div className="tour-keyboard"><dt>Keyboard</dt><dd><kbd>W A S D</kbd> to pan · <kbd>E</kbd> forward · <kbd>Q</kbd> back</dd></div>
          </dl>
        )}

        {last && required && <p className="tour-start-note">Start with the 1920s story. You can explore the gallery at any point.</p>}

        <div className="tour-actions">
          {step > 0 && <button type="button" className="tour-back" onClick={() => onStep(step - 1)}>Back</button>}
          <button
            ref={actionRef}
            type="button"
            className="tour-btn-primary"
            onClick={() => last ? onFinish(required ? 'first-time' : 'explore') : onStep(step + 1)}
          >
            {last ? (required ? 'Start at the 1920s' : 'Done') : 'Next'}
          </button>
        </div>
      </aside>
    </div>
  );
}
