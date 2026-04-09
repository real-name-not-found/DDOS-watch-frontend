import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getAbuseStatus } from '../utils/helpers';

export default function ThreatRadar({ result }) {
    const abuseScore = result?.abuseScore || 0;
    const totalReports = result?.totalReports || 0;
    const numDistinctUsers = result?.numDistinctUsers || 0;
    const isTor = result?.isTor ? 100 : 0;
    const isWhitelisted = result?.isWhitelisted === true;
    const statusInfo = getAbuseStatus(abuseScore, isWhitelisted);

    // Normalize reports to 0-100 (cap at 500)
    const reportScore = Math.min(100, Math.round((totalReports / 500) * 100));

    // Normalize distinct users to 0-100 (cap at 50 users)
    const userScore = Math.min(100, Math.round((numDistinctUsers / 50) * 100));

    // Whitelist dimension: inverted — whitelisted = lower risk visually
    // But show it as "trust level" so whitelisted = high on the axis
    const whitelistScore = isWhitelisted ? 100 : 0;

    const data = [
        { dimension: 'Abuse Score', value: abuseScore, raw: `${abuseScore}/100` },
        { dimension: 'Reports', value: reportScore, raw: `${totalReports} total` },
        { dimension: 'Reporters', value: userScore, raw: `${numDistinctUsers} users` },
        { dimension: 'Tor Node', value: isTor, raw: isTor ? 'Detected' : 'None' },
        { dimension: 'Whitelisted', value: whitelistScore, raw: isWhitelisted ? 'Yes' : 'No' },
    ];

    const hasData = result !== null;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-black text-white p-3 text-[11px] font-sans space-y-0.5">
                    <div className="font-bold text-[10px] uppercase tracking-wider text-white/60">{item.dimension}</div>
                    <div className="text-sm">{item.raw}</div>
                </div>
            );
        }
        return null;
    };

    const renderAxisTick = ({ payload, x, y, cx, cy }) => {
        const adjustedX = x + (x - cx) * 0.15;
        const adjustedY = y + (y - cy) * 0.15;
        return (
            <text
                x={adjustedX}
                y={adjustedY}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-neutral-500"
                style={{ fontSize: '9px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
                {payload.value}
            </text>
        );
    };

    return (
        <div className="lg:col-span-2 border-r border-t border-black bg-white p-4 md:p-8 lg:p-12 relative h-[350px] md:h-[500px] flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-serif text-3xl">Threat Radar</h3>
                    <p className="text-neutral-500 font-light mt-1">
                        Multi-dimensional risk profile
                    </p>
                </div>
                {hasData && (
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${statusInfo.bg === 'bg-risk-critical'
                            ? 'border-risk-critical text-risk-critical'
                            : statusInfo.bg === 'bg-risk-warning'
                                ? 'border-risk-warning text-risk-warning'
                                : statusInfo.bg === 'bg-yellow-500'
                                    ? 'border-yellow-500 text-yellow-600'
                                    : 'border-neutral-300 text-neutral-400'
                        }`}>
                        {statusInfo.level}
                    </span>
                )}
            </div>

            {hasData ? (
                <div className="flex-1 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid
                                stroke="#e5e5e5"
                                strokeDasharray="3 3"
                            />
                            <PolarAngleAxis
                                dataKey="dimension"
                                tick={renderAxisTick}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Radar
                                name="Threat"
                                dataKey="value"
                                stroke="#000000"
                                strokeWidth={1.5}
                                fill="#000000"
                                fillOpacity={0.06}
                                dot={{ r: 3, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
                                activeDot={{ r: 5, fill: '#000', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-4xl text-neutral-300 mb-4">radar</span>
                    <p className="font-serif text-lg text-neutral-400">Awaiting analysis</p>
                    <p className="text-xs text-neutral-400 mt-1">Analyze an IP to generate its threat profile</p>
                </div>
            )}

            {/* Dimension legend */}
            {hasData && (
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 pt-4 border-t border-black/10">
                    {data.map((d) => (
                        <div key={d.dimension} className="flex items-center gap-1.5">
                            <div className={`size-1.5 rounded-full ${d.value >= 80 ? 'bg-risk-critical' : d.value >= 50 ? 'bg-risk-warning' : 'bg-neutral-400'}`}></div>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-500">{d.dimension}</span>
                            <span className="text-[10px] font-bold text-neutral-700">{d.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
