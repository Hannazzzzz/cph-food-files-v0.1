import { useEffect, useMemo, useRef, useState } from 'react';
import { LayerGroup, MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { DivIcon, type Map as LeafletMap, type Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Bakery } from '@/data/bakeries';
import MapFiltersOverlay from '@/components/MapFiltersOverlay';
import MarkerClusterGroup from '@/components/MarkerClusterGroup';

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
  initialFoodTags?: string[];
  initialMoodTags?: string[];
  initialHoodTags?: string[];
  onSelectFoodTags?: (tags: string[]) => void;
  onSelectMoodTags?: (tags: string[]) => void;
  onSelectHoodTags?: (tags: string[]) => void;
};

const BakeryMap = ({
  selectedBakeryName,
  bakeries,
  initialFoodTags,
  initialMoodTags,
  initialHoodTags,
  onSelectFoodTags,
  onSelectMoodTags,
  onSelectHoodTags,
}: BakeryMapProps) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({});
  const [clusterSelectedBakery, setClusterSelectedBakery] = useState<string | null>(null);

  // Single source of truth: `Index` decides which bakeries are currently in-scope.
  // The map only additionally hides entries without coordinates.
  const bakeriesWithCoords = useMemo(
    () => bakeries.filter((bakery) => bakery.latitude !== null && bakery.longitude !== null),
    [bakeries],
  );

  // Workaround: ensure Leaflet layers fully sync when the dataset shrinks/expands.
  // (Some Leaflet layer edge-cases can leave stale markers visible.)
  const markerLayerKey = useMemo(
    () => bakeriesWithCoords.map((b) => b.name).sort((a, b) => a.localeCompare(b)).join('|'),
    [bakeriesWithCoords],
  );

  useEffect(() => {
    const bakeryToShow = selectedBakeryName || clusterSelectedBakery;
    if (!bakeryToShow) return;

    const marker = markerRefs.current[bakeryToShow];
    if (!marker) return;

    marker.openPopup();
    const map = mapRef.current;
    if (!map) return;

    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 14), { animate: true });

    // Reset cluster selection after showing the marker
    if (clusterSelectedBakery) {
      setClusterSelectedBakery(null);
    }
  }, [selectedBakeryName, clusterSelectedBakery]);

  return (
    <div
      data-map-theme="cph-food-files"
      className="relative w-full h-[400px] rounded-lg overflow-hidden"
    >
      <MapFiltersOverlay
        initialFoodTags={initialFoodTags}
        initialMoodTags={initialMoodTags}
        initialHoodTags={initialHoodTags}
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

        /*
          Keep Leaflet controls above the top overlay area.
          (Dropdown menus still render above everything via their own z-index.)
        */
        [data-map-theme="cph-food-files"] .leaflet-top.leaflet-right {
          z-index: 1600;
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

        /* Cluster marker styles */
        [data-map-theme="cph-food-files"] .cph-food-files-cluster {
          background: transparent;
          border: 0;
        }

        [data-map-theme="cph-food-files"] .cluster-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
          font-weight: 600;
          font-size: 10px;
          box-shadow: 0 1px 3px hsl(var(--foreground) / 0.2);
          border: 1.5px solid hsl(var(--background));
          cursor: pointer;
          transition: all 0.2s ease;
        }

        [data-map-theme="cph-food-files"] .cluster-marker:hover {
          background: hsl(var(--marker-hover));
          transform: scale(1.15);
        }

        [data-map-theme="cph-food-files"] .cluster-marker-small {
          width: 20px;
          height: 20px;
          font-size: 9px;
        }

        [data-map-theme="cph-food-files"] .cluster-marker-medium {
          width: 24px;
          height: 24px;
          font-size: 10px;
        }

        [data-map-theme="cph-food-files"] .cluster-marker-large {
          width: 28px;
          height: 28px;
          font-size: 11px;
        }

        /* Cluster popup styles */
        [data-map-theme="cph-food-files"] .cluster-popup {
          max-height: 400px;
          overflow-y: auto;
        }

        [data-map-theme="cph-food-files"] .cluster-popup-header {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
        }

        [data-map-theme="cph-food-files"] .cluster-popup-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        [data-map-theme="cph-food-files"] .cluster-popup-item {
          padding: 8px;
          border-radius: 4px;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          transition: all 0.2s ease;
        }

        [data-map-theme="cph-food-files"] .cluster-popup-item:hover {
          background: hsl(var(--accent) / 0.1);
          border-color: hsl(var(--accent));
        }

        [data-map-theme="cph-food-files"] .cluster-popup-item-name {
          margin-bottom: 4px;
          cursor: pointer;
        }

        [data-map-theme="cph-food-files"] .cluster-popup-item-name a {
          font-weight: 600;
          font-size: 13px;
        }

        [data-map-theme="cph-food-files"] .cluster-popup-item-link a {
          font-size: 11px;
        }

        [data-map-theme="cph-food-files"] .cluster-popup-item a.temporarily-closed {
          color: hsl(var(--muted-foreground));
        }

        [data-map-theme="cph-food-files"] .cluster-popup-item a.temporarily-closed:hover {
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
        <MarkerClusterGroup
          bakeries={bakeriesWithCoords}
          onBakeryClick={(bakeryName) => setClusterSelectedBakery(bakeryName)}
        >
          <LayerGroup key={markerLayerKey}>
            {bakeriesWithCoords.map((bakery) => (
              <Marker
                key={bakery.name}
                position={[bakery.latitude!, bakery.longitude!]}
                icon={bakery.name === selectedBakeryName ? markerIconHover : markerIcon}
                ref={(marker) => {
                  markerRefs.current[bakery.name] = marker;
                }}
                // @ts-ignore - Custom option for cluster identification
                bakeryName={bakery.name}
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
          </LayerGroup>
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default BakeryMap;