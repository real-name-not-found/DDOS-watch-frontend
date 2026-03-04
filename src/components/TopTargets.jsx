export default function TopTargets({ targets }) {
    // Default mock data if none provided
    const data = targets && targets.length > 0 ? targets : [
        { name: 'United States', events: '42,391', pct: '85%', rank: '01' },
        { name: 'China', events: '38,102', pct: '72%', rank: '02' },
        { name: 'Russia', events: '21,450', pct: '55%', rank: '03' },
        { name: 'Brazil', events: '18,200', pct: '42%', rank: '04' },
        { name: 'India', events: '15,120', pct: '35%', rank: '05' },
    ];

    return (
        <div className="lg:col-span-1 border-r border-t border-typo-border/20 flex flex-col bg-typo-bg">
            <div className="p-8 border-b border-typo-border/20 flex justify-between items-baseline">
                <h3 className="font-serif text-3xl italic text-typo-text">Top Targets</h3>
                <span className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    Real-time
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll">
                {data.map((item, i) => (
                    <div
                        key={item.name}
                        className="group cursor-pointer border-b border-typo-border/10 hover:bg-[#F2EFE9] transition-colors p-6 flex items-center justify-between"
                    >
                        <div className="flex items-start gap-4">
                            <span className="font-serif text-xl italic text-typo-text-light group-hover:text-typo-text w-6">
                                {item.rank || String(i + 1).padStart(2, '0')}
                            </span>
                            <div>
                                <p className="text-sm font-bold text-typo-text uppercase tracking-wider mb-1">{item.name}</p>
                                <p className="text-[10px] text-typo-text-light font-mono">{item.events} EVENTS</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-serif">{item.pct}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6">
                <button className="w-full py-4 text-xs font-bold uppercase tracking-widest text-typo-text border border-typo-border hover:bg-typo-text hover:text-white transition-all">
                    View All Regions
                </button>
            </div>
        </div>
    );
}
