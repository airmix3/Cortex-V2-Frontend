'use client';

import { useState, useMemo } from 'react';
import PageShell from '@/components/shared/PageShell';
import { vaultEntries } from '@/data/pages-data';
import { VaultEntry } from '@/types';
import { motion } from 'motion/react';
import {
  Shield,
  Target,
  Compass,
  Gavel,
  Scale,
  Heart,
  BookOpen,
  Search,
  Lock,
  Hash,
  Building2,
} from 'lucide-react';

// ─── Category Config ───

const categoryConfig: Record<
  VaultEntry['category'],
  { icon: React.ElementType; color: string; bgColor: string; borderColor: string; label: string }
> = {
  mission:    { icon: Target,   color: 'text-amber-400',  bgColor: 'bg-amber-500/10',  borderColor: 'border-amber-500/20',  label: 'Mission' },
  strategy:   { icon: Compass,  color: 'text-sky-400',    bgColor: 'bg-sky-500/10',     borderColor: 'border-sky-500/20',    label: 'Strategy' },
  decision:   { icon: Gavel,    color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20', label: 'Decision' },
  policy:     { icon: Scale,    color: 'text-rose-400',   bgColor: 'bg-rose-500/10',    borderColor: 'border-rose-500/20',   label: 'Policy' },
  preference: { icon: Heart,    color: 'text-violet-400', bgColor: 'bg-violet-500/10',  borderColor: 'border-violet-500/20', label: 'Preference' },
  knowledge:  { icon: BookOpen, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10',  borderColor: 'border-indigo-500/20', label: 'Knowledge' },
};

const allCategories: Array<VaultEntry['category'] | 'all'> = [
  'all', 'mission', 'strategy', 'decision', 'policy', 'preference', 'knowledge',
];

// ─── Vault Page ───

export default function VaultPage() {
  const [activeCategory, setActiveCategory] = useState<VaultEntry['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    return vaultEntries.filter((entry) => {
      const matchesCategory = activeCategory === 'all' || entry.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const byCat: Record<string, number> = {};
    for (const cat of Object.keys(categoryConfig)) {
      byCat[cat] = vaultEntries.filter((e) => e.category === cat).length;
    }
    const lastUpdated = vaultEntries.reduce((latest, e) => {
      const num = parseInt(e.createdAt.replace(/\D/g, ''), 10);
      return num > latest ? num : latest;
    }, 0);
    return { total: vaultEntries.length, byCat, lastUpdated: `Day ${lastUpdated}` };
  }, []);

  const maxCatCount = Math.max(...Object.values(stats.byCat));

  return (
    <PageShell>
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* ─── Page Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">The Vault</h1>
              <p className="text-sm text-slate-400">
                Company-wide institutional memory &mdash; durable facts, decisions, and strategy
              </p>
            </div>
          </div>
        </motion.div>

        {/* ─── Info Strip ─── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="panel px-4 py-2.5 mb-6 flex items-center gap-2"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-xs text-slate-400">
            Readable by all agents. Write access:{' '}
            <span className="text-amber-400 font-medium">Tamir only</span> (CEO approval for major
            entries).
          </span>
        </motion.div>

        {/* ─── Filter Bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="flex flex-wrap gap-1.5">
            {allCategories.map((cat) => {
              const isActive = activeCategory === cat;
              const cfg = cat !== 'all' ? categoryConfig[cat] : null;
              const Icon = cfg?.icon;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                    ${
                      isActive
                        ? cat === 'all'
                          ? 'bg-white/10 text-white border border-white/15'
                          : `${cfg!.bgColor} ${cfg!.color} border ${cfg!.borderColor}`
                        : 'text-slate-400 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {cat === 'all' ? 'All' : cfg!.label}
                </button>
              );
            })}
          </div>

          <div className="ml-auto relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg text-xs text-slate-300 placeholder:text-slate-500 outline-none w-64 transition-colors"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            />
          </div>
        </motion.div>

        {/* ─── Main Grid: Cards + Sidebar ─── */}
        <div className="grid grid-cols-[1fr_280px] gap-6">
          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-4 auto-rows-max">
            {filteredEntries.map((entry, i) => {
              const cfg = categoryConfig[entry.category];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="card-depth rounded-xl p-4 flex flex-col"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {/* Top row: category badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${cfg.bgColor} ${cfg.color} ${cfg.borderColor}`}
                    >
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </div>
                    {entry.department && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Building2 className="w-2.5 h-2.5" />
                        {entry.department}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">{entry.title}</h3>

                  {/* Content (clamped) */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-3 flex-1">
                    {entry.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-slate-400"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <Hash className="w-2 h-2 text-slate-500" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div
                    className="pt-2 text-[10px] text-slate-500 leading-relaxed"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}
                  >
                    Added by <span className="text-slate-300">{entry.addedBy}</span> &bull; Approved
                    by <span className="text-slate-300">{entry.approvedBy}</span> &bull;{' '}
                    {entry.createdAt}
                  </div>
                </motion.div>
              );
            })}

            {filteredEntries.length === 0 && (
              <div className="col-span-2 panel p-12 text-center">
                <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No vault entries match your filters.</p>
              </div>
            )}
          </div>

          {/* ─── Sidebar: Vault Stats ─── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Total Entries */}
            <div
              className="panel p-4 card-depth"
            >
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Vault Statistics
              </h4>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-white">{stats.total}</span>
                <span className="text-xs text-slate-400">total entries</span>
              </div>
              <p className="text-[10px] text-slate-500">Last updated: {stats.lastUpdated}</p>
            </div>

            {/* Entries by Category */}
            <div className="panel p-4 card-depth">
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
                By Category
              </h4>
              <div className="space-y-3">
                {(Object.keys(categoryConfig) as Array<VaultEntry['category']>).map((cat) => {
                  const cfg = categoryConfig[cat];
                  const Icon = cfg.icon;
                  const count = stats.byCat[cat];
                  const pct = maxCatCount > 0 ? (count / maxCatCount) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3 h-3 ${cfg.color}`} />
                          <span className="text-xs text-slate-300">{cfg.label}</span>
                        </div>
                        <span className={`text-xs font-semibold ${cfg.color}`}>{count}</span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'var(--bg-elevated)' }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className={`h-full rounded-full ${cfg.bgColor}`}
                          style={{ opacity: 0.8 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Access Info */}
            <div className="panel p-4 card-depth">
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Access Control
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Read Access</span>
                  <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    All Agents
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Write Access</span>
                  <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    Tamir Only
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Major Entries</span>
                  <span className="text-[10px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                    CEO Approval
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageShell>
  );
}
