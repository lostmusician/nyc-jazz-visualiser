import React from 'react';
import { motion } from 'framer-motion';
import { NARRATIVE_CHAPTERS } from '../data/chapters';

const NOTE_TITLES = [
  'Affordable space subsidises risk.',
  'Neglect becomes an investment opportunity.',
  'Authenticity is converted into property value.',
  'The culture survives in forms the expensive city can finance.',
];

const NOTE_IMAGES = [
  '/images/jazz-club-scenes-1940s-12.jpg',
  '/images/jazz-club-scenes-1940s-08.jpg',
  '/images/jazz-club-scenes-1940s-03.jpg',
  '/images/Celebrated%20Female%20Jazz%20Artists%20Taken%20by%20William%20P.%20Gottlieb%20(32).jpg',
];

export const ArgumentInterlude: React.FC = () => (
  <section className="argument-interlude" aria-label="How a local scene becomes a global commodity">
    <header className="argument-intro">
      <span className="font-typewriter">Four listening notes</span>
      <h2 className="font-display">The displacement is spatial.<br />The transformation is structural.</h2>
      <p>Move slowly. Each note isolates one link in the argument.</p>
    </header>

    <div className="argument-notes">
      {NARRATIVE_CHAPTERS.map((chapter, index) => (
        <article className={`argument-note argument-note-${index + 1}`} key={chapter.id}>
          <motion.div
            className="argument-note-image"
            initial={{ opacity: 0, scale: .9, rotate: index % 2 ? 3 : -3 }}
            whileInView={{ opacity: .52, scale: 1, rotate: index % 2 ? 1 : -1 }}
            viewport={{ amount: .35 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            <img src={NOTE_IMAGES[index]} alt="" loading="lazy" />
          </motion.div>

          <motion.div
            className="argument-note-copy"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: .45 }}
            transition={{ duration: .85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="argument-note-index font-typewriter">0{index + 1} / 04</div>
            <h3 className="font-display">{NOTE_TITLES[index]}</h3>
            <p>{chapter.narrative_body[1]}</p>
            {chapter.framework && (
              <aside>
                <span className="font-typewriter">{chapter.framework.scholar}</span>
                <strong className="font-serif">{chapter.framework.concept}</strong>
                <p>{chapter.framework.reading}</p>
              </aside>
            )}
          </motion.div>
        </article>
      ))}
    </div>

    <div className="argument-chain">
      <span>Affordable space</span><i>→</i><span>Local scene</span><i>→</i><span>Urban desirability</span><i>→</i><span>Reinvestment</span><i>→</i><span>Displacement</span><i>→</i><span>Global commodity</span>
    </div>
  </section>
);
