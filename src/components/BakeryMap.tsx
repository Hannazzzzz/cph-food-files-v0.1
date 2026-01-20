import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DivIcon, type Map as LeafletMap, type Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { bakeries } from '@/data/bakeries';

// Custom marker icon (colored using design tokens)
const markerIcon = new DivIcon({
  className: 'cph-food-files-marker',
  html: `
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M14 27C14 27 23 18.5 23 11.2C23 6.1 19 2 14 2C9 2 5 6.1 5 11.2C5 18.5 14 27 14 27Z"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--background))"
        stroke-width="2"
      />
      <circle cx="14" cy="11.5" r="4" fill="hsl(var(--background))" />
    </svg>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 27],
  popupAnchor: [0, -26],
});

type BakeryMapProps = {
  selectedBakeryName?: string | null;
};

const BakeryMap = ({ selectedBakeryName }: BakeryMapProps) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({});

  const bakeriesWithCoords = useMemo(
    () => bakeries.filter((bakery) => bakery.latitude !== null && bakery.longitude !== null),
    []
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
      className="w-full h-[400px] rounded-lg overflow-hidden"
    >
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

        [data-map-theme="cph-food-files"] .leaflet-popup-content a {
          color: hsl(var(--primary));
        }
        [data-map-theme="cph-food-files"] .leaflet-popup-content a:hover {
          color: hsl(var(--primary) / 0.8);
        }
      `}</style>
      <MapContainer
        ref={mapRef as any}
        center={[55.6761, 12.5683]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bakeriesWithCoords.map((bakery) => (
          <Marker
            key={bakery.name}
            position={[bakery.latitude!, bakery.longitude!]}
            icon={markerIcon}
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
                  className="font-semibold text-primary hover:underline"
                >
                  {bakery.name}
                </a>
                <div className="mt-1">
                  <a
                    href={bakery.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary/80 hover:underline"
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