import React, { useState, useEffect, useMemo } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import { NYC_JAZZ_VENUES } from '../data/venues';
import type { VenueFeature, SceneMovement } from '../types';

const YEAR_MIN = 1950;
const YEAR_MAX = 2020;
const YEAR_TICKS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

const INITIAL_MAP_CAMERA = {
  center: [-73.98, 40.735] as [number, number],
  zoom: 12.0,
  pitch: 40,
  bearing: -10,
};

const SCENE_FILTERS: { label: string; value: SceneMovement | 'all' }[] = [
  { label: 'All venues', value: 'all' },
  { label: 'Harlem', value: 'harlem_jazz' },
  { label: '52nd Street', value: 'bebop_mainstream' },
  { label: 'Loft jazz', value: 'loft_jazz' },
  { label: 'Downtown', value: 'downtown_avant_garde' },
  { label: 'Brooklyn', value: 'brooklyn_continuation' },
];

export const InteractiveDataMap: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(1970);
  const [selectedScene, setSelectedScene] = useState<SceneMovement | 'all'>('all');
  const [selectedVenue, setSelectedVenue] = useState<VenueFeature | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  // Filter venues by scene
  const filteredVenues = useMemo(() => {
    if (selectedScene === 'all') return NYC_JAZZ_VENUES;
    return NYC_JAZZ_VENUES.filter(v => v.properties.scene_movement === selectedScene);
  }, [selectedScene]);

  const highlightedVenueIds = useMemo(
    () => selectedVenue ? [selectedVenue.properties.id] : [],
    [selectedVenue]
  );

  // Compute venue status for the exact selected year.
  const stats = useMemo(() => {
    let activeCount = 0;
    let closedCount = 0;

    filteredVenues.forEach(v => {
      const { open_year, close_year } = v.properties;
      const isFounded = open_year ? open_year <= Math.floor(selectedYear) : true;
      if (!isFounded) return;

      if (close_year && close_year <= Math.floor(selectedYear)) closedCount++;
      else activeCount++;
    });

    return { activeCount, closedCount };
  }, [selectedYear, filteredVenues]);

  // Mapbox initialization
  const { isLoaded, flyTo, updateChoroplethYear } = useMapbox({
    containerRef: mapContainerRef,
    initialCamera: INITIAL_MAP_CAMERA,
    venues: filteredVenues,
    activeVenueIds: highlightedVenueIds,
    choroplethDataPath: '/data/nyc_rent_history.geojson',
    selectedYear,
    onSelectVenue: (venue) => {
      setSelectedVenue(venue);
    }
  });

  // Update rent interpolation and venue lifecycle for the exact year.
  useEffect(() => {
    if (isLoaded) {
      updateChoroplethYear(selectedYear);
    }
  }, [selectedYear, isLoaded, updateChoroplethYear]);

  // Timeline Auto-player animation
  useEffect(() => {
    if (!isPlaying) return;

    let animationFrame = 0;
    let previousTime: number | null = null;
    const yearsPerSecond = 2.5;

    const advance = (time: number) => {
      if (previousTime === null) previousTime = time;
      const elapsedSeconds = (time - previousTime) / 1000;
      previousTime = time;

      setSelectedYear((previousYear) => {
        const nextYear = Math.min(YEAR_MAX, previousYear + elapsedSeconds * yearsPerSecond);
        if (nextYear >= YEAR_MAX) setIsPlaying(false);
        return nextYear;
      });

      animationFrame = requestAnimationFrame(advance);
    };

    animationFrame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  return (
    <section id="evidence-map" className="relative w-full h-screen bg-[#1c140e] overflow-hidden flex flex-col scroll-mt-0">
      {/* Mapbox Container */}
      <div className="absolute inset-0 z-0">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full" 
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_140px_rgba(20,13,8,0.7)] z-10" />
      </div>

      {/* Top Header & Scene Filter Bar */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-20 flex flex-col sm:flex-row justify-between items-start gap-3 pointer-events-none">
        
        {/* Left Badge */}
        <div className="pointer-events-auto bg-[#f8f3e9]/94 backdrop-blur-sm px-4 py-3 border border-[#3b2e24]/35 max-w-xs shadow-[0_8px_24px_rgba(35,27,20,0.12)]">
          <div className="font-typewriter text-[10px] uppercase tracking-[0.18em] text-[#8f3428] mb-1">
            New York jazz venues · 1950–present
          </div>
          <h2 className="font-display font-bold text-xl text-[#1f1712] leading-tight">
            The displacement map
          </h2>
        </div>

        {/* Scene Movement Pills */}
        <div className="pointer-events-auto flex gap-1.5 max-w-full sm:max-w-2xl overflow-x-auto pb-2 sm:flex-wrap sm:justify-end map-filter-row">
          {SCENE_FILTERS.map((filter) => {
            const isSelected = selectedScene === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setSelectedScene(filter.value)}
                className={`shrink-0 px-3 py-1.5 rounded-full border text-[11px] font-sans font-semibold transition-colors duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#231b14] text-[#fbf8f0] border-[#231b14]'
                    : 'bg-[#fbf8f0]/88 text-[#3b2e24] border-[#3b2e24]/30 hover:bg-[#fbf8f0]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Venue Detail Slide-out Card */}
      {selectedVenue && (
        <aside className="absolute top-32 sm:top-28 right-4 sm:right-6 z-30 w-[calc(100%-2rem)] max-w-sm max-h-[calc(100vh-25rem)] sm:max-h-[calc(100vh-22rem)] overflow-y-auto bg-[#f8f3e9]/96 backdrop-blur-sm p-5 border border-[#3b2e24]/40 shadow-[0_16px_45px_rgba(20,13,8,0.24)] animate-fadeIn">
          <button
            onClick={() => setSelectedVenue(null)}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-[#6e5a47] text-sm hover:bg-[#231b14] hover:text-white transition-colors cursor-pointer"
            aria-label="Close venue details"
          >
            ✕
          </button>
          <div className="font-typewriter text-[9px] tracking-[0.16em] uppercase text-[#a63d2b] mb-1">
            {selectedVenue.properties.scene_movement.replace(/_/g, ' ')}
          </div>
          <h3 className="font-display font-bold text-2xl text-[#1f1712] mb-2 pr-8 leading-tight">
            {selectedVenue.properties.name}
          </h3>
          <div className="font-sans text-xs text-[#73604d] mb-4">
            {selectedVenue.properties.address} · {selectedVenue.properties.neighborhood}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4 pb-4 border-b border-[#3b2e24]/15">
            <span className="font-typewriter text-[10px] text-[#4a3b2f]">
              {selectedVenue.properties.open_year || 'Unknown'} – {selectedVenue.properties.close_year || 'Present'}
            </span>
            <span className={`font-typewriter text-[10px] uppercase ${
              selectedVenue.properties.close_year ? 'text-[#a63d2b]' : 'text-[#46654b]'
            }`}>
              {selectedVenue.properties.close_year ? 'Closed / Displaced' : 'Active Landmark'}
            </span>
          </div>

          {selectedVenue.properties.closing_reason && (
            <div className="mb-4 text-sm text-[#2e1d14] leading-relaxed">
              <div className="font-typewriter text-[9px] tracking-widest uppercase text-[#a63d2b] mb-1">Why it closed</div>
              <p>{selectedVenue.properties.closing_reason}</p>
            </div>
          )}

          {selectedVenue.properties.quote && (
            <blockquote className="font-serif italic text-sm text-[#5c4d3c] border-l-2 border-[#c59b4c] pl-3 mb-4 leading-relaxed">
              "{selectedVenue.properties.quote}"
            </blockquote>
          )}

          <button
            onClick={() => {
              flyTo({
                center: selectedVenue.geometry.coordinates as [number, number],
                zoom: 15.5,
                pitch: 50,
                bearing: 15
              });
            }}
            className="text-xs font-sans font-semibold text-[#8f3428] hover:text-[#231b14] underline underline-offset-4 cursor-pointer"
          >
            Centre this venue on the map →
          </button>
        </aside>
      )}

      {/* Bottom Timeline Controller HUD */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-4xl bg-[#f8f3e9]/96 backdrop-blur-sm px-4 py-3 sm:px-5 sm:py-4 border border-[#3b2e24]/40 shadow-[0_14px_40px_rgba(20,13,8,0.22)]">
        
        {/* Header & Metric Tickers */}
        <div className="flex justify-between items-center gap-3 mb-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#1f1712]">
                {Math.floor(selectedYear)}
              </span>
              <span className="hidden sm:inline font-serif italic text-xs text-[#73604d]">
                venue landscape
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="text-center">
              <span className="font-display font-bold text-lg text-[#46654b]">{stats.activeCount}</span>
              <span className="hidden sm:inline font-sans text-[10px] text-[#5c4d3c] ml-1">active</span>
            </div>

            <div className="text-center">
              <span className="font-display font-bold text-lg text-[#a63d2b]">{stats.closedCount}</span>
              <span className="hidden sm:inline font-sans text-[10px] text-[#5c4d3c] ml-1">closed</span>
            </div>

            {/* Play / Pause Autoplay Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[11px] font-semibold transition-colors border cursor-pointer ${
                isPlaying
                  ? 'bg-[#a63d2b] border-[#a63d2b] text-white'
                  : 'bg-[#231b14] border-[#231b14] text-[#fbf8f0] hover:bg-[#4a3b2f]'
              }`}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>

        {/* Rent Choropleth Legend Strip */}
        <div className="hidden sm:block mb-3">
          <div className="flex justify-between items-center font-sans text-[9px] text-[#73604d] mb-1">
            <span>$100 monthly rent</span>
            <span className="uppercase tracking-widest">Census tract shading</span>
            <span>$3,200+ monthly rent</span>
          </div>
          <div 
            className="h-1.5 rounded-full overflow-hidden"
            style={{ 
              background: 'linear-gradient(to right, #f7f2e7, #ebd49d, #cda250, #c25a38, #962d1d, #38140e)' 
            }}
          />
        </div>

        {/* Continuous year slider */}
        <div className="relative pt-1 pb-4">
          <input
            type="range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step="any"
            value={selectedYear}
            onChange={(e) => {
              setIsPlaying(false);
              setSelectedYear(parseFloat(e.target.value));
            }}
            className="w-full h-2.5 bg-[#d6cab7] rounded-lg appearance-none cursor-pointer accent-[#a63d2b]"
          />
          <div className="absolute top-7 left-0 w-full hidden sm:flex justify-between px-1 pointer-events-none">
            {YEAR_TICKS.map((year) => {
              const isSelected = year === selectedYear;
              return (
                <button
                  key={year}
                  onClick={() => {
                    setIsPlaying(false);
                    setSelectedYear(year);
                  }}
                  className={`pointer-events-auto font-typewriter text-xs font-bold transition-all ${
                    isSelected ? 'text-[#a63d2b] scale-125 underline decoration-2' : 'text-[#8c7456] hover:text-[#1f1712]'
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
