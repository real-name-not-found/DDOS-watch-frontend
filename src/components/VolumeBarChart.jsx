import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip,
    AreaChart, Area, CartesianGrid
} from 'recharts';

export default function VolumeBarChart({ timeseries, period = '7d' }) {
    const isLongRange = period === '30d' || period === '90d';

    const buildChartData = () => {
        if (!timeseries?.serie_0?.timestamps || !timeseries?.serie_0?.values) {
            return null;
        }

        const { timestamps, values } = timeseries.serie_0;

        if (!isLongRange) {
            // 7d: group into daily buckets
            const dailyMap = {};
            timestamps.forEach((ts, i) => {
                const date = new Date(ts);
                const dayKey = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                if (!dailyMap[dayKey]) dailyMap[dayKey] = { sum: 0, count: 0 };
                dailyMap[dayKey].sum += parseFloat(values[i]) || 0;
                dailyMap[dayKey].count += 1;
            });
            return Object.entries(dailyMap).map(([day, { sum, count }]) => ({
                day,
                value: Math.round((sum / count) * 1000) / 1000,
            }));
        }

        // 30d/90d: use all data points for smooth curve
        // For 90d (daily aggInterval from Cloudflare) → ~84 points
        // For 30d (hourly aggInterval) → group every 6 hours for ~112 points
        const groupHours = period === '90d' ? 24 : 6;
        const buckets = [];
        let bucketStart = null;
        let bucketSum = 0;
        let bucketCount = 0;
        let bucketTimestamp = null;

        timestamps.forEach((ts, i) => {
            const time = new Date(ts).getTime();
            if (!bucketStart) {
                bucketStart = time;
                bucketTimestamp = ts;
            }

            bucketSum += parseFloat(values[i]) || 0;
            bucketCount += 1;

            const hoursSinceStart = (time - bucketStart) / (1000 * 60 * 60);

            if (hoursSinceStart >= groupHours || i === timestamps.length - 1) {
                const date = new Date(bucketTimestamp);
                buckets.push({
                    day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    value: Math.round((bucketSum / bucketCount) * 1000) / 1000,
                    fullDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                });
                bucketStart = null;
                bucketSum = 0;
                bucketCount = 0;
            }
        });

        return buckets;
    };

    const chartData = buildChartData();
    const hasData = chartData && chartData.length > 0;
    const maxVal = hasData ? Math.max(...chartData.map((d) => d.value)) : 0;

    // Date range from metadata
    const dateRange = timeseries?.meta?.dateRange?.[0];
    const rangeLabel = dateRange
        ? `${new Date(dateRange.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(dateRange.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : period === '90d' ? 'Last 90 Days' : period === '30d' ? 'Last 30 Days' : 'Last 7 Days';

    const groupLabel = period === '90d' ? 'Daily' : period === '30d' ? '6-hour avg' : 'Daily avg';

    const BarTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-black text-white p-3 text-[11px] font-sans space-y-0.5">
                    <div className="font-bold">{d.day}</div>
                    <div className="text-white/70">Intensity: {(d.value * 100).toFixed(1)}%</div>
                </div>
            );
        }
        return null;
    };

    const AreaTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="bg-black text-white p-3 text-[11px] font-sans space-y-0.5">
                    <div className="font-bold">{d.fullDate || d.day}</div>
                    <div className="text-white/70">Intensity: {(d.value * 100).toFixed(1)}%</div>
                </div>
            );
        }
        return null;
    };

    // Determine tick interval for X-axis labels (avoid crowding)
    const getTickInterval = () => {
        if (!chartData) return 0;
        if (period === '90d') return Math.floor(chartData.length / 8);
        if (period === '30d') return Math.floor(chartData.length / 10);
        return 0;
    };

    return (
        <div className="p-12 border-r border-b border-typo-border/20 flex flex-col">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h3 className="font-serif text-3xl italic text-typo-text">Attack Volume</h3>
                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mt-2">
                        Layer 3 DDoS intensity · {groupLabel} / {rangeLabel}
                    </p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 border border-neutral-300 px-2 py-1">
                    Cloudflare Radar
                </span>
            </div>

            <div className="flex-1 h-64">
                {hasData ? (
                    isLongRange ? (
                        /* ── Smooth Area Chart for 28d / 90d ── */
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1A1A1A" stopOpacity={0.4} />
                                        <stop offset="50%" stopColor="#1A1A1A" stopOpacity={0.1} />
                                        <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e5e5"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 9, fill: '#999', fontWeight: 400 }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={getTickInterval()}
                                />
                                <YAxis hide />
                                <Tooltip content={<AreaTooltip />} cursor={{ stroke: '#ccc', strokeDasharray: '3 3' }} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#1A1A1A"
                                    strokeWidth={1.5}
                                    fill="url(#volumeGradient)"
                                    dot={false}
                                    activeDot={{ r: 3, fill: '#1A1A1A', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        /* ── Bar Chart for 7d ── */
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barCategoryGap="15%">
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 11, fill: '#555', fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={0}
                                />
                                <YAxis hide />
                                <Tooltip content={<BarTooltip />} cursor={false} />
                                <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.value === maxVal ? '#1A1A1A' : '#E5E5E5'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <span className="material-symbols-outlined text-3xl text-neutral-300 mb-3">bar_chart</span>
                        <p className="font-serif text-lg text-neutral-400">Loading attack data...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
