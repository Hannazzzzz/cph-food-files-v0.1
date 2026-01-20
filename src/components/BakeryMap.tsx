import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { bakeries } from '@/data/bakeries';

// Neighbourhood center coordinates (approximate)
const neighbourhoodCoords: Record<string, [number, number]> = {
  'Østerbro': [55.7100, 12.5700],
  'Nordhavn': [55.7150, 12.5950],
  'Nørrebro': [55.6950, 12.5450],
  'Vesterbro': [55.6700, 12.5500],
  'Indre By': [55.6800, 12.5750],
  'Christianshavn': [55.6730, 12.5950],
  'Refshaleøen': [55.6900, 12.6150],
  'Frederiksberg': [55.6800, 12.5250],
  'Amager': [55.6550, 12.6000],
  'Nordvest': [55.7050, 12.5200],
  'Sydhavn': [55.6450, 12.5350],
  'Valby': [55.6600, 12.5100],
  'København': [55.6761, 12.5683],
};

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

// Offset markers slightly to avoid overlap
function getOffsetCoords(neighbourhood: string, index: number): [number, number] {
  const base = neighbourhoodCoords[neighbourhood] || neighbourhoodCoords['København'];
  // Create a small offset based on index to spread markers
  const offsetLat = (index % 5) * 0.003 - 0.006;
  const offsetLng = Math.floor(index / 5) * 0.004 - 0.004;
  return [base[0] + offsetLat, base[1] + offsetLng];
}

const BakeryMap = () => {
  // Group bakeries by neighbourhood to apply offsets
  const bakeryIndices: Record<string, number> = {};
  
  const bakeriesWithCoords = bakeries.map((bakery) => {
    const idx = bakeryIndices[bakery.neighbourhood] || 0;
    bakeryIndices[bakery.neighbourhood] = idx + 1;
    return {
      ...bakery,
      coords: getOffsetCoords(bakery.neighbourhood, idx),
    };
  });

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
          <Marker key={index} position={bakery.coords} icon={markerIcon}>
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
                <p className="text-muted-foreground mt-1">{bakery.neighbourhood}</p>
                <a
                  href={bakery.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View on Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BakeryMap;
