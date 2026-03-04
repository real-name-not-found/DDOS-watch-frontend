export default function MlPredictionCard({ confidence = 0 }) {
    return (
        <div className="border-r border-b border-black p-8 flex flex-col min-h-[320px] hover:bg-neutral-50 transition-colors">
            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">AI Analysis</span>
                <span className="material-symbols-outlined text-lg font-light text-neutral-400">psychology</span>
            </div>
            <div className="flex flex-col items-center justify-center flex-1">
                <span className="text-6xl font-serif">
                    {confidence.toFixed(1)}<span className="text-3xl">%</span>
                </span>
                <span className="text-xs text-neutral-500 mt-2 font-light">Confidence Level</span>

                {/* Progress bar */}
                <div className="w-full h-px bg-neutral-200 mt-8 mb-4 relative">
                    <div
                        className="absolute left-0 top-0 bottom-0 bg-accent-blue h-full transition-all duration-1000"
                        style={{ width: `${confidence}%` }}
                    ></div>
                    <div
                        className="absolute -top-1 size-2 bg-black transition-all duration-1000"
                        style={{ left: `${confidence}%` }}
                    ></div>
                </div>
                <div className="w-full flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                    <span>Low</span>
                    <span>High Certainty</span>
                </div>
            </div>
        </div>
    );
}
