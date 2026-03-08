import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { getCountryCoord } from '../data/countryCoords';

function weightedPick(items) {
    if (!items || !items.length) return null;
    const total = items.reduce((s, it) => s + parseFloat(it.value), 0);
    let r = Math.random() * total;
    for (const it of items) {
        r -= parseFloat(it.value);
        if (r <= 0) return it;
    }
    return items[0];
}

let _id = 0;

export default function GlobeView({ attackPairs = [], origins = [], targets = [], vectors = {} }) {
    const globeEl = useRef(null);
    const containerRef = useRef(null);
    const [Globe, setGlobe] = useState(null);
    const [dims, setDims] = useState({ width: 800, height: 600 });
    const [arcs, setArcs] = useState([]);
    const [points, setPoints] = useState([]);
    const [rings, setRings] = useState([]);
    const [events, setEvents] = useState([]);
    const timersRef = useRef([]);

    // Removed Option 1 (Country Profile Panel) logic to improve performance

    useEffect(() => {
        import('react-globe.gl').then((mod) => setGlobe(() => mod.default));
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        const obs = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setDims({ width, height });
        });
        obs.observe(containerRef.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!globeEl.current) return;
        const c = globeEl.current.controls();
        if (c) {
            c.autoRotate = true;
            c.autoRotateSpeed = 0.3;
            c.enableZoom = true;
        }
        globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.0 }, 1000);
    }, [Globe]);

    const vectorList = useMemo(() =>
        Object.entries(vectors)
            .filter(([k]) => k !== 'other')
            .map(([name, value]) => ({ name, value: parseFloat(value) }))
            .sort((a, b) => b.value - a.value),
        [vectors]
    );

    // Spawn one attack
    const spawn = useCallback(() => {
        let srcCode, srcName, dstCode, dstName;

        // Verify we have real pair data
        if (attackPairs.length > 0) {
            const pair = weightedPick(attackPairs);
            srcCode = pair.originCountryAlpha2;
            srcName = pair.originCountryName;
            dstCode = pair.targetCountryAlpha2;
            dstName = pair.targetCountryName;
        } else if (origins.length > 0 && targets.length > 0) {
            // Fallback if pairs fail to load
            const origin = weightedPick(origins);
            const target = weightedPick(targets);
            srcCode = origin.originCountryAlpha2 || origin.clientCountryAlpha2;
            srcName = origin.originCountryName;
            dstCode = target.targetCountryAlpha2 || target.clientCountryAlpha2;
            dstName = target.targetCountryName;
        } else {
            return;
        }

        if (srcCode === dstCode) return;

        const baseSrc = getCountryCoord(srcCode);
        const baseDst = getCountryCoord(dstCode);

        if (!baseSrc || !baseDst) return; // Skip if country coords not found

        // Add jitter so multiple attacks between same countries don't strictly overlap
        // +/- 2.5 degrees is roughly up to ~250km offset
        const jitter = () => (Math.random() - 0.5) * 5;

        const src = { lat: baseSrc.lat + jitter(), lng: baseSrc.lng + jitter() };
        const dst = { lat: baseDst.lat + jitter(), lng: baseDst.lng + jitter() };

        const vector = vectorList.length ? weightedPick(vectorList) : { name: 'UDP Flood' };
        const id = `a${++_id}`;

        // Color based on vector type
        const hue = (vector.name.charCodeAt(0) * 7 + vector.name.length * 31) % 360;
        const color = `hsla(${hue}, 80%, 60%, 0.7)`;
        const colorFaint = `hsla(${hue}, 80%, 60%, 0.1)`;

        const arc = {
            id,
            startLat: src.lat,
            startLng: src.lng,
            endLat: dst.lat,
            endLng: dst.lng,
            color: [color, colorFaint],
        };

        const point = {
            id,
            lat: dst.lat,
            lng: dst.lng,
            color,
            size: 0.3 + Math.random() * 0.3,
        };

        const ring = {
            id,
            lat: dst.lat,
            lng: dst.lng,
            color,
        };

        setArcs(prev => [...prev.slice(-40), arc]); // Allow up to 40 arcs at once
        setPoints(prev => [...prev.slice(-30), point]); // Allow up to 30 visible endpoints
        setRings(prev => [...prev.slice(-15), ring]); // Allow up to 15 active rings

        const eventData = {
            id, srcCode, dstCode, srcName, dstName,
            vector: vector.name,
            color,
            time: new Date(),
        };

        setEvents(prev => [eventData, ...prev].slice(0, 15)); // Show last 15 in the log
    }, [attackPairs, origins, targets, vectorList]);

    // Lifecycle
    useEffect(() => {
        const hasData = attackPairs.length > 0 || (origins.length > 0 && targets.length > 0);
        if (!hasData) return;

        timersRef.current.forEach(clearInterval);

        const t1 = setInterval(spawn, 300); // 5x faster spawn rate (every 0.3s)

        // Remove old arcs/rings slower to let them build up
        const t2 = setInterval(() => {
            setArcs(prev => prev.length > 40 ? prev.slice(1) : prev);
            setRings(prev => prev.length > 15 ? prev.slice(1) : prev);
        }, 3000);

        // Let endpoints linger for a bit
        const t3 = setInterval(() => {
            setPoints(prev => prev.length > 30 ? prev.slice(1) : prev);
        }, 4000);

        timersRef.current = [t1, t2, t3];
        return () => timersRef.current.forEach(clearInterval);
    }, [attackPairs, origins, targets, spawn]);

    return (
        <div
            ref={containerRef}
            className="lg:col-span-2 border-r border-t border-typo-border/20 relative min-h-[650px] overflow-hidden bg-[#060a10] globe-container"
        >
            {/* Option 2: NOC Threat Feed Sidebar (Removed Blur for Performance) */}
            <div className="absolute top-0 left-0 bottom-0 w-80 bg-[#060a10] border-r border-white/10 z-20 flex flex-col pointer-events-auto shadow-2xl">
                {/* Header & Latest */}
                <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">Threat Feed</span>
                    </div>
                </div>

                {/* Event Log */}
                <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col justify-end relative">
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#060a10]/95 to-transparent z-10 pointer-events-none"></div>
                    <div className="space-y-1.5 relative z-0">
                        {events.map((e, i) => (
                            <div
                                key={e.id}
                                className="font-mono text-[10px] flex items-center justify-between transition-opacity"
                                style={{ opacity: Math.max(0.35, 1 - i * 0.08) }}
                            >
                                <div className="flex items-center gap-2.5 w-full">
                                    <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-white/90">{e.srcCode}</span>
                                        <span className="text-white/30">→</span>
                                        <span className="text-white font-bold">{e.dstCode}</span>
                                        <span className="text-white/80 font-medium truncate ml-auto uppercase tracking-wide">{e.vector}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



            {/* Globe */}
            {Globe && (
                <div className="absolute inset-0 pl-80">
                    <Globe
                        ref={globeEl}
                        width={dims.width - 320}
                        height={dims.height}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                        // Arcs
                        arcsData={arcs}
                        arcColor="color"
                        arcDashLength={0.5}
                        arcDashGap={0.2}
                        arcDashAnimateTime={1800}
                        arcStroke={0.5}
                        arcAltitudeAutoScale={0.3}

                        // Dots
                        pointsData={points}
                        pointLat="lat"
                        pointLng="lng"
                        pointColor="color"
                        pointAltitude={0.01}
                        pointRadius="size"
                        pointsMerge={false}

                        // Rings
                        ringsData={rings}
                        ringLat="lat"
                        ringLng="lng"
                        ringColor={() => (t) => `rgba(255,100,100,${1 - t})`}
                        ringMaxRadius={3}
                        ringPropagationSpeed={2}
                        ringRepeatPeriod={800}

                        atmosphereColor="rgba(60,100,180,0.1)"
                        atmosphereAltitude={0.12}
                        showGraticules={false}
                    />
                </div>
            )}
        </div>
    );
}
