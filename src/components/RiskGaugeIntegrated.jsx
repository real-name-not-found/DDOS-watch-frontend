import { useState } from 'react';
import { getThreatLevel } from '../utils/helpers';

export default function RiskGaugeIntegrated({ score = 0, probability, statusInfo }) {
    const [showProbabilityInfo, setShowProbabilityInfo] = useState(false);
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

    const activeStatus = statusInfo || getThreatLevel(score);
    const { level: label, color } = activeStatus;

    return (
        <div className="lg:col-span-5 relative bg-[#F2F2F2] flex items-center justify-center p-6 md:p-10 min-h-[300px] md:min-h-[400px]">
            <div className="absolute top-6 left-6 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Final Risk Score
            </div>
            <div className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Current Target Risk
            </div>

            <div className="relative w-48 h-48 md:w-64 md:h-64">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="butt"
                        style={{ transition: 'stroke-dasharray 1s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl md:text-7xl font-serif" style={{ color }}>{score}</span>
                    <span
                        className="text-[10px] uppercase tracking-[0.2em] mt-2 px-2 py-1 border"
                        style={{ color, borderColor: `${color}30` }}
                    >
                        {label}
                    </span>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between border-t border-black/10 pt-4">
                {/* Same footer layout as before, but now the left stat explains model probability. */}
                <div
                    className="relative cursor-help"
                    onMouseEnter={() => setShowProbabilityInfo(true)}
                    onMouseLeave={() => setShowProbabilityInfo(false)}
                >
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
                        ML Probability
                        <span className="inline-flex items-center justify-center w-3 h-3 rounded-full border border-neutral-400 text-[7px] text-neutral-400 font-serif leading-none">?</span>
                    </span>
                    <span className="text-sm font-sans mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">network_intelligence</span>
                        {probability || '--'}
                    </span>

                    {showProbabilityInfo && (
                        <div className="absolute bottom-full left-0 mb-3 w-60 bg-white border border-neutral-200 shadow-md p-4 z-50">
                            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-800 mb-2 font-sans">
                                What is ML Probability?
                            </p>
                            <p className="text-[11px] leading-[1.6] text-neutral-500 font-light font-sans">
                                This is the XGBoost model&apos;s estimated probability that the target IP belongs to the malicious class used during training.
                            </p>
                            <div className="absolute -bottom-1 left-4 w-2 h-2 bg-white border-r border-b border-black/10 rotate-45"></div>
                        </div>
                    )}
                </div>

                <div>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-500">Status</span>
                    <span className="text-sm font-sans mt-1">{activeStatus?.level || 'Pending'}</span>
                </div>
            </div>
        </div>
    );
}
