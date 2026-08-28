import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MapCameraState, VenueFeature } from '../types';

interface UseMapboxProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  initialCamera: MapCameraState;
  venues: VenueFeature[];
  activeVenueIds: string[];
  choroplethDataPath?: string;
  selectedYear?: number;
  onSelectVenue?: (venue: VenueFeature) => void;
}

export function useMapbox({
  containerRef,
  initialCamera,
  venues,
  activeVenueIds,
  choroplethDataPath,
  selectedYear = 1970,
  onSelectVenue
}: UseMapboxProps) {
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; venue: VenueFeature }>>(new Map());
  const currentYearRef = useRef<number>(selectedYear);
  const venuesRef = useRef<VenueFeature[]>(venues);
  venuesRef.current = venues;
  const onSelectVenueRef = useRef(onSelectVenue);
  onSelectVenueRef.current = onSelectVenue;
  const lifecycleYear = Math.floor(selectedYear);

  // Interpolate rent values between census observations for each individual year.
  const getChoroplethPaint = useCallback((year: number) => {
    let valueExp: any;

    if (year < 1980) {
      const multiplier = 0.25 + ((year - 1950) / 30) * 0.75;
      valueExp = ['*', ['coalesce', ['get', 'rent_1980'], 0], multiplier];
    } else if (year >= 2020) {
      valueExp = ['coalesce', ['get', 'rent_2020'], 0];
    } else {
      const lowerYear = Math.floor(year / 10) * 10;
      const upperYear = lowerYear + 10;
      const progress = (year - lowerYear) / 10;
      const lowerValue = ['coalesce', ['get', `rent_${lowerYear}`], ['get', `rent_${upperYear}`], 0];
      const upperValue = ['coalesce', ['get', `rent_${upperYear}`], ['get', `rent_${lowerYear}`], 0];
      valueExp = ['+', ['*', lowerValue, 1 - progress], ['*', upperValue, progress]];
    }

    return [
      'interpolate',
      ['linear'],
      valueExp,
      0, 'rgba(0,0,0,0)',
      1, '#fbf8f0',     // Lightest Archival Parchment
      100, '#fbf8f0',   // 1950s baseline
      250, '#f5ecd7',   // Warm Antique Paper
      500, '#edd59e',   // Pale Gold
      850, '#c79d48',   // Warm Burnished Brass
      1400, '#c25a38',  // Terracotta / Burnt Sienna
      2200, '#9e3222',  // Archival Crimson
      3200, '#38140e'   // Deep Roast Espresso
    ] as any;
  }, []);

  // Helper to build GeoJSON FeatureCollection for venues in a given era
  const buildVenuesGeoJSON = useCallback((venueList: VenueFeature[], year: number) => {
    return {
      type: 'FeatureCollection' as const,
      features: venueList.map(v => {
        const { id, name, open_year, close_year, scene_movement } = v.properties;
        let era_status = 'active';

        if (open_year && open_year > year) {
          era_status = 'future';
        } else if (close_year && close_year <= year) {
          era_status = 'closed';
        } else {
          era_status = 'active';
        }

        const label = era_status === 'closed'
          ? `${name} [†${close_year}]`
          : name;

        return {
          type: 'Feature' as const,
          geometry: v.geometry,
          properties: {
            ...v.properties,
            venue_id: id,
            name: name,
            era_status,
            display_label: label,
            scene_movement: scene_movement || 'bebop_mainstream'
          }
        };
      })
    };
  }, []);

  // Smooth A/B layer cross-fade for each year change.
  const updateChoroplethYear = useCallback((year: number) => {
    currentYearRef.current = year;
    const map = mapInstanceRef.current;
    if (!map) return;

    // Update the active layer directly; fractional years make the expression itself continuous.
    try {
      const nextPaint = getChoroplethPaint(year);
      if (map.getLayer('rent-choropleth-a')) {
        map.setPaintProperty('rent-choropleth-a', 'fill-color', nextPaint);
        map.setPaintProperty('rent-choropleth-a', 'fill-opacity', 0.72);
      }
    } catch (err) {
      console.warn('Could not cross-fade choropleth:', err);
    }

  }, [getChoroplethPaint]);

  // Initialize Mapbox Canvas
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN || '';
    if (!token) {
      console.warn('Mapbox Token is not set. Please set VITE_MAPBOX_TOKEN in your .env file.');
    }
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: initialCamera.center,
      zoom: initialCamera.zoom,
      pitch: initialCamera.pitch || 0,
      bearing: initialCamera.bearing || 0,
      attributionControl: false,
      interactive: true,
    });

    map.on('error', (e) => {
      console.error('Mapbox error encountered:', e);
    });

    map.on('load', () => {
      mapInstanceRef.current = map;

      // 1. ADD CHOROPLETH SOURCE & DUAL A/B CROSS-FADING FILL LAYERS
      if (choroplethDataPath) {
        map.addSource('rent-data', {
          type: 'geojson',
          data: choroplethDataPath,
          generateId: true
        });

        const firstSymbolId = map.getStyle().layers?.find(l => l.type === 'symbol')?.id;

        // Buffer Layer A (Active initially)
        map.addLayer({
          id: 'rent-choropleth-a',
          type: 'fill',
          source: 'rent-data',
          paint: {
            'fill-color': getChoroplethPaint(currentYearRef.current),
            'fill-opacity': 0.72,
            'fill-opacity-transition': {
              duration: 950,
              delay: 0
            }
          }
        }, firstSymbolId);

        // Buffer Layer B (Standby for smooth cross-fading)
        map.addLayer({
          id: 'rent-choropleth-b',
          type: 'fill',
          source: 'rent-data',
          paint: {
            'fill-color': getChoroplethPaint(currentYearRef.current),
            'fill-opacity': 0,
            'fill-opacity-transition': {
              duration: 950,
              delay: 0
            }
          }
        }, firstSymbolId);
        
        map.addLayer({
          id: 'rent-choropleth-lines',
          type: 'line',
          source: 'rent-data',
          paint: {
            'line-color': '#2e241c',
            'line-width': 0.5,
            'line-opacity': 0.2
          }
        }, firstSymbolId);

        // Hover tooltip for census tract rent info
        const hoverPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 10,
          className: 'tract-hover-popup'
        });

        const handleTractHover = (e: mapboxgl.MapLayerMouseEvent) => {
          if (!e.features || e.features.length === 0) return;
          map.getCanvas().style.cursor = 'pointer';

          const f = e.features[0];
          const boro = f.properties?.boro || 'NYC';
          const tract = f.properties?.tract || '';
          const year = currentYearRef.current;
          let rentVal: number | null = null;
          if (year < 1980) {
            const base = Number(f.properties?.rent_1980);
            rentVal = Number.isFinite(base) ? base * (0.25 + ((year - 1950) / 30) * 0.75) : null;
          } else if (year >= 2020) {
            const value = Number(f.properties?.rent_2020);
            rentVal = Number.isFinite(value) ? value : null;
          } else {
            const lowerYear = Math.floor(year / 10) * 10;
            const upperYear = lowerYear + 10;
            const lower = Number(f.properties?.[`rent_${lowerYear}`]);
            const upper = Number(f.properties?.[`rent_${upperYear}`]);
            const progress = (year - lowerYear) / 10;
            if (Number.isFinite(lower) && Number.isFinite(upper)) rentVal = lower + (upper - lower) * progress;
            else if (Number.isFinite(lower)) rentVal = lower;
            else if (Number.isFinite(upper)) rentVal = upper;
          }

          const rentDisplay = rentVal !== null ? `$${Math.round(rentVal)}/mo` : 'Data unavailable';

          hoverPopup
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="px-2.5 py-1.5 font-sans text-xs bg-[#fbf8f0] border border-[#2e241c] rounded shadow-[2px_2px_0px_#2e241c]">
                <div class="font-typewriter text-[10px] text-[#8c7456]">${boro} // Tract ${tract}</div>
                <div class="font-bold text-[#1f1813]">${year} estimated rent: <span class="text-[#a63d2b] font-sketch text-sm">${rentDisplay}</span></div>
              </div>
            `)
            .addTo(map);
        };

        const handleTractLeave = () => {
          map.getCanvas().style.cursor = '';
          hoverPopup.remove();
        };

        map.on('mousemove', 'rent-choropleth-a', handleTractHover);
        map.on('mouseleave', 'rent-choropleth-a', handleTractLeave);
        map.on('mousemove', 'rent-choropleth-b', handleTractHover);
        map.on('mouseleave', 'rent-choropleth-b', handleTractLeave);
      }

      // 2. ADD NATIVE WEBGL JAZZ VENUES SOURCE & LAYERS
      map.addSource('jazz-venues-webgl', {
        type: 'geojson',
        data: buildVenuesGeoJSON(venuesRef.current, currentYearRef.current)
      });

      // Outer Halo Glow Layer
      map.addLayer({
        id: 'jazz-venues-halo',
        type: 'circle',
        source: 'jazz-venues-webgl',
        filter: ['!=', ['get', 'era_status'], 'future'],
        paint: {
          'circle-radius': [
            'case',
            ['==', ['get', 'era_status'], 'active'], 18,
            ['==', ['get', 'era_status'], 'closed'], 10,
            0
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'era_status'], 'active'], '#c59b4c',
            ['==', ['get', 'era_status'], 'closed'], '#a63d2b',
            'transparent'
          ],
          'circle-opacity': 0.35,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#1c140e',
          'circle-stroke-opacity': 0.6,
          'circle-radius-transition': { duration: 800, delay: 100 },
          'circle-color-transition': { duration: 900, delay: 0 },
          'circle-opacity-transition': { duration: 600, delay: 0 }
        }
      });

      // Solid Center Pin Circle
      map.addLayer({
        id: 'jazz-venues-pin',
        type: 'circle',
        source: 'jazz-venues-webgl',
        filter: ['!=', ['get', 'era_status'], 'future'],
        paint: {
          'circle-radius': [
            'case',
            ['==', ['get', 'era_status'], 'active'], 8.5,
            ['==', ['get', 'era_status'], 'closed'], 6,
            0
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'era_status'], 'active'], '#c9402a',
            ['==', ['get', 'era_status'], 'closed'], '#38221b',
            'transparent'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fffdf9',
          'circle-radius-transition': { duration: 800, delay: 100 },
          'circle-color-transition': { duration: 900, delay: 0 }
        }
      });

      // Center Dot
      map.addLayer({
        id: 'jazz-venues-inner-dot',
        type: 'circle',
        source: 'jazz-venues-webgl',
        filter: ['==', ['get', 'era_status'], 'active'],
        paint: {
          'circle-radius': 3,
          'circle-color': '#fffdf9'
        }
      });

      // Venue Text Labels with Archival Paper Halo
      map.addLayer({
        id: 'jazz-venues-labels',
        type: 'symbol',
        source: 'jazz-venues-webgl',
        minzoom: 13.0,
        filter: ['!=', ['get', 'era_status'], 'future'],
        layout: {
          'text-field': ['get', 'display_label'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 11,
          'text-offset': [0, 1.3],
          'text-anchor': 'top',
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'text-optional': true
        },
        paint: {
          'text-color': [
            'case',
            ['==', ['get', 'era_status'], 'active'], '#1c140e',
            ['==', ['get', 'era_status'], 'closed'], '#73604d',
            '#1c140e'
          ],
          'text-halo-color': '#fbf8f0',
          'text-halo-width': 2.5,
          'text-halo-blur': 0.5
        }
      });

      // Interactive Click & Hover on WebGL pins
      map.on('click', 'jazz-venues-pin', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const venueId = feat.properties?.venue_id || feat.properties?.id;
        const matchedVenue = venuesRef.current.find(v => v.properties.id === venueId);

        if (matchedVenue) {
          if (onSelectVenueRef.current) {
            onSelectVenueRef.current(matchedVenue);
          }
        }
      });

      map.on('mouseenter', 'jazz-venues-pin', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'jazz-venues-pin', () => {
        map.getCanvas().style.cursor = '';
      });

      // 3. ADD 3D BUILDINGS
      try {
        if (map.getSource('composite')) {
          map.addLayer({
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 14,
            paint: {
              'fill-extrusion-color': '#e8dfcf',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.3,
            },
          });
        }
      } catch (err) {
        console.warn('Could not add 3D buildings layer:', err);
      }

      setIsLoaded(true);
      map.resize();
    });

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [containerRef, initialCamera, choroplethDataPath, getChoroplethPaint, buildVenuesGeoJSON]);

  // Smooth cinematic camera transitions (flyTo)
  const flyTo = useCallback((camera: MapCameraState) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo({
      center: camera.center,
      zoom: camera.zoom,
      pitch: camera.pitch ?? 30,
      bearing: camera.bearing ?? 0,
      speed: 1.2,
      curve: 1.3,
      essential: true,
      easing: (t) => t * (2 - t),
    });
  }, []);

  // Update Custom HTML Markers and WebGL source when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isLoaded) return;

    const year = lifecycleYear;

    // Update WebGL Source
    try {
      const venuesSource = map.getSource('jazz-venues-webgl') as mapboxgl.GeoJSONSource | undefined;
      if (venuesSource) {
        venuesSource.setData(buildVenuesGeoJSON(venues, year));
      }
    } catch (err) {
      console.warn('Could not update venues source:', err);
    }

    // Clean up markers no longer in venues list
    markersRef.current.forEach(({ marker }, id) => {
      if (!venues.some((v) => v.properties.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    venues.forEach((venue) => {
      const { id, name, open_year, close_year } = venue.properties;
      const [lng, lat] = venue.geometry.coordinates;
      const isHighlighted = activeVenueIds.includes(id);

      let lifecycleState: 'is-open' | 'is-closed' | 'is-future' = 'is-open';
      let labelSuffix = '';

      if (open_year && open_year > year) {
        lifecycleState = 'is-future';
      } else if (close_year && close_year <= year) {
        lifecycleState = 'is-closed';
        labelSuffix = `<span class="displaced-badge">† ${close_year}</span>`;
      } else {
        lifecycleState = 'is-open';
      }

      let existing = markersRef.current.get(id);

      if (!existing) {
        const el = document.createElement('div');
        el.className = 'custom-jazz-marker';
        el.dataset.id = id;

        el.innerHTML = `
          <div class="marker-wrapper ${lifecycleState} ${isHighlighted ? 'is-highlighted' : ''}">
            <div class="marker-pin"></div>
            <div class="marker-pulse"></div>
            <span class="marker-label">${name} ${labelSuffix}</span>
          </div>
        `;

        el.addEventListener('click', () => {
          if (onSelectVenueRef.current) onSelectVenueRef.current(venue);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.set(id, { marker, venue });
      } else {
        const el = existing.marker.getElement();
        const wrapper = el.querySelector('.marker-wrapper');
        if (wrapper) {
          wrapper.className = `marker-wrapper ${lifecycleState} ${isHighlighted ? 'is-highlighted' : ''}`;
          const label = wrapper.querySelector('.marker-label');
          if (label) {
            label.innerHTML = `${name} ${labelSuffix}`;
          }
        }
      }
    });
  }, [venues, activeVenueIds, lifecycleYear, isLoaded, buildVenuesGeoJSON]);

  return { map: mapInstanceRef.current, isLoaded, flyTo, updateChoroplethYear };
}
