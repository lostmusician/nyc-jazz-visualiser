import React from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../animation/gsap';
import type { DecadeStory as DecadeStoryModel } from '../types';

export function DecadeStory({
  story,
  activeBeat,
  onActiveBeat,
  onExplore,
}: {
  story: DecadeStoryModel;
  activeBeat: number;
  onActiveBeat: (index: number) => void;
  onExplore: () => void;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const activeCallbackRef = React.useRef(onActiveBeat);
  activeCallbackRef.current = onActiveBeat;

  React.useLayoutEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [story.decade]);

  useGSAP(() => {
    const scroller = scrollerRef.current;
    const root = rootRef.current;
    if (!scroller || !root) return;
    const beats = gsap.utils.toArray<HTMLElement>('.story-beat', root);
    const media = gsap.matchMedia(root);

    beats.forEach((beat, index) => {
      ScrollTrigger.create({
        trigger: beat,
        scroller,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => activeCallbackRef.current(index),
        onEnterBack: () => activeCallbackRef.current(index),
      });
    });

    media.add({
      animated: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 801px)',
    }, (context) => {
      if (!context.conditions?.animated) return;
      const distance = context.conditions.desktop ? 88 : 42;
      beats.forEach((beat) => {
        const card = beat.querySelector<HTMLElement>('.story-card');
        const image = beat.querySelector<HTMLElement>('.story-beat-image');
        if (card) {
          gsap.fromTo(card, { y: distance * 0.45, opacity: 0.38 }, {
            y: -distance * 0.28,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: beat, scroller, start: 'top bottom', end: 'bottom top', scrub: 0.45 },
          });
        }
        if (image) {
          gsap.fromTo(image, { yPercent: -7, scale: 1.08 }, {
            yPercent: 7,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: beat, scroller, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          });
        }
      });
      gsap.fromTo('.story-decade-ghost', { yPercent: -9 }, {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: { trigger: scroller, scroller, start: 0, end: 'max', scrub: 0.8 },
      });
    });

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      media.revert();
    };
  }, { scope: rootRef, dependencies: [story.decade], revertOnUpdate: true });

  return (
    <div ref={rootRef} className="decade-story" data-story-decade={story.decade}>
      <div className="story-ambient" aria-hidden="true" />
      <div className="story-decade-ghost" aria-hidden="true">{story.decade}</div>
      <button type="button" className="story-skip" onClick={onExplore}>Skip story and explore</button>
      <div ref={scrollerRef} className="story-scroller" data-story-scroller>
        <header className="story-heading">
          <span>{story.historicalPhase} · {story.decade}s in New York</span>
          <h1 ref={headingRef} tabIndex={-1}>{story.title}</h1>
          <p>{story.subtitle}</p>
          <small>Scroll to follow the rooms across the city</small>
        </header>
        {story.beats.map((beat, index) => (
          <section
            key={beat.id}
            className={`story-beat${index === activeBeat ? ' is-active' : ''}`}
            data-story-beat={beat.id}
            data-active={index === activeBeat ? 'true' : 'false'}
            aria-labelledby={`${beat.id}-title`}
          >
            {beat.image && (
              <figure className="story-beat-image" aria-hidden="true">
                <img src={beat.image} alt="" onLoad={() => ScrollTrigger.refresh()} />
              </figure>
            )}
            <article className="story-card">
              <span>{String(index + 1).padStart(2, '0')} / {String(story.beats.length).padStart(2, '0')} · {beat.historicalContext}</span>
              <h2 id={`${beat.id}-title`}>{beat.title}</h2>
              <p>{beat.body}</p>
              {beat.pullQuote && <blockquote>“{beat.pullQuote.text}”<cite>— {beat.pullQuote.speaker}, <a href={beat.pullQuote.url} target="_blank" rel="noreferrer">{beat.pullQuote.source}</a></cite></blockquote>}
              {beat.rentContext && <p className="story-rent-context">{beat.rentContext.note}</p>}
              {beat.sources && (
                <footer>
                  {beat.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}
                </footer>
              )}
              {index === story.beats.length - 1 && (
                <button type="button" className="story-explore" onClick={onExplore}>Explore the {story.decade}s</button>
              )}
            </article>
          </section>
        ))}
      </div>
    </div>
  );
}
