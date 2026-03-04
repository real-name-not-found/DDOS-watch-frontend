import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function VolumeBarChart({ data }) {
    const chartData = data && data.length > 0
        ? data
        : DAYS.map((day, i) => ({
            day,
            value: [400, 650, 450, 850, 550, 300, 600][i],
        }));

    const maxVal = Math.max(...chartData.map((d) => d.value));

    return (
        <div className="p-12 border-r border-b border-typo-border/20 flex flex-col">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h3 className="font-serif text-3xl italic text-typo-text">Volume History</h3>
                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mt-2">Traffic throughput (7 Days)</p>
                </div>
                <div className="flex gap-4">
                    <button className="text-xs font-bold uppercase tracking-widest border-b border-typo-text pb-0.5">Inbound</button>
                    <button className="text-xs font-medium uppercase tracking-widest text-typo-text-light hover:text-typo-text transition-colors">Outbound</button>
                </div>
            </div>

            <div className="flex-1 h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barCategoryGap="20%">
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 10, fill: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide />
                        <Tooltip
                            cursor={false}
                            contentStyle={{
                                background: '#1A1A1A',
                                border: 'none',
                                color: 'white',
                                fontSize: 10,
                                fontFamily: 'monospace',
                                padding: '4px 8px',
                            }}
                            formatter={(value) => [`${value}G`, 'Volume']}
                            labelStyle={{ display: 'none' }}
                        />
                        <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.value === maxVal ? '#1A1A1A' : '#E5E5E5'}
                                    className="hover:fill-[#1A1A1A] transition-colors cursor-pointer"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
