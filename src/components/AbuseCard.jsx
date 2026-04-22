import { useState } from 'react';

export default function AbuseCard({ totalReports = 0, data, ipAddress }) {
    const [showWhitelistTip, setShowWhitelistTip] = useState(false);

    return (
        <div className="border-r border-b border-black p-4 md:p-8 flex flex-col min-h-[280px] md:min-h-[320px] hover:bg-neutral-50 transition-colors">
            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Abuse Log</span>
                <span className="material-symbols-outlined text-lg font-light text-neutral-400">report_problem</span>
            </div>
            <div className="flex flex-col justify-center flex-1">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-serif">{totalReports}</span>
                    <span className="text-sm text-neutral-500">Reports</span>
                </div>
                <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400">Abuse Score</span>
                        <span className="font-sans text-sm">{data?.abuseScore ?? '—'} / 100</span>
                    </div>
                    <div className="flex justify-between items-start border-b border-black/10 pb-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400 shrink-0">Last Reported</span>
                        <span className="font-sans text-sm text-right ml-4">{data?.lastReportedAt || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400">Usage Type</span>
                        <span className="font-sans text-sm text-right max-w-[160px]">{data?.usageType || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400">Domain</span>
                        <span className="font-sans text-sm">{data?.domain || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-400">Tor Node</span>
                        <span className={`font-sans text-sm ${data?.isTor ? 'text-risk-critical font-bold' : ''}`}>
                            {data?.isTor === true ? 'Yes' : data?.isTor === false ? 'No' : '—'}
                        </span>
                    </div>

                    {/* Whitelisted row with tooltip */}
                    <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <div className="flex items-center gap-1.5 relative">
                            <span className="text-[10px] uppercase tracking-widest text-neutral-400">Whitelisted</span>
                            <div
                                className="relative"
                                onMouseEnter={() => setShowWhitelistTip(true)}
                                onMouseLeave={() => setShowWhitelistTip(false)}
                            >
                                <span className="text-[9px] text-neutral-400 cursor-help hover:text-neutral-600 transition-colors border border-neutral-300 rounded-full size-3.5 inline-flex items-center justify-center font-sans font-medium leading-none">
                                    ?
                                </span>
                                {showWhitelistTip && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-black text-white p-4 z-50 pointer-events-none">
                                        <div className="font-bold text-[10px] uppercase tracking-wider text-white/60 mb-2">AbuseIPDB Whitelist</div>
                                        <p className="text-[11px] leading-relaxed text-white/85 mb-2">
                                            Whitelisted netblocks are typically owned by trusted entities such as Google, Microsoft, or Cloudflare, often used for search engine crawlers, DNS resolvers, or CDN services.
                                        </p>
                                        <p className="text-[11px] leading-relaxed text-white/85 mb-2">
                                            However, these same entities also provide cloud hosting, VPS, and email services that can be abused by malicious actors for phishing, spam, or DDoS attacks.
                                        </p>
                                        <p className="text-[10px] leading-relaxed text-white/60 italic">
                                            In this dashboard, a whitelisted verdict is treated as the primary provider signal. The AI score remains visible for context, but the AbuseIPDB whitelist should take precedence in the final decision.
                                        </p>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-black"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className={`font-sans text-sm font-bold ${data?.isWhitelisted ? 'text-risk-ok' : 'text-neutral-500'}`}>
                            {data?.isWhitelisted === true ? 'Yes' : data?.isWhitelisted === false ? 'No' : '—'}
                        </span>
                    </div>

                    {data?.hostnames && data.hostnames.length > 0 && (
                        <div className="flex justify-between items-center border-b border-black/10 pb-2">
                            <span className="text-[10px] uppercase tracking-widest text-neutral-400">Hostnames</span>
                            <span className="font-sans text-sm text-right max-w-[140px] truncate" title={data.hostnames.join(', ')}>
                                {data.hostnames[0]}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="pt-4">
                <a
                    href={ipAddress ? `https://www.abuseipdb.com/check/${ipAddress}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2 border border-black text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 ${ipAddress ? 'hover:bg-black hover:text-white cursor-pointer' : 'opacity-30 pointer-events-none'}`}
                >
                    View on AbuseIPDB
                    <svg className="size-2.5 -translate-y-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
