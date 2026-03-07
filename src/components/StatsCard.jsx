export default function StatsCard({ label, icon, items = [] }) {
    const hasData = items.length > 0;
    const maxValue = hasData ? items[0].value : 0;

    return (
        <div className="p-8 border-r border-b border-typo-border/20 flex flex-col hover:bg-[#F2EFE9] transition-colors duration-500">
            <div className="flex justify-between items-start mb-6">
                <span className="text-[11px] uppercase tracking-widest font-bold text-typo-text">{label}</span>
                <span className="material-symbols-outlined text-[20px] text-typo-text-light">{icon}</span>
            </div>

            {hasData ? (
                <div className="space-y-4 flex-1">
                    {items.map((item, i) => (
                        <div key={item.name}>
                            <div className="flex justify-between items-baseline mb-1.5">
                                <span className={`font-serif leading-tight ${i === 0
                                    ? 'text-xl font-medium text-typo-text'
                                    : 'text-[15px] text-typo-text/70'
                                    }`}>
                                    {item.name}
                                </span>
                                <span className={`font-mono ml-3 whitespace-nowrap ${i === 0
                                    ? 'text-base font-bold text-typo-text'
                                    : 'text-sm text-typo-text/60'
                                    }`}>
                                    {item.value.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-neutral-200 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-700 ${i === 0 ? 'bg-neutral-800' : 'bg-neutral-400'}`}
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="font-serif text-lg text-neutral-400 italic">Loading...</p>
                </div>
            )}
        </div>
    );
}
