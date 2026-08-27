import React, { useRef, useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import type { MapCameraState, VenueFeature } from '../types';

interface MapCanvasProps {
  camera: MapCameraState;
  venues: VenueFeature[];
  activeVenueIds: string[];
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  camera,
  venues,
  activeVenueIds,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { flyTo, isLoaded } = useMapbox({
    containerRef: mapContainerRef,
    initialCamera: camera,
    venues,
    activeVenueIds,
  });

  // Whenever camera or isLoaded state updates, smoothly move the map
  useEffect(() => {
    if (isLoaded) {
      flyTo(camera);
    }
  }, [camera.center[0], camera.center[1], camera.zoom, camera.pitch, camera.bearing, flyTo, isLoaded]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#e8dfcf]">
      {/* Mapbox Canvas with Archival Sepia Warmth Filter */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full map-vintage-filter"
      />

      {/* Vignette Overlay for tactile edge depth */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(40,25,15,0.3)]" />

      {/* Hand-Drawn Cartographic Compass Rose & Coordinates Badge */}
      <div className="absolute bottom-6 left-6 z-10 hidden sm:flex items-center gap-3 bg-[#fbf8f0]/95 backdrop-blur-md px-4 py-2 rounded-lg border-2 border-[#231b14] shadow-[3px_3px_0px_#231b14] font-sketch text-xs text-[#2e231a]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#c59b4c] border border-[#231b14] animate-pulse" />
        <span className="font-bold tracking-wide">
          NYC JAZZ CARTOGRAPHY // {camera.center[1].toFixed(3)}° N, {Math.abs(camera.center[0]).toFixed(3)}° W
        </span>
        <span className="font-hand text-sm font-bold text-[#a63d2b] ml-1">✎ field survey</span>
      </div>
    </div>
  );
};
