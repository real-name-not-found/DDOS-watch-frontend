export default function IpDetailCard({ data }) {
    const ip = data?.ipAddress || '—';
    const isp = data?.isp || '—';
    const country = data?.country || '—';
    const countryCode = data?.countryCode || '';
    const city = data?.city || '';
    const org = data?.org || '—';

    return (
        <div className="border-r border-b border-black p-8 flex flex-col min-h-[320px] hover:bg-neutral-50 transition-colors group">
            <div className="mb-auto">
                <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400">Target</span>
                    <span className="text-[10px] border border-black px-1.5 py-0.5 uppercase">IPv4</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    {countryCode && (
                        <div className="size-5 rounded-full overflow-hidden border border-black/10 flex items-center justify-center text-[10px] font-bold">
                            {countryCode}
                        </div>
                    )}
                    <span className="font-serif text-2xl">{ip}</span>
                </div>
                <div className="space-y-4 mt-8">
                    <div>
                        <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">ISP</span>
                        <span className="font-sans text-sm border-b border-black/10 pb-1 block w-full">{isp}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Location</span>
                        <span className="font-sans text-sm border-b border-black/10 pb-1 block w-full">
                            {city ? `${city}, ${countryCode}` : country}
                        </span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Organization</span>
                        <span className="font-sans text-sm border-b border-black/10 pb-1 block w-full">{org}</span>
                    </div>
                </div>
            </div>
            <div className="pt-6 mt-4">
                <a className="text-[10px] uppercase tracking-widest border-b border-black pb-0.5 hover:opacity-60 transition-opacity cursor-pointer">
                    Full WHOIS Record
                </a>
            </div>
        </div>
    );
}
