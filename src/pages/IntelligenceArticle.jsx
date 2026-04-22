import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import { modelPageData } from '../data/modelPageData';

/* ─── Layout primitives ─── */

function Prose({ children, className = '' }) {
    return <div className={`max-w-[760px] mx-auto ${className}`}>{children}</div>;
}

function Breakout({ children, className = '' }) {
    return <div className={`max-w-[1100px] mx-auto ${className}`}>{children}</div>;
}

function FullBleed({ children, className = '' }) {
    return <div className={`max-w-[1400px] mx-auto ${className}`}>{children}</div>;
}

/* ─── Blog components ─── */

function ProseBlock({ paragraphs }) {
    return (
        <Prose className="mt-8">
            {paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] md:text-base leading-[1.85] text-typo-text-light mb-6 last:mb-0">
                    {p}
                </p>
            ))}
        </Prose>
    );
}

function SectionHeading({ id, eyebrow, title }) {
    return (
        <Prose>
            <div id={id} className="scroll-mt-24 pt-16 pb-2">
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs md:text-[13px] uppercase tracking-[0.22em] font-medium text-typo-text">{eyebrow}</span>
                    <span className="w-16 h-px bg-typo-text/70"></span>
                </div>
                <h2 className="text-3xl md:text-[2.75rem] font-serif font-light leading-[1.05] tracking-tight text-typo-text">
                    {title}
                </h2>
            </div>
        </Prose>
    );
}

function Callout({ children }) {
    return (
        <Prose className="my-10">
            <div className="border-l-2 border-typo-text bg-white py-5 pl-6 pr-6">
                <p className="text-lg font-serif italic leading-relaxed text-typo-text">{children}</p>
            </div>
        </Prose>
    );
}

function MetricPill({ label, value, note }) {
    const valueStr = String(value);
    const isShortNumeric = /^[\d.,%\s-]+$/.test(valueStr.trim());
    return (
        <div className="border border-typo-border bg-white px-5 py-5 flex flex-col h-full">
            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-3">{label}</p>
            <p className={`font-serif text-typo-text ${
                isShortNumeric
                    ? 'text-3xl md:text-4xl leading-none'
                    : 'text-lg md:text-xl leading-snug'
            }`}>
                {value}
            </p>
            {note ? (
                <p className="mt-auto pt-4 text-[12px] leading-relaxed text-typo-text-light">{note}</p>
            ) : null}
        </div>
    );
}

function EvidenceFigureCard({ figure }) {
    const [failed, setFailed] = useState(false);
    return (
        <div className="border border-typo-border bg-white flex flex-col">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-typo-border">
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-1">{figure.sourceLabel}</p>
                    <h3 className="text-lg font-serif leading-tight text-typo-text">{figure.title}</h3>
                </div>
                <span className="material-symbols-outlined text-typo-text-light">frame_inspect</span>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center bg-typo-bg/70">
                {!failed ? (
                    <a
                        href={figure.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block w-full"
                        title="Open full-size image"
                    >
                        <img
                            src={figure.src}
                            alt={figure.title}
                            className="w-full h-auto object-contain transition-opacity group-hover:opacity-90"
                            onError={() => setFailed(true)}
                        />
                        <span className="absolute bottom-2 right-2 bg-typo-text/80 text-white text-[9px] uppercase tracking-widest px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px] leading-none">open_in_new</span>
                            Enlarge
                        </span>
                    </a>
                ) : (
                    <div className="w-full h-full min-h-[200px] border border-dashed border-typo-border/40 flex flex-col items-center justify-center text-center px-6">
                        <span className="material-symbols-outlined text-3xl text-typo-text-light/60 mb-3">image</span>
                        <p className="text-xs uppercase tracking-widest text-typo-text-light mb-1">Evidence Placeholder</p>
                        <p className="text-sm font-serif text-typo-text">{figure.filename}</p>
                    </div>
                )}
            </div>
            <div className="px-5 py-4 border-t border-typo-border">
                <p className="text-sm leading-6 text-typo-text-light">{figure.caption}</p>
            </div>
        </div>
    );
}

/* ─── Chart tooltip ─── */

function ChartTooltip({ active, payload, label, suffix = '' }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-typo-text text-white px-4 py-3 text-xs shadow-lg">
            <p className="font-medium mb-1">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} className="opacity-80">
                    {entry.name}: <span className="font-medium text-white">{typeof entry.value === 'number' ? (Number.isInteger(entry.value) ? entry.value : entry.value.toFixed(4)) : entry.value}{suffix}</span>
                </p>
            ))}
        </div>
    );
}

/* ─── Table of Contents sidebar ─── */

function TableOfContents({ items, activeId }) {
    return (
        <nav className="hidden lg:block fixed left-[max(1.5rem,calc((100vw-1100px)/2-260px))] top-1/2 -translate-y-1/2 w-[220px]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-typo-text-light/70 mb-5 font-medium">On this page</p>
            <ul className="space-y-3">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className={`group flex items-baseline gap-3 text-[13px] leading-[1.35] transition-colors ${
                                activeId === item.id
                                    ? 'text-typo-text font-medium'
                                    : 'text-typo-text-light/60 hover:text-typo-text'
                            }`}
                        >
                            <span className={`text-[11px] font-mono tabular-nums shrink-0 ${
                                activeId === item.id ? 'text-typo-text' : 'text-typo-text-light/80'
                            }`}>
                                {item.number ?? ''}
                            </span>
                            <span>{item.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function useActiveSection(ids) {
    const [activeId, setActiveId] = useState(ids[0] || '');
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.current.observe(el);
        });

        return () => observer.current?.disconnect();
    }, [ids]);

    return activeId;
}

/* ─── Chart colors ─── */
const MODEL_COLORS = { XGBoost: '#1A1A1A', 'Random Forest': '#A56A43', 'Logistic Regression': '#C9C2B5' };
const PROVIDER_COLORS = (value) => (value > 0 ? '#1A1A1A' : '#D1CDC7');
const ENRICHMENT_SOURCE_COLORS = ['#1A1A1A', '#A56A43', '#C9C2B5'];

/* ─── Main page ─── */

export default function IntelligenceArticle() {
    const fadeIn = {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: 'easeOut' },
    };

    const topImportance = [...modelPageData.featureImportance].sort((a, b) => b.value - a.value);
    const tocIds = modelPageData.tableOfContents.map((t) => t.id);
    const activeId = useActiveSection(tocIds);

    const rocData = modelPageData.modelComparison.map((m) => ({
        model: m.model,
        'ROC-AUC': m.rocAuc,
        'Accuracy': m.accuracy,
        'Avg Precision': m.averagePrecision,
    }));

    const providerData = modelPageData.enrichment.enrichmentSignalCounts.map((p) => ({
        name: p.label,
        value: p.value,
    }));

    const importanceData = topImportance.map((f) => ({
        name: f.label,
        value: f.value,
    }));

    return (
        <article className="w-full px-6 py-8 md:py-16">
            <TableOfContents items={modelPageData.tableOfContents} activeId={activeId} />

            {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
            <motion.header {...fadeIn}>
                <Prose className="text-center pt-8 pb-12 md:pt-16 md:pb-20">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <time dateTime={modelPageData.meta.publicationDate} className="text-[10px] uppercase tracking-widest text-typo-text-light">
                            {new Date(modelPageData.meta.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        <span className="w-8 h-px bg-typo-text-light/40"></span>
                        <span className="text-[10px] uppercase tracking-widest text-typo-text-light">{modelPageData.meta.readingTime}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-[0.95] tracking-tighter text-typo-text">
                        {modelPageData.meta.title}
                    </h1>
                    <p className="mt-6 text-lg md:text-2xl font-serif italic text-typo-text-light leading-relaxed max-w-2xl mx-auto">
                        {modelPageData.meta.subtitle}
                    </p>
                </Prose>

                {/* Stats bar */}
                <Breakout className="max-w-[960px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-typo-border bg-white">
                        <div className="p-5 md:p-7 border-b md:border-b-0 md:border-r border-typo-border">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Final model</p>
                            <p className="text-2xl md:text-3xl font-serif text-typo-text">XGBoost</p>
                        </div>
                        <div className="p-5 md:p-7 border-b md:border-b-0 md:border-r border-typo-border">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Dataset</p>
                            <p className="text-2xl md:text-3xl font-serif text-typo-text">5,000 rows</p>
                        </div>
                        <div className="p-5 md:p-7">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">ROC-AUC</p>
                            <p className="text-2xl md:text-3xl font-serif text-typo-text">0.9882</p>
                        </div>
                    </div>
                </Breakout>
            </motion.header>

            {/* ═══════════════════════════════ INTRODUCTION ═══════════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.05 }}>
                <div id="intro" className="scroll-mt-24" />
                <ProseBlock paragraphs={modelPageData.prose.intro} />
            </motion.section>

            {/* ═══════════════════════════ 1. DATASET COLLECTION ═══════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.08 }}>
                <Prose><div className="border-t border-typo-line mt-16" /></Prose>
                <SectionHeading id="dataset" eyebrow="01 — Dataset" title="We collected our own training data from public threat feeds and real internet infrastructure." />
                <ProseBlock paragraphs={modelPageData.prose.dataset} />

                <Breakout className="mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modelPageData.sourceColumns.map((column) => (
                            <div key={column.title} className="border border-typo-border bg-white p-6">
                                <p className={`text-[10px] uppercase tracking-widest mb-3 ${column.accent}`}>{column.title}</p>
                                <p className="text-sm leading-7 text-typo-text-light mb-5">{column.summary}</p>
                                <div className="space-y-4">
                                    {column.items.map((item) => (
                                        <div key={item.name} className="border-t border-typo-line pt-3">
                                            <h3 className="text-lg font-serif text-typo-text mb-1">{item.name}</h3>
                                            <p className="text-sm leading-6 text-typo-text-light">{item.note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Balance viz */}
                    <div className="border border-typo-border bg-white mt-6">
                        <div className="grid grid-cols-2">
                            <div className="p-5 md:p-6 border-r border-typo-border bg-risk-critical/5">
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Malicious</p>
                                <p className="text-4xl md:text-5xl font-serif text-risk-critical">{modelPageData.dataset.maliciousRows.toLocaleString()}</p>
                            </div>
                            <div className="p-5 md:p-6 bg-risk-ok/5">
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Low risk</p>
                                <p className="text-4xl md:text-5xl font-serif text-risk-ok">{modelPageData.dataset.lowRiskRows.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="h-2 flex">
                            <div className="w-1/2 bg-risk-critical"></div>
                            <div className="w-1/2 bg-risk-ok"></div>
                        </div>
                    </div>
                </Breakout>
            </motion.section>

            {/* ═══════════════════════════ 2. FEATURE ENRICHMENT ═══════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.1 }}>
                <Prose><div className="border-t border-typo-line mt-16" /></Prose>
                <SectionHeading id="enrichment" eyebrow="02 — Enrichment" title="Each IP was enriched with infrastructure metadata from three free intelligence sources." />
                <ProseBlock paragraphs={modelPageData.prose.enrichment} />

                <Callout>
                    AbuseIPDB provides excellent analyst context at runtime, but its free-tier quota of 1,000 lookups per day made it impractical for a 5,000-row offline training run. The model does not depend on AbuseIPDB scores.
                </Callout>

                {/* Enrichment signal chart */}
                <Breakout className="mt-8">
                    <div className="border border-typo-border bg-white p-6 md:p-8">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Raw signals extracted during offline enrichment</p>
                        <h3 className="text-2xl font-serif text-typo-text mb-3">Infrastructure Signals by Source</h3>
                        <p className="text-sm leading-7 text-typo-text-light mb-8 max-w-3xl">
                            The full raw enriched dataset had 74 columns overall. The counts shown here reflect only the source-derived signals added during enrichment, not identifiers, labels, provider status fields, or display/context columns.
                        </p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={providerData} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 5 }}>
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#E5E2DC" />
                                <XAxis type="number" allowDecimals={false} domain={[0, 24]} tick={{ fontSize: 13, fill: '#555' }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" width={190} tick={{ fontSize: 15, fill: '#1A1A1A', fontFamily: 'Cormorant Garamond, serif' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip suffix=" signals" />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                                    {providerData.map((entry, i) => (
                                        <Cell key={i} fill={ENRICHMENT_SOURCE_COLORS[i] || PROVIDER_COLORS(entry.value)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Breakout>

                {/* Included / excluded */}
                <Breakout className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-typo-border bg-white p-6">
                            <p className="text-[10px] uppercase tracking-widest text-risk-ok mb-4">Included in training</p>
                            <div className="space-y-4">
                                {modelPageData.enrichment.included.map((s) => (
                                    <div key={s.name} className="border-t border-typo-line pt-3 first:border-t-0 first:pt-0">
                                        <h3 className="text-lg font-serif text-typo-text mb-1">{s.name}</h3>
                                        <p className="text-sm leading-6 text-typo-text-light">{s.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border border-typo-border bg-white p-6">
                            <p className="text-[10px] uppercase tracking-widest text-risk-warning mb-4">Excluded from training</p>
                            <div className="space-y-4">
                                {modelPageData.enrichment.excluded.map((s) => (
                                    <div key={s.name} className="border-t border-typo-line pt-3 first:border-t-0 first:pt-0">
                                        <h3 className="text-lg font-serif text-typo-text mb-1">{s.name}</h3>
                                        <p className="text-sm leading-6 text-typo-text-light">{s.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Breakout>
            </motion.section>

            {/* ═══════════════════════════ 3. FEATURE ENGINEERING ═══════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.12 }}>
                <Prose><div className="border-t border-typo-line mt-16" /></Prose>
                <SectionHeading id="features" eyebrow="03 — Features" title="74 raw columns were progressively reduced to 38 transformed features through five notebook steps." />
                <ProseBlock paragraphs={modelPageData.prose.featureEngineering} />

                {/* Pipeline flow */}
                <Breakout className="mt-10">
                    <div className="flex flex-col md:flex-row items-stretch gap-0">
                        {modelPageData.featurePipeline.map((step, i) => (
                            <div key={step.label} className="flex-1 flex items-stretch">
                                <div className="flex-1 border border-typo-border bg-white p-5 flex flex-col justify-between min-h-[140px]">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">{step.label}</p>
                                        <p className="text-3xl font-serif text-typo-text mb-2">{step.value}</p>
                                    </div>
                                    <p className="text-xs leading-5 text-typo-text-light">{step.detail}</p>
                                </div>
                                {i < modelPageData.featurePipeline.length - 1 && (
                                    <div className="hidden md:flex items-center justify-center w-10 text-typo-text text-2xl font-light shrink-0">&rarr;</div>
                                )}
                            </div>
                        ))}
                    </div>
                </Breakout>

                {/* Feature roles */}
                <Breakout className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(modelPageData.featureRoles).map(([role, info]) => (
                            <div key={role} className="border border-typo-border bg-white p-5">
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">{role} features</p>
                                <p className="text-3xl font-serif text-typo-text mb-3">{info.count}</p>
                                <p className="text-xs leading-5 text-typo-text-light">{info.names}</p>
                                {info.note && <p className="text-xs leading-5 text-typo-text-light/60 mt-2 italic">{info.note}</p>}
                            </div>
                        ))}
                    </div>
                </Breakout>
            </motion.section>

            {/* ═══════════════════════════ 4. MODEL COMPARISON ═══════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.15 }}>
                <Prose><div className="border-t border-typo-line mt-16" /></Prose>
                <SectionHeading id="models" eyebrow="04 — Models" title="Three model families were trained and evaluated. XGBoost was selected for deployment." />
                <ProseBlock paragraphs={modelPageData.prose.modelComparison} />

                {/* ROC-AUC bar chart */}
                <Breakout className="mt-10">
                    <div className="border border-typo-border bg-white p-6 md:p-8">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Held-out test evaluation</p>
                        <h3 className="text-2xl font-serif text-typo-text mb-8">Model Benchmark Comparison</h3>
                        <ResponsiveContainer width="100%" height={340}>
                            <BarChart data={rocData} margin={{ left: 10, right: 10, top: 20, bottom: 5 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E2DC" />
                                <XAxis dataKey="model" tick={{ fontSize: 13, fill: '#1A1A1A', fontFamily: 'Cormorant Garamond, serif' }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0.93, 1.0]} tickFormatter={(v) => v.toFixed(2)} tick={{ fontSize: 11, fill: '#555' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                                <Bar dataKey="ROC-AUC" radius={[6, 6, 0, 0]} barSize={60}>
                                    {rocData.map((entry, i) => (
                                        <Cell key={i} fill={MODEL_COLORS[entry.model]} />
                                    ))}
                                </Bar>
                                <Bar dataKey="Accuracy" radius={[6, 6, 0, 0]} barSize={60} fillOpacity={0.5}>
                                    {rocData.map((entry, i) => (
                                        <Cell key={i} fill={MODEL_COLORS[entry.model]} />
                                    ))}
                                </Bar>
                                <Bar dataKey="Avg Precision" radius={[6, 6, 0, 0]} barSize={60} fillOpacity={0.3}>
                                    {rocData.map((entry, i) => (
                                        <Cell key={i} fill={MODEL_COLORS[entry.model]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <span className="flex items-center gap-2 text-xs text-typo-text-light"><span className="w-3 h-3 bg-typo-text rounded-sm"></span> ROC-AUC</span>
                            <span className="flex items-center gap-2 text-xs text-typo-text-light"><span className="w-3 h-3 bg-typo-text/50 rounded-sm"></span> Accuracy</span>
                            <span className="flex items-center gap-2 text-xs text-typo-text-light"><span className="w-3 h-3 bg-typo-text/30 rounded-sm"></span> Avg Precision</span>
                        </div>
                    </div>
                </Breakout>

                {/* Benchmark table */}
                <Breakout className="mt-6">
                    <div className="border border-typo-border bg-white overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left">
                            <thead>
                                <tr className="border-b border-typo-border">
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-typo-text-light font-medium">Model</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-typo-text-light font-medium">Configuration</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-typo-text-light font-medium text-right">Accuracy</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-typo-text-light font-medium text-right">ROC-AUC</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-typo-text-light font-medium text-right">Avg Precision</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-typo-text-light font-medium text-right">Brier Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modelPageData.modelComparison.map((entry) => (
                                    <tr
                                        key={entry.model}
                                        className={`border-b border-typo-line last:border-b-0 ${
                                            entry.model === 'XGBoost' ? 'bg-typo-bg/50 border-l-2 border-l-typo-text' : 'bg-white'
                                        }`}
                                    >
                                        <td className="px-6 py-5">
                                            <span className="text-lg font-serif text-typo-text">{entry.model}</span>
                                            {entry.model === 'XGBoost' && (
                                                <span className="ml-2 text-[9px] uppercase tracking-widest bg-typo-text text-white px-2 py-0.5 rounded-sm">Selected</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-xs text-typo-text-light font-mono">{entry.params}</td>
                                        <td className="px-6 py-5 text-sm text-typo-text text-right font-mono">{entry.accuracy.toFixed(4)}</td>
                                        <td className="px-6 py-5 text-sm text-typo-text text-right font-mono font-medium">{entry.rocAuc.toFixed(4)}</td>
                                        <td className="px-6 py-5 text-sm text-typo-text text-right font-mono">{entry.averagePrecision.toFixed(4)}</td>
                                        <td className="px-6 py-5 text-sm text-typo-text text-right font-mono">{entry.brierScore.toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Breakout>
            </motion.section>

            {/* ═══════════════════════════ 5. VALIDATION ═══════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.18 }}>
                <Prose><div className="border-t border-typo-line mt-16" /></Prose>
                <SectionHeading id="validation" eyebrow="05 — Validation" title="Leakage control, permutation tests, cross-validation, and hyperparameter tuning confirmed the model's reliability." />
                <ProseBlock paragraphs={modelPageData.prose.validation} />

                {/* Validation checks */}
                <Breakout className="mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {modelPageData.validation.checks.map((check) => (
                            <div key={check.title} className="border border-typo-border bg-white p-6 flex flex-col h-full">
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-3">{check.title}</p>
                                <p className="text-sm leading-7 text-typo-text-light mb-5">{check.body}</p>
                                <div className="space-y-3 mt-auto">
                                    {check.metrics.map((m) => {
                                        const valueStr = String(m.value);
                                        const isTextValue = /[a-zA-Z]/.test(valueStr);
                                        return (
                                            <div key={m.label} className="flex items-center justify-between gap-4 border-t border-typo-line pt-3">
                                                <span className="text-[10px] uppercase tracking-widest text-typo-text-light shrink-0">{m.label}</span>
                                                {isTextValue ? (
                                                    <div className="flex flex-wrap justify-end gap-1.5">
                                                        {valueStr.split('·').map((part) => part.trim()).filter(Boolean).map((part) => (
                                                            <span
                                                                key={part}
                                                                className="bg-typo-text text-white text-[11px] font-mono uppercase tracking-wider px-2 py-1 rounded-sm leading-none whitespace-nowrap"
                                                            >
                                                                {part}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="font-serif text-typo-text leading-none text-right text-2xl md:text-[1.6rem]">
                                                        {m.value}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </Breakout>

                {/* Tuning summary pills */}
                <Breakout className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {modelPageData.validation.tuningSummary.map((item) => (
                            <MetricPill key={item.label} label={item.label} value={item.value} note={item.note} />
                        ))}
                    </div>
                </Breakout>

                {/* Cell 85 — Compact hyperparameter tuning detail */}
                <Breakout className="mt-6">
                    <div className="border border-typo-border bg-white">
                        <div className="px-6 py-5 border-b border-typo-border flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-1">Notebook Cell 85</p>
                                <h3 className="text-xl font-serif text-typo-text">Compact Hyperparameter Tuning</h3>
                                <p className="text-sm text-typo-text-light mt-2">6 nearby XGBoost configurations · 3-fold grouped CV · 18 fold-level evaluations</p>
                            </div>
                            <span className="material-symbols-outlined text-typo-text-light hidden md:inline">table_chart</span>
                        </div>

                        {/* Per-fold table */}
                        <div className="border-b border-typo-border">
                            <div className="px-6 pt-5 pb-3">
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-1">Per-fold metrics</p>
                                <p className="text-xs text-typo-text-light">Each of 6 configurations evaluated on 3 StratifiedGroupKFold splits.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1100px] text-left">
                                    <thead>
                                        <tr className="border-y border-typo-border bg-typo-bg/40">
                                            <th className="px-4 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium">Config</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Fold</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Trees</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Depth</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">LR</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Subsample</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Colsample</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Accuracy</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">ROC-AUC</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">AP</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Brier</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modelPageData.validation.tuningPerFold.map((row, i) => (
                                            <tr key={`${row.config}-${row.fold}`} className={`border-b border-typo-line last:border-b-0 ${i % 6 === 5 || i % 6 === 2 ? 'border-b-typo-border' : ''}`}>
                                                <td className="px-4 py-2 text-xs font-mono text-typo-text whitespace-nowrap">{row.config}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.fold}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.nEstimators}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.maxDepth}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.learningRate.toFixed(2)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.subsample.toFixed(1)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.colsampleBytree.toFixed(1)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.accuracy.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums font-medium">{row.rocAuc.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.averagePrecision.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.brierScore.toFixed(4)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Aggregate table */}
                        <div className="border-b border-typo-border">
                            <div className="px-6 pt-5 pb-3">
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-1">Aggregate across folds</p>
                                <p className="text-xs text-typo-text-light">Sorted by mean ROC-AUC (descending). Baseline retained as the production choice.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1200px] text-left">
                                    <thead>
                                        <tr className="border-y border-typo-border bg-typo-bg/40">
                                            <th className="px-4 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium">Config</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Trees</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Depth</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">LR</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Sub</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Col</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Mean Acc</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">± Std</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Mean ROC-AUC</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">± Std</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Mean AP</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">± Std</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Mean Brier</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">± Std</th>
                                            <th className="px-3 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">Decision</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modelPageData.validation.tuningAggregate.map((row, i) => (
                                            <tr
                                                key={row.config}
                                                className={`border-b border-typo-line last:border-b-0 ${
                                                    row.retained ? 'bg-typo-bg/60 border-l-2 border-l-typo-text' : (i === 0 ? 'bg-risk-ok/5' : '')
                                                }`}
                                            >
                                                <td className="px-4 py-2 text-xs font-mono text-typo-text whitespace-nowrap">{row.config}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.nEstimators}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.maxDepth}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.learningRate.toFixed(2)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.subsample.toFixed(1)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.colsampleBytree.toFixed(1)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.meanAccuracy.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-[11px] text-typo-text-light text-right font-mono tabular-nums">{row.stdAccuracy.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums font-medium">{row.meanRocAuc.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-[11px] text-typo-text-light text-right font-mono tabular-nums">{row.stdRocAuc.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.meanAveragePrecision.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-[11px] text-typo-text-light text-right font-mono tabular-nums">{row.stdAveragePrecision.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-xs text-typo-text text-right font-mono tabular-nums">{row.meanBrierScore.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-[11px] text-typo-text-light text-right font-mono tabular-nums">{row.stdBrierScore.toFixed(4)}</td>
                                                <td className="px-3 py-2 text-[9px] uppercase tracking-widest text-right whitespace-nowrap">
                                                    {row.retained ? (
                                                        <span className="bg-typo-text text-white px-2 py-0.5 rounded-sm">Retained</span>
                                                    ) : i === 0 ? (
                                                        <span className="border border-risk-ok/40 text-risk-ok px-2 py-0.5 rounded-sm">Top ROC-AUC</span>
                                                    ) : (
                                                        <span className="text-typo-text-light">Candidate</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top-ranked highlight */}
                        <div className="px-6 py-5 bg-typo-bg/40">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-1">Top-ranked configuration</p>
                                    <p className="text-xs text-typo-text-light">Highest mean ROC-AUC of the 6 candidates (difference from baseline is well within ±σ, so baseline was retained for stability).</p>
                                </div>
                            </div>
                            {(() => {
                                const top = modelPageData.validation.tuningAggregate[0];
                                const fmt4 = (v) => v.toFixed(4);
                                const fields = [
                                    ['n_estimators', top.nEstimators],
                                    ['max_depth', top.maxDepth],
                                    ['learning_rate', top.learningRate.toFixed(2)],
                                    ['subsample', top.subsample.toFixed(1)],
                                    ['colsample_bytree', top.colsampleBytree.toFixed(1)],
                                    ['mean_accuracy', fmt4(top.meanAccuracy)],
                                    ['std_accuracy', fmt4(top.stdAccuracy)],
                                    ['mean_roc_auc', fmt4(top.meanRocAuc)],
                                    ['std_roc_auc', fmt4(top.stdRocAuc)],
                                    ['mean_avg_precision', fmt4(top.meanAveragePrecision)],
                                    ['std_avg_precision', fmt4(top.stdAveragePrecision)],
                                    ['mean_brier', fmt4(top.meanBrierScore)],
                                    ['std_brier', fmt4(top.stdBrierScore)],
                                ];
                                return (
                                    <div className="border border-typo-border bg-white">
                                        <div className="px-5 py-4 border-b border-typo-border flex items-center justify-between gap-4">
                                            <span className="text-base font-mono text-typo-text">{top.config}</span>
                                            <span className="border border-risk-ok/40 text-risk-ok text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm">Top ROC-AUC</span>
                                        </div>
                                        <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-y divide-typo-line md:divide-y-0 md:divide-x md:[&>*:nth-child(n+4)]:border-t md:[&>*:nth-child(n+4)]:border-typo-line">
                                            {fields.map(([k, v]) => (
                                                <div key={k} className="px-5 py-3 flex items-baseline justify-between gap-3">
                                                    <dt className="text-[10px] uppercase tracking-widest text-typo-text-light">{k}</dt>
                                                    <dd className="text-sm font-mono text-typo-text tabular-nums">{v}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </Breakout>

                {/* Evidence figures */}
                <Breakout className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {modelPageData.evidenceFigures.map((fig) => (
                            <EvidenceFigureCard key={fig.filename} figure={fig} />
                        ))}
                    </div>
                </Breakout>

                {/* Cell 91 — raw XGBoost feature_importances_ */}
                <Breakout className="mt-8">
                    <div className="border border-typo-border bg-white">
                        <div className="px-6 py-5 border-b border-typo-border flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-1">Notebook Cell 91</p>
                                <h3 className="text-xl md:text-2xl font-serif leading-tight text-typo-text">Feature importance — raw XGBoost gain</h3>
                                <p className="text-xs text-typo-text-light mt-2">Top 20 transformed features ranked by <span className="font-mono">feature_importances_</span>.</p>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-typo-text-light">model.feature_importances_</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[520px] text-left">
                                <thead>
                                    <tr className="border-b border-typo-border bg-typo-bg/40">
                                        <th className="px-4 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right w-[60px]">#</th>
                                        <th className="px-4 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium">feature</th>
                                        <th className="px-4 py-2 text-[9px] uppercase tracking-widest text-typo-text-light font-medium text-right">importance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modelPageData.featureImportanceRaw.map((row) => (
                                        <tr
                                            key={row.rank}
                                            className={`border-b border-typo-line last:border-b-0 ${
                                                row.rank === 0 ? 'bg-typo-bg/60 border-l-2 border-l-typo-text' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-2 text-xs text-typo-text-light text-right font-mono tabular-nums">{row.rank}</td>
                                            <td className="px-4 py-2 text-xs font-mono text-typo-text whitespace-nowrap">{row.feature}</td>
                                            <td className={`px-4 py-2 text-xs text-typo-text text-right font-mono tabular-nums ${row.rank === 0 ? 'font-medium' : ''}`}>
                                                {row.importance}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Breakout>
            </motion.section>

            {/* ═══════════════════════════ 6. FEATURE IMPORTANCE ═══════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.2 }}>
                <Prose><div className="border-t border-typo-line mt-16" /></Prose>
                <SectionHeading id="importance" eyebrow="06 — Importance" title="The model learned infrastructure-exposure patterns, not a single hard-coded rule." />
                <ProseBlock paragraphs={modelPageData.prose.featureImportance} />

                {/* Horizontal bar chart */}
                <Breakout className="mt-10">
                    <div className="border border-typo-border bg-white p-6 md:p-8">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">XGBoost gain-based importance</p>
                        <h3 className="text-2xl font-serif text-typo-text mb-8">Top 10 Transformed Features</h3>
                        <ResponsiveContainer width="100%" height={380}>
                            <BarChart data={importanceData} layout="vertical" margin={{ left: 20, right: 40, top: 5, bottom: 5 }}>
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#E5E2DC" />
                                <XAxis type="number" tickFormatter={(v) => v.toFixed(2)} tick={{ fontSize: 11, fill: '#555' }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" width={170} tick={{ fontSize: 12, fill: '#1A1A1A', fontFamily: 'Cormorant Garamond, serif' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                    {importanceData.map((_, i) => (
                                        <Cell key={i} fill={i === 0 ? '#1A1A1A' : '#A56A43'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Breakout>

                <Callout>
                    The model distinguishes malicious-like infrastructure from low-risk-like infrastructure based on a combination of port exposure, provider context, vulnerability state, and naming patterns. It does not discover moral truth about an IP.
                </Callout>
            </motion.section>

            {/* ═══════════════════════════ 7. DECISION BANDS ═══════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.22 }}>
                <Prose><div className="border-t border-typo-line mt-16" /></Prose>
                <SectionHeading id="thresholds" eyebrow="07 — Thresholds" title="The deployed product maps probabilities into three operational bands instead of a binary verdict." />
                <ProseBlock paragraphs={modelPageData.prose.decisionBands} />

                <Breakout className="mt-10">
                    <div className="border border-typo-border bg-white p-6 md:p-8">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-5">Probability-to-band mapping</p>

                        {/* Zone labels aligned to bar proportions */}
                        <div className="grid mb-3" style={{ gridTemplateColumns: '60fr 10fr 30fr' }}>
                            <div className="pr-4">
                                <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-risk-ok">Low Risk</span>
                                <p className="text-[11px] font-mono text-typo-text-light mt-0.5">p &lt; 0.60</p>
                            </div>
                            <div className="border-x border-typo-line px-2">
                                <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#A07820]">Monitor</span>
                                <p className="text-[11px] font-mono text-typo-text-light mt-0.5 whitespace-nowrap">0.60 – 0.70</p>
                            </div>
                            <div className="pl-4">
                                <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-risk-critical">High Risk</span>
                                <p className="text-[11px] font-mono text-typo-text-light mt-0.5">p ≥ 0.70</p>
                            </div>
                        </div>

                        {/* Gradient bar */}
                        <div className="relative h-12">
                            <div className="absolute inset-0 rounded-sm bg-gradient-to-r from-risk-ok via-[#D4A24A] to-risk-critical" />
                            <div className="absolute inset-y-0 left-[60%] w-px bg-white/70" />
                            <div className="absolute inset-y-0 left-[70%] w-px bg-white/70" />
                        </div>

                        {/* Axis with threshold callouts */}
                        <div className="relative h-16 mt-0.5 mb-8">
                            <div className="absolute left-0 top-0 flex flex-col items-start">
                                <div className="w-px h-3 bg-typo-line" />
                                <span className="text-[11px] font-mono text-typo-text-light/60 mt-1">0.0</span>
                            </div>

                            <div className="absolute left-[60%] -translate-x-1/2 top-0 flex flex-col items-center">
                                <div className="w-px h-3 bg-typo-text/50" />
                                <span className="text-2xl font-serif text-typo-text mt-1 leading-none">0.60</span>
                                <span className="text-[9px] uppercase tracking-widest text-typo-text-light mt-1.5 whitespace-nowrap">Low threshold</span>
                            </div>

                            <div className="absolute left-[70%] -translate-x-1/2 top-0 flex flex-col items-center">
                                <div className="w-px h-3 bg-typo-text/50" />
                                <span className="text-2xl font-serif text-typo-text mt-1 leading-none">0.70</span>
                                <span className="text-[9px] uppercase tracking-widest text-typo-text-light mt-1.5 whitespace-nowrap">High threshold</span>
                            </div>

                            <div className="absolute right-0 top-0 flex flex-col items-end">
                                <div className="w-px h-3 bg-typo-line" />
                                <span className="text-[11px] font-mono text-typo-text-light/60 mt-1">1.0</span>
                            </div>
                        </div>

                        {/* Band cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {modelPageData.thresholds.bandCards.map((band) => (
                                <div key={band.title} className="border border-typo-border p-5 bg-typo-bg/40">
                                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-1">{band.range}</p>
                                    <h3 className="text-2xl font-serif text-typo-text mb-4">{band.title}</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-4 border-t border-typo-line pt-2">
                                            <span className="text-[10px] uppercase tracking-widest text-typo-text-light">Test rows</span>
                                            <span className="text-xl font-serif text-typo-text">{band.count}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 border-t border-typo-line pt-2">
                                            <span className="text-[10px] uppercase tracking-widest text-typo-text-light">{band.purityLabel}</span>
                                            <span className="text-lg font-serif text-typo-text">{band.purityValue}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Breakout>
            </motion.section>

            {/* ═══════════════════════════ 8. LIVE ARCHITECTURE ═══════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.24 }}>
                <Prose><div className="border-t border-typo-line mt-16" /></Prose>
                <SectionHeading id="architecture" eyebrow="08 — Architecture" title="Training and inference follow deliberately separate paths." />
                <ProseBlock paragraphs={modelPageData.prose.liveFlow} />

                <Breakout className="mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Training pipeline */}
                        <div className="border border-typo-border bg-white p-6">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-6">Offline training pipeline</p>
                            <div className="space-y-0">
                                {modelPageData.liveFlow.training.map((step, i) => (
                                    <div key={step} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="size-7 border border-typo-border rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 bg-white">{i + 1}</div>
                                            {i < modelPageData.liveFlow.training.length - 1 && <div className="w-px flex-1 bg-typo-line"></div>}
                                        </div>
                                        <div className="pb-5">
                                            <p className="text-[16px] md:text-[17px] font-serif text-typo-text leading-snug">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Runtime pipeline */}
                        <div className="border border-typo-border bg-white p-6">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-6">Runtime analysis pipeline</p>
                            <div className="space-y-0">
                                {modelPageData.liveFlow.runtime.map((step, i) => (
                                    <div key={step} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="size-7 border border-typo-border rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 bg-white">{i + 1}</div>
                                            {i < modelPageData.liveFlow.runtime.length - 1 && <div className="w-px flex-1 bg-typo-line"></div>}
                                        </div>
                                        <div className="pb-5">
                                            <p className="text-[16px] md:text-[17px] font-serif text-typo-text leading-snug">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Breakout>
            </motion.section>

            {/* ═══════════════════════════ 9. LIMITATIONS ═══════════════════════════ */}
            <motion.section {...fadeIn} transition={{ delay: 0.26 }}>
                <Prose><div className="border-t border-typo-line mt-16" /></Prose>
                <SectionHeading id="limitations" eyebrow="09 — Limitations" title="The model is useful because its boundaries are explicit." />

                <Breakout className="mt-8 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {modelPageData.limitations.map((item, i) => (
                            <div key={i} className="border border-typo-border bg-white p-6">
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-3">Boundary {String(i + 1).padStart(2, '0')}</p>
                                <p className="text-[16px] md:text-[17px] font-serif leading-relaxed text-typo-text">{item}</p>
                            </div>
                        ))}
                    </div>
                </Breakout>
            </motion.section>
        </article>
    );
}
