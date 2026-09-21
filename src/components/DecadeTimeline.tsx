import { DECADES, type Decade } from '../gallery/model';

export function DecadeTimeline({ value, onChange }: { value: Decade; onChange: (decade: Decade) => void }) {
  const index = DECADES.indexOf(value);
  return (
    <div className="decade-timeline" data-ui-layer>
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
        {DECADES.map((decade) => <button key={decade} type="button" className={decade === value ? 'active' : ''} onClick={() => onChange(decade)}>{decade}</button>)}
      </div>
    </div>
  );
}
