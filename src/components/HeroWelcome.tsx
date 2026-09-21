import React from 'react';
import { motion } from 'framer-motion';

interface HeroWelcomeProps { onStart: () => void; }

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({ onStart }) => (
  <header className="hero-cover museum-hero night-threshold relative min-h-screen overflow-hidden bg-[#100d0b] px-6 text-[#eee5d6] sm:px-10 lg:px-16">
    <div className="hero-rule" aria-hidden="true" />
    <div className="hero-club-photo" aria-hidden="true"><img src="/images/jazz-club-scenes-1940s-01.jpg" alt="" /></div>
    <div className="hero-grain" aria-hidden="true" />
    <div className="hero-door-glow" aria-hidden="true" />

    <div className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] items-center gap-10 py-20">
      <div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 font-typewriter text-[10px] uppercase tracking-[.24em] text-[#c99a61]">
          New York City · Museum open after hours
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }} className="hero-title font-display text-[#f1e8db]">
          <span className="block">Fifths <i>&amp;</i> Sevenths,</span><span className="hero-title-indent block">Priced to the Nines</span>
        </motion.h1>
        <p className="mt-8 max-w-xl border-l border-[#c99a61]/35 pl-6 font-serif text-lg leading-relaxed text-[#bcae9d] sm:text-xl">
          Four rooms hold four ways of encountering a scene. The doors open in any order.
        </p>
        <button onClick={onStart} className="hero-entry group mt-9 flex items-center gap-4 font-typewriter text-xs font-semibold uppercase tracking-[.16em] text-[#f1e8db]">
          <span className="hero-entry-disc" aria-hidden="true"><i /></span><span>Enter after hours</span><span className="text-lg text-[#c99a61] group-hover:translate-x-1" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </header>
);
