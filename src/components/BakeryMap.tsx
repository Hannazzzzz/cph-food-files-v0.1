import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, type Map as LeafletMap, type Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { bakeries } from '@/data/bakeries';

// Custom marker icon
const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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
      className="w-full h-[400px] rounded-lg overflow-hidden border border-border"
    >
      {/*
        Leaflet tiles are raster images, so we approximate a retro pale-yellow + pale-grey look
        via CSS filters (no change to map functionality).
      */}
      <style>{`
        [data-map-theme="cph-food-files"] .leaflet-container {
          background: hsl(60 100% 95%);
        }
        [data-map-theme="cph-food-files"] .leaflet-tile {
          filter: grayscale(1) sepia(0.4) hue-rotate(10deg) saturate(0.6) brightness(1.1) contrast(0.85);
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