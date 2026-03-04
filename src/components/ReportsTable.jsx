import { useState } from 'react';

const mockReports = [
    { id: 1, timestamp: '2023-11-24 08:42', type: 'SYN Flood', port: 'TCP/443', volume: '2.4 Gbps', status: 'Mitigated', statusColor: 'risk-ok' },
    { id: 2, timestamp: '2023-11-23 22:15', type: 'UDP Amp', port: 'UDP/53', volume: '150 Mbps', status: 'Mitigated', statusColor: 'risk-ok' },
    { id: 3, timestamp: '2023-11-23 14:30', type: 'HTTP Flood', port: 'TCP/80', volume: '5.8 Gbps', status: 'Analyzing', statusColor: 'risk-warning', critical: true },
    { id: 4, timestamp: '2023-11-22 09:12', type: 'Port Scan', port: 'Multiple', volume: 'N/A', status: 'Blocked', statusColor: 'risk-ok' },
];

export default function ReportsTable({ reports, totalReports = 142 }) {
    const [page, setPage] = useState(1);
    const data = reports && reports.length > 0 ? reports : mockReports;
    const perPage = 4;
    const totalPages = Math.ceil(totalReports / perPage);

    return (
        <div className="mt-16 border border-black bg-white">
            {/* Header */}
            <div className="p-8 lg:p-10 border-b border-black flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 block">Data Logs</span>
                    <h3 className="font-serif text-3xl">Security Reports</h3>
                </div>
                <div className="flex gap-4">
                    <button className="text-[10px] uppercase tracking-widest font-bold border-b border-transparent hover:border-black pb-0.5 transition-all">
                        Filter View
                    </button>
                    <button className="text-[10px] uppercase tracking-widest font-bold border-b border-black pb-0.5 hover:opacity-60 transition-all">
                        Download CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest bg-typo-bg border-b border-black">
                        <tr>
                            <th className="px-8 py-6 font-normal" scope="col">Timestamp</th>
                            <th className="px-8 py-6 font-normal" scope="col">Attack Type</th>
                            <th className="px-8 py-6 font-normal" scope="col">Target Port</th>
                            <th className="px-8 py-6 font-normal" scope="col">Traffic Volume</th>
                            <th className="px-8 py-6 font-normal" scope="col">Status</th>
                            <th className="px-8 py-6 text-right font-normal" scope="col"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                        {data.map((report) => (
                            <tr key={report.id} className="hover:bg-neutral-50 transition-colors group">
                                <td className="px-8 py-6 font-serif text-lg text-typo-text whitespace-nowrap">
                                    {report.timestamp}
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`inline-block px-2 py-1 border text-[10px] uppercase tracking-widest bg-white ${report.critical ? 'border-risk-critical text-risk-critical' : 'border-black/20'
                                        }`}>
                                        {report.type}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-light text-neutral-600">{report.port}</td>
                                <td className="px-8 py-6 font-serif text-lg">{report.volume}</td>
                                <td className="px-8 py-6">
                                    <div className={`flex items-center gap-2 ${report.status === 'Analyzing' ? 'text-risk-warning' : ''}`}>
                                        <span className={`size-1.5 rounded-full bg-${report.statusColor} ${report.status === 'Analyzing' ? 'animate-pulse' : ''}`}></span>
                                        <span className={`text-xs uppercase tracking-wider ${report.status === 'Analyzing' ? 'font-bold' : ''}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="material-symbols-outlined text-neutral-400 group-hover:text-black cursor-pointer transition-colors">
                                        arrow_forward
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-6 flex items-center justify-between border-t border-black bg-typo-bg">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                    {(page - 1) * perPage + 1}-{Math.min(page * perPage, totalReports)} of {totalReports}
                </span>
                <div className="flex gap-4">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="text-xs uppercase font-bold tracking-widest disabled:opacity-30 hover:text-neutral-600 transition-colors"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="text-xs uppercase font-bold tracking-widest disabled:opacity-30 hover:text-neutral-600 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
