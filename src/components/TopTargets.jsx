import { useState } from 'react';

export default function TopTargets({ targets }) {
    const [showTip, setShowTip] = useState(false);
    const hasData = targets && targets.length > 0;

    return (
        <div className="lg:col-span-1 border-r border-t border-typo-border/20 flex flex-col bg-typo-bg">
            <div className="p-8 border-b border-typo-border/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h3 className="font-serif text-3xl italic text-typo-text">Top Targets</h3>
                    <div
                        className="relative"
                        onMouseEnter={() => setShowTip(true)}
                        onMouseLeave={() => setShowTip(false)}
                    >
                        <span className="text-[9px] text-neutral-400 cursor-help hover:text-neutral-600 transition-colors border border-neutral-300 rounded-full size-4 inline-flex items-center justify-center font-sans font-medium leading-none mt-1">
                            ?
                        </span>
                        {showTip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-black text-white p-4 z-50 pointer-events-none">
                                <div className="font-bold text-[10px] uppercase tracking-wider text-white/60 mb-2">Top Target Countries</div>
                                <p className="text-[11px] leading-relaxed text-white/85 mb-2">
                                    Which countries are receiving the most DDoS attacks. These are the nations whose <span className="font-bold text-white">networks, servers, and digital infrastructure</span> are being overwhelmed with malicious traffic.
                                </p>
                                <p className="text-[11px] leading-relaxed text-white/85 mb-2">
                                    Countries with large financial systems, cloud hosting providers, government services, and gaming infrastructure tend to be targeted more frequently.
                                </p>
                                <p className="text-[10px] leading-relaxed text-white/60 italic border-t border-white/10 pt-2 mt-2">
                                    The percentage represents each country's share of total global DDoS attack traffic observed by Cloudflare Radar over the selected time period.
                                </p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-black"></div>
                            </div>
                        )}
                    </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    Real-time
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll">
                {hasData ? (
                    targets.map((item, i) => (
                        <div
                            key={item.name}
                            className="group cursor-pointer border-b border-typo-border/10 hover:bg-[#F2EFE9] transition-colors p-6 flex items-center justify-between"
                        >
                            <div className="flex items-start gap-4">
                                <span className="font-serif text-xl italic text-typo-text-light group-hover:text-typo-text w-6">
                                    {item.rank || String(i + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <p className="text-base font-bold text-typo-text uppercase tracking-wider mb-1">{item.name}</p>
                                    <p className="text-[10px] text-typo-text-light font-mono">RANK {item.rank || i + 1}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-serif font-medium">{item.pct}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <span className="material-symbols-outlined text-3xl text-neutral-300 mb-3">public</span>
                        <p className="font-serif text-lg text-neutral-400">Loading targets...</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-typo-border/10">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400">Source: Cloudflare Radar</span>
            </div>
        </div>
    );
}
