import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function MiniMap({ lat = 31.2, lng = 121.5, label = 'Shanghai, CN' }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        // Dynamic import of leaflet to avoid SSR issues
        import('leaflet').then((L) => {
            if (mapInstance.current) {
                mapInstance.current.remove();
            }

            const map = L.map(mapRef.current, {
                center: [lat, lng],
                zoom: 10,
                zoomControl: false,
                attributionControl: false,
                scrollWheelZoom: false,
                dragging: true,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
            }).addTo(map);

            // Pulsing marker using CSS
            const pulsingIcon = L.divIcon({
                className: 'pulsing-marker',
                html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <span style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,0.2);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
            <span style="width:12px;height:12px;border-radius:50%;background:#1A1A1A;position:relative;z-index:1;"></span>
          </div>
        `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
            });

            L.marker([lat, lng], { icon: pulsingIcon }).addTo(map);

            // Add zoom controls bottom right
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            mapInstance.current = map;

            // Force size recalculation
            setTimeout(() => map.invalidateSize(), 100);
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [lat, lng]);

    return (
        <div className="lg:col-span-1 border-r border-black border-t border-black h-[500px] relative bg-neutral-100 group overflow-hidden">
            {/* Location label */}
            <div className="absolute top-6 left-6 z-[1000] bg-white border border-black px-4 py-2">
                <span className="text-[10px] uppercase tracking-widest block text-neutral-500 mb-0.5">Origin</span>
                <span className="font-serif text-lg block">{label}</span>
            </div>

            {/* Map container */}
            <div ref={mapRef} className="absolute inset-0 z-10" />

            {/* Inject ping animation */}
            <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
        </div>
    );
}
