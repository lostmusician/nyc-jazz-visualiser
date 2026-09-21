import React from 'react';
import type { Decade } from '../gallery/model';
import { useMapbox } from '../hooks/useMapbox';
import type { SceneMovement, VenueFeature } from '../types';

interface CentralMapProps {
  venues: VenueFeature[];
  decade: Decade;
  scene: SceneMovement | 'all';
  hoveredVenueId: string | null;
  selectedVenueId: string | null;
  onHoverVenue: (venueId: string | null) => void;
  onSelectVenue: (venueId: string) => void;
}

const INITIAL_CAMERA = { center: [-73.98, 40.735] as [number, number], zoom: 10.25, pitch: 0, bearing: 0 };

export function CentralMap({ venues, decade, scene, hoveredVenueId, selectedVenueId, onHoverVenue, onSelectVenue }: CentralMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const configured = Boolean(import.meta.env.VITE_MAPBOX_TOKEN);
  const highlighted = [hoveredVenueId, selectedVenueId].filter(Boolean) as string[];
  const { isLoaded, updateChoroplethYear } = useMapbox({
    containerRef,
    initialCamera: INITIAL_CAMERA,
    venues,
    activeVenueIds: highlighted,
    choroplethDataPath: '/data/nyc_rent_history.geojson',
    selectedYear: decade,
    lifecycleDecade: decade,
    selectedScene: scene,
    onHoverVenue,
    onSelectVenue: (venue) => onSelectVenue(venue.properties.id),
  });

  React.useEffect(() => {
    if (isLoaded) updateChoroplethYear(decade);
  }, [decade, isLoaded, updateChoroplethYear]);

  return (
    <section className="central-map" data-ui-layer aria-label={`New York jazz-club map in the ${decade}s`}>
      <div ref={containerRef} className="central-map-canvas" />
      <div className="map-glass" aria-hidden="true" />
      {decade < 1980 && <small className="map-model-note">pre-1980 rent modeled from 1980 census data</small>}
      {!configured && (
        <div className="map-token-fallback" role="status">
          <span>NEW YORK</span>
          <b>Mapbox token needed</b>
          <small>The gallery and club index remain available.</small>
        </div>
      )}
      <div className="map-legend" aria-hidden="true">
        <i className="active" /> active <i className="closed" /> closed <i className="future" /> not yet open
      </div>
    </section>
  );
}
