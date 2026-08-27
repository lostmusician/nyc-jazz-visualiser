import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NARRATIVE_CHAPTERS } from '../data/chapters';
import { ArchivalStamp } from './sketches/SketchDoodles';

export const HorizontalTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // The scroll progress of the entire HorizontalTimeline section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Translate the inner flex container horizontally
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]); // -75% because 4 items = 400% width. To reach the last item, translate by -300% / 400% = -75%

  return (
    // The outer section needs enough height to allow for vertical scrolling.
    // 400vh means it takes 4 screens to scroll through 4 chapters.
    <section ref={containerRef} className="relative h-[400vh] bg-[#f5efe2]">
      
      {/* Sticky container stays in view while we scroll past the 400vh */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Subtle background texture for the entire timeline */}
        <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />

        <motion.div 
          style={{ x }} 
          className="flex h-full w-[400vw]"
        >
          {NARRATIVE_CHAPTERS.map((chapter, index) => (
            <div 
              key={chapter.id} 
              className="w-screen h-full flex flex-col justify-center items-center px-12 md:px-24 shrink-0 relative"
            >
              
              {/* Minimalist Narrative Card */}
              <div className="max-w-3xl w-full">
                
                <div className="mb-8 flex items-center gap-4">
                  <div className="font-typewriter text-[#a63d2b] tracking-widest text-sm uppercase">
                    Archive // {chapter.indexNumber}
                  </div>
                  <div className="h-px bg-[#231b14] flex-grow opacity-30" />
                  <ArchivalStamp label={chapter.decade} />
                </div>

                <h2 className="font-display text-5xl md:text-7xl font-extrabold text-[#1f1712] mb-4">
                  {chapter.title}
                </h2>
                
                <h3 className="font-serif italic text-2xl md:text-3xl text-[#8c7456] mb-8">
                  {chapter.subtitle}
                </h3>

                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="flex-1 space-y-6">
                    {chapter.narrative_body.map((paragraph, i) => (
                      <p key={i} className="font-sans text-xl text-[#3b2e24] leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                    
                    {chapter.key_statistic && (
                      <div className="pt-6 border-t border-dashed border-[#231b14]/30">
                        <div className="font-sketch text-5xl text-[#a63d2b] font-bold">
                          {chapter.key_statistic.value}
                        </div>
                        <div className="font-typewriter text-xs tracking-wider text-[#73604d] mt-2 uppercase">
                          {chapter.key_statistic.label}
                        </div>
                      </div>
                    )}
                  </div>

                  {chapter.quote && (
                    <blockquote className="flex-1 relative bg-[#fbf8f0] p-8 border-l-4 border-[#c59b4c] shadow-[4px_4px_0px_rgba(35,27,20,0.1)]">
                      <div className="absolute -top-4 -left-3 text-6xl text-[#ebd8b7] font-serif leading-none">
                        "
                      </div>
                      <p className="font-serif text-xl italic text-[#4a3b2f] leading-relaxed relative z-10">
                        {chapter.quote.text}
                      </p>
                      <footer className="mt-4 font-typewriter text-sm text-[#8c7456]">
                        — {chapter.quote.author}, <span className="opacity-70">{chapter.quote.source}</span>
                      </footer>
                    </blockquote>
                  )}
                </div>

              </div>

              {/* Decorative progress indicator line at the bottom */}
              <div className="absolute bottom-12 left-0 w-full px-12 md:px-24">
                <div className="flex items-center gap-4">
                  <span className="font-sketch font-bold text-[#c59b4c]">{chapter.decade}</span>
                  <div className="h-0.5 bg-[#231b14]/20 flex-grow relative">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-[#231b14]"
                      style={{ 
                        // Local progress bar per slide. 
                        // The scaleX goes from 0 to 1 as we scroll past this specific screen.
                        scaleX: useTransform(
                          scrollYProgress, 
                          [index / NARRATIVE_CHAPTERS.length, (index + 1) / NARRATIVE_CHAPTERS.length], 
                          [0, 1]
                        ),
                        transformOrigin: "left center"
                      }} 
                    />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
