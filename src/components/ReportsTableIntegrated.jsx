import { useState } from 'react';
import { getAbuseStatus } from '../utils/helpers';

export default function AnalysisHistoryTableIntegrated({ history = [], onSelectIP }) {
    const [page, setPage] = useState(1);
    const perPage = 5;
    const totalItems = history.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    const sorted = history
        .slice()
        .sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt));

    const pageData = sorted.slice((page - 1) * perPage, page * perPage);

    // Delegates to the shared threshold function so the table, gauge, and
    // recommendation card all use the same cutoffs.
    const getStatusInfo = (score, isWhitelisted) => {
        const { level, bg: color, textColor } = getAbuseStatus(score, isWhitelisted);
        return {
            level,
            label: level.charAt(0) + level.slice(1).toLowerCase(),
            color,
            textColor,
        };
    };

    return (
        <div className="mt-16 border border-black bg-white">
            <div className="p-4 md:p-8 lg:p-10 border-b border-black flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Your Data</span>
                    <h3 className="font-serif text-3xl">Analysis History</h3>
                </div>
                <div className="flex gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 border border-neutral-300 px-2 py-1">
                        {totalItems} total
                    </span>
                </div>
            </div>

            {totalItems > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest bg-typo-bg border-b border-black">
                                <tr>
                                    <th className="px-3 md:px-8 py-3 md:py-6 font-normal" scope="col">Analyzed At</th>
                                    <th className="px-3 md:px-8 py-3 md:py-6 font-normal" scope="col">IP Address</th>
                                    <th className="px-3 md:px-8 py-3 md:py-6 font-normal" scope="col">Country</th>
                                    <th className="px-3 md:px-8 py-3 md:py-6 font-normal" scope="col">Risk Score</th>
                                    <th className="px-3 md:px-8 py-3 md:py-6 font-normal" scope="col">Reports</th>
                                    <th className="px-3 md:px-8 py-3 md:py-6 font-normal" scope="col">Status</th>
                                    <th className="px-3 md:px-8 py-3 md:py-6 text-right font-normal" scope="col"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10">
                                {pageData.map((item) => {
                                    const score = item.abuseScore ?? item.finalRiskScore ?? 0;
                                    const status = getStatusInfo(score, item.isWhitelisted);

                                    return (
                                        <tr
                                            key={item._id || item.ipAddress + item.analyzedAt}
                                            className="hover:bg-neutral-50 transition-colors group cursor-pointer"
                                            onClick={() => onSelectIP && onSelectIP(item.ipAddress)}
                                        >
                                            <td className="px-3 md:px-8 py-3 md:py-6 font-sans text-sm text-neutral-600 whitespace-nowrap">
                                                {new Date(item.analyzedAt).toLocaleString()}
                                            </td>
                                            <td className="px-3 md:px-8 py-3 md:py-6 font-serif text-lg text-typo-text">
                                                {item.ipAddress}
                                            </td>
                                            <td className="px-3 md:px-8 py-3 md:py-6 font-sans text-sm text-neutral-600">
                                                {item.city ? `${item.city}, ${item.countryCode}` : item.country || '-'}
                                            </td>
                                            <td className="px-3 md:px-8 py-3 md:py-6">
                                                <span className={`font-serif text-xl ${status.textColor} ${status.level === 'CRITICAL' || status.level === 'HIGH' ? 'font-bold' : ''}`}>
                                                    {score ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-8 py-3 md:py-6 font-serif text-lg">{item.totalReports ?? '-'}</td>
                                            <td className="px-3 md:px-8 py-3 md:py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`size-1.5 rounded-full ${status.color}`}></span>
                                                    <span className={`text-xs uppercase tracking-wider ${status.textColor}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 md:px-8 py-3 md:py-6 text-right">
                                                <span className="material-symbols-outlined text-neutral-400 group-hover:text-black transition-colors text-sm">
                                                    arrow_forward
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 flex items-center justify-between border-t border-black bg-typo-bg">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                            {(page - 1) * perPage + 1}-{Math.min(page * perPage, totalItems)} of {totalItems}
                        </span>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="text-xs uppercase font-bold tracking-widest disabled:opacity-30 hover:text-neutral-600 transition-colors"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="text-xs uppercase font-bold tracking-widest disabled:opacity-30 hover:text-neutral-600 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="material-symbols-outlined text-4xl text-neutral-300 mb-4">history</span>
                    <p className="font-serif text-lg text-neutral-400">No analyses yet</p>
                    <p className="text-xs text-neutral-400 mt-1">Analyzed IPs will appear here</p>
                </div>
            )}
        </div>
    );
}
