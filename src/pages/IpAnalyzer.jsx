import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import RiskGauge from '../components/RiskGaugeIntegrated';
import IpDetailCard from '../components/IpDetailCard';
import MlPredictionCard from '../components/MlPredictionCard';
import AbuseCard from '../components/AbuseCard';
import RecommendationCard from '../components/RecommendationCardIntegrated';
import MiniMap from '../components/MiniMap';
import ThreatRadar from '../components/AttackFrequencyChart';
import AnalysisHistoryTable from '../components/ReportsTableIntegrated';
import { analyzeIP, getHistory } from '../services/api';
import { isValidIP, isPrivateIP, getAbuseStatus } from '../utils/helpers';

export default function IpAnalyzer() {
    const [ip, setIp] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [history, setHistory] = useState([]);

    // Fetch analysis history on mount
    const fetchHistory = useCallback(async () => {
        try {
            const res = await getHistory();
            setHistory(res.data || []);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        const trimmedIp = ip.trim();

        if (!trimmedIp) {
            toast.error('Please enter an IP address');
            return;
        }
        if (!isValidIP(trimmedIp)) {
            toast.error('Invalid IP address format');
            return;
        }
        if (isPrivateIP(trimmedIp)) {
            toast.warning('Private IP addresses cannot be analyzed');
            return;
        }

        setLoading(true);
        setHasSearched(true);
        try {
            const res = await analyzeIP(trimmedIp);
            setResult(res.data);
            toast.success('Analysis complete');
            // Refresh history to include new analysis
            fetchHistory();
        } catch (err) {
            console.error('IP analysis error:', err);
            const msg = err.response?.data?.error || 'Failed to analyze IP';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Handle clicking an IP in the history table
    const handleSelectIP = async (selectedIp) => {
        setIp(selectedIp);
        setLoading(true);
        setHasSearched(true);
        try {
            const res = await analyzeIP(selectedIp);
            setResult(res.data);
            toast.success('Analysis complete');
            fetchHistory();
        } catch (err) {
            console.error('IP analysis error:', err);
            const msg = err.response?.data?.error || 'Failed to analyze IP';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // The final gauge should show the provider-backed AbuseIPDB score, while the
    // AI card remains visible as an advisory prediction.
    const riskScore = result?.abuseScore ?? result?.finalRiskScore ?? 0;
    const abuseStatus = getAbuseStatus(riskScore, result?.isWhitelisted);
    const mlProbabilityText = typeof result?.mlMaliciousProbability === 'number'
        ? `${(result.mlMaliciousProbability * 100).toFixed(2)}%`
        : undefined;

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
    };

    return (
        <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-12">
            {/* Hero Section */}
            <motion.div {...fadeIn} className="grid grid-cols-1 lg:grid-cols-12 border border-black mb-12">
                {/* Left: Title + Search */}
                <div className="lg:col-span-7 p-6 pt-10 md:p-10 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-black relative bg-white">
                    <span className="hidden md:block absolute top-6 left-6 lg:left-16 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                        Global Sensor Network
                    </span>
                    <span className="md:hidden text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-4 block">
                        Global Sensor Network
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif leading-[0.95] mb-6">
                        IP Threat<br />
                        <i className="font-serif italic font-light">Intelligence</i>
                    </h1>
                    <p className="text-typo-text-light text-base lg:text-lg font-light max-w-md leading-relaxed mb-10">
                        Analyzing suspicious IP addresses for potential DDoS vectors, botnet participation, and anomaly detection through our distributed sensor grid.
                    </p>

                    <form onSubmit={handleAnalyze} className="w-full max-w-lg mt-auto">
                        <div className="flex items-end gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    className="bg-transparent border-b border-black text-lg md:text-2xl font-serif w-full py-2 px-0 focus:ring-0 focus:outline-none focus:border-black placeholder-neutral-400"
                                    placeholder="Enter IP address..."
                                    value={ip}
                                    onChange={(e) => setIp(e.target.value)}
                                />
                                <span className="absolute right-0 bottom-3 material-symbols-outlined text-neutral-400 text-lg">search</span>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-black text-white text-xs uppercase tracking-widest font-sans hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50 shrink-0"
                            >
                                {loading ? 'Analyzing...' : 'Analyze'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right: Risk Gauge */}
                <RiskGauge
                    score={riskScore}
                    probability={mlProbabilityText}
                    statusInfo={result ? abuseStatus : undefined}
                />
            </motion.div>

            {/* Diagnostic Metrics */}
            {(hasSearched || result) && (
                <>
                    <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
                        <div className="mb-2">
                            <h3 className="text-sm uppercase tracking-[0.2em] font-bold mb-6 pl-1">Diagnostic Metrics</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-black bg-white">
                            <IpDetailCard data={result} />
                            <MlPredictionCard result={result} />
                            <AbuseCard
                                totalReports={result?.totalReports || 0}
                                ipAddress={result?.ipAddress}
                                data={{
                                    abuseScore: result?.abuseScore,
                                    lastReportedAt: result?.lastReportedAt ? new Date(result.lastReportedAt).toLocaleString() : null,
                                    usageType: result?.usageType,
                                    domain: result?.domain,
                                    isTor: result?.isTor,
                                    isWhitelisted: result?.isWhitelisted,
                                    hostnames: result?.hostnames,
                                }}
                            />
                            <RecommendationCard riskScore={riskScore} result={result} />
                        </div>
                    </motion.div>

                    {/* Map + Threat Radar */}
                    <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 border-l border-b border-black mt-12">
                        <MiniMap
                            lat={result?.lat || 31.2}
                            lng={result?.lon || 121.5}
                            label={result ? `${result.city || result.country || 'Unknown'}, ${result.countryCode || ''}` : 'Shanghai, CN'}
                        />
                        <ThreatRadar result={result} />
                    </motion.div>
                </>
            )}

            {/* Analysis History Table — always visible if there's history */}
            {history.length > 0 && (
                <motion.div {...fadeIn} transition={{ delay: hasSearched ? 0.3 : 0.1 }}>
                    <AnalysisHistoryTable history={history} onSelectIP={handleSelectIP} />
                </motion.div>
            )}

            {/* Empty state before search (only if no history either) */}
            {!hasSearched && !result && history.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                >
                    <span className="material-symbols-outlined text-6xl text-neutral-300 mb-6">travel_explore</span>
                    <h3 className="font-serif text-2xl text-neutral-400 mb-2">Enter an IP address to begin analysis</h3>
                    <p className="text-sm text-neutral-400 max-w-md">
                        Our distributed sensor network will analyze the IP against multiple threat intelligence databases and produce a comprehensive risk assessment.
                    </p>
                </motion.div>
            )}

            {/* Empty state with history but no search yet */}
            {!hasSearched && !result && history.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                >
                    <span className="material-symbols-outlined text-4xl text-neutral-300 mb-4">travel_explore</span>
                    <h3 className="font-serif text-xl text-neutral-400 mb-1">Enter an IP address above to start a new analysis</h3>
                    <p className="text-xs text-neutral-400">or click any IP in the history table below to re-analyze</p>
                </motion.div>
            )}

            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-typo-bg/60 backdrop-blur-sm z-40 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-8 border border-typo-text border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs uppercase tracking-widest">Analyzing threat intelligence...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
