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
  selectedDecade?: string;
  onSelectVenue?: (venue: VenueFeature) => void;
}

export function useMapbox({
  containerRef,
  initialCamera,
  venues,
  activeVenueIds,
  choroplethDataPath,
  selectedDecade = '1970',
  onSelectVenue
}: UseMapboxProps) {
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; popup: mapboxgl.Popup; venue: VenueFeature }>>(new Map());
  const currentDecadeRef = useRef<string>(selectedDecade);
  const venuesRef = useRef<VenueFeature[]>(venues);
  venuesRef.current = venues;
  const onSelectVenueRef = useRef(onSelectVenue);
  onSelectVenueRef.current = onSelectVenue;

  // Helper to map any decade (including 1950-1970) to available census rent properties
  const getCensusYearForDecade = (dec: string) => {
    const d = parseInt(dec, 10);
    if (d <= 1980) return '1980';
    if (d <= 1990) return '1990';
    if (d <= 2000) return '2000';
    if (d <= 2010) return '2010';
    return '2020';
  };

  // Helper to get paint color expression for a given decade
  const getChoroplethPaint = useCallback((decade: string) => {
    const censusYr = getCensusYearForDecade(decade);
    const prop = `rent_${censusYr}`;
    return [
      'case',
      ['==', ['get', prop], null],
      'transparent',
      [
        'interpolate',
        ['linear'],
        ['get', prop],
        100, '#f7f2e7',   // Light Archival Paper
        350, '#ebd49d',   // Pale Gold
        700, '#cda250',   // Warm Brass
        1200, '#c25a38',  // Terracotta / Burnt Orange
        2000, '#962d1d',  // Archival Crimson
        3200, '#38140e'   // Deep Roast Espresso
      ]
    ] as any;
  }, []);

  // Helper to build GeoJSON FeatureCollection for venues in a given era
  const buildVenuesGeoJSON = useCallback((venueList: VenueFeature[], decade: string) => {
    const decNum = parseInt(decade, 10);
    const endDecYear = decNum + 9;

    return {
      type: 'FeatureCollection' as const,
      features: venueList.map(v => {
        const { id, name, open_year, close_year, scene_movement } = v.properties;
        let era_status = 'active';

        if (open_year && open_year > endDecYear) {
          era_status = 'future';
        } else if (close_year && close_year < decNum) {
          era_status = 'closed';
        } else if (close_year && close_year >= decNum && close_year <= endDecYear) {
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

  // Helper to generate rich popup HTML for a venue in a given era
  const getVenuePopupHTML = useCallback((venue: VenueFeature, decade: string) => {
    const { name, open_year, close_year, scene_movement, address, neighborhood, closing_reason, quote, notes } = venue.properties;
    const decNum = parseInt(decade, 10);
    const endDecYear = decNum + 9;

    let statusText = '';
    let statusClass = 'open';

    if (open_year && open_year > endDecYear) {
      statusText = `NOT FOUNDED YET (OPENS IN ${open_year})`;
      statusClass = 'future';
    } else if (close_year && close_year < decNum) {
      statusText = `DISPLACED & CLOSED (IN ${close_year})`;
      statusClass = 'closed';
    } else if (close_year && close_year >= decNum && close_year <= endDecYear) {
      statusText = `LOST IN THIS ERA (${close_year})`;
      statusClass = 'closed';
    } else {
      statusText = 'VIBRANT & ACTIVE';
      statusClass = 'open';
    }

    const lifespan = open_year
      ? `${open_year} – ${close_year ? close_year : 'Present'}`
      : 'Mid-20th Century';

    return `
      <div class="archival-popup">
        <span class="popup-tag">${(scene_movement || '').replace(/_/g, ' ').toUpperCase()}</span>
        <h4>${name}</h4>
        <div class="popup-lifespan">${neighborhood} • ${lifespan}</div>
        <div class="popup-status-pill ${statusClass}">${decade}s Era: ${statusText}</div>
        
        <p class="font-mono text-[11px] text-[#73604d] mb-1">📍 ${address}</p>

        ${close_year && close_year <= endDecYear && closing_reason ? `
          <div class="mt-2.5 p-2 bg-[#faebd7] border border-[#a63d2b]/40 rounded text-xs text-[#2e1d14]">
            <strong class="text-[#a63d2b] font-sketch">Displacement Record:</strong> ${closing_reason}
          </div>
        ` : ''}

        ${quote ? `<p class="popup-quote">"${quote}"</p>` : ''}
        ${notes ? `<p class="popup-note text-[11px] mt-2 text-[#5c4d3c] italic">${notes}</p>` : ''}
      </div>
    `;
  }, []);

  // Update Choropleth & WebGL venue layers when decade or venues change
  const updateChoroplethDecade = useCallback((decade: string) => {
    currentDecadeRef.current = decade;
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('rent-choropleth')) {
      map.setPaintProperty('rent-choropleth', 'fill-color', getChoroplethPaint(decade));
    }

    // Update WebGL venues source
    const venuesSource = map.getSource('jazz-venues-webgl') as mapboxgl.GeoJSONSource | undefined;
    if (venuesSource) {
      venuesSource.setData(buildVenuesGeoJSON(venuesRef.current, decade));
    }
  }, [getChoroplethPaint, buildVenuesGeoJSON]);

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

      // 1. ADD CHOROPLETH SOURCE & LAYER
      if (choroplethDataPath) {
        map.addSource('rent-data', {
          type: 'geojson',
          data: choroplethDataPath,
          generateId: true
        });

        const firstSymbolId = map.getStyle().layers?.find(l => l.type === 'symbol')?.id;

        map.addLayer({
          id: 'rent-choropleth',
          type: 'fill',
          source: 'rent-data',
          paint: {
            'fill-color': getChoroplethPaint(currentDecadeRef.current),
            'fill-opacity': 0.7
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

        map.on('mousemove', 'rent-choropleth', (e) => {
          if (!e.features || e.features.length === 0) return;
          map.getCanvas().style.cursor = 'pointer';

          const f = e.features[0];
          const boro = f.properties?.boro || 'NYC';
          const tract = f.properties?.tract || '';
          const decade = currentDecadeRef.current;
          const censusYr = getCensusYearForDecade(decade);
          const rentVal = f.properties?.[`rent_${censusYr}`];
          const rentDisplay = rentVal ? `$${rentVal}/mo` : 'Data Unavailable';

          hoverPopup
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="px-2.5 py-1.5 font-sans text-xs bg-[#fbf8f0] border border-[#2e241c] rounded shadow-[2px_2px_0px_#2e241c]">
                <div class="font-typewriter text-[10px] text-[#8c7456]">${boro} // Tract ${tract}</div>
                <div class="font-bold text-[#1f1813]">${decade}s Median Rent: <span class="text-[#a63d2b] font-sketch text-sm">${rentDisplay}</span></div>
              </div>
            `)
            .addTo(map);
        });

        map.on('mouseleave', 'rent-choropleth', () => {
          map.getCanvas().style.cursor = '';
          hoverPopup.remove();
        });
      }

      // 2. ADD NATIVE WEBGL JAZZ VENUES SOURCE & LAYERS (Guarantees 100% visible pins)
      map.addSource('jazz-venues-webgl', {
        type: 'geojson',
        data: buildVenuesGeoJSON(venuesRef.current, currentDecadeRef.current)
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
          'circle-stroke-opacity': 0.6
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
          'circle-stroke-color': '#fffdf9'
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
        filter: ['!=', ['get', 'era_status'], 'future'],
        layout: {
          'text-field': ['get', 'display_label'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
          'text-offset': [0, 1.3],
          'text-anchor': 'top',
          'text-allow-overlap': true,
          'text-ignore-placement': true
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
      const venueClickPopup = new mapboxgl.Popup({
        offset: 16,
        closeButton: true,
        className: 'custom-popup'
      });

      map.on('click', 'jazz-venues-pin', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const venueId = feat.properties?.venue_id || feat.properties?.id;
        const matchedVenue = venuesRef.current.find(v => v.properties.id === venueId);

        if (matchedVenue) {
          venueClickPopup
            .setLngLat(e.lngLat)
            .setHTML(getVenuePopupHTML(matchedVenue, currentDecadeRef.current))
            .addTo(map);

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
  }, [containerRef, initialCamera, choroplethDataPath, getChoroplethPaint, buildVenuesGeoJSON, getVenuePopupHTML]);

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

    const decade = selectedDecade;
    currentDecadeRef.current = decade;
    const decNum = parseInt(decade, 10);
    const endDecYear = decNum + 9;

    // Update WebGL Source
    const venuesSource = map.getSource('jazz-venues-webgl') as mapboxgl.GeoJSONSource | undefined;
    if (venuesSource) {
      venuesSource.setData(buildVenuesGeoJSON(venues, decade));
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

      if (open_year && open_year > endDecYear) {
        lifecycleState = 'is-future';
      } else if (close_year && close_year < decNum) {
        lifecycleState = 'is-closed';
        labelSuffix = `<span class="displaced-badge">† ${close_year}</span>`;
      } else if (close_year && close_year >= decNum && close_year <= endDecYear) {
        lifecycleState = 'is-closed';
        labelSuffix = `<span class="displaced-badge">LOST ${close_year}</span>`;
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

        const popup = new mapboxgl.Popup({ offset: 16, closeButton: true, className: 'custom-popup' })
          .setHTML(getVenuePopupHTML(venue, decade));

        el.addEventListener('click', () => {
          if (onSelectVenueRef.current) onSelectVenueRef.current(venue);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.set(id, { marker, popup, venue });
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
        existing.popup.setHTML(getVenuePopupHTML(venue, decade));
      }
    });
  }, [venues, activeVenueIds, selectedDecade, isLoaded, buildVenuesGeoJSON, getVenuePopupHTML]);

  return { map: mapInstanceRef.current, isLoaded, flyTo, updateChoroplethDecade };
}
