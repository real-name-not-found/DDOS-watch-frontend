import { useState } from 'react';

const formatBandLabel = (band) => {
    if (band === 'high_risk') return 'HIGH RISK';
    if (band === 'monitor') return 'KEEP MONITORING';
    if (band === 'low_risk') return 'LOW RISK';
    return 'PENDING';
};

export default function MlPredictionCard({ result }) {
    const [showTooltip, setShowTooltip] = useState(false);

    const rawProbability = result?.mlMaliciousProbability;
    const modelScore = typeof rawProbability === 'number'
        ? Math.round(rawProbability * 100)
        : null;
    const probability = typeof rawProbability === 'number'
        ? `${(rawProbability * 100).toFixed(2)}%`
        : '--';
    const bandLabel = formatBandLabel(result?.mlRiskBand);
    const providerStatus = result?.mlProviderStatus || {};
    const activeSources = Object.entries(providerStatus)
        .filter(([, value]) => value === 1)
        .map(([key]) => key.replace('_success', '').toUpperCase());
    const bandColor = result?.mlRiskBand === 'high_risk'
        ? 'text-risk-critical'
        : result?.mlRiskBand === 'monitor'
            ? 'text-risk-warning'
            : 'text-risk-ok';

    // Position on the gradient bar (0–100%)
    const barPosition = typeof rawProbability === 'number'
        ? Math.max(0, Math.min(100, rawProbability * 100))
        : null;
    const dotColor = result?.mlRiskBand === 'high_risk'
        ? '#9B2C2C'
        : result?.mlRiskBand === 'monitor'
            ? '#C05621'
            : '#2F855A';

    return (
        <div className="border-r border-b border-black p-8 flex flex-col min-h-[320px] hover:bg-neutral-50 transition-colors relative">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400">AI Analysis</span>
                    <div
                        className="relative"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <span className="text-[9px] text-neutral-400 cursor-help hover:text-neutral-600 transition-colors border border-neutral-300 rounded-full size-3.5 inline-flex items-center justify-center font-sans font-medium leading-none">
                            ?
                        </span>

                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-black text-white p-3 z-50 pointer-events-none">
                                <p className="text-[10px] leading-relaxed font-sans text-white/80">
                                    The backend sends this IP to the Python XGBoost service, which builds features from live network intelligence and returns a malicious probability plus a risk band.
                                </p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-black"></div>
                            </div>
                        )}
                    </div>
                </div>
                <span className="material-symbols-outlined text-lg font-light text-neutral-400">psychology</span>
            </div>

            <div className="flex flex-col justify-between flex-1">
                <div>
                    <span className={`text-[10px] uppercase tracking-widest font-sans mb-3 block ${bandColor}`}>
                        {bandLabel}
                    </span>
                    <div className="mb-6">
                        <span className="block text-[10px] uppercase tracking-widest text-neutral-400 font-sans mb-2">
                            AI Score
                        </span>
                        <span className="text-4xl font-serif">{modelScore ?? '--'}</span>
                        <span className="block text-xs uppercase tracking-widest text-neutral-400 font-sans mt-2">
                            Probability {probability}
                        </span>
                    </div>

                    <div className="space-y-3 text-[11px] font-sans text-neutral-600">
                        <div className="flex justify-between gap-4 border-t border-neutral-200 pt-3">
                            <span className="uppercase tracking-widest text-neutral-400">Live Sources</span>
                            <span className="text-right">{activeSources.length ? activeSources.join(', ') : 'Pending'}</span>
                        </div>
                    </div>

                    {result?.isWhitelisted === true && (
                        <div className="mt-5 border border-neutral-200 bg-neutral-50 p-3">
                            <span className="block text-[10px] uppercase tracking-widest text-risk-ok font-sans mb-2">
                                AbuseIPDB Override
                            </span>
                            <p className="text-[11px] leading-relaxed text-neutral-600 font-sans">
                                AbuseIPDB marks this IP as whitelisted. Treat the AI score as a prediction-only signal and prefer the AbuseIPDB provider judgment for the final decision.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Gradient risk spectrum bar ── */}
                <div className="mt-8 border-t border-neutral-200 pt-4">
                    <div className="relative h-5">
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-neutral-300" />
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-px"
                            style={{ width: '33.333%', backgroundColor: 'rgba(47, 133, 90, 0.55)' }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 h-px"
                            style={{ left: '33.333%', width: '33.333%', backgroundColor: 'rgba(214, 158, 46, 0.45)' }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 h-px"
                            style={{ left: '66.666%', width: '33.334%', backgroundColor: 'rgba(155, 44, 44, 0.55)' }}
                        />

                        {barPosition !== null && (
                            <div
                                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
                                style={{ left: `${barPosition}%` }}
                            >
                                <div className="h-5 w-px bg-neutral-700" />
                                <div
                                    className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
                                    style={{ backgroundColor: dotColor }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-2 flex justify-between text-[9px] uppercase tracking-widest text-neutral-400 font-sans">
                        <span>Low</span>
                        <span>Monitor</span>
                        <span>High</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
