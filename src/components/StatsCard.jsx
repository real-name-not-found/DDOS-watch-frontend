export default function StatsCard({ label, value, icon, change, subtitle }) {
    return (
        <div className="p-8 border-r border-b border-typo-border/20 flex flex-col justify-between h-48 hover:bg-[#F2EFE9] transition-colors duration-500">
            <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light">{label}</span>
                <span className="material-symbols-outlined text-[18px] text-typo-text-light">{icon}</span>
            </div>
            <div>
                <p className="text-5xl font-serif font-light text-typo-text">{value}</p>
                <div className="flex items-center gap-2 mt-2">
                    {change && <span className="text-xs font-mono text-typo-text">{change}</span>}
                    {subtitle && <span className="text-[10px] uppercase text-typo-text-light tracking-wide">{subtitle}</span>}
                </div>
            </div>
        </div>
    );
}
