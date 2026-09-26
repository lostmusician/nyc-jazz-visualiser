import { eraForDecade } from '../data/eras';
import type { Decade } from '../gallery/model';

export function EraContext({ decade, onDismiss }: { decade: Decade; onDismiss: () => void }) {
  const era = eraForDecade(decade);
  return (
    <aside
      className={`era-context era-context--${era.phase}`}
      role="region"
      aria-live="polite"
      aria-label={`${decade}s era context`}
      data-ui-layer
    >
      <div className="era-context-progress" aria-hidden="true" />
      <button type="button" className="era-context-close" aria-label="Dismiss era context" onClick={onDismiss}>×</button>
      <header>
        <span>{decade}s</span>
        <i>{era.phase}</i>
      </header>
      <h2>{era.title}</h2>
      <p className="era-context-subtitle">{era.subtitle}</p>
      <p>{era.summary}</p>
      <section>
        <strong>Why it matters to New York</strong>
        <p>{era.cityImpact}</p>
      </section>
      <footer>
        {era.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}
      </footer>
    </aside>
  );
}
