import React, { useState, useEffect, useMemo } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import { NYC_JAZZ_VENUES } from '../data/venues';
import type { VenueFeature, SceneMovement } from '../types';

const DECADES = ['1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020'];

const SCENE_FILTERS: { label: string; value: SceneMovement | 'all' }[] = [
  { label: 'All Sanctuaries', value: 'all' },
  { label: 'Harlem Jazz', value: 'harlem_jazz' },
  { label: 'Bebop & 52nd St', value: 'bebop_mainstream' },
  { label: 'Loft Movement', value: 'loft_jazz' },
  { label: 'Downtown Avant-Garde', value: 'downtown_avant_garde' },
  { label: 'Brooklyn Diaspora', value: 'brooklyn_continuation' },
];

export const InteractiveDataMap: React.FC = () => {
  const [selectedDecade, setSelectedDecade] = useState<string>('1970');
  const [selectedScene, setSelectedScene] = useState<SceneMovement | 'all'>('all');
  const [selectedVenue, setSelectedVenue] = useState<VenueFeature | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);

  // Filter venues by scene
  const filteredVenues = useMemo(() => {
    if (selectedScene === 'all') return NYC_JAZZ_VENUES;
    return NYC_JAZZ_VENUES.filter(v => v.properties.scene_movement === selectedScene);
  }, [selectedScene]);

  // Compute statistics for the selected decade
  const stats = useMemo(() => {
    const decNum = parseInt(selectedDecade, 10);
    const endDecYear = decNum + 9;

    let activeCount = 0;
    let closedCount = 0;
    let newThisEra = 0;
    let lostThisEra = 0;

    filteredVenues.forEach(v => {
      const { open_year, close_year } = v.properties;
      const isFounded = open_year ? open_year <= endDecYear : true;
      if (!isFounded) return;

      const isClosedBefore = close_year ? close_year < decNum : false;
      const isClosedDuring = close_year ? (close_year >= decNum && close_year <= endDecYear) : false;
      const isOpenDuring = !close_year || close_year >= decNum;

      if (isOpenDuring) {
        activeCount++;
      }
      if (isClosedBefore || isClosedDuring) {
        closedCount++;
      }
      if (open_year && open_year >= decNum && open_year <= endDecYear) {
        newThisEra++;
      }
      if (isClosedDuring) {
        lostThisEra++;
      }
    });

    return { activeCount, closedCount, newThisEra, lostThisEra };
  }, [selectedDecade, filteredVenues]);

  // Mapbox initialization
  const { isLoaded, flyTo, updateChoroplethDecade } = useMapbox({
    containerRef: mapContainerRef,
    initialCamera: {
      center: [-73.98, 40.735],
      zoom: 12.0,
      pitch: 40,
      bearing: -10,
    },
    venues: filteredVenues,
    activeVenueIds: filteredVenues.map(v => v.properties.id),
    choroplethDataPath: '/data/nyc_rent_history.geojson',
    selectedDecade: selectedDecade,
    onSelectVenue: (venue) => {
      setSelectedVenue(venue);
    }
  });

  // Whenever decade changes, inform the map hook
  useEffect(() => {
    if (isLoaded) {
      updateChoroplethDecade(selectedDecade);
    }
  }, [selectedDecade, isLoaded, updateChoroplethDecade]);

  // Timeline Auto-player animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSelectedDecade((prev) => {
        const currentIndex = DECADES.indexOf(prev);
        if (currentIndex === DECADES.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return DECADES[currentIndex + 1];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="relative w-full h-screen bg-[#1c140e] overflow-hidden flex flex-col">
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
      <div className="absolute top-6 left-6 right-6 z-20 flex flex-wrap justify-between items-start gap-4 pointer-events-none">
        
        {/* Left Badge */}
        <div className="pointer-events-auto bg-[#fbf8f0]/95 backdrop-blur-md p-4 rounded-xl border-2 border-[#231b14] shadow-[4px_4px_0px_#231b14] max-w-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c59b4c] animate-ping" />
            <span className="font-typewriter text-[11px] uppercase tracking-widest text-[#a63d2b] font-bold">
              NYC Spatial Displacement Lab
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#1f1712]">
            Mapping The Vanishing Cadence
          </h2>
          <p className="font-serif italic text-xs text-[#5c4d3c] mt-1 leading-relaxed">
            Drag the era slider below to witness how real estate escalation displaced historical jazz sanctuaries from 1950 to the present.
          </p>
        </div>

        {/* Scene Movement Pills */}
        <div className="pointer-events-auto flex flex-wrap gap-2 max-w-lg justify-end">
          {SCENE_FILTERS.map((filter) => {
            const isSelected = selectedScene === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setSelectedScene(filter.value)}
                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-sketch font-bold transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_#231b14] ${
                  isSelected
                    ? 'bg-[#231b14] text-[#fbf8f0] border-[#231b14] -translate-y-0.5'
                    : 'bg-[#fbf8f0]/95 text-[#231b14] border-[#231b14] hover:bg-[#faebd7]'
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
        <div className="absolute top-24 left-6 z-30 w-80 sm:w-96 bg-[#fbf8f0] p-6 rounded-2xl border-2 border-[#231b14] shadow-[6px_6px_0px_#231b14] animate-fadeIn">
          <button
            onClick={() => setSelectedVenue(null)}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full border border-[#231b14] font-bold text-xs hover:bg-[#a63d2b] hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
          <div className="font-typewriter text-[10px] uppercase text-[#a63d2b] font-bold mb-1">
            {selectedVenue.properties.scene_movement.replace(/_/g, ' ')}
          </div>
          <h3 className="font-display font-bold text-2xl text-[#1f1712] mb-1">
            {selectedVenue.properties.name}
          </h3>
          <div className="font-hand font-bold text-sm text-[#8c7456] mb-3">
            📍 {selectedVenue.properties.address} ({selectedVenue.properties.neighborhood})
          </div>

          <div className="flex gap-2 mb-3">
            <span className="font-typewriter text-xs px-2 py-0.5 rounded bg-[#faebd7] border border-[#231b14]/30">
              🗓 {selectedVenue.properties.open_year || 'Unknown'} – {selectedVenue.properties.close_year || 'Present'}
            </span>
            <span className={`font-typewriter text-xs px-2 py-0.5 rounded border uppercase ${
              selectedVenue.properties.close_year ? 'bg-[#fce8e6] text-[#c5221f] border-[#c5221f]' : 'bg-[#e6f4ea] text-[#137333] border-[#137333]'
            }`}>
              {selectedVenue.properties.close_year ? 'Closed / Displaced' : 'Active Landmark'}
            </span>
          </div>

          {selectedVenue.properties.closing_reason && (
            <div className="mb-3 p-2.5 bg-[#f5efe2] border-l-3 border-[#a63d2b] text-xs text-[#2e1d14]">
              <div className="font-sketch font-bold text-[#a63d2b]">Displacement Factor:</div>
              <p className="mt-0.5">{selectedVenue.properties.closing_reason}</p>
            </div>
          )}

          {selectedVenue.properties.quote && (
            <blockquote className="font-serif italic text-xs text-[#5c4d3c] border-l-2 border-[#c59b4c] pl-2.5 mb-3 leading-relaxed">
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
            className="w-full mt-2 py-2 rounded-lg bg-[#c59b4c] text-[#1a120b] font-sketch font-bold text-xs hover:bg-[#231b14] hover:text-[#fbf8f0] transition-colors border border-[#231b14] cursor-pointer shadow-[2px_2px_0px_#231b14]"
          >
            Zoom Camera to Club Location ➔
          </button>
        </div>
      )}

      {/* Bottom Timeline Controller HUD */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-3xl bg-[#fbf8f0]/95 backdrop-blur-md p-5 sm:p-6 rounded-2xl border-2 border-[#231b14] shadow-[6px_6px_0px_#231b14]">
        
        {/* Header & Metric Tickers */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#1f1712]">
                {selectedDecade}s
              </span>
              <span className="font-serif italic text-xs text-[#73604d]">
                Historical Snapshot
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-[#faebd7] border border-[#231b14]/30 text-center">
              <div className="font-sketch font-bold text-lg text-[#137333] leading-none">
                {stats.activeCount}
              </div>
              <div className="font-typewriter text-[9px] uppercase text-[#5c4d3c] tracking-wider mt-0.5">
                Active Clubs
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#faebd7] border border-[#231b14]/30 text-center">
              <div className="font-sketch font-bold text-lg text-[#a63d2b] leading-none">
                {stats.closedCount}
              </div>
              <div className="font-typewriter text-[9px] uppercase text-[#5c4d3c] tracking-wider mt-0.5">
                Lost to Date
              </div>
            </div>

            {/* Play / Pause Autoplay Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-sketch text-xs font-bold transition-all border-2 border-[#231b14] shadow-[2px_2px_0px_#231b14] cursor-pointer ${
                isPlaying
                  ? 'bg-[#a63d2b] text-white animate-pulse'
                  : 'bg-[#231b14] text-[#fbf8f0] hover:bg-[#c59b4c] hover:text-[#1a120b]'
              }`}
            >
              {isPlaying ? '❚❚ Pause' : '▶ Play History'}
            </button>
          </div>
        </div>

        {/* Rent Choropleth Legend Strip */}
        <div className="mb-4">
          <div className="flex justify-between items-center font-typewriter text-[10px] text-[#73604d] mb-1">
            <span>$100/mo (Affordable Buffer)</span>
            <span className="font-sketch font-bold text-[#a63d2b] text-xs">Census Tract Rent Shading</span>
            <span>$3,200+/mo (Hyper-Gentrified)</span>
          </div>
          <div 
            className="h-2.5 rounded-full overflow-hidden border border-[#231b14]/40 shadow-inner"
            style={{ 
              background: 'linear-gradient(to right, #f7f2e7, #ebd49d, #cda250, #c25a38, #962d1d, #38140e)' 
            }}
          />
        </div>

        {/* Decade Slider Control */}
        <div className="relative pt-1 pb-4">
          <input
            type="range"
            min="0"
            max={DECADES.length - 1}
            step="1"
            value={DECADES.indexOf(selectedDecade)}
            onChange={(e) => {
              setIsPlaying(false);
              setSelectedDecade(DECADES[parseInt(e.target.value, 10)]);
            }}
            className="w-full h-2.5 bg-[#d6cab7] rounded-lg appearance-none cursor-pointer accent-[#a63d2b]"
          />
          <div className="absolute top-7 left-0 w-full flex justify-between px-1 pointer-events-none">
            {DECADES.map((dec) => {
              const isSelected = dec === selectedDecade;
              return (
                <button
                  key={dec}
                  onClick={() => setSelectedDecade(dec)}
                  className={`pointer-events-auto font-typewriter text-xs font-bold transition-all ${
                    isSelected ? 'text-[#a63d2b] scale-125 underline decoration-2' : 'text-[#8c7456] hover:text-[#1f1712]'
                  }`}
                >
                  {dec}s
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
