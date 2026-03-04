export default function RiskGauge({ score = 0, trend, status }) {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

    const getLevel = (s) => {
        if (s >= 81) return { label: 'Critical', color: '#9B2C2C' };
        if (s >= 61) return { label: 'High', color: '#C05621' };
        if (s >= 31) return { label: 'Medium', color: '#D69E2E' };
        return { label: 'Low', color: '#2F855A' };
    };

    const { label, color } = getLevel(score);

    return (
        <div className="lg:col-span-5 relative bg-[#F2F2F2] flex items-center justify-center p-10 min-h-[400px]">
            <div className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Current Target Risk
            </div>

            {/* Gauge circle */}
            <div className="relative w-64 h-64">
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
                    <span className="text-7xl font-serif" style={{ color }}>{score}</span>
                    <span
                        className="text-[10px] uppercase tracking-[0.2em] mt-2 px-2 py-1 border"
                        style={{ color, borderColor: `${color}30` }}
                    >
                        {label}
                    </span>
                </div>
            </div>

            {/* Bottom stats */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between border-t border-black/10 pt-4">
                <div>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-500">Trend</span>
                    <span className="text-sm font-sans mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        {trend || '+12%'}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] uppercase tracking-widest text-neutral-500">Status</span>
                    <span className="text-sm font-sans mt-1">{status || 'Pending'}</span>
                </div>
            </div>
        </div>
    );
}
