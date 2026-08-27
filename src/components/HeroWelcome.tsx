import React from 'react';
import { motion } from 'framer-motion';
import { SaxophoneSketch } from './sketches/SaxophoneSketch';
import { TrumpetSketch } from './sketches/TrumpetSketch';
import { MusicianSketch } from './sketches/MusicianSketches';
import { CoffeeStain, ArchivalStamp, MusicalStaffDoodle } from './sketches/SketchDoodles';

interface HeroWelcomeProps {
  onStart: () => void;
}

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({ onStart }) => {
  return (
    <header className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 bg-[#f5efe2] overflow-hidden">
      {/* Background Musical Staff Doodles */}
      <div className="absolute top-8 left-0 w-full">
        <MusicalStaffDoodle />
      </div>
      <div className="absolute bottom-10 left-0 w-full">
        <MusicalStaffDoodle />
      </div>

      {/* Decorative Coffee Ring Stain in corner */}
      <div className="absolute top-12 right-12 hidden lg:block">
        <CoffeeStain className="w-36 h-36" />
      </div>

      {/* Floating Instrument Sketches */}
      <motion.div
        initial={{ opacity: 0, x: -60, rotate: -10 }}
        animate={{ opacity: 1, x: 0, rotate: -5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute left-4 sm:left-8 lg:left-20 top-1/4 hidden md:block sketch-jitter pointer-events-none"
      >
        <SaxophoneSketch className="w-44 h-44 lg:w-52 lg:h-52" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 60, rotate: 10 }}
        animate={{ opacity: 1, x: 0, rotate: 6 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute right-4 sm:right-8 lg:right-20 top-1/4 hidden md:block sketch-jitter pointer-events-none"
      >
        <TrumpetSketch className="w-48 h-36 lg:w-56 lg:h-44" />
      </motion.div>

      {/* Archival Badge & Monogram */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mb-4 relative z-10"
      >
        <div className="flex items-center gap-3 justify-center mb-3">
          <ArchivalStamp label="Digital Humanities Archive" sub="ISM • NYC Spatial Studies" />
        </div>
        <div className="font-hand text-lg sm:text-xl text-[#8c7456] font-bold tracking-wide">
          ~ Field Notes on Acoustic Erasure (1950 – Present) ~
        </div>
      </motion.div>

      {/* Main Title with Hand-Drawn Display Font & Ink Underline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold text-[#1f1712] max-w-5xl leading-[1.05] tracking-tight relative z-10"
      >
        The Vanishing <span className="sketch-underline inline-block">Cadence</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="mt-6 max-w-2xl font-serif text-lg sm:text-xl text-[#4a3b2f] leading-relaxed mx-auto italic relative z-10"
      >
        “A hand-drawn cartography tracing the hyper-gentrification, loft rent hikes, and cross-river displacement of New York City’s legendary jazz sanctuaries.”
      </motion.p>

      {/* Handwritten subtitle note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 font-hand text-lg text-[#a63d2b] font-bold relative z-10"
      >
        ✎ Featuring field sketches of Miles Davis, John Coltrane & Thelonious Monk
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7 }}
        className="mt-8 flex flex-wrap gap-5 justify-center items-center relative z-10"
      >
        <button
          onClick={onStart}
          className="px-8 py-4 rounded-xl bg-[#231b14] text-[#fbf8f0] font-sketch text-lg tracking-wide font-bold hover:bg-[#c59b4c] hover:text-[#1a120b] transition-all duration-300 shadow-[4px_4px_0px_#231b14] hover:shadow-[6px_6px_0px_#231b14] hover:-translate-y-0.5 cursor-pointer border-2 border-[#231b14]"
        >
          Open Sketchbook & Map ➔
        </button>
        <button
          onClick={onStart}
          className="px-8 py-4 rounded-xl bg-[#fbf8f0] text-[#231b14] font-sketch text-lg tracking-wide font-bold hover:bg-[#f0e4d0] transition-all duration-300 shadow-[4px_4px_0px_#231b14] hover:-translate-y-0.5 cursor-pointer border-2 border-[#231b14]"
        >
          Explore Modern Diaspora
        </button>
      </motion.div>

      {/* Mini Sketchbook Taped Line Art Portraits Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.9 }}
        className="mt-12 flex flex-wrap justify-center items-center gap-6 relative z-10 max-w-4xl"
      >
        {/* Miles Davis portrait card */}
        <div className="bg-[#fbf8f0] p-3 rounded-lg border-2 border-[#231b14] shadow-[3px_3px_0px_#231b14] transform -rotate-2 hover:rotate-0 transition-transform">
          <MusicianSketch musician="miles" className="w-28 h-32 sm:w-32 sm:h-36" />
        </div>

        {/* Coltrane & Monk duo card */}
        <div className="bg-[#fbf8f0] p-3 rounded-lg border-2 border-[#231b14] shadow-[3px_3px_0px_#231b14] transform rotate-1 hover:rotate-0 transition-transform">
          <MusicianSketch musician="monk_coltrane_duo" className="w-44 h-32 sm:w-56 sm:h-36" />
        </div>
      </motion.div>
    </header>
  );
};
