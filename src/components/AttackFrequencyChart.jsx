import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const defaultData = [
    { date: 'Nov 01', value: 200 },
    { date: 'Nov 05', value: 150 },
    { date: 'Nov 08', value: 280 },
    { date: 'Nov 10', value: 140 },
    { date: 'Nov 13', value: 350 },
    { date: 'Nov 15', value: 300 },
    { date: 'Nov 18', value: 420 },
    { date: 'Nov 20', value: 380 },
    { date: 'Today', value: 310 },
];

export default function AttackFrequencyChart({ data }) {
    const chartData = data && data.length > 0 ? data : defaultData;

    return (
        <div className="lg:col-span-2 border-r border-black border-t border-black bg-white p-8 lg:p-12 relative h-[500px] flex flex-col">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="font-serif text-3xl">Attack Frequency</h3>
                    <p className="text-neutral-500 font-light mt-1">Traffic anomalies / Last 7 Days</p>
                </div>
                <select className="bg-transparent border-b border-black text-xs uppercase tracking-widest font-bold py-1 pr-8 focus:ring-0 focus:border-black cursor-pointer focus:outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 24 Hours</option>
                </select>
            </div>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#000000" stopOpacity={0.05} />
                                <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                background: '#1A1A1A',
                                border: 'none',
                                color: 'white',
                                fontSize: 11,
                                fontFamily: 'monospace',
                                padding: '6px 10px',
                            }}
                            formatter={(value) => [`${value} events`, 'Volume']}
                            labelStyle={{ color: '#999', fontSize: 10 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#000000"
                            strokeWidth={1.5}
                            fill="url(#areaGradient)"
                            dot={false}
                            activeDot={{ r: 3, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
