import { DECADES, type Decade } from '../gallery/model';

const PHASES = [
  { label: 'Prewar metropolis', decades: 1 },
  { label: 'Depression & mobilization', decades: 1 },
  { label: 'Wartime transformation', decades: 1 },
  { label: 'Postwar city', decades: 2 },
  { label: 'Artist-run alternatives', decades: 1 },
  { label: 'Redevelopment & rising costs', decades: 3 },
  { label: 'Contemporary decentralization', decades: 2 },
] as const;

export function DecadeTimeline({ value, activeBeat, beatCount = 4, onChange }: {
  value: Decade;
  activeBeat?: number;
  beatCount?: number;
  onChange: (decade: Decade) => void;
}) {
  const index = DECADES.indexOf(value);
  return (
    <nav className="decade-timeline" data-ui-layer data-tour="timeline" aria-label="Jazz history timeline">
      <div className="timeline-phases" aria-hidden="true">
        {PHASES.map((phase) => <span key={phase.label} style={{ flex: phase.decades }}>{phase.label}</span>)}
      </div>
      <input
        aria-label="Jazz-club decade"
        type="range"
        min="0"
        max={DECADES.length - 1}
        step="1"
        value={index}
        onChange={(event) => onChange(DECADES[Number(event.target.value)])}
      />
      <div className="decade-ticks">
        {DECADES.map((decade) => <button key={decade} type="button" data-decade={decade} aria-current={decade === value ? 'page' : undefined} className={decade === value ? 'active' : ''} onClick={() => onChange(decade)}>{decade}</button>)}
      </div>
      {activeBeat !== undefined && <div className="timeline-story-progress" aria-label={`Story beat ${activeBeat + 1} of ${beatCount}`}><i style={{ width: `${((activeBeat + 1) / beatCount) * 100}%` }} /></div>}
    </nav>
  );
}
