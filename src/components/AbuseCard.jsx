export default function AbuseCard({ totalReports = 0, data }) {
    return (
        <div className="border-r border-b border-black p-8 flex flex-col min-h-[320px] hover:bg-neutral-50 transition-colors">
            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Abuse Log</span>
                <span className="material-symbols-outlined text-lg font-light text-neutral-400">report_problem</span>
            </div>
            <div className="flex flex-col justify-center flex-1">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-serif">{totalReports}</span>
                    <span className="text-sm text-neutral-500">Reports</span>
                </div>
                <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="text-xs text-neutral-500">Last 24h</span>
                        <span className="font-bold font-serif">{data?.recentCount || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="text-xs text-neutral-500">Top Type</span>
                        <span className="font-bold font-serif">{data?.topType || '—'}</span>
                    </div>
                </div>
            </div>
            <div className="pt-4">
                <button className="w-full py-2 border border-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
}
