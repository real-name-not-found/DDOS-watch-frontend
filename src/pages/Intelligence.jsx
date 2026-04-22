import { useState } from 'react';
import { motion } from 'framer-motion';
import { modelPageData } from '../data/modelPageData';

function SectionLabel({ children }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light">{children}</span>
            <span className="w-14 h-px bg-typo-text"></span>
        </div>
    );
}

function SectionIntro({ eyebrow, title, body }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-b border-typo-border">
            <div className="lg:col-span-5 py-8 md:py-12 pr-4 md:pr-10 border-b lg:border-b-0 lg:border-r border-typo-border">
                <SectionLabel>{eyebrow}</SectionLabel>
                <h2 className="text-3xl md:text-5xl font-serif font-light leading-[0.94] tracking-tight text-typo-text">
                    {title}
                </h2>
            </div>
            <div className="lg:col-span-7 py-8 md:py-12 lg:pl-10 flex items-center">
                <p className="text-sm md:text-base leading-7 text-typo-text-light max-w-3xl">
                    {body}
                </p>
            </div>
        </div>
    );
}

function EvidenceFigureCard({ figure }) {
    const [failed, setFailed] = useState(false);

    return (
        <div className="border border-typo-border bg-white flex flex-col min-h-[320px]">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-typo-border">
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-1">{figure.sourceLabel}</p>
                    <h3 className="text-lg font-serif leading-tight text-typo-text">{figure.title}</h3>
                </div>
                <span className="material-symbols-outlined text-typo-text-light">frame_inspect</span>
            </div>

            <div className="flex-1 p-5 flex items-center justify-center bg-typo-bg/70">
                {!failed ? (
                    <img
                        src={figure.src}
                        alt={figure.title}
                        className="w-full h-full max-h-[260px] object-contain"
                        onError={() => setFailed(true)}
                    />
                ) : (
                    <div className="w-full h-full min-h-[220px] border border-dashed border-typo-border/40 flex flex-col items-center justify-center text-center px-6">
                        <span className="material-symbols-outlined text-3xl text-typo-text-light/60 mb-4">image</span>
                        <p className="text-xs uppercase tracking-widest text-typo-text-light mb-2">Notebook Evidence Placeholder</p>
                        <p className="text-sm font-serif text-typo-text mb-2">{figure.filename}</p>
                        <p className="text-xs leading-6 text-typo-text-light max-w-sm">
                            Add this screenshot to <span className="font-medium text-typo-text">public/model-evidence</span> to replace the placeholder with the notebook proof block.
                        </p>
                    </div>
                )}
            </div>

            <div className="px-5 py-4 border-t border-typo-border">
                <p className="text-sm leading-6 text-typo-text-light">{figure.caption}</p>
            </div>
        </div>
    );
}

function MetricPill({ label, value, subtle = false }) {
    return (
        <div className={`border border-typo-border ${subtle ? 'bg-transparent' : 'bg-white'} px-4 py-4`}>
            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">{label}</p>
            <p className="text-2xl md:text-3xl font-serif text-typo-text">{value}</p>
        </div>
    );
}

function PillRail({ items, activeIndex = 0, className = '' }) {
    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            {items.map((item, index) => (
                <span
                    key={item}
                    className={`px-4 py-2 rounded-full border text-xs uppercase tracking-widest transition-colors ${
                        index === activeIndex
                            ? 'bg-typo-text text-white border-typo-text'
                            : 'bg-transparent text-typo-text-light border-typo-border/50'
                    }`}
                >
                    {item}
                </span>
            ))}
        </div>
    );
}

function formatPercent(value, digits = 2) {
    return `${value.toFixed(digits)}%`;
}

export default function Intelligence() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' },
    };

    const topImportance = [...modelPageData.featureImportance].sort((a, b) => b.value - a.value);
    const maxImportance = topImportance[0]?.value || 1;
    const rocValues = modelPageData.modelComparison.map((entry) => entry.rocAuc);
    const minRoc = Math.min(...rocValues);
    const maxRoc = Math.max(...rocValues);

    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 py-12 flex flex-col gap-12">
            <motion.div {...fadeIn} className="border-t border-b border-typo-border">
                <div className="py-12 md:py-18 lg:py-24">
                    <div className="max-w-5xl mx-auto text-center px-2">
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                            <span className="text-[10px] uppercase tracking-widest font-medium text-typo-text-light">{modelPageData.hero.eyebrow}</span>
                            <span className="w-14 h-px bg-typo-text hidden md:block"></span>
                            <span className="text-[10px] uppercase tracking-widest font-medium text-risk-ok flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-risk-ok animate-pulse"></span>
                                Live in Product
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-7xl lg:text-[6.5rem] font-serif font-light leading-[0.9] tracking-tighter text-typo-text">
                            {modelPageData.hero.title}
                        </h1>
                        <p className="mt-6 text-xl md:text-3xl font-serif italic text-typo-text-light leading-relaxed">
                            {modelPageData.hero.subtitle}
                        </p>
                        <p className="mt-10 max-w-3xl mx-auto text-base md:text-lg leading-8 text-typo-text-light">
                            {modelPageData.hero.summary}
                        </p>

                        <PillRail items={modelPageData.hero.chips} className="justify-center mt-10" />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 border-t border-typo-border bg-white">
                    <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-typo-border">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Final deployed model</p>
                        <p className="text-3xl md:text-4xl font-serif text-typo-text">XGBoost</p>
                    </div>
                    <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-typo-border">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Offline rows</p>
                        <p className="text-3xl md:text-4xl font-serif text-typo-text">{modelPageData.dataset.totalRows}</p>
                    </div>
                    <div className="p-6 md:p-8 border-r border-typo-border">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Balanced labels</p>
                        <p className="text-3xl md:text-4xl font-serif text-typo-text">2500 / 2500</p>
                    </div>
                    <div className="p-6 md:p-8">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Decision bands</p>
                        <p className="text-3xl md:text-4xl font-serif text-typo-text">0.60 / 0.70</p>
                    </div>
                </div>
            </motion.div>

            <motion.section {...fadeIn} transition={{ delay: 0.05 }}>
                <SectionIntro
                    eyebrow="1. Collected From Scratch"
                    title="Two label streams were collected independently, then cleaned into one balanced research dataset."
                    body="The malicious class was assembled from live public blocklists and botnet intelligence feeds, while the low-risk class was built from resolved real-world infrastructure such as popular domains and curated institutional targets. The result was deliberately balanced at 2,500 malicious and 2,500 low-risk rows so that one label would not dominate training. Low-risk here means operationally ordinary infrastructure, not a mathematical guarantee of safety."
                />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
                    <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modelPageData.sourceColumns.map((column) => (
                            <div key={column.title} className="border border-typo-border bg-white p-6 flex flex-col">
                                <p className={`text-[10px] uppercase tracking-widest mb-3 ${column.accent}`}>{column.title}</p>
                                <p className="text-sm leading-7 text-typo-text-light mb-6">{column.summary}</p>
                                <div className="space-y-5">
                                    {column.items.map((item) => (
                                        <div key={item.name} className="border-t border-typo-line pt-4">
                                            <h3 className="text-xl font-serif text-typo-text mb-1">{item.name}</h3>
                                            <p className="text-sm leading-6 text-typo-text-light">{item.note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="xl:col-span-4 border border-typo-border bg-white p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-4">Balanced class design</p>
                            <h3 className="text-3xl font-serif leading-tight text-typo-text mb-4">5,000 collected rows after overlap removal and balancing.</h3>
                            <p className="text-sm leading-7 text-typo-text-light mb-8">
                                Any collision between malicious feeds and low-risk candidates was removed before the final offline dataset was locked.
                            </p>
                        </div>

                        <div className="border border-typo-border">
                            <div className="grid grid-cols-2">
                                <div className="p-6 border-r border-typo-border bg-risk-critical/5">
                                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Malicious</p>
                                    <p className="text-5xl font-serif text-risk-critical">{modelPageData.dataset.maliciousRows}</p>
                                </div>
                                <div className="p-6 bg-risk-ok/5">
                                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">Low risk</p>
                                    <p className="text-5xl font-serif text-risk-ok">{modelPageData.dataset.lowRiskRows}</p>
                                </div>
                            </div>
                            <div className="h-3 border-t border-typo-border flex">
                                <div className="w-1/2 bg-risk-critical"></div>
                                <div className="w-1/2 bg-risk-ok"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section {...fadeIn} transition={{ delay: 0.1 }}>
                <SectionIntro
                    eyebrow="2. Offline Enrichment Pipeline"
                    title="Raw IP lists were turned into infrastructure-aware feature rows using only free intelligence sources."
                    body="After collection, the offline pipeline enriched each IP with Team Cymru allocation context, Shodan InternetDB exposure data, and reverse DNS naming signals. AbuseIPDB was intentionally excluded from the large offline dataset because the free quota was too small for 5,000 rows, and ipwho security fields were excluded because they were not reliable enough for training."
                />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
                    <div className="xl:col-span-8 border border-typo-border bg-white p-6">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-6">Training-time pipeline</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                            {modelPageData.enrichment.pipelineSteps.map((step, index) => (
                                <div key={step} className="relative border border-typo-border bg-typo-bg/50 p-4 min-h-[150px] flex flex-col justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-4">Step {index + 1}</p>
                                        <p className="text-lg font-serif leading-tight text-typo-text">{step}</p>
                                    </div>
                                    {index < modelPageData.enrichment.pipelineSteps.length - 1 && (
                                        <span className="hidden xl:flex absolute top-1/2 -right-3 -translate-y-1/2 items-center justify-center size-6 bg-typo-bg border border-typo-border rounded-full text-xs">
                                            →
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="xl:col-span-4 space-y-6">
                        <div className="border border-typo-border bg-white p-6">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-4">Included sources</p>
                            <div className="space-y-4">
                                {modelPageData.enrichment.included.map((source) => (
                                    <div key={source.name} className="border-t border-typo-line pt-4 first:border-t-0 first:pt-0">
                                        <h3 className="text-xl font-serif text-typo-text mb-1">{source.name}</h3>
                                        <p className="text-sm leading-6 text-typo-text-light">{source.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border border-typo-border bg-white p-6">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-4">Offline exclusions</p>
                            <div className="space-y-4">
                                {modelPageData.enrichment.excluded.map((source) => (
                                    <div key={source.name} className="border-t border-typo-line pt-4 first:border-t-0 first:pt-0">
                                        <h3 className="text-xl font-serif text-typo-text mb-1">{source.name}</h3>
                                        <p className="text-sm leading-6 text-typo-text-light">{source.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-typo-border bg-white mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        {modelPageData.enrichment.providerSuccess.map((provider) => (
                            <div key={provider.label} className="p-6 border-b lg:border-b-0 lg:border-r last:border-r-0 border-typo-border">
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-3">{provider.label}</p>
                                <div className="flex items-end justify-between gap-4 mb-3">
                                    <p className="text-4xl font-serif text-typo-text">{formatPercent(provider.value)}</p>
                                    <span className={`text-xs uppercase tracking-widest ${provider.value > 0 ? 'text-risk-ok' : 'text-typo-text-light/60'}`}>
                                        {provider.value > 0 ? 'Available' : 'Not used'}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-typo-line overflow-hidden">
                                    <div
                                        className={`${provider.value > 0 ? 'bg-typo-text' : 'bg-typo-line/60'} h-full`}
                                        style={{ width: `${provider.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section {...fadeIn} transition={{ delay: 0.15 }}>
                <SectionIntro
                    eyebrow="3. Cleaning and Feature Selection"
                    title="The raw enriched export was reduced in several notebook steps before any model was fit."
                    body="The notebook progressively removed identifiers and non-feature columns, normalized missing-value markers, selected a smaller V1 feature set, and then fit the preprocessing pipeline only on the training split. Numeric and binary columns were imputed separately from the coded categorical columns that were one-hot encoded."
                />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-8">
                    {modelPageData.preprocessingSteps.map((step, index) => (
                        <div key={step.label} className="border border-typo-border bg-white p-5 relative min-h-[220px]">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-3">Notebook step {index + 1}</p>
                            <h3 className="text-2xl font-serif text-typo-text mb-3">{step.value}</h3>
                            <p className="text-lg font-serif text-typo-text mb-3 leading-tight">{step.label}</p>
                            <p className="text-sm leading-6 text-typo-text-light">{step.detail}</p>
                            {index < modelPageData.preprocessingSteps.length - 1 && (
                                <span className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 size-6 rounded-full bg-typo-bg border border-typo-border items-center justify-center text-xs">
                                    →
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <MetricPill label="Raw enriched dataset" value={modelPageData.dataset.rawShape} />
                    <MetricPill label="Model V1 base matrix" value={modelPageData.dataset.step5Shape} />
                    <MetricPill label="Final transformed matrix" value={modelPageData.dataset.step6TransformedShape} />
                </div>
            </motion.section>

            <motion.section {...fadeIn} transition={{ delay: 0.2 }}>
                <SectionIntro
                    eyebrow="4. Model Comparison"
                    title="Three model families were trained and evaluated before one was selected for deployment."
                    body="DDoS Watch did not jump directly to a single model. Logistic Regression was used as a transparent linear baseline, Random Forest as a strong tree ensemble baseline, and XGBoost as the boosted-tree candidate. The held-out test split showed XGBoost delivered the strongest overall discrimination and the best probability quality."
                />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
                    <div className="xl:col-span-7 border border-typo-border bg-white p-6">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-6">Held-out model metrics</p>
                        <div className="space-y-4">
                            {modelPageData.modelComparison.map((entry) => (
                                <div key={entry.model} className="border border-typo-border p-5 bg-typo-bg/40">
                                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-3xl font-serif text-typo-text">{entry.model}</h3>
                                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mt-2">{entry.status}</p>
                                        </div>
                                        <div className="text-sm text-typo-text-light leading-6">
                                            Accuracy {entry.accuracy.toFixed(4)} · ROC-AUC {entry.rocAuc.toFixed(4)} · AP {entry.averagePrecision.toFixed(4)} · Brier {entry.brierScore.toFixed(4)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <MetricPill label="Accuracy" value={entry.accuracy.toFixed(4)} subtle />
                                        <MetricPill label="ROC-AUC" value={entry.rocAuc.toFixed(4)} subtle />
                                        <MetricPill label="Average Precision" value={entry.averagePrecision.toFixed(4)} subtle />
                                        <MetricPill label="Brier Score" value={entry.brierScore.toFixed(4)} subtle />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="xl:col-span-5 border border-typo-border bg-white p-6">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-6">Why XGBoost was retained</p>
                        <div className="space-y-5">
                            <div className="border-t border-typo-line pt-5">
                                <h3 className="text-2xl font-serif text-typo-text mb-2">Best discrimination</h3>
                                <p className="text-sm leading-7 text-typo-text-light">
                                    XGBoost produced the best held-out ROC-AUC of <span className="font-medium text-typo-text">0.9882</span>, showing the strongest separation between malicious and low-risk infrastructure.
                                </p>
                            </div>
                            <div className="border-t border-typo-line pt-5">
                                <h3 className="text-2xl font-serif text-typo-text mb-2">Strong probability quality</h3>
                                <p className="text-sm leading-7 text-typo-text-light">
                                    Its Brier score of <span className="font-medium text-typo-text">0.0354</span> was the best among the tested models, so it was not only ranking well but also producing more useful probabilities.
                                </p>
                            </div>
                            <div className="border-t border-typo-line pt-5">
                                <h3 className="text-2xl font-serif text-typo-text mb-2">Tree-based without excessive complexity</h3>
                                <p className="text-sm leading-7 text-typo-text-light">
                                    After grouped validation and compact tuning, the baseline XGBoost configuration remained competitive enough to retain without a larger search.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section {...fadeIn} transition={{ delay: 0.25 }}>
                <SectionIntro
                    eyebrow="5. Validation and Trustworthiness"
                    title="The notebook included leakage control, sanity checks, cross-validation, and a small tuning search before the model was accepted."
                    body="The legitimacy work matters as much as the model itself. The dataset was split by /24 network neighborhood to reduce direct subnet leakage, a shuffled-label permutation test was used to confirm the result collapses toward chance, grouped cross-validation checked stability across folds, and a compact nearby search explored alternative XGBoost configurations before the baseline was retained."
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    {modelPageData.validation.checks.map((check) => (
                        <div key={check.title} className="border border-typo-border bg-white p-6">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-4">{check.title}</p>
                            <p className="text-sm leading-7 text-typo-text-light mb-6">{check.body}</p>
                            <div className="space-y-3">
                                {check.metrics.map((metric) => (
                                    <div key={metric.label} className="flex items-center justify-between gap-4 border-t border-typo-line pt-3">
                                        <span className="text-xs uppercase tracking-widest text-typo-text-light">{metric.label}</span>
                                        <span className="text-xl font-serif text-typo-text">{metric.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
                    {modelPageData.validation.tuningSummary.map((item) => (
                        <MetricPill key={item.label} label={item.label} value={item.value} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {modelPageData.evidenceFigures.map((figure) => (
                        <EvidenceFigureCard key={figure.filename} figure={figure} />
                    ))}
                </div>
            </motion.section>

            <motion.section {...fadeIn} transition={{ delay: 0.3 }}>
                <SectionIntro
                    eyebrow="6. What the Model Learns"
                    title="Feature importance shows that the model learned infrastructure-profile patterns, not a single hard-coded rule."
                    body="The selected XGBoost model leaned most heavily on exposure and provider-context features such as HTTP presence, provider family codes, vulnerability signals, HTTPS, SSH exposure, registry metadata, ASN age, and hostname activity. This does not mean those features are causal on their own; it means they were the strongest discriminators in this particular dataset."
                />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
                    <div className="xl:col-span-8 border border-typo-border bg-white p-6">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-6">Top transformed features</p>
                        <div className="space-y-4">
                            {topImportance.map((feature, index) => (
                                <div key={feature.key}>
                                    <div className="flex items-end justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] uppercase tracking-widest text-typo-text-light">{String(index + 1).padStart(2, '0')}</span>
                                            <h3 className="text-xl font-serif text-typo-text">{feature.label}</h3>
                                        </div>
                                        <span className="text-lg font-serif text-typo-text">{feature.value.toFixed(6)}</span>
                                    </div>
                                    <div className="h-2 bg-typo-line/80 overflow-hidden">
                                        <div
                                            className="h-full bg-typo-text"
                                            style={{ width: `${(feature.value / maxImportance) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="xl:col-span-4 border border-typo-border bg-white p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-4">Interpretation note</p>
                            <h3 className="text-3xl font-serif text-typo-text leading-tight mb-4">The model distinguishes malicious-like infrastructure from low-risk-like infrastructure.</h3>
                            <p className="text-sm leading-7 text-typo-text-light">
                                The importance profile supports an honest interpretation: DDoS Watch is learning exposure, provider, and naming patterns associated with different infrastructure types. It is not discovering moral truth about an IP, and that limitation should be stated openly.
                            </p>
                        </div>

                        <div className="border-t border-typo-line pt-5 mt-8">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-3">Most dominant signal</p>
                            <p className="text-4xl font-serif text-typo-text mb-2">HTTP exposure</p>
                            <p className="text-sm leading-6 text-typo-text-light">
                                The `has_http` feature had the strongest importance in the notebook output, indicating that public-service-like exposure was a major separator in the final dataset.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section {...fadeIn} transition={{ delay: 0.35 }}>
                <SectionIntro
                    eyebrow="7. Live Inference Flow"
                    title="A pasted IP travels through a different runtime path than the offline training dataset."
                    body="Training and inference are intentionally separated. The offline dataset was collected once, enriched once, and used to fit the preprocessor and XGBoost model. Live inference re-runs only the feature collection needed for a single IP, then merges the model output with live analyst-facing context in the backend before the frontend renders the result."
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
                    <div className="border border-typo-border bg-white p-6">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-6">Offline training pipeline</p>
                        <div className="space-y-4">
                            {modelPageData.liveFlow.training.map((step, index) => (
                                <div key={step} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="size-8 border border-typo-border rounded-full flex items-center justify-center text-xs font-medium">{index + 1}</div>
                                        {index < modelPageData.liveFlow.training.length - 1 && <div className="w-px flex-1 bg-typo-line mt-2"></div>}
                                    </div>
                                    <div className="pb-5">
                                        <p className="text-lg font-serif text-typo-text leading-tight">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-typo-border bg-white p-6">
                        <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-6">Runtime analysis pipeline</p>
                        <div className="space-y-4">
                            {modelPageData.liveFlow.runtime.map((step, index) => (
                                <div key={step} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="size-8 border border-typo-border rounded-full flex items-center justify-center text-xs font-medium">{index + 1}</div>
                                        {index < modelPageData.liveFlow.runtime.length - 1 && <div className="w-px flex-1 bg-typo-line mt-2"></div>}
                                    </div>
                                    <div className="pb-5">
                                        <p className="text-lg font-serif text-typo-text leading-tight">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section {...fadeIn} transition={{ delay: 0.4 }}>
                <SectionIntro
                    eyebrow="8. Decision Bands"
                    title="The deployed product does not force every IP into a binary answer."
                    body="The XGBoost probability is converted into three operational bands. Scores at or below 0.60 are treated as low risk, scores at or above 0.70 are treated as high risk, and the narrow band in between is intentionally reserved for monitor cases where the system avoids overclaiming confidence."
                />

                <div className="border border-typo-border bg-white p-6 mt-8">
                    <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-6">Probability-to-band mapping</p>
                    <div className="relative">
                        <div className="h-3 bg-gradient-to-r from-risk-ok via-[#D4A24A] to-risk-critical"></div>
                        <div className="absolute inset-y-0 left-[60%] -translate-x-1/2 flex flex-col items-center">
                            <div className="w-px h-8 bg-typo-text -mt-2"></div>
                            <span className="mt-2 text-[10px] uppercase tracking-widest text-typo-text-light">0.60</span>
                        </div>
                        <div className="absolute inset-y-0 left-[70%] -translate-x-1/2 flex flex-col items-center">
                            <div className="w-px h-8 bg-typo-text -mt-2"></div>
                            <span className="mt-2 text-[10px] uppercase tracking-widest text-typo-text-light">0.70</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14">
                        {modelPageData.thresholds.bandCards.map((band) => (
                            <div key={band.title} className="border border-typo-border p-5 bg-typo-bg/40">
                                <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-2">{band.range}</p>
                                <h3 className="text-3xl font-serif text-typo-text mb-4">{band.title}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-4 border-t border-typo-line pt-3">
                                        <span className="text-xs uppercase tracking-widest text-typo-text-light">Test rows</span>
                                        <span className="text-2xl font-serif text-typo-text">{band.count}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 border-t border-typo-line pt-3">
                                        <span className="text-xs uppercase tracking-widest text-typo-text-light">{band.purityLabel}</span>
                                        <span className="text-lg font-serif text-typo-text">{band.purityValue}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section {...fadeIn} transition={{ delay: 0.45 }}>
                <SectionIntro
                    eyebrow="9. Limitations and Honest Boundaries"
                    title="The model is useful because its boundaries are explicit."
                    body="The page should not overstate what the system knows. DDoS Watch is strongest when it is described as an infrastructure-profiling model that combines offline machine learning with live analyst context, not as an oracle that proves guilt or innocence."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
                    {modelPageData.limitations.map((item, index) => (
                        <div key={item} className="border border-typo-border bg-white p-6">
                            <p className="text-[10px] uppercase tracking-widest text-typo-text-light mb-4">Boundary {String(index + 1).padStart(2, '0')}</p>
                            <p className="text-xl font-serif leading-tight text-typo-text">{item}</p>
                        </div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
