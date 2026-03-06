import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#1A1A1A', '#555555', '#888888', '#BBBBBB', '#E0E0E0'];

export default function AttackDonutChart({ origins }) {
    const [showTip, setShowTip] = useState(false);
    const hasData = origins && origins.length > 0;

    // Dynamic example for tooltip — uses the #1 origin country
    const topExample = hasData ? { name: origins[0].originCountryName || origins[0].originCountryAlpha2, value: parseFloat(origins[0].value) } : null;

    const chartData = hasData
        ? origins.map((o) => ({
            name: o.originCountryName || o.originCountryAlpha2 || 'Unknown',
            value: parseFloat(o.value) || 0,
            code: o.originCountryAlpha2 || '',
        }))
        : [];

    const total = chartData.reduce((sum, d) => sum + d.value, 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-black text-white p-3 text-[11px] font-sans space-y-0.5">
                    <div className="font-bold">{d.name} ({d.code})</div>
                    <div className="text-white/70">{d.value.toFixed(1)}% of global attacks</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-12 border-r border-b border-typo-border/20 flex flex-col justify-between">
            <div className="flex justify-between items-baseline mb-12">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-serif text-3xl italic text-typo-text">Attack Origins</h3>
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
                                    <div className="font-bold text-[10px] uppercase tracking-wider text-white/60 mb-2">Top Origin Countries</div>
                                    <p className="text-[11px] leading-relaxed text-white/85 mb-2">
                                        Which countries are the attackers coming from. Not which country's citizens are choosing to attack — but which country's <span className="font-bold text-white">servers and compromised computers</span> are being used to launch DDoS attacks.
                                    </p>
                                    <p className="text-[11px] leading-relaxed text-white/85 mb-2">
                                        These are typically data centers, botnets, and hijacked infrastructure being exploited by threat actors worldwide.
                                    </p>
                                    {topExample && (
                                        <p className="text-[10px] leading-relaxed text-white/60 italic border-t border-white/10 pt-2 mt-2">
                                            Example: {topExample.value.toFixed(0)}% of all Layer 3 attacks currently originate from {topExample.name}-based servers.
                                        </p>
                                    )}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-black"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mt-2">Top source countries by volume</p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 border border-neutral-300 px-2 py-1">
                    Cloudflare Radar
                </span>
            </div>

            {hasData ? (
                <div className="flex flex-col md:flex-row items-center gap-12 justify-center">
                    {/* Donut */}
                    <div className="relative size-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={1}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="font-serif text-3xl text-typo-text">{chartData.length}</span>
                            <span className="text-[9px] uppercase tracking-widest text-typo-text-light">Countries</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-1 gap-y-4">
                        {chartData.map((item, i) => (
                            <div key={item.name} className="flex items-center gap-3">
                                <span className="size-2.5 shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                                <div className="flex items-baseline gap-3">
                                    <p className="text-sm font-bold text-typo-text uppercase tracking-widest w-24 truncate" title={item.name}>
                                        {item.code || item.name}
                                    </p>
                                    <p className="text-2xl font-serif italic text-typo-text">
                                        {item.value.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                    <span className="material-symbols-outlined text-3xl text-neutral-300 mb-3">donut_large</span>
                    <p className="font-serif text-lg text-neutral-400">Loading origin data...</p>
                </div>
            )}
        </div>
    );
}
