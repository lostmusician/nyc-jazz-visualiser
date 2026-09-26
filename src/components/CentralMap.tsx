import React from 'react';
import type { Decade } from '../gallery/model';
import { useMapbox } from '../hooks/useMapbox';
import type { MapCameraState, SceneMovement, VenueFeature } from '../types';

interface CentralMapProps {
  venues: VenueFeature[];
  decade: Decade;
  scene: SceneMovement | 'all';
  hoveredVenueId: string | null;
  selectedVenueId: string | null;
  mode?: 'gallery' | 'story';
  cameraTarget?: MapCameraState;
  highlightedVenueIds?: string[];
  interactionEnabled?: boolean;
  reducedMotion?: boolean;
  onHoverVenue: (venueId: string | null) => void;
  onSelectVenue: (venueId: string) => void;
}

const INITIAL_CAMERA = { center: [-73.98, 40.735] as [number, number], zoom: 10.25, pitch: 0, bearing: 0 };

export function CentralMap({
  venues,
  decade,
  scene,
  hoveredVenueId,
  selectedVenueId,
  mode = 'gallery',
  cameraTarget,
  highlightedVenueIds,
  interactionEnabled = true,
  reducedMotion = false,
  onHoverVenue,
  onSelectVenue,
}: CentralMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const configured = Boolean(import.meta.env.VITE_MAPBOX_TOKEN);
  const highlighted = highlightedVenueIds ?? [hoveredVenueId, selectedVenueId].filter(Boolean) as string[];
  const { isLoaded, updateChoroplethYear, flyTo, jumpTo, resize } = useMapbox({
    containerRef,
    initialCamera: INITIAL_CAMERA,
    venues,
    activeVenueIds: highlighted,
    choroplethDataPath: '/data/nyc_rent_history.geojson',
    selectedYear: decade,
    lifecycleDecade: decade,
    selectedScene: scene,
    interactionEnabled,
    onHoverVenue,
    onSelectVenue: (venue) => onSelectVenue(venue.properties.id),
  });

  React.useEffect(() => {
    if (isLoaded) updateChoroplethYear(decade);
  }, [decade, isLoaded, updateChoroplethYear]);

  React.useEffect(() => {
    if (!isLoaded || !cameraTarget) return;
    if (reducedMotion) jumpTo(cameraTarget);
    else flyTo(cameraTarget);
  }, [cameraTarget, flyTo, isLoaded, jumpTo, reducedMotion]);

  React.useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => resize());
    return () => window.cancelAnimationFrame(frame);
  }, [mode, resize]);

  return (
    <section className={`central-map central-map--${mode}`} data-ui-layer data-tour="map" data-map-mode={mode} aria-label={`New York jazz-club map in the ${decade}s`}>
      <div ref={containerRef} className="central-map-canvas" />
      <div className="map-glass" aria-hidden="true" />
      <small className="map-model-note">{decade < 1980 ? 'Historical housing context only · mapped rent begins in 1980' : `${decade} median residential contract rent · constant 2020 dollars · not commercial leases`}</small>
      {!configured && (
        <div className="map-token-fallback" role="status">
          <span>NEW YORK</span>
          <b>Mapbox token needed</b>
          <small>{mode === 'story' ? 'The decade story remains available.' : 'The gallery and club index remain available.'}</small>
        </div>
      )}
      <div className="map-legend" aria-hidden="true">
        <i className="active" /> active this decade <i className="closed" /> earlier clubs · zoom in
      </div>
      {decade >= 1980 && <div className="rent-legend" aria-label={`Residential rent scale for ${decade} in constant 2020 dollars`}><span>$400</span><i /><span>$3,400+</span></div>}
    </section>
  );
}
