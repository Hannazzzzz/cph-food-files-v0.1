import { createPathComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import type { Bakery } from '@/data/bakeries';

type MarkerClusterGroupProps = {
  bakeries: Bakery[];
  selectedBakeryName?: string | null;
  onBakeryClick?: (bakeryName: string) => void;
  children?: React.ReactNode;
};

// Create a React Leaflet component for MarkerClusterGroup
const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 'small' : count < 100 ? 'medium' : 'large';

  // Determine icon size based on count (only slightly bigger than 16px marker)
  const iconSize = count < 10 ? 20 : count < 100 ? 24 : 28;

  return L.divIcon({
    html: `
      <div class="cluster-marker cluster-marker-${size}">
        <span>${count}</span>
      </div>
    `,
    className: 'cph-food-files-cluster',
    iconSize: L.point(iconSize, iconSize),
  });
};

// Helper function to create cluster popup content
const createClusterPopupContent = (clusterBakeries: Bakery[]) => `
  <div class="cluster-popup">
    <div class="cluster-popup-header">
      ${clusterBakeries.length} location${clusterBakeries.length !== 1 ? 's' : ''} here
    </div>
    <div class="cluster-popup-list">
      ${clusterBakeries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(
          (bakery) => `
          <div class="cluster-popup-item" data-bakery-name="${bakery.name}">
            <div class="cluster-popup-item-name">
              <a
                href="${bakery.website || bakery.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="${bakery.temporarilyClosed ? 'temporarily-closed' : ''}"
              >
                ${bakery.name}${bakery.temporarilyClosed ? ' (Temporarily Closed)' : ''}
              </a>
            </div>
            <div class="cluster-popup-item-link">
              <a
                href="${bakery.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="${bakery.temporarilyClosed ? 'temporarily-closed' : ''}"
              >
                View on Google Maps
              </a>
            </div>
          </div>
        `
        )
        .join('')}
    </div>
  </div>
`;

// Helper to add click handlers to cluster popup items
const addClusterPopupClickHandlers = (popup: L.Popup, onBakeryClick?: (name: string) => void) => {
  setTimeout(() => {
    const items = document.querySelectorAll('.cluster-popup-item');
    items.forEach((item) => {
      const clickableArea = item.querySelector('.cluster-popup-item-name');
      if (clickableArea) {
        clickableArea.addEventListener('click', (e) => {
          // Only trigger if not clicking on link
          if ((e.target as HTMLElement).tagName !== 'A') {
            const bakeryName = (item as HTMLElement).dataset.bakeryName;
            if (bakeryName && onBakeryClick) {
              onBakeryClick(bakeryName);
              popup.remove();
            }
          }
        });
      }
    });
  }, 0);
};

// Function to show popup for a specific bakery by name
const showPopupForBakeryName = (
  clusterGroup: L.MarkerClusterGroup,
  bakeryName: string
) => {
  // Find the marker in the cluster group's layers
  let targetMarker: L.Marker | null = null;
  clusterGroup.eachLayer((layer) => {
    if ((layer as any).options?.bakeryName === bakeryName) {
      targetMarker = layer as L.Marker;
    }
  });

  if (!targetMarker) return;

  // Open the marker's popup directly, even if it's in a cluster
  targetMarker.openPopup();
};

const MarkerClusterGroup = createPathComponent<
  L.MarkerClusterGroup,
  MarkerClusterGroupProps & { children?: React.ReactNode }
>(
  // Create instance
  ({ bakeries, onBakeryClick, ...options }, ctx) => {
    const clusterProps: L.MarkerClusterGroupOptions = {
      ...options,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      spiderfyOnMaxZoom: false,
      maxClusterRadius: 20, // Only cluster when markers significantly overlap
      disableClusteringAtZoom: 16, // Disable clustering at high zoom levels
      iconCreateFunction: createClusterCustomIcon,
    };

    const clusterGroup = L.markerClusterGroup(clusterProps);

    // Override cluster click to show popup list
    clusterGroup.on('clusterclick', (event) => {
      const cluster = event.layer as L.MarkerCluster;
      const markers = cluster.getAllChildMarkers();

      const clusterBakeries = markers
        .map((marker: any) => {
          const bakeryName = marker.options.bakeryName;
          return bakeries.find((b) => b.name === bakeryName);
        })
        .filter((b): b is Bakery => b !== undefined);

      const popup = L.popup({
        maxWidth: 300,
        maxHeight: 250,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(20, 90),
        autoPanPaddingBottomRight: L.point(20, 60),
        offset: L.point(0, -10),
        closeButton: true,
      })
        .setLatLng(cluster.getLatLng())
        .setContent(createClusterPopupContent(clusterBakeries));

      popup.openOn(ctx.map);
      addClusterPopupClickHandlers(popup, onBakeryClick);
    });

    return {
      instance: clusterGroup,
      context: { ...ctx, layerContainer: clusterGroup },
    };
  },
  // Update instance - called when props change
  (instance, { selectedBakeryName }) => {
    if (selectedBakeryName) {
      // Small delay to ensure cluster group has updated after zoom
      setTimeout(() => {
        showPopupForBakeryName(instance, selectedBakeryName);
      }, 100);
    }
  }
);

export default MarkerClusterGroup;
