import React from 'react';
import { gsap } from '../animation/gsap';
import { CHANGE_DURATION, type DecadeTransitionState } from '../gallery/decade-transition';

// The gallery owns all card rendering. This component only runs the shared clock
// and provides a small, skippable caption above the existing canvas.
export function DecadeTransition({ transition, ready, onComplete }: {
  transition: DecadeTransitionState;
  ready: boolean;
  onComplete: () => void;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const skipRef = React.useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = React.useState('The clubs between decades');
  const noWebGL = new URLSearchParams(window.location.search).get('webgl') === 'off';

  React.useEffect(() => { skipRef.current?.focus(); }, []);
  React.useEffect(() => {
    if (!ready && !noWebGL) return;
    const duration = transition.reducedMotion || noWebGL ? .5 : CHANGE_DURATION;
    let previousPhase = '';
    const tween = gsap.to(transition.clock, {
      seconds: duration, duration, ease: 'none',
      onUpdate: () => {
        const elapsed = transition.clock.seconds;
        if (rootRef.current) rootRef.current.dataset.elapsed = elapsed.toFixed(2);
        const nextPhase = elapsed < .7 ? 'The clubs between decades' : elapsed < 3.05
          ? (transition.change.closing.length ? 'Some clubs fall silent' : 'The music carries on')
          : (transition.change.opening.length ? 'Other doors open' : 'The remaining clubs carry on');
        if (nextPhase !== previousPhase) { previousPhase = nextPhase; setPhase(nextPhase); }
      },
      onComplete,
    });
    const visibility = () => { if (document.hidden) tween.pause(); else tween.resume(); };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => { tween.kill(); document.removeEventListener('visibilitychange', visibility); };
  }, [ready, noWebGL, transition, onComplete]);

  const { from, to, closing, surviving, opening } = transition.change;
  return <div ref={rootRef} className="decade-change" data-decade-change={`${from}-${to}`} data-reduced-motion={transition.reducedMotion}>
    <div className="change-footer">
      <span className="change-years">{from} → {to}</span>
      <p role="status" aria-live="polite">{phase}</p>
      <button ref={skipRef} type="button" onClick={onComplete}>Skip transition</button>
    </div>
    <p className="sr-status">Between the {from}s and {to}s, {closing.length} mapped clubs close, {surviving.length} continue, and {opening.length} open.</p>
  </div>;
}
