import React from 'react';

type StepData = {
  id: string;
  target?: string;
  title: string;
  copy: string;
  highlight1920Prompt?: boolean;
  showControlsDiagram?: boolean;
};

const STEPS: StepData[] = [
  {
    id: 'intro',
    target: '[data-tour="controls"]',
    title: 'Move around',
    copy: 'This interactive project documents the living history of New York City\'s jazz ecosystem—from 1920s Harlem speakeasies to modern outer-borough lofts. Explore historical venues in an infinite 3D visual gallery, see where clubs thrived across five boroughs on our city map, and listen to authentic decade soundtracks as rent and cultural geography evolved.\n\nUse your keyboard or mouse to navigate the infinite visual space:',
    showControlsDiagram: true,
  },
  {
    id: 'timeline',
    target: '[data-tour="timeline"]',
    title: 'Follow the city through time',
    copy: 'Traverse the timeline along the top to travel through 11 distinct eras. Each decade unlocks curated historical narratives, archival club photography, and period-specific jazz recordings.',
    highlight1920Prompt: true,
  },
  {
    id: 'filter',
    target: '[data-tour="filter"]',
    title: 'Find a room',
    copy: 'Filter clubs by neighborhood and movement—from Harlem after hours and 52nd Street swing to 1970s loft collectives and Brooklyn\'s modern revival. Open the index anytime to discover venue profiles, archival photos, and curated listening recommendations.',
  },
  {
    id: 'soundtrack',
    target: '[data-tour="soundtrack"]',
    title: 'Control the soundtrack',
    copy: 'Use the record button to spin the music down to mute, or spin it back up to continue listening. Each decade features a signature track calibrated for balanced volume, complete with realistic vinyl spin-down physics.',
  },
  {
    id: 'map',
    target: '[data-tour="map"]',
    title: 'Watch the map',
    copy: 'This is an interactive map to visualise all the jazz clubs in the city. The shading shows rising rent over the years across Manhattan, Brooklyn, Queens, and the Bronx, illustrating the displacement and rebirth of jazz neighborhoods over a century.',
  },
];

export function GalleryTour({ step, required, onStep, onFinish }: {
  step: number;
  required: boolean;
  onStep: (step: number) => void;
  onFinish: () => void;
}) {
  const calloutRef = React.useRef<HTMLElement>(null);
  const actionRef = React.useRef<HTMLButtonElement>(null);
  const [spotlightRect, setSpotlightRect] = React.useState<DOMRect | null>(null);
  const current = STEPS[step] ?? STEPS[0];

  React.useLayoutEffect(() => {
    if (!current.target) {
      setSpotlightRect(null);
      return;
    }
    const targetEl = document.querySelector<HTMLElement>(current.target);
    const update = () => {
      const rect = targetEl?.getBoundingClientRect() ?? null;
      if (rect && rect.width > 0 && rect.height > 0) {
        setSpotlightRect(rect);
      } else {
        setSpotlightRect(null);
      }
    };
    update();
    const observer = targetEl ? new ResizeObserver(update) : null;
    if (targetEl) observer?.observe(targetEl);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [current.target]);

  React.useEffect(() => {
    actionRef.current?.focus();
  }, [step]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !required) onFinish();
      if (event.key !== 'Tab' || !calloutRef.current) return;
      const focusable = [...calloutRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onFinish, required]);

  const last = step === STEPS.length - 1;

  return (
    <div className="gallery-tour gallery-tour--centered" data-ui-layer data-required={required ? 'true' : 'false'}>
      <div className="tour-backdrop" onClick={required ? undefined : onFinish} aria-hidden="true" />
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
        className="tour-callout tour-callout--centered"
        role="dialog"
        aria-modal={required}
        aria-labelledby="tour-title"
      >
        <div className="tour-header">
          <div className="tour-count">{String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</div>
        </div>

        <h2 id="tour-title">{current.title}</h2>

        <div className="tour-body">
          {current.copy.split('\n').map((paragraph, idx) => (
            <p key={idx} className={paragraph.startsWith('•') ? 'tour-bullet' : 'tour-paragraph'}>
              {paragraph}
            </p>
          ))}
        </div>

        {current.showControlsDiagram && (
          <div className="tour-controls-diagram" aria-label="Visual control guide">
            <div className="control-card">
              <span className="control-card-title">Keyboard Navigation</span>
              <div className="control-keys-grid">
                <div className="keys-cluster keys-cluster--wasd">
                  <div className="key-row">
                    <kbd className="key-cap">W</kbd>
                  </div>
                  <div className="key-row">
                    <kbd className="key-cap">A</kbd>
                    <kbd className="key-cap">S</kbd>
                    <kbd className="key-cap">D</kbd>
                  </div>
                  <span className="key-desc">Pan (Up / Left / Down / Right)</span>
                </div>
                <div className="keys-divider" />
                <div className="keys-cluster keys-cluster--eq">
                  <div className="key-row">
                    <kbd className="key-cap key-cap--accent">E</kbd>
                    <kbd className="key-cap key-cap--accent">Q</kbd>
                  </div>
                  <span className="key-desc">Depth (<b>E</b> Forward / <b>Q</b> Back)</span>
                </div>
              </div>
            </div>

            <div className="control-card">
              <span className="control-card-title">Mouse & Touch</span>
              <div className="mouse-gestures-grid">
                <div className="gesture-item">
                  <svg className="gesture-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 2a5 5 0 0 0-5 5v10a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                    <path d="M12 6v4" strokeLinecap="round" />
                    <path d="M9 14l-2 2M15 14l2 2M9 10l-2-2M15 10l2-2" strokeLinecap="round" />
                  </svg>
                  <div>
                    <strong>Click & Drag</strong>
                    <span>Pan across canvas</span>
                  </div>
                </div>
                <div className="gesture-item">
                  <svg className="gesture-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 2a5 5 0 0 0-5 5v10a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                    <path d="M12 6v4" strokeWidth="2.5" stroke="var(--color-accent, #e8c578)" strokeLinecap="round" />
                  </svg>
                  <div>
                    <strong>Mouse Wheel / Pinch</strong>
                    <span>Zoom through depth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {current.highlight1920Prompt && (
          <div className="tour-prompt-box">
            <div className="prompt-badge">Recommended for First-Time Visitors</div>
            <p>
              Start at the <strong>1920s</strong> button on the timeline! Experience how jazz blossomed in Harlem speakeasies during Prohibition, then advance decade by decade through 52nd Street swing, bebop, the loft revolution, and the modern scene.
            </p>
          </div>
        )}

        <div className="tour-actions">
          {!required && (
            <button type="button" className="tour-skip" onClick={onFinish}>
              Close
            </button>
          )}
          <span />
          {step > 0 && (
            <button type="button" onClick={() => onStep(step - 1)}>
              Back
            </button>
          )}
          <button
            ref={actionRef}
            type="button"
            className="tour-btn-primary"
            onClick={() => (last ? onFinish() : onStep(step + 1))}
          >
            {last ? (required ? 'Done' : 'Explore') : 'Next'}
          </button>
        </div>
      </aside>
    </div>
  );
}
