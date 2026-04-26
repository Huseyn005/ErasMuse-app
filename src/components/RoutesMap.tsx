import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
};

const ruseCenterCoordinates = {
  lat: 43.8516,
  lng: 25.9597,
};

interface RoutesMapProps {
  from?: string;
  to?: string;
}

export function RoutesMap({ from = "University of Ruse", to = "Railway Station" }: RoutesMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  // Fetch directions when map is loaded or from/to changes
  useEffect(() => {
    if (!isLoaded) return;

    const service = new google.maps.DirectionsService();
    setError(null);
    setDirections(null);

    service.route(
      {
        origin: `${from}, Ruse, Bulgaria`,
        destination: `${to}, Ruse, Bulgaria`,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
          setError(`Could not find a route: ${status}`);
        }
      }
    );
  }, [isLoaded, from, to]);

  const onLoad = useCallback((map: google.maps.Map) => {
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
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false,
        }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#3b82f6",
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}

        {/* Error fallback */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl">
            <p className="text-sm text-destructive bg-background px-4 py-2 rounded-lg shadow">{error}</p>
          </div>
        )}
      </GoogleMap>

      <p className="text-xs text-muted-foreground">
        {from} → {to}
      </p>
    </div>
  );
}