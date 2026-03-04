import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#1A1A1A', '#666666', '#A3A3A3', '#E5E5E5'];

export default function AttackDonutChart({ data }) {
    const chartData = data && data.length > 0
        ? data
        : [
            { name: 'UDP Flood', value: 45 },
            { name: 'TCP SYN', value: 25 },
            { name: 'HTTP Flood', value: 20 },
            { name: 'Other', value: 10 },
        ];

    const total = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="p-12 border-r border-b border-typo-border/20 flex flex-col justify-between">
            <div className="flex justify-between items-baseline mb-12">
                <div>
                    <h3 className="font-serif text-3xl italic text-typo-text">Attack Distribution</h3>
                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mt-2">Classification by vector</p>
                </div>
            </div>

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
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="font-serif text-4xl text-typo-text">
                            {total >= 1000000 ? (total / 1000000).toFixed(1) + 'M' : total >= 1000 ? (total / 1000).toFixed(1) + 'K' : total}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-typo-text-light">Total</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {chartData.map((item, i) => (
                        <div key={item.name} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="size-2" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                                <p className="text-xs font-bold text-typo-text uppercase tracking-widest">{item.name}</p>
                            </div>
                            <p className="text-lg font-serif italic text-typo-text-light pl-4">
                                {Math.round((item.value / total) * 100)}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
