import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { CPI_U_ANNUAL, RENT_2020_DOLLAR_STOPS, rentValues, type RentDataYear } from '../data/rent';
import { HISTORICAL_VENUE_MIN_ZOOM, statusForDecade } from '../gallery/model';
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
  interactionEnabled?: boolean;
  onSelectVenue?: (venue: VenueFeature) => void;
  onHoverVenue?: (venueId: string | null) => void;
}

const rentDataYear = (year: number): RentDataYear => year >= 2020 ? 2020 : Math.max(1980, Math.floor(year / 10) * 10) as RentDataYear;

export const getChoroplethPaint = (year: number) => {
  const dataYear = rentDataYear(year);
  const valueExpression: unknown[] = ['coalesce', ['get', `rent_2020_dollars_${dataYear}`], ['*', ['coalesce', ['get', `rent_${dataYear}`], 0], CPI_U_ANNUAL[2020] / CPI_U_ANNUAL[dataYear]]];
  const [a, b, c, d, e, f, g, h] = RENT_2020_DOLLAR_STOPS;
  return ['interpolate', ['linear'], valueExpression,
    0, 'rgba(11,8,7,0)', a, '#211814', b, '#35241d', c, '#513124', d, '#74452d',
    e, '#9a6138', f, '#b87941', g, '#d59d59', h, '#edc273',
  ] as mapboxgl.Expression;
};

const buildVenueCollection = (venues: VenueFeature[], decade: number, highlightedIds: string[], selectedScene: SceneMovement | 'all') => ({
  type: 'FeatureCollection' as const,
  features: venues.map((venue) => {
    const { id, close_year: closed } = venue.properties;
    const eraStatus = statusForDecade(venue, decade);
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
  interactionEnabled = true,
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
    const rentPopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 10, className: 'rent-popup' });
    map.on('load', () => {
      const firstSymbol = map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id;
      if (choroplethDataPath) {
        map.addSource('rent-data', { type: 'geojson', data: choroplethDataPath, generateId: true });
        map.addLayer({
          id: 'rent-choropleth', type: 'fill', source: 'rent-data',
          paint: { 'fill-color': getChoroplethPaint(yearRef.current), 'fill-opacity': yearRef.current < 1980 ? 0 : 0.64, 'fill-opacity-transition': { duration: 700 } },
        }, firstSymbol);
        map.addLayer({
          id: 'rent-lines', type: 'line', source: 'rent-data',
          paint: { 'line-color': '#d0a56d', 'line-width': 0.45, 'line-opacity': yearRef.current < 1980 ? 0 : 0.16 },
        }, firstSymbol);
      }
      map.addSource('jazz-venues', {
        type: 'geojson',
        data: buildVenueCollection(venuesRef.current, lifecycleDecadeRef.current, activeVenueIdsRef.current, selectedSceneRef.current),
      });
      const activeOrHighlightedFilter: mapboxgl.FilterSpecification = [
        'any',
        ['==', ['get', 'era_status'], 'active'],
        ['boolean', ['get', 'highlighted'], false],
      ];
      const historicalFilter: mapboxgl.FilterSpecification = [
        'all',
        ['==', ['get', 'era_status'], 'closed'],
        ['!', ['boolean', ['get', 'highlighted'], false]],
      ];
      map.addLayer({
        id: 'jazz-venue-halo', type: 'circle', source: 'jazz-venues',
        filter: activeOrHighlightedFilter,
        paint: {
          'circle-radius': ['case', ['boolean', ['get', 'highlighted'], false], 18, 10],
          'circle-color': ['case', ['boolean', ['get', 'highlighted'], false], '#fff0b5', '#e39a46'],
          'circle-opacity': ['case', ['!', ['boolean', ['get', 'scene_match'], true]], 0.07, 0.3],
          'circle-blur': 0.35,
        },
      });
      map.addLayer({
        id: 'jazz-venue-historical-halo', type: 'circle', source: 'jazz-venues',
        minzoom: HISTORICAL_VENUE_MIN_ZOOM,
        filter: historicalFilter,
        paint: {
          'circle-radius': 6,
          'circle-color': '#55392f',
          'circle-opacity': ['case',
            ['!', ['boolean', ['get', 'scene_match'], true]], 0.04,
            ['interpolate', ['linear'], ['zoom'], HISTORICAL_VENUE_MIN_ZOOM, 0, HISTORICAL_VENUE_MIN_ZOOM + 0.75, 0.3],
          ],
          'circle-blur': 0.35,
        },
      });
      map.addLayer({
        id: 'jazz-venue-pin', type: 'circle', source: 'jazz-venues',
        filter: activeOrHighlightedFilter,
        paint: {
          'circle-radius': ['case', ['boolean', ['get', 'highlighted'], false], 7, 4.5],
          'circle-color': ['case', ['boolean', ['get', 'highlighted'], false], '#fff0b5', '#e7a04d'],
          'circle-stroke-width': 1.4,
          'circle-stroke-color': '#f2d3a0',
          'circle-opacity': ['case', ['!', ['boolean', ['get', 'scene_match'], true]], 0.16, 1],
        },
      });
      map.addLayer({
        id: 'jazz-venue-historical-pin', type: 'circle', source: 'jazz-venues',
        minzoom: HISTORICAL_VENUE_MIN_ZOOM,
        filter: historicalFilter,
        paint: {
          'circle-radius': 3.5,
          'circle-color': '#4b342c',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#b79777',
          'circle-opacity': ['case',
            ['!', ['boolean', ['get', 'scene_match'], true]], 0.12,
            ['interpolate', ['linear'], ['zoom'], HISTORICAL_VENUE_MIN_ZOOM, 0, HISTORICAL_VENUE_MIN_ZOOM + 0.75, 0.9],
          ],
        },
      });
      map.addLayer({
        id: 'jazz-venue-label', type: 'symbol', source: 'jazz-venues', minzoom: 12,
        filter: activeOrHighlightedFilter,
        layout: { 'text-field': ['get', 'display_label'], 'text-size': 10, 'text-offset': [0, 1.2], 'text-anchor': 'top', 'text-optional': true },
        paint: { 'text-color': '#ead4b0', 'text-halo-color': '#0b0807', 'text-halo-width': 2 },
      });
      map.addLayer({
        id: 'jazz-venue-historical-label', type: 'symbol', source: 'jazz-venues', minzoom: 14,
        filter: historicalFilter,
        layout: { 'text-field': ['get', 'display_label'], 'text-size': 9, 'text-offset': [0, 1.1], 'text-anchor': 'top', 'text-optional': true },
        paint: { 'text-color': '#bba589', 'text-halo-color': '#0b0807', 'text-halo-width': 2 },
      });
      const selectVenue = (event: mapboxgl.MapLayerMouseEvent) => {
        const venueId = String(event.features?.[0]?.properties?.venue_id ?? '');
        const venue = venuesRef.current.find((candidate) => candidate.properties.id === venueId);
        if (venue) selectRef.current?.(venue);
      };
      const hoverVenue = (event: mapboxgl.MapLayerMouseEvent) => {
        map.getCanvas().style.cursor = 'pointer';
        const venueId = event.features?.[0]?.properties?.venue_id;
        if (venueId) hoverRef.current?.(String(venueId));
      };
      const leaveVenue = () => {
        map.getCanvas().style.cursor = '';
        hoverRef.current?.(null);
      };
      for (const layerId of ['jazz-venue-pin', 'jazz-venue-historical-pin']) {
        map.on('click', layerId, selectVenue);
        map.on('mousemove', layerId, hoverVenue);
        map.on('mouseleave', layerId, leaveVenue);
      }
      if (choroplethDataPath) {
        map.on('mousemove', 'rent-choropleth', (event) => {
          if (yearRef.current < 1980 || !event.features?.[0]) return;
          const year = rentDataYear(yearRef.current);
          const nominal = Number(event.features[0].properties?.[`rent_${year}`]);
          if (!Number.isFinite(nominal) || nominal <= 0) return;
          const values = rentValues(nominal, year);
          const node = document.createElement('div');
          const place = document.createElement('strong');
          place.textContent = String(event.features[0].properties?.boro ?? 'NYC tract');
          const adjusted = document.createElement('span');
          adjusted.textContent = `$${values.constant2020.toLocaleString()}/month in 2020 dollars`;
          const original = document.createElement('small');
          original.textContent = `$${values.nominal.toLocaleString()} reported in ${year}`;
          node.append(place, adjusted, original);
          rentPopup.setLngLat(event.lngLat).setDOMContent(node).addTo(map);
        });
        map.on('mouseleave', 'rent-choropleth', () => rentPopup.remove());
      }
      setIsLoaded(true);
      map.resize();
    });
    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
      rentPopup.remove();
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;
    const handlers = [
      map.boxZoom,
      map.doubleClickZoom,
      map.dragPan,
      map.dragRotate,
      map.keyboard,
      map.scrollZoom,
      map.touchPitch,
      map.touchZoomRotate,
    ];
    handlers.forEach((handler) => interactionEnabled ? handler.enable() : handler.disable());
    map.getCanvas().style.cursor = interactionEnabled ? '' : 'default';
  }, [interactionEnabled, isLoaded]);

  const updateChoroplethYear = useCallback((year: number) => {
    yearRef.current = year;
    const map = mapRef.current;
    if (map?.getLayer('rent-choropleth')) {
      map.setPaintProperty('rent-choropleth', 'fill-color', getChoroplethPaint(year));
      map.setPaintProperty('rent-choropleth', 'fill-opacity', year < 1980 ? 0 : 0.64);
      map.setPaintProperty('rent-lines', 'line-opacity', year < 1980 ? 0 : 0.16);
    }
  }, []);

  const flyTo = useCallback((camera: MapCameraState) => {
    mapRef.current?.flyTo({ center: camera.center, zoom: camera.zoom, pitch: camera.pitch ?? 0, bearing: camera.bearing ?? 0, essential: true });
  }, []);

  const jumpTo = useCallback((camera: MapCameraState) => {
    mapRef.current?.jumpTo({ center: camera.center, zoom: camera.zoom, pitch: camera.pitch ?? 0, bearing: camera.bearing ?? 0 });
  }, []);

  const resize = useCallback(() => mapRef.current?.resize(), []);

  return { map: mapRef.current, isLoaded, updateChoroplethYear, flyTo, jumpTo, resize };
}
