import React, { useState } from 'react';
import { MapCanvas } from './MapCanvas';
import { NarrativeCard } from './NarrativeCard';
import { useScrollObserver } from '../hooks/useScrollObserver';
import { NARRATIVE_CHAPTERS } from '../data/chapters';
import { NYC_JAZZ_VENUES } from '../data/venues';

const CHAPTER_IDS = NARRATIVE_CHAPTERS.map((c) => c.id);

export const Scrollyteller: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useScrollObserver(CHAPTER_IDS);
  const [soundActive, setSoundActive] = useState(false);

  const currentChapter =
    NARRATIVE_CHAPTERS.find((c) => c.id === activeChapterId) || NARRATIVE_CHAPTERS[0];

  const scrollToChapter = (id: string) => {
    setActiveChapterId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#f5efe2]">
      {/* 1. STICKY BACKGROUND LAYER: Mapbox Visualizer */}
      <div className="sticky top-0 left-0 w-full h-screen z-0">
        <MapCanvas
          camera={currentChapter.map_camera}
          venues={NYC_JAZZ_VENUES}
          activeVenueIds={currentChapter.active_venue_ids}
        />
      </div>

      {/* 2. FLOATING STICKY SIDEBAR: Hand-drawn Chapter Index Tabs */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden md:block">
        <nav className="flex flex-col gap-3.5 bg-[#fbf8f0]/95 backdrop-blur-md p-4 rounded-xl border-2 border-[#231b14] shadow-[4px_4px_0px_#231b14]">
          <div className="font-hand text-sm font-bold text-[#8c7456] pb-1 border-b border-dashed border-[#231b14]">
            Timeline Index
          </div>
          {NARRATIVE_CHAPTERS.map((ch) => {
            const isSelected = ch.id === currentChapter.id;
            return (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.id)}
                className="group flex items-center gap-3 text-left transition-all duration-300 focus:outline-none cursor-pointer"
                aria-label={`Scroll to ${ch.decade}`}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 border-[#231b14] transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#a63d2b] scale-125 shadow-[1px_1px_0px_#231b14]'
                      : 'bg-[#ebd8b7] group-hover:bg-[#c59b4c]'
                  }`}
                />
                <span
                  className={`text-sm font-sketch tracking-wider transition-colors ${
                    isSelected
                      ? 'text-[#1a120b] font-bold underline decoration-[#a63d2b] decoration-2'
                      : 'text-[#73604d] group-hover:text-[#231b14]'
                  }`}
                >
                  {ch.decade}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. AMBIENT AUDIO TOGGLE: Vintage Record Player Stamp Button */}
      <div className="fixed top-6 right-6 z-30">
        <button
          onClick={() => setSoundActive(!soundActive)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#231b14] text-xs font-typewriter uppercase tracking-wider backdrop-blur-md transition-all duration-300 cursor-pointer shadow-[3px_3px_0px_#231b14] hover:-translate-y-0.5 ${
            soundActive
              ? 'bg-[#a63d2b] text-[#fffdf9]'
              : 'bg-[#fbf8f0]/95 text-[#231b14] hover:bg-[#faebd7]'
          }`}
        >
          <span className={`inline-block w-2.5 h-2.5 rounded-full border border-[#231b14] ${soundActive ? 'bg-[#fffdf9] animate-ping' : 'bg-[#c59b4c]'}`} />
          {soundActive ? '♪ Vinyl Needle: Playing' : '♫ Ambient Tone: Muted'}
        </button>
      </div>

      {/* 4. FOREGROUND LAYER: Scrolling Narrative Storyboard Cards */}
      <div className="relative z-10 -mt-[100vh] pointer-events-none">
        <div className="pointer-events-auto">
          {NARRATIVE_CHAPTERS.map((chapter) => (
            <NarrativeCard
              key={chapter.id}
              step={chapter}
              isActive={chapter.id === currentChapter.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
