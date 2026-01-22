import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { DivIcon, type Map as LeafletMap, type Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Bakery } from '@/data/bakeries';
import MapFiltersOverlay from '@/components/MapFiltersOverlay';

// Custom marker icon (colored using design tokens)
const markerIcon = new DivIcon({
  className: 'cph-food-files-marker',
  html: `
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="6" fill="hsl(var(--accent))" />
    </svg>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});

// Hover/selected marker icon (gold)
const markerIconHover = new DivIcon({
  className: 'cph-food-files-marker',
  html: `
    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="6" fill="hsl(var(--marker-hover))" />
    </svg>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10],
});

type BakeryMapProps = {
  selectedBakeryName?: string | null;
  bakeries: Bakery[];
  onSelectFoodTags?: (tags: string[]) => void;
  onSelectMoodTags?: (tags: string[]) => void;
  onSelectHoodTags?: (tags: string[]) => void;
};

const BakeryMap = ({
  selectedBakeryName,
  bakeries,
  onSelectFoodTags,
  onSelectMoodTags,
  onSelectHoodTags,
}: BakeryMapProps) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({});

  // Single source of truth: `Index` decides which bakeries are currently in-scope.
  // The map only additionally hides entries without coordinates.
  const bakeriesWithCoords = useMemo(
    () => bakeries.filter((bakery) => bakery.latitude !== null && bakery.longitude !== null),
    [bakeries],
  );

  useEffect(() => {
    if (!selectedBakeryName) return;

    const marker = markerRefs.current[selectedBakeryName];
    if (!marker) return;

    marker.openPopup();
    const map = mapRef.current;
    if (!map) return;

    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 14), { animate: true });
  }, [selectedBakeryName]);

  return (
    <div
      data-map-theme="cph-food-files"
      className="relative w-full h-[400px] rounded-lg overflow-hidden"
    >
      <MapFiltersOverlay
        onSelectFoodTag={(tags) => {
          onSelectFoodTags?.(tags);
        }}
        onSelectMoodTag={(tags) => {
          onSelectMoodTags?.(tags);
        }}
        onSelectHoodTag={(tags) => {
          onSelectHoodTags?.(tags);
        }}
      />
      {/*
        Leaflet tiles are raster images, so we approximate a retro pale-yellow + pale-grey look
        via CSS filters (no change to map functionality).
      */}
      <style>{`
        [data-map-theme="cph-food-files"] .leaflet-container {
          background: hsl(var(--background));
        }
        [data-map-theme="cph-food-files"] .leaflet-tile {
          filter: grayscale(1) contrast(0.9) brightness(1.15);
          opacity: 0.92;
        }

        [data-map-theme="cph-food-files"] .cph-food-files-marker {
          background: transparent;
          border: 0;
        }

        [data-map-theme="cph-food-files"] .cph-food-files-marker svg {
          display: block;
          filter: drop-shadow(0 1px 0 hsl(var(--border))) drop-shadow(0 2px 4px hsl(var(--foreground) / 0.18));
        }

        [data-map-theme="cph-food-files"] .cph-food-files-marker:hover svg circle {
          fill: hsl(var(--marker-hover));
        }

        /* Popup typography + link colors (match global page styles) */
        [data-map-theme="cph-food-files"] .leaflet-popup-content-wrapper,
        [data-map-theme="cph-food-files"] .leaflet-popup-content {
          font-family: inherit;
           font-size: 14px;
           line-height: 1.6;
          color: hsl(var(--foreground));
        }

        /* Square popups (no rounded corners) */
        [data-map-theme="cph-food-files"] .leaflet-popup-content-wrapper,
        [data-map-theme="cph-food-files"] .leaflet-popup-tip {
          border-radius: 0;
        }

        [data-map-theme="cph-food-files"] .leaflet-popup-content a {
          color: hsl(var(--primary));
          text-decoration: none;
        }
        [data-map-theme="cph-food-files"] .leaflet-popup-content a:hover {
          color: hsl(var(--accent));
          text-decoration: none;
        }

        [data-map-theme="cph-food-files"] .leaflet-control-attribution {
          color: hsl(var(--muted-foreground));
        }
        [data-map-theme="cph-food-files"] .leaflet-control-attribution a {
          color: hsl(var(--muted-foreground));
        }
      `}</style>
      <MapContainer
        ref={mapRef as any}
        center={[55.6761, 12.5683]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={false}
        whenReady={() => {
          // Defensive: ensure the default (top-left) zoom control is removed,
          // so only our explicit top-right ZoomControl remains.
          const map = mapRef.current as any;
          if (!map) return;
          if (map.zoomControl) {
            map.removeControl(map.zoomControl);
          }
        }}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {bakeriesWithCoords.map((bakery) => (
          <Marker
            key={bakery.name}
            position={[bakery.latitude!, bakery.longitude!]}
            icon={bakery.name === selectedBakeryName ? markerIconHover : markerIcon}
            ref={(marker) => {
              markerRefs.current[bakery.name] = marker;
            }}
          >
            <Popup>
              <div className="text-sm">
                <a
                  href={bakery.website || bakery.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    bakery.temporarilyClosed
                      ? 'font-semibold text-muted-foreground hover:text-muted-foreground'
                      : 'font-semibold text-primary hover:text-accent'
                  }
                >
                  {bakery.name}
                  {bakery.temporarilyClosed ? ' (Temporarily Closed)' : ''}
                </a>
                <div className="mt-1">
                  <a
                    href={bakery.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      bakery.temporarilyClosed
                        ? 'text-xs text-muted-foreground hover:text-muted-foreground'
                        : 'text-xs text-primary/80 hover:text-accent'
                    }
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BakeryMap;