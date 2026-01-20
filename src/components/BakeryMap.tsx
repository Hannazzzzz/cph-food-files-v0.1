import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
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

const BakeryMap = () => {
  // Filter bakeries that have valid coordinates
  const bakeriesWithCoords = bakeries.filter(
    (bakery) => bakery.latitude !== null && bakery.longitude !== null
  );

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[55.6761, 12.5683]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bakeriesWithCoords.map((bakery, index) => (
          <Marker 
            key={index} 
            position={[bakery.latitude!, bakery.longitude!]} 
            icon={markerIcon}
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
                    className="text-xs text-blue-600 hover:underline"
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