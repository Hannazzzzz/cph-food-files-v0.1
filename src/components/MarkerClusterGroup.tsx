import { createPathComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import type { Bakery } from '@/data/bakeries';

type MarkerClusterGroupProps = {
  bakeries: Bakery[];
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

const MarkerClusterGroup = createPathComponent<
  L.MarkerClusterGroup,
  MarkerClusterGroupProps & { children?: React.ReactNode }
>(
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

      // Get bakery data for all markers in the cluster
      const clusterBakeries = markers
        .map((marker: any) => {
          const bakeryName = marker.options.bakeryName;
          return bakeries.find((b) => b.name === bakeryName);
        })
        .filter((b): b is Bakery => b !== undefined);

      // Create popup content with list of bakeries
      const popupContent = `
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

      const popup = L.popup({
        maxWidth: 300,
        maxHeight: 400,
        autoPan: true,
         // Nudge the popup down so it doesn't collide with the top overlay buttons.
         // (We also raise the popup pane z-index in BakeryMap styles, but this helps visually.)
         offset: L.point(0, 50),
        closeButton: true,
      })
        .setLatLng(cluster.getLatLng())
        .setContent(popupContent);

      popup.openOn(ctx.map);

      // Add click handlers to list items after popup is opened
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
    });

    return {
      instance: clusterGroup,
      context: { ...ctx, layerContainer: clusterGroup },
    };
  }
);

export default MarkerClusterGroup;
