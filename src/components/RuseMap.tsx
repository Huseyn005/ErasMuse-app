import { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  type: "event" | "gem" | "campus" | "buddy";
  label?: string;
};

const TYPE_COLOR: Record<MapMarker["type"], string> = {
  event: "#FFA500",     // warning orange
  gem: "#EC4899",       // accent pink
  campus: "#3B82F6",    // primary blue
  buddy: "#FF6B6B",     // coral red
};

export function RuseMap({
  markers,
  selectedId,
  onSelect,
  height = "h-[420px]",
}: {
  markers: MapMarker[];
  selectedId?: string | null;
  onSelect?: (m: MapMarker) => void;
  height?: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Ruse, Bulgaria coordinates
  const RUSE_CENTER = { lat: 43.8356, lng: 25.9657 };

  // Load Google Maps script
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Google Maps API key not found in VITE_GOOGLE_MAPS_API_KEY");
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      initializeMap();
      return;
    }

    // Load the script if not already present
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("✓ Google Maps API loaded");
      initializeMap();
    };
    script.onerror = () => {
      console.error("✗ Failed to load Google Maps API");
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || googleMapRef.current) return;

    try {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: RUSE_CENTER,
        zoom: 14,
        mapTypeId: "roadmap",
        fullscreenControl: true,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
      });

      console.log("✓ Map initialized at Ruse, Bulgaria");

      // Update markers after map is ready
      updateMarkers(markers);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const updateMarkers = (markerList: MapMarker[]) => {
    if (!googleMapRef.current) return;

    // Remove markers not in new list
    Object.keys(markersRef.current).forEach((key) => {
      if (!markerList.find((m) => m.id === key)) {
        markersRef.current[key].setMap(null);
        delete markersRef.current[key];
      }
    });

    // Add or update markers
    markerList.forEach((markerData) => {
      if (markersRef.current[markerData.id]) {
        // Update existing marker
        const existingMarker = markersRef.current[markerData.id];
        existingMarker.setPosition({
          lat: markerData.lat,
          lng: markerData.lng,
        });
      } else {
        // Create new marker
        const marker = new google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: googleMapRef.current,
          title: markerData.label || markerData.type,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: TYPE_COLOR[markerData.type],
            fillOpacity: 0.8,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
        });

        // Add click listener
        marker.addListener("click", () => {
          onSelect?.(markerData);

          // Show info window
          if (!infoWindowRef.current) {
            infoWindowRef.current = new google.maps.InfoWindow();
          }

          infoWindowRef.current.setContent(
            `<div style="padding: 8px; font-family: system-ui; font-size: 12px;">
              <strong>${markerData.label || markerData.type}</strong>
              <br/>
              <small>${markerData.type}</small>
              <br/>
              <small>${markerData.lat.toFixed(4)}, ${markerData.lng.toFixed(4)}</small>
            </div>`
          );
          infoWindowRef.current.open(googleMapRef.current, marker);
        });

        markersRef.current[markerData.id] = marker;
        console.log(`✓ Marker added: ${markerData.label || markerData.type}`);
      }
    });
  };

  // Update markers when they change
  useEffect(() => {
    if (googleMapRef.current && markers.length > 0) {
      updateMarkers(markers);
    }
  }, [markers]);

  // Handle selected marker
  useEffect(() => {
    if (selectedId && markersRef.current[selectedId]) {
      const marker = markersRef.current[selectedId];
      googleMapRef.current?.panTo(marker.getPosition()!);
      googleMapRef.current?.setZoom(15);

      // Trigger click to show info window
      google.maps.event.trigger(marker, "click");
    }
  }, [selectedId]);

  return (
    <div
      ref={mapRef}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border shadow-soft",
        height
      )}
    >
      {/* Loading state */}
      {!googleMapRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
