import { useEffect, useRef, useState } from 'react';

export default function GlobeView({ arcsData = [] }) {
    const globeEl = useRef(null);
    const containerRef = useRef(null);
    const [Globe, setGlobe] = useState(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    // Dynamic import of react-globe.gl (it's heavy and uses WebGL)
    useEffect(() => {
        import('react-globe.gl').then((mod) => {
            setGlobe(() => mod.default);
        });
    }, []);

    // Resize observer
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Configure globe after mount
    useEffect(() => {
        if (!globeEl.current) return;
        const controls = globeEl.current.controls();
        if (controls) {
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;
            controls.enableZoom = true;
        }
        // Set initial point of view
        globeEl.current.pointOfView({ lat: 25, lng: 10, altitude: 2.2 }, 1000);
    }, [Globe]);

    // Generate mock arcs if no real data
    const defaultArcs = [
        { startLat: 35, startLng: 105, endLat: 38, endLng: -97, color: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)'] },
        { startLat: 60, startLng: 100, endLat: 51, endLng: 9, color: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)'] },
        { startLat: -14, startLng: -51, endLat: 38, endLng: -97, color: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)'] },
        { startLat: 20, startLng: 77, endLat: 55, endLng: -3, color: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)'] },
        { startLat: 36, startLng: 138, endLat: 38, endLng: -97, color: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.05)'] },
        { startLat: 14, startLng: 108, endLat: 52, endLng: 5, color: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.1)'] },
        { startLat: 35, startLng: 105, endLat: 36, endLng: 128, color: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.1)'] },
        { startLat: 39, startLng: 35, endLat: -25, endLng: 133, color: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.05)'] },
    ];

    const finalArcs = arcsData.length > 0 ? arcsData : defaultArcs;

    return (
        <div
            ref={containerRef}
            className="lg:col-span-2 border-r border-t border-typo-border/20 relative min-h-[600px] overflow-hidden bg-[#0B0E14] globe-container"
        >
            {/* Attack info overlay */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-20 pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="size-1.5 rounded-full bg-red-600 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Attack Detected</span>
                    </div>
                    <div className="font-mono text-[10px] text-white/80 space-y-1 bg-white/5 backdrop-blur-sm p-3 border border-white/10 inline-block">
                        <div className="flex gap-4"><span className="text-white/50">SRC:</span> <span>192.168.1.X (CN)</span></div>
                        <div className="flex gap-4"><span className="text-white/50">DST:</span> <span>10.0.0.X (US)</span></div>
                        <div className="flex gap-4"><span className="text-white/50">TYPE:</span> <span className="font-bold">UDP FLOOD</span></div>
                    </div>
                </div>
                <button className="pointer-events-auto p-2 hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 rounded">
                    <span className="material-symbols-outlined text-white">fullscreen</span>
                </button>
            </div>

            {/* Globe */}
            {Globe && (
                <Globe
                    ref={globeEl}
                    width={dimensions.width}
                    height={dimensions.height}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    arcsData={finalArcs}
                    arcColor="color"
                    arcDashLength={0.4}
                    arcDashGap={0.2}
                    arcDashAnimateTime={1500}
                    arcStroke={0.5}
                    atmosphereColor="rgba(255,255,255,0.15)"
                    atmosphereAltitude={0.2}
                    showGraticules={false}
                />
            )}

            {/* Legend */}
            <div className="absolute bottom-8 left-8 z-20 flex gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 border border-white bg-white"></div>
                    <span className="text-[10px] uppercase tracking-wider font-medium text-white/80">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 border border-white bg-gray-400"></div>
                    <span className="text-[10px] uppercase tracking-wider font-medium text-white/80">High</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 border border-white bg-transparent"></div>
                    <span className="text-[10px] uppercase tracking-wider font-medium text-white/80">Normal</span>
                </div>
            </div>
        </div>
    );
}
