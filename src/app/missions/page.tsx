'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import PageShell from '@/components/shared/PageShell';
import { allMissions } from '@/data/pages-data';
import { Mission, Deliverable, Person } from '@/types';
import {
  FileText, FileCode, FileSpreadsheet, Image, Film, FileType,
  Zap, ChevronRight, Eye, AlertTriangle, Filter,
} from 'lucide-react';

// ─── Constants ───

const flowStages = ['Created', 'Agent Work', 'Dept Review', 'CEO Review', 'Done'];

const priorityBorder: Record<string, string> = {
  critical: 'rgba(244,63,94,0.3)',
  high: 'rgba(245,158,11,0.2)',
  medium: 'var(--border-subtle)',
  low: 'var(--border-subtle)',
};

const priorityBadge: Record<string, string> = {
  critical: 'bg-rose-500/20 text-rose-300',
  high: 'bg-amber-500/20 text-amber-300',
  medium: 'bg-slate-500/20 text-slate-400',
  low: 'bg-slate-500/20 text-slate-500',
};

const fileIcons: Record<string, React.ElementType> = {
  document: FileText,
  code: FileCode,
  spreadsheet: FileSpreadsheet,
  image: Image,
  video: Film,
  pdf: FileType,
  presentation: FileText,
};

const statusColors: Record<string, string> = {
  draft: 'bg-slate-500/20 text-slate-400',
  'in-progress': 'bg-sky-500/20 text-sky-400',
  ready: 'bg-emerald-500/20 text-emerald-400',
  approved: 'bg-violet-500/20 text-violet-400',
};

const columnFilters = [
  { key: 'all', label: 'All' },
  { key: 'act-now', label: 'Act Now' },
  { key: 'approve-decide', label: 'Approve / Decide' },
  { key: 'review', label: 'Review' },
] as const;

const departmentFilters = ['Tech', 'Marketing', 'Operations'] as const;

// ─── Sub-components ───

function DeliverableRow({ deliverable }: { deliverable: Deliverable }) {
  const Icon = fileIcons[deliverable.type] || FileText;
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg group cursor-pointer transition-all hover:brightness-125"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
    >
      <Icon className="w-4 h-4 text-sky-400 shrink-0" />
      <span className="text-xs text-slate-200 truncate flex-1 font-medium">{deliverable.name}</span>
      <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${statusColors[deliverable.status]}`}>
        {deliverable.status}
      </span>
      <Eye className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
    </div>
  );
}

function TouchTrail({ trail, owner }: { trail: Person[]; owner: Person }) {
  return (
    <div className="flex items-center gap-1">
      {trail.map((person, i) => (
        <div key={i} className="flex items-center gap-0.5">
          <div
            className={`w-6 h-6 rounded-full ${person.color} flex items-center justify-center text-[10px] font-bold text-white ${
              i === trail.length - 1 ? 'ring-2 ring-amber-400/60' : 'opacity-60'
            }`}
            title={`${person.name} (${person.role})`}
          >
            {person.avatar}
          </div>
          {i < trail.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600" />}
        </div>
      ))}
      <span className="text-[11px] text-slate-500 ml-2">
        Owner: <span className="text-slate-300">{owner.name}</span>
      </span>
    </div>
  );
}

function FlowStageBar({ currentStage }: { currentStage: number }) {
  return (
    <div>
      <div className="flex items-center gap-1">
        {flowStages.map((stage, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full transition-all ${
                i < currentStage
                  ? 'bg-emerald-500'
                  : i === currentStage
                  ? 'bg-amber-400'
                  : 'bg-slate-700'
              }`}
            />
            <span
              className={`text-[9px] ${
                i === currentStage ? 'text-amber-300 font-semibold' : 'text-slate-600'
              }`}
            >
              {stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MissionCardFull({ mission, index }: { mission: Mission; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className="card-depth rounded-xl p-5"
      style={{ background: 'var(--bg-card)', border: `1px solid ${priorityBorder[mission.priority]}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${mission.owner.color} flex items-center justify-center text-xs font-bold text-white`}>
            {mission.owner.avatar}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">{mission.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-slate-500">{mission.department}</span>
              <span className="text-slate-700">|</span>
              <span className="text-[11px] text-slate-500">{mission.escalationPath}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span
            className="text-[10px] px-2 py-0.5 rounded-md font-semibold"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary, #94a3b8)' }}
          >
            {mission.department}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${priorityBadge[mission.priority]}`}>
            {mission.priority}
          </span>
        </div>
      </div>

      {/* Blocker */}
      {mission.blocker && (
        <div
          className="flex items-start gap-2 text-[11px] text-rose-400 px-3 py-2 rounded-lg mb-3"
          style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.15)' }}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            <span className="font-semibold">Blocker:</span> {mission.blocker}
            {mission.attempts && (
              <span className="ml-2 text-slate-500">&middot; {mission.attempts} retries</span>
            )}
          </span>
        </div>
      )}

      {/* Content grid: Deliverables + Flow + Touch Trail */}
      <div className="grid grid-cols-[1fr_1fr] gap-4 mb-3">
        {/* Deliverables */}
        <div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Deliverables
          </div>
          <div className="flex flex-col gap-1.5">
            {mission.deliverables.map((d, i) => (
              <DeliverableRow key={i} deliverable={d} />
            ))}
          </div>
        </div>

        {/* Flow Stage + Touch Trail */}
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Flow Progress
            </div>
            <FlowStageBar currentStage={mission.flowStage} />
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Touch Trail
            </div>
            <TouchTrail trail={mission.touchTrail} owner={mission.owner} />
          </div>
        </div>
      </div>

      {/* CEO Action */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}
      >
        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-xs text-amber-300 font-medium">{mission.ceoAction}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {mission.column === 'act-now' && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded-lg transition-all intervention-glow"
            >
              <Zap className="w-3.5 h-3.5" />
              Intervene
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              Send Directive
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              More Info
            </motion.button>
          </>
        )}
        {mission.column === 'approve-decide' && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Approve
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              Reject
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              Details
            </motion.button>
          </>
        )}
        {mission.column === 'review' && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Review
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              Request Changes
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Filter Pill ───

function FilterPill({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
        active
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          : 'text-slate-400 hover:text-slate-200 border border-transparent'
      }`}
      style={!active ? { background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' } : undefined}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-1.5 text-[10px] ${active ? 'text-amber-400' : 'text-slate-500'}`}>
          {count}
        </span>
      )}
    </motion.button>
  );
}

// ─── Page ───

export default function MissionsPage() {
  const [columnFilter, setColumnFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string | null>(null);

  const filtered = allMissions.filter((m) => {
    if (columnFilter !== 'all' && m.column !== columnFilter) return false;
    if (deptFilter && m.department !== deptFilter) return false;
    return true;
  });

  const columnCounts = {
    all: allMissions.filter((m) => !deptFilter || m.department === deptFilter).length,
    'act-now': allMissions.filter((m) => m.column === 'act-now' && (!deptFilter || m.department === deptFilter)).length,
    'approve-decide': allMissions.filter((m) => m.column === 'approve-decide' && (!deptFilter || m.department === deptFilter)).length,
    review: allMissions.filter((m) => m.column === 'review' && (!deptFilter || m.department === deptFilter)).length,
  };

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white tracking-tight">Missions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track all active missions across the organization
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex items-center gap-6 mb-6 flex-wrap"
        >
          {/* Column Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
            {columnFilters.map((f) => (
              <FilterPill
                key={f.key}
                label={f.label}
                active={columnFilter === f.key}
                onClick={() => setColumnFilter(f.key)}
                count={columnCounts[f.key]}
              />
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-6" style={{ background: 'var(--border-subtle)' }} />

          {/* Department Filters */}
          <div className="flex items-center gap-2">
            {departmentFilters.map((dept) => (
              <FilterPill
                key={dept}
                label={dept}
                active={deptFilter === dept}
                onClick={() => setDeptFilter(deptFilter === dept ? null : dept)}
              />
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="text-[11px] text-slate-500 mb-4">
          Showing {filtered.length} of {allMissions.length} missions
        </div>

        {/* Mission Cards */}
        <div className="flex flex-col gap-4">
          {filtered.map((mission, i) => (
            <MissionCardFull key={mission.id} mission={mission} index={i} />
          ))}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-slate-500 text-sm"
            >
              No missions match the current filters.
            </motion.div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
