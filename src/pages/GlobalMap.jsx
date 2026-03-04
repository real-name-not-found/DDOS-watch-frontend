import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatsCard from '../components/StatsCard';
import TopTargets from '../components/TopTargets';
import GlobeView from '../components/GlobeView';
import AttackDonutChart from '../components/AttackDonutChart';
import VolumeBarChart from '../components/VolumeBarChart';
import { getGlobalDDoS } from '../services/api';
import { formatNumber } from '../utils/helpers';
import { getCountryCoords, getCountryName } from '../utils/countryCoordinates';

export default function GlobalMap() {
    const [period, setPeriod] = useState('7d');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [arcsData, setArcsData] = useState([]);
    const [targets, setTargets] = useState([]);

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getGlobalDDoS(period);
            setData(res.data);

            // Build arcs from top origins -> top targets
            if (res.data.topOrigins && res.data.topTargets) {
                const origins = res.data.topOrigins.slice(0, 5);
                const targetsList = res.data.topTargets.slice(0, 5);
                const arcs = [];

                origins.forEach((origin) => {
                    const originCoords = getCountryCoords(origin.originCountryAlpha2 || origin.clientCountryAlpha2);
                    targetsList.forEach((target) => {
                        const targetCoords = getCountryCoords(target.targetCountryAlpha2 || target.clientCountryAlpha2);
                        arcs.push({
                            startLat: originCoords.lat,
                            startLng: originCoords.lng,
                            endLat: targetCoords.lat,
                            endLng: targetCoords.lng,
                            color: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)'],
                        });
                    });
                });
                setArcsData(arcs);

                // Build targets list
                const builtTargets = targetsList.map((t, i) => ({
                    name: getCountryName(t.targetCountryAlpha2 || t.clientCountryAlpha2),
                    events: formatNumber(parseInt(t.value) || (42391 - i * 5000)),
                    pct: t.rank ? `${t.rank}%` : `${85 - i * 12}%`,
                    rank: String(i + 1).padStart(2, '0'),
                }));
                setTargets(builtTargets);
            }
        } catch (err) {
            console.error('Failed to fetch global DDoS data:', err);
            toast.error('Failed to load threat data. Using sample data.');
        } finally {
            setLoading(false);
        }
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 py-12 flex flex-col gap-12">
            {/* Hero Section */}
            <motion.div {...fadeIn} className="grid grid-cols-1 lg:grid-cols-12 border-t border-b border-typo-border">
                {/* Left: Title */}
                <div className="lg:col-span-8 py-16 pr-12 border-r border-typo-border flex flex-col justify-between min-h-[400px]">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light">Live Feed</span>
                            <span className="w-16 h-[1px] bg-typo-text"></span>
                            <span className="text-[10px] uppercase tracking-widest font-medium text-red-700 flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                Active
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-light leading-[0.9] tracking-tighter mb-8 text-typo-text">
                            Global Threat<br />Intelligence Map
                        </h1>
                    </div>
                    <p className="text-lg font-serif italic text-typo-text-light max-w-lg leading-relaxed">
                        Real-time visualization of DDoS vectors. Analyzing <span className="text-typo-text not-italic font-medium">1.2M</span> events per second across global nodes.
                    </p>
                </div>

                {/* Right: Time Range + Export */}
                <div className="lg:col-span-4 flex flex-col">
                    <div className="flex-1 p-8 border-b border-typo-border flex flex-col justify-center">
                        <span className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light mb-4 block">Time Range</span>
                        <div className="flex gap-4">
                            {['7d', '30d'].map((p) => (
                                <label key={p} className="cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="timerange"
                                        value={p}
                                        checked={period === p}
                                        onChange={() => setPeriod(p)}
                                        className="peer sr-only"
                                    />
                                    <span className={`text-2xl font-serif transition-all ${period === p
                                            ? 'text-typo-text italic font-medium'
                                            : 'text-typo-text-light group-hover:text-typo-text'
                                        }`}>
                                        {p === '7d' ? '7 Days' : '30 Days'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 p-8 flex items-center justify-between group cursor-pointer hover:bg-typo-text hover:text-white transition-colors duration-300">
                        <span className="text-sm uppercase tracking-widest">Export Data Report</span>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                </div>
            </motion.div>

            {/* KPI Cards */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-typo-border/20">
                <StatsCard label="Total Attacks" value="1.2M" icon="security" change="+12.5%" subtitle="vs last week" />
                <StatsCard label="Active Threats" value="4,521" icon="warning" change="+5.2%" subtitle="Critical Load" />
                <StatsCard label="Bandwidth Peak" value={<>850 <span className="text-2xl italic">Gbps</span></>} icon="speed" change="+8.1%" subtitle="High Saturation" />
                <StatsCard label="Mitigation" value="99.8%" icon="shield" change="STABLE" subtitle="Automated" />
            </motion.div>

            {/* Globe + Top Targets */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 border-b border-l border-typo-border/20">
                <GlobeView arcsData={arcsData} />
                <TopTargets targets={targets} />
            </motion.div>

            {/* Charts Row */}
            <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 border-l border-t border-typo-border/20">
                <AttackDonutChart />
                <VolumeBarChart />
            </motion.div>

            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-typo-bg/60 backdrop-blur-sm z-40 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-8 border border-typo-text border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs uppercase tracking-widest">Loading threat data...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
