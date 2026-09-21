import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { MapCameraState, SceneMovement, VenueFeature } from '../types';

interface UseMapboxProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  initialCamera: MapCameraState;
  venues: VenueFeature[];
  activeVenueIds: string[];
  choroplethDataPath?: string;
  selectedYear?: number;
  lifecycleDecade?: number;
  selectedScene?: SceneMovement | 'all';
  onSelectVenue?: (venue: VenueFeature) => void;
  onHoverVenue?: (venueId: string | null) => void;
}

const getChoroplethPaint = (year: number) => {
  let valueExpression: unknown[];
  if (year < 1980) {
    valueExpression = ['*', ['coalesce', ['get', 'rent_1980'], 0], 0.25 + ((year - 1950) / 30) * 0.75];
  } else if (year >= 2020) {
    valueExpression = ['coalesce', ['get', 'rent_2020'], 0];
  } else {
    const lowerYear = Math.floor(year / 10) * 10;
    const upperYear = lowerYear + 10;
    const progress = (year - lowerYear) / 10;
    valueExpression = ['+',
      ['*', ['coalesce', ['get', `rent_${lowerYear}`], ['get', `rent_${upperYear}`], 0], 1 - progress],
      ['*', ['coalesce', ['get', `rent_${upperYear}`], ['get', `rent_${lowerYear}`], 0], progress],
    ];
  }
  return ['interpolate', ['linear'], valueExpression,
    0, 'rgba(11,8,7,0)', 100, '#211814', 250, '#35241d', 500, '#513124',
    850, '#74452d', 1400, '#9a6138', 2200, '#c58b4d', 3200, '#edc273',
  ] as mapboxgl.Expression;
};

const buildVenueCollection = (venues: VenueFeature[], decade: number, highlightedIds: string[], selectedScene: SceneMovement | 'all') => ({
  type: 'FeatureCollection' as const,
  features: venues.map((venue) => {
    const { id, open_year: opened, close_year: closed } = venue.properties;
    const eraStatus = opened !== null && opened > decade + 9 ? 'future' : closed !== null && closed < decade ? 'closed' : 'active';
    return {
      ...venue,
      properties: {
        ...venue.properties,
        venue_id: id,
        era_status: eraStatus,
        highlighted: highlightedIds.includes(id),
        scene_match: selectedScene === 'all' || venue.properties.scene_movement === selectedScene,
        display_label: eraStatus === 'closed' ? `${venue.properties.name} · closed ${closed}` : venue.properties.name,
      },
    };
  }),
});

export function useMapbox({
  containerRef,
  initialCamera,
  venues,
  activeVenueIds,
  choroplethDataPath,
  selectedYear = 1970,
  lifecycleDecade = selectedYear,
  selectedScene = 'all',
  onSelectVenue,
  onHoverVenue,
}: UseMapboxProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const venuesRef = useRef(venues);
  const activeVenueIdsRef = useRef(activeVenueIds);
  const lifecycleDecadeRef = useRef(lifecycleDecade);
  const selectedSceneRef = useRef(selectedScene);
  const selectRef = useRef(onSelectVenue);
  const hoverRef = useRef(onHoverVenue);
  const yearRef = useRef(selectedYear);
  const [isLoaded, setIsLoaded] = useState(false);
  venuesRef.current = venues;
  activeVenueIdsRef.current = activeVenueIds;
  lifecycleDecadeRef.current = lifecycleDecade;
  selectedSceneRef.current = selectedScene;
  selectRef.current = onSelectVenue;
  hoverRef.current = onHoverVenue;
  yearRef.current = selectedYear;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const token = import.meta.env.VITE_MAPBOX_TOKEN || '';
    if (!token) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: initialCamera.center,
      zoom: initialCamera.zoom,
      pitch: initialCamera.pitch ?? 0,
      bearing: initialCamera.bearing ?? 0,
      attributionControl: false,
      interactive: true,
    });
    mapRef.current = map;
    map.on('load', () => {
      const firstSymbol = map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id;
      if (choroplethDataPath) {
        map.addSource('rent-data', { type: 'geojson', data: choroplethDataPath, generateId: true });
        map.addLayer({
          id: 'rent-choropleth', type: 'fill', source: 'rent-data',
          paint: { 'fill-color': getChoroplethPaint(yearRef.current), 'fill-opacity': 0.64, 'fill-opacity-transition': { duration: 700 } },
        }, firstSymbol);
        map.addLayer({
          id: 'rent-lines', type: 'line', source: 'rent-data',
          paint: { 'line-color': '#d0a56d', 'line-width': 0.45, 'line-opacity': 0.16 },
        }, firstSymbol);
      }
      map.addSource('jazz-venues', {
        type: 'geojson',
        data: buildVenueCollection(venuesRef.current, lifecycleDecadeRef.current, activeVenueIdsRef.current, selectedSceneRef.current),
      });
      map.addLayer({
        id: 'jazz-venue-halo', type: 'circle', source: 'jazz-venues',
        paint: {
          'circle-radius': ['case', ['boolean', ['get', 'highlighted'], false], 18, ['==', ['get', 'era_status'], 'active'], 10, 6],
          'circle-color': ['case', ['boolean', ['get', 'highlighted'], false], '#fff0b5', ['==', ['get', 'era_status'], 'active'], '#e39a46', ['==', ['get', 'era_status'], 'closed'], '#55392f', '#84705f'],
          'circle-opacity': ['case', ['!', ['boolean', ['get', 'scene_match'], true]], 0.07, ['==', ['get', 'era_status'], 'future'], 0.15, 0.3],
          'circle-blur': 0.35,
        },
      });
      map.addLayer({
        id: 'jazz-venue-pin', type: 'circle', source: 'jazz-venues',
        paint: {
          'circle-radius': ['case', ['boolean', ['get', 'highlighted'], false], 7, 4.5],
          'circle-color': ['case', ['boolean', ['get', 'highlighted'], false], '#fff0b5', ['==', ['get', 'era_status'], 'active'], '#e7a04d', ['==', ['get', 'era_status'], 'closed'], '#4b342c', '#786859'],
          'circle-stroke-width': 1.4,
          'circle-stroke-color': '#f2d3a0',
          'circle-opacity': ['case', ['!', ['boolean', ['get', 'scene_match'], true]], 0.16, ['==', ['get', 'era_status'], 'future'], 0.28, 1],
        },
      });
      map.addLayer({
        id: 'jazz-venue-label', type: 'symbol', source: 'jazz-venues', minzoom: 12,
        layout: { 'text-field': ['get', 'display_label'], 'text-size': 10, 'text-offset': [0, 1.2], 'text-anchor': 'top', 'text-optional': true },
        paint: { 'text-color': '#ead4b0', 'text-halo-color': '#0b0807', 'text-halo-width': 2 },
      });
      map.on('click', 'jazz-venue-pin', (event) => {
        const venueId = String(event.features?.[0]?.properties?.venue_id ?? '');
        const venue = venuesRef.current.find((candidate) => candidate.properties.id === venueId);
        if (venue) selectRef.current?.(venue);
      });
      map.on('mousemove', 'jazz-venue-pin', (event) => {
        map.getCanvas().style.cursor = 'pointer';
        const venueId = event.features?.[0]?.properties?.venue_id;
        if (venueId) hoverRef.current?.(String(venueId));
      });
      map.on('mouseleave', 'jazz-venue-pin', () => {
        map.getCanvas().style.cursor = '';
        hoverRef.current?.(null);
      });
      setIsLoaded(true);
      map.resize();
    });
    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      setIsLoaded(false);
    };
  }, [containerRef, initialCamera, choroplethDataPath]);

  useEffect(() => {
    if (!isLoaded) return;
    const source = mapRef.current?.getSource('jazz-venues') as mapboxgl.GeoJSONSource | undefined;
    source?.setData(buildVenueCollection(venues, lifecycleDecade, activeVenueIds, selectedScene));
  }, [venues, lifecycleDecade, activeVenueIds, selectedScene, isLoaded]);

  const updateChoroplethYear = useCallback((year: number) => {
    yearRef.current = year;
    const map = mapRef.current;
    if (map?.getLayer('rent-choropleth')) map.setPaintProperty('rent-choropleth', 'fill-color', getChoroplethPaint(year));
  }, []);

  const flyTo = useCallback((camera: MapCameraState) => {
    mapRef.current?.flyTo({ center: camera.center, zoom: camera.zoom, pitch: camera.pitch ?? 0, bearing: camera.bearing ?? 0, essential: true });
  }, []);

  return { map: mapRef.current, isLoaded, updateChoroplethYear, flyTo };
}
