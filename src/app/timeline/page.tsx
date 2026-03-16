'use client';

import { useState } from 'react';
import PageShell from '@/components/shared/PageShell';
import { fullTimeline } from '@/data/pages-data';
import { TimelineEvent } from '@/types';
import { motion } from 'motion/react';
import {
  Clock,
  AlertTriangle,
  Package,
  Megaphone,
  RotateCw,
  UserPlus,
  ClipboardCheck,
} from 'lucide-react';

// ─── Constants ───

const departments = ['All', 'Tech', 'Marketing', 'Operations', 'Executive'] as const;

const categories = [
  { key: 'all', label: 'All Categories' },
  { key: 'escalation', label: 'Escalations' },
  { key: 'deliverable', label: 'Deliverables' },
  { key: 'directive', label: 'Directives' },
  { key: 'routine', label: 'Routine' },
  { key: 'hire', label: 'Hires' },
  { key: 'review', label: 'Reviews' },
] as const;

const categoryColors: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  escalation:  { dot: 'bg-rose-500',    bg: 'bg-rose-500/10',    text: 'text-rose-400',    border: 'border-rose-500/20' },
  deliverable: { dot: 'bg-sky-500',     bg: 'bg-sky-500/10',     text: 'text-sky-400',     border: 'border-sky-500/20' },
  directive:   { dot: 'bg-amber-500',   bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20' },
  routine:     { dot: 'bg-slate-500',   bg: 'bg-slate-500/10',   text: 'text-slate-400',   border: 'border-slate-500/20' },
  hire:        { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  review:      { dot: 'bg-violet-500',  bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/20' },
};

const categoryIcons: Record<string, React.ReactNode> = {
  escalation:  <AlertTriangle className="w-3 h-3" />,
  deliverable: <Package className="w-3 h-3" />,
  directive:   <Megaphone className="w-3 h-3" />,
  routine:     <RotateCw className="w-3 h-3" />,
  hire:        <UserPlus className="w-3 h-3" />,
  review:      <ClipboardCheck className="w-3 h-3" />,
};

const departmentBadgeColors: Record<string, string> = {
  Tech:       'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Marketing:  'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Operations: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Executive:  'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

// ─── Component ───

export default function TimelinePage() {
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [catFilter, setCatFilter] = useState<string>('all');

  const filtered = fullTimeline.filter((event: TimelineEvent) => {
    const matchDept = deptFilter === 'All' || event.department === deptFilter;
    const matchCat = catFilter === 'all' || event.category === catFilter;
    return matchDept && matchCat;
  });

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* ─── Page Header ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <Clock className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Activity Timeline
              </h1>
              <p className="text-sm text-slate-500">
                Real-time event feed across all departments
              </p>
            </div>
          </div>
        </div>

        {/* ─── Filter Bar ─── */}
        <div
          className="panel p-4 mb-8 space-y-3"
        >
          {/* Department filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-slate-600 font-medium mr-1">
              Department
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
                  deptFilter === dept
                    ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                    : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-slate-600 font-medium mr-1">
              Category
            </span>
            {categories.map((cat) => {
              const isActive = catFilter === cat.key;
              const colors = cat.key !== 'all' ? categoryColors[cat.key] : null;
              return (
                <button
                  key={cat.key}
                  onClick={() => setCatFilter(cat.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                    isActive
                      ? colors
                        ? `${colors.bg} ${colors.text} ${colors.border}`
                        : 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                      : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {cat.key !== 'all' && categoryIcons[cat.key]}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Event Count ─── */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-slate-600">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-500/80 font-medium">Live</span>
          </div>
        </div>

        {/* ─── Timeline ─── */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[140px] top-0 bottom-0 w-px"
            style={{ background: 'var(--border-subtle)' }}
          />

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-600 text-sm">
              No events match the selected filters.
            </div>
          )}

          {filtered.map((event: TimelineEvent, index: number) => {
            const colors = categoryColors[event.category || 'routine'];
            const deptBadge = departmentBadgeColors[event.department || ''] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';

            return (
              <motion.div
                key={`${event.time}-${event.actor}-${index}`}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.04,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="relative flex items-start gap-0 mb-1"
              >
                {/* ─── Left: Time ─── */}
                <div className="w-[124px] shrink-0 text-right pr-5 pt-4">
                  <div className="font-mono text-sm text-slate-300 leading-none">
                    {event.time}
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 mt-1">
                    {event.timeAgo}
                  </div>
                </div>

                {/* ─── Center: Dot ─── */}
                <div className="relative shrink-0 w-[32px] flex justify-center pt-[18px] z-10">
                  <div
                    className={`w-3 h-3 rounded-full ${colors.dot} ring-4`}
                    style={{ boxShadow: `0 0 0 4px var(--bg-base)` }}
                  />
                </div>

                {/* ─── Right: Event Card ─── */}
                <div className="flex-1 pb-4 pl-3">
                  <div
                    className="card-depth p-4 rounded-xl transition-colors duration-200 hover:brightness-110"
                    style={{ border: '1px solid var(--border-subtle)' }}
                  >
                    {/* Top row: Actor + department badge */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-white">
                        {event.actor}
                      </span>
                      {event.department && (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${deptBadge}`}
                        >
                          {event.department}
                        </span>
                      )}
                      <div className="flex-1" />
                      {/* Category badge */}
                      {event.category && (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {categoryIcons[event.category]}
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Action */}
                    <p className="text-[13px] text-slate-300 leading-relaxed">
                      {event.action}
                      {event.object && (
                        <>
                          {' '}
                          <span
                            className={
                              event.category === 'directive' || event.category === 'escalation'
                                ? 'text-amber-400 font-medium'
                                : 'text-sky-400 font-medium'
                            }
                          >
                            {event.object}
                          </span>
                        </>
                      )}
                    </p>

                    {/* Result */}
                    {event.result && (
                      <p className="text-[12px] text-slate-500 mt-1.5 leading-relaxed">
                        {event.result}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
