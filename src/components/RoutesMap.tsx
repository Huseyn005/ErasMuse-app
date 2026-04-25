import { useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

// Ruse city center coordinates
const ruseCenterCoordinates = {
  lat: 43.8516,
  lng: 25.9597,
};

// Define key locations in Ruse
const locationMarkers = [
  { id: 1, name: "University of Ruse", lat: 43.8652, lng: 25.9656 },
  { id: 2, name: "Student dorms", lat: 43.8450, lng: 25.9700 },
  { id: 3, name: "City Center", lat: 43.8516, lng: 25.9597 },
  { id: 4, name: "Railway Station", lat: 43.8390, lng: 25.9520 },
  { id: 5, name: "Bus Station", lat: 43.8370, lng: 25.9450 },
  { id: 6, name: "Danube River area", lat: 43.8650, lng: 25.9450 },
];

interface RoutesMapProps {
  from?: string;
  to?: string;
}

export function RoutesMap({ from = "University of Ruse", to = "Railway Station" }: RoutesMapProps) {
  const mapRef = useRef<GoogleMap>(null);

  // Get coordinates for location names
  const getLocationCoordinates = (location: string) => {
    const marker = locationMarkers.find(m => m.name === location);
    return marker ? { lat: marker.lat, lng: marker.lng } : ruseCenterCoordinates;
  };

  const fromCoords = getLocationCoordinates(from);
  const toCoords = getLocationCoordinates(to);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  console.log("[v0] Google Maps API Key present:", !!apiKey, "Key starts with:", apiKey?.substring(0, 10));
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });
  
  console.log("[v0] Google Maps isLoaded:", isLoaded, "loadError:", loadError);

  const onLoad = useCallback((map: GoogleMap) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-96 rounded-2xl bg-muted flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-sm text-destructive">Failed to load Google Maps</p>
          <p className="text-xs text-muted-foreground">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-96 rounded-2xl bg-muted flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={ruseCenterCoordinates}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {/* Route markers */}
        <Marker
          position={fromCoords}
          title={from}
          icon={{
            path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z",
            fillColor: "#10b981",
            fillOpacity: 1,
            scale: 2,
            strokeColor: "#fff",
            strokeWeight: 1,
          }}
        />

        <Marker
          position={toCoords}
          title={to}
          icon={{
            path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12.5c.83 0 1.5.67 1.5 1.5S12.83 11 12 11s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z",
            fillColor: "#ef4444",
            fillOpacity: 1,
            scale: 2,
            strokeColor: "#fff",
            strokeWeight: 1,
          }}
        />

        {/* Route line */}
        <Polyline
          path={[fromCoords, toCoords]}
          options={{
            strokeColor: "#3b82f6",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            geodesic: true,
          }}
        />

        {/* Other location markers */}
        {locationMarkers
          .filter(m => m.name !== from && m.name !== to)
          .map(marker => (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.name}
              icon={{
                path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
                fillColor: "#9ca3af",
                fillOpacity: 0.6,
                scale: 1.5,
                strokeColor: "#fff",
                strokeWeight: 1,
              }}
            />
          ))}
      </GoogleMap>
      <p className="text-xs text-muted-foreground">
        {from} → {to}
      </p>
    </div>
  );
}
