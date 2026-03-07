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
import { getCountryName } from '../utils/countryCoordinates';

export default function GlobalMap() {
    // Map UI-friendly period keys to Cloudflare API dateRange values
    const PERIOD_MAP = { '7d': '7d', '30d': '28d', '90d': '12w' };
    const [period, setPeriod] = useState('7d');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [targets, setTargets] = useState([]);

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getGlobalDDoS(PERIOD_MAP[period]);
            setData(res.data);

            // Build targets list for sidebar
            if (res.data.topOrigins && res.data.topTargets) {
                const targetsList = res.data.topTargets.slice(0, 5);

                // Build targets list with real data
                const builtTargets = targetsList.map((t, i) => ({
                    name: getCountryName(t.targetCountryAlpha2 || t.clientCountryAlpha2),
                    pct: `${parseFloat(t.value).toFixed(1)}%`,
                    rank: String(t.rank || i + 1).padStart(2, '0'),
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
                        <div className="flex gap-6">
                            {['7d', '30d', '90d'].map((p) => (
                                <label key={p} className="cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="timerange"
                                        value={p}
                                        checked={period === p}
                                        onChange={() => setPeriod(p)}
                                        className="peer sr-only"
                                    />
                                    <span className={`text-2xl font-serif transition-all pb-2 inline-block border-b-2 ${period === p
                                        ? 'text-typo-text italic font-medium border-black'
                                        : 'text-typo-text-light border-transparent group-hover:text-typo-text group-hover:border-neutral-300'
                                        }`}>
                                        {{ '7d': '7 Days', '30d': '30 Days', '90d': '90 Days' }[p]}
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
            {(() => {
                // Helper: get top 5 entries from a summary object, formatted with a label function
                const getTop5 = (summary, formatFn) => {
                    if (!summary) return [];
                    return Object.entries(summary)
                        .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
                        .slice(0, 5)
                        .map(([key, val]) => ({ name: formatFn(key), value: parseFloat(val) }));
                };

                // Format readable labels
                const formatProtocol = (key) => key?.toUpperCase() || '—';
                // Vector keys are already human-readable from Cloudflare (e.g., "Mirai (UDP) Flood")
                const formatVector = (key) => key || '—';
                const formatBitrate = (key) => {
                    const map = {
                        UNDER_500_MBPS: '< 500 Mbps',
                        _500_MBPS_TO_1_GBPS: '500M–1G',
                        _1_GBPS_TO_10_GBPS: '1–10 Gbps',
                        _10_GBPS_TO_100_GBPS: '10–100 Gbps',
                        OVER_100_GBPS: '100+ Gbps',
                    };
                    return map[key] || key?.replace(/_/g, ' ') || '—';
                };
                const formatDuration = (key) => {
                    const map = {
                        UNDER_10_MINS: '< 10 min',
                        _10_MINS_TO_20_MINS: '10–20 min',
                        _20_MINS_TO_40_MINS: '20–40 min',
                        _40_MINS_TO_1_HOUR: '40–60 min',
                        _1_HOUR_TO_3_HOURS: '1–3 hours',
                        OVER_3_HOURS: '3+ hours',
                    };
                    return map[key] || key?.replace(/_/g, ' ') || '—';
                };

                return (
                    <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-typo-border/20">
                        <StatsCard label="Protocols" icon="lan" items={getTop5(data?.protocol, formatProtocol)} />
                        <StatsCard label="Attack Vectors" icon="bolt" items={getTop5(data?.vector, formatVector)} />
                        <StatsCard label="Attack Size" icon="speed" items={getTop5(data?.bitrate, formatBitrate)} />
                        <StatsCard label="Attack Duration" icon="timer" items={getTop5(data?.duration, formatDuration)} />
                    </motion.div>
                );
            })()}

            {/* Globe + Top Targets */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 border-b border-l border-typo-border/20">
                <GlobeView
                    attackPairs={data?.attackPairs || []}
                    origins={data?.topOrigins || []}
                    targets={data?.topTargets || []}
                    vectors={data?.vector || {}}
                />
                <TopTargets targets={targets} />
            </motion.div>

            {/* Charts Row */}
            <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="grid grid-cols-1 lg:grid-cols-2 border-l border-t border-typo-border/20">
                <AttackDonutChart origins={data?.topOrigins} />
                <VolumeBarChart timeseries={data?.timeseries} period={period} />
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
