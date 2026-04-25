import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type MapMarker = {
    id: string;
    lat: number;
    lng: number;
    type: 'event' | 'gem' | 'campus' | 'buddy';
    label?: string;
};

const TYPE_COLOR: Record<MapMarker['type'], string> = {
    event: '#FFA500',
    gem: '#EC4899',
    campus: '#3B82F6',
    buddy: '#FF6B6B',
};

export function RuseMap({ markers, selectedId, onSelect, height = 'h-[420px]' }: { markers: MapMarker[]; selectedId?: string | null; onSelect?: (m: MapMarker) => void; height?: string }) {
    // Outer div — owned by React
    const wrapperRef = useRef<HTMLDivElement>(null);
    // Inner div — owned exclusively by Google Maps, never touched by React
    const mapDomRef = useRef<HTMLDivElement | null>(null);

    const googleMapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;

    const RUSE_CENTER = { lat: 43.8356, lng: 25.9657 };

    const initializeMap = () => {
        if (googleMapRef.current || !mapDomRef.current) return;

        try {
            googleMapRef.current = new google.maps.Map(mapDomRef.current, {
                center: RUSE_CENTER,
                zoom: 14,
                mapTypeId: 'roadmap',
                fullscreenControl: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: false,
            });

            console.log('✓ Map initialized at Ruse, Bulgaria');
            updateMarkers(markers);
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    };

    const updateMarkers = (markerList: MapMarker[]) => {
        if (!googleMapRef.current) return;

        // Remove stale markers
        Object.keys(markersRef.current).forEach(key => {
            if (!markerList.find(m => m.id === key)) {
                markersRef.current[key].setMap(null);
                delete markersRef.current[key];
            }
        });

        // Add or update
        markerList.forEach(markerData => {
            if (markersRef.current[markerData.id]) {
                markersRef.current[markerData.id].setPosition({
                    lat: markerData.lat,
                    lng: markerData.lng,
                });
            } else {
                const marker = new google.maps.Marker({
                    position: { lat: markerData.lat, lng: markerData.lng },
                    map: googleMapRef.current,
                    title: markerData.label || markerData.type,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: TYPE_COLOR[markerData.type],
                        fillOpacity: 0.8,
                        strokeColor: '#fff',
                        strokeWeight: 2,
                    },
                });

                marker.addListener('click', () => {
                    onSelectRef.current?.(markerData);

                    if (!infoWindowRef.current) {
                        infoWindowRef.current = new google.maps.InfoWindow();
                    }

                    infoWindowRef.current.setContent(
                        `<div style="padding:8px;font-family:system-ui;font-size:12px;">
                            <strong>${markerData.label || markerData.type}</strong><br/>
                            <small>${markerData.type}</small><br/>
                            <small>${markerData.lat.toFixed(4)}, ${markerData.lng.toFixed(4)}</small>
                        </div>`,
                    );
                    infoWindowRef.current.open(googleMapRef.current, marker);
                });

                markersRef.current[markerData.id] = marker;
            }
        });
    };

    // Mount: create a plain div, append it to wrapper, hand it to Google Maps
    useEffect(() => {
        if (!wrapperRef.current) return;

        // Create the Google Maps-owned div imperatively — React never sees it
        const mapDiv = document.createElement('div');
        mapDiv.style.width = '100%';
        mapDiv.style.height = '100%';
        wrapperRef.current.appendChild(mapDiv);
        mapDomRef.current = mapDiv;

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.error('Google Maps API key not found');
            return;
        }

        if (window.google?.maps) {
            initializeMap();
        } else {
            const existing = document.querySelector('script[data-gmap]');
            if (!existing) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
                script.async = true;
                script.defer = true;
                script.dataset.gmap = 'true';
                script.onload = () => {
                    console.log('✓ Google Maps API loaded');
                    initializeMap();
                };
                script.onerror = () => console.error('✗ Failed to load Google Maps API');
                document.head.appendChild(script);
            } else {
                // Script already in DOM but not yet loaded — wait for it
                existing.addEventListener('load', initializeMap);
            }
        }

        return () => {
            // Clean up info window and markers, but DO NOT remove mapDiv from DOM
            // to avoid the removeChild React/Maps conflict
            infoWindowRef.current?.close();
            Object.values(markersRef.current).forEach(m => m.setMap(null));
            markersRef.current = {};
            googleMapRef.current = null;

            // Safe to remove the imperatively-created div since React never owned it
            if (mapDomRef.current && wrapperRef.current?.contains(mapDomRef.current)) {
                wrapperRef.current.removeChild(mapDomRef.current);
            }
            mapDomRef.current = null;
        };
    }, []); // runs once

    // Sync markers prop changes
    useEffect(() => {
        if (googleMapRef.current) {
            updateMarkers(markers);
        }
    }, [markers]);

    // Pan to selected marker
    useEffect(() => {
        if (selectedId && markersRef.current[selectedId]) {
            const marker = markersRef.current[selectedId];
            googleMapRef.current?.panTo(marker.getPosition()!);
            googleMapRef.current?.setZoom(15);
            google.maps.event.trigger(marker, 'click');
        }
    }, [selectedId]);

    return <div ref={wrapperRef} className={cn('relative w-full overflow-hidden rounded-2xl border border-border shadow-soft', height)} />;
}
