import React from 'react';
import { motion } from 'framer-motion';
import { SaxophoneSketch } from './sketches/SaxophoneSketch';

interface HeroWelcomeProps {
  onStart: () => void;
}

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({ onStart }) => {
  return (
    <header className="hero-cover relative min-h-screen overflow-hidden bg-[#100d0b] px-6 text-[#eee5d6] sm:px-10 lg:px-16">
      <div className="hero-rule" aria-hidden="true" />
      <div className="hero-club-photo" aria-hidden="true">
        <img src="/images/jazz-club-scenes-1940s-01.jpg" alt="" />
      </div>
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-door-glow" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 items-center lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
        <div className="max-w-6xl py-24 sm:py-28 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-4 font-typewriter text-[10px] uppercase tracking-[0.22em] text-[#c99a61] sm:text-xs"
          >
            <span>New York City</span>
            <span className="h-px w-10 bg-[#c99a61]/60" />
            <span>1950–Present</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="hero-title font-display text-[#f1e8db]"
          >
            <span className="block">Fifths <i>&amp;</i> Sevenths,</span>
            <span className="hero-title-indent block">Priced to the Nines</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-9 flex max-w-3xl flex-col gap-8 border-l border-[#c99a61]/35 pl-5 sm:mt-12 sm:pl-7 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-xl font-serif text-lg leading-relaxed text-[#bcae9d] sm:text-xl">
              A spatial history of the rooms where New York jazz lived—and the rents, rezonings, and migrations that moved the music elsewhere.
            </p>

            <button
              onClick={onStart}
              className="hero-entry group flex shrink-0 items-center gap-4 self-start font-typewriter text-xs font-semibold uppercase tracking-[0.16em] text-[#f1e8db] lg:self-auto"
            >
              <span className="hero-entry-disc" aria-hidden="true"><i /></span>
              <span>Enter the listening room</span>
              <span className="text-lg text-[#c99a61] transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, rotate: 5, x: 25 }}
          animate={{ opacity: 0.72, rotate: -3, x: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: 'easeOut' }}
          className="hero-instrument pointer-events-none absolute -bottom-12 -right-14 w-64 sm:bottom-2 sm:right-0 sm:w-80 lg:static lg:w-full"
          aria-hidden="true"
        >
          <SaxophoneSketch className="h-auto w-full" />
        </motion.div>
      </div>

      <div className="hero-edition font-typewriter" aria-hidden="true">
        No. 09 / urban sound archive
      </div>
      <div className="hero-threshold font-typewriter" aria-hidden="true">
        Sound begins beyond this door <span>↓</span>
      </div>
    </header>
  );
};
