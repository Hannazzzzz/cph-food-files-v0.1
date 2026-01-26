import { createPathComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import type { Bakery } from '@/data/bakeries';

type MarkerClusterGroupProps = {
  bakeries: Bakery[];
  onBakeryClick?: (bakeryName: string) => void;
  onClusterGroupReady?: (clusterGroup: L.MarkerClusterGroup) => void;
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
  <div class="cluster-popup" role="dialog" aria-label="${clusterBakeries.length} bakeries at this location">
    <div class="cluster-popup-header" id="cluster-popup-title">
      ${clusterBakeries.length} location${clusterBakeries.length !== 1 ? 's' : ''} here
    </div>
    <ul class="cluster-popup-list" role="list" aria-labelledby="cluster-popup-title">
      ${clusterBakeries
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(
          (bakery) => `
          <li class="cluster-popup-item" data-bakery-name="${bakery.name}" role="listitem">
            <div class="cluster-popup-item-name">
              <a
                href="${bakery.website || bakery.url}"
                target="_blank"
                rel="noopener noreferrer"
                class="${bakery.temporarilyClosed ? 'temporarily-closed' : ''}"
                aria-label="${bakery.name}${bakery.temporarilyClosed ? ', temporarily closed' : ''}, opens in new tab"
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
                aria-label="View ${bakery.name} on Google Maps, opens in new tab"
              >
                View on Google Maps
              </a>
            </div>
          </li>
        `
        )
        .join('')}
    </ul>
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

const MarkerClusterGroup = createPathComponent<
  L.MarkerClusterGroup,
  MarkerClusterGroupProps & { children?: React.ReactNode }
>(
  // Create instance
  ({ bakeries, onBakeryClick, onClusterGroupReady, ...options }, ctx) => {
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

    // Notify parent that cluster group is ready
    if (onClusterGroupReady) {
      onClusterGroupReady(clusterGroup);
    }

    return {
      instance: clusterGroup,
      context: { ...ctx, layerContainer: clusterGroup },
    };
  }
);

export default MarkerClusterGroup;
