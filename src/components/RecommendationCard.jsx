export default function RecommendationCard({ riskScore = 0 }) {
    const isHighRisk = riskScore >= 60;

    return (
        <div className="border-r border-b border-black flex flex-col">
            <div className="flex-1 bg-black text-white p-8 flex flex-col justify-between min-h-[320px]">
                <span className="text-[10px] uppercase tracking-widest opacity-60">Recommendation</span>
                <div>
                    <h3 className="font-serif text-2xl mb-2">
                        {isHighRisk ? 'Block Traffic' : 'Monitor'}
                    </h3>
                    <p className="text-neutral-400 text-sm font-light leading-relaxed">
                        {isHighRisk
                            ? 'Due to high confidence and critical risk score, immediate blocking is recommended.'
                            : 'Moderate risk detected. Continued monitoring is advised.'}
                    </p>
                </div>
                <button className="bg-white text-black w-full py-3 text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-colors mt-4">
                    {isHighRisk ? 'Apply Rule' : 'Set Alert'}
                </button>
            </div>
        </div>
    );
}
