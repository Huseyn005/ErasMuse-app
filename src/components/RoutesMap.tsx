import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Ruse city center coordinates
const ruseCenterCoordinates: LatLngExpression = [43.8516, 25.9597];

// Define key locations in Ruse
const locationMarkers = [
  { id: 1, name: "University of Ruse", lat: 43.8652, lng: 25.9656 },
  { id: 2, name: "Student dorms", lat: 43.8450, lng: 25.9700 },
  { id: 3, name: "City Center", lat: 43.8516, lng: 25.9597 },
  { id: 4, name: "Railway Station", lat: 43.8390, lng: 25.9520 },
  { id: 5, name: "Bus Station", lat: 43.8370, lng: 25.9450 },
  { id: 6, name: "Danube River area", lat: 43.8650, lng: 25.9450 },
];

// Custom marker icons
const startIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const endIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface RoutesMapProps {
  from?: string;
  to?: string;
}

export function RoutesMap({ from = "University of Ruse", to = "Railway Station" }: RoutesMapProps) {
  // Get coordinates for location names
  const getLocationCoordinates = (location: string): LatLngExpression => {
    const marker = locationMarkers.find(m => m.name === location);
    return marker ? [marker.lat, marker.lng] : ruseCenterCoordinates;
  };

  const fromCoords = getLocationCoordinates(from);
  const toCoords = getLocationCoordinates(to);

  return (
    <div className="space-y-3">
      <MapContainer
        center={ruseCenterCoordinates}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "400px", borderRadius: "12px" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Start marker */}
        <Marker position={fromCoords} icon={startIcon}>
          <Popup>
            <span className="font-medium">{from}</span>
            <br />
            <span className="text-xs text-muted-foreground">Starting point</span>
          </Popup>
        </Marker>

        {/* End marker */}
        <Marker position={toCoords} icon={endIcon}>
          <Popup>
            <span className="font-medium">{to}</span>
            <br />
            <span className="text-xs text-muted-foreground">Destination</span>
          </Popup>
        </Marker>

        {/* Route line */}
        <Polyline
          positions={[fromCoords, toCoords]}
          pathOptions={{
            color: "#3b82f6",
            weight: 4,
            opacity: 0.8,
          }}
        />

        {/* Other location markers */}
        {locationMarkers
          .filter(m => m.name !== from && m.name !== to)
          .map(marker => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={defaultIcon}
            >
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
      </MapContainer>
      <p className="text-xs text-muted-foreground">
        {from} &rarr; {to}
      </p>
    </div>
  );
}
