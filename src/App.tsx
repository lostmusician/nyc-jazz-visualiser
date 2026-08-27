import React, { useRef } from 'react';
import { HeroWelcome } from './components/HeroWelcome';
import { HorizontalTimeline } from './components/HorizontalTimeline';
import { InteractiveDataMap } from './components/InteractiveDataMap';
import { MusicalStaffDoodle, ArchivalStamp } from './components/sketches/SketchDoodles';

export const App: React.FC = () => {
  const storyRef = useRef<HTMLDivElement>(null);

  const handleStartJourney = () => {
    storyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#f5efe2] text-[#2a211b] selection:bg-[#c59b4c]/30 selection:text-[#1a1410]">
      {/* 1. Welcoming Hero Stage */}
      <HeroWelcome onStart={handleStartJourney} />

      {/* 2. Horizontal Timeline Scrolling Phase */}
      <div ref={storyRef}>
        <HorizontalTimeline />
      </div>

      {/* 3. Interactive Free-Roam Map Phase */}
      <InteractiveDataMap />

      {/* 4. Archival Epilogue / Sketchbook Back Cover */}
      <footer className="relative z-20 py-24 px-6 bg-[#231b14] text-[#d6cab7] border-t-4 border-[#120d09] overflow-hidden">
        <div className="absolute top-0 left-0 w-full opacity-10">
          <MusicalStaffDoodle />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="flex justify-center">
            <ArchivalStamp label="Archival Field Survey Concluded" sub="Digital Humanities & Urban Spatial Analysis" />
          </div>

          <h4 className="font-display text-3xl sm:text-4xl text-[#fbf8f0] font-bold">
            The Living Memory of Sound
          </h4>

          <p className="font-serif text-base sm:text-lg text-[#b8a994] max-w-xl mx-auto italic leading-relaxed">
            “When physical sanctuaries are dismantled by real estate escalation, cultural memory survives through oral histories, sound recordings, and spatial cartographies.”
          </p>

          <div className="pt-6 font-hand text-lg text-[#c59b4c] font-bold tracking-wider">
            ✎ Sources: Institute of Jazz Studies (Rutgers) • New York Times Archives • The Village Voice (1955–2010)
          </div>

          <div className="font-typewriter text-xs text-[#73604d] pt-2">
            INDEPENDENT STUDY MODULE (ISM) // UNIVERSITY CARTOGRAPHY LAB
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
