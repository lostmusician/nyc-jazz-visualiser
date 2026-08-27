import React from 'react';
import { motion } from 'framer-motion';
import type { ChapterStep } from '../types';
import { SaxophoneSketch } from './sketches/SaxophoneSketch';
import { TrumpetSketch } from './sketches/TrumpetSketch';
import { UprightBassSketch } from './sketches/UprightBassSketch';
import { PianoSketch } from './sketches/PianoSketch';
import { DrumKitSketch } from './sketches/DrumKitSketch';
import { MusicianSketch } from './sketches/MusicianSketches';
import { ArchivalStamp, HandDrawnArrow } from './sketches/SketchDoodles';

interface NarrativeCardProps {
  step: ChapterStep;
  isActive: boolean;
}

export const NarrativeCard: React.FC<NarrativeCardProps> = ({ step, isActive }) => {
  // Select chapter-specific line-art illustrations matched to reference art
  const renderIllustration = () => {
    switch (step.id) {
      case 'chapter-1950s':
        return (
          <div className="flex flex-col items-center my-4 py-3 border-y border-dashed border-[#d8c8b0] gap-2">
            <MusicianSketch musician="monk_coltrane_duo" className="w-full max-w-[340px] h-48 sm:h-56" />
            <PianoSketch className="w-48 h-24 sm:w-56 sm:h-28 -mt-3" />
          </div>
        );
      case 'chapter-1970s':
        return (
          <div className="flex flex-wrap items-center justify-around my-4 py-3 border-y border-dashed border-[#d8c8b0] gap-2">
            <MusicianSketch musician="coltrane" className="w-36 h-36 sm:w-44 sm:h-44" />
            <SaxophoneSketch className="w-32 h-36 sm:w-38 sm:h-42" />
            <DrumKitSketch className="w-36 h-32 sm:w-44 sm:h-38" />
          </div>
        );
      case 'chapter-1990s':
        return (
          <div className="flex flex-wrap items-center justify-around my-4 py-3 border-y border-dashed border-[#d8c8b0] gap-2">
            <MusicianSketch musician="miles" className="w-36 h-40 sm:w-44 sm:h-48" />
            <TrumpetSketch className="w-44 h-28 sm:w-52 sm:h-32" />
          </div>
        );
      case 'chapter-present':
      default:
        return (
          <div className="flex flex-wrap items-center justify-around my-4 py-3 border-y border-dashed border-[#d8c8b0] gap-2">
            <MusicianSketch musician="billie" className="w-36 h-36 sm:w-40 sm:h-40" />
            <UprightBassSketch className="w-32 h-44 sm:w-36 sm:h-48" />
          </div>
        );
    }
  };

  return (
    <div
      id={step.id}
      data-step-id={step.id}
      className="min-h-screen flex items-center justify-end px-4 sm:px-8 lg:px-14 py-24"
    >
      <motion.article
        initial={{ opacity: 0, y: 60, rotate: -1 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-xl p-8 sm:p-10 sketchbook-card transition-all duration-500 relative ${
          isActive
            ? 'scale-[1.02] shadow-[10px_14px_0px_#231b14,0_25px_60px_rgba(35,25,17,0.2)]'
            : 'opacity-75'
        }`}
      >
        {/* Washi Tape Strip on Top Edge */}
        <div className="washi-tape" />
        <div className="washi-tape-right hidden sm:block" />

        {/* Header: Chapter Number & Decade */}
        <div className="flex items-center justify-between border-b-2 border-[#231b14] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-sketch text-3xl font-bold text-[#a63d2b]">
              #{step.indexNumber}
            </span>
            <div>
              <span className="font-typewriter text-xs uppercase tracking-widest text-[#6e5a47] block">
                ERA / {step.decade}
              </span>
              <span className="font-hand text-sm font-bold text-[#8c7456]">
                Decade Chapter
              </span>
            </div>
          </div>

          {step.key_statistic && (
            <div className="text-right">
              <ArchivalStamp label={step.key_statistic.label} sub={step.key_statistic.value} />
            </div>
          )}
        </div>

        {/* Chapter Title & Subtitle */}
        <h2 className="font-display text-3xl sm:text-4xl text-[#1f1712] font-extrabold leading-tight mb-1">
          {step.title}
        </h2>
        <h3 className="font-sketch text-base sm:text-lg text-[#c59b4c] font-bold mb-4">
          ✦ {step.subtitle}
        </h3>

        {/* Narrative Paragraphs */}
        <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed text-[#3b2e23]">
          {step.narrative_body.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Dynamic Reference-Matched Line Art Sketches */}
        {renderIllustration()}

        {/* Handwritten Pull Quote with Tape accent */}
        {step.quote && (
          <blockquote className="mt-6 pt-5 border-t-2 border-dashed border-[#231b14] relative bg-[#f5ecda]/60 p-4 rounded-lg">
            <div className="font-hand text-xl sm:text-2xl text-[#231810] font-bold leading-snug">
              “{step.quote.text}”
            </div>
            <cite className="block mt-2 font-typewriter text-xs uppercase tracking-wider text-[#a63d2b] font-bold not-italic">
              — {step.quote.author} {step.quote.source ? `[${step.quote.source}]` : ''}
            </cite>
          </blockquote>
        )}

        {/* Subtle Handwritten Arrow pointing towards the map */}
        <div className="mt-4 flex justify-between items-center text-xs text-[#8c7456]">
          <span className="font-typewriter">FIG. {step.indexNumber} // SPATIAL RECORD</span>
          <HandDrawnArrow text="View coordinates on map ➔" className="w-36" />
        </div>
      </motion.article>
    </div>
  );
};
