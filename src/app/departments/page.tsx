'use client';

import PageShell from '@/components/shared/PageShell';
import { departmentDetails } from '@/data/pages-data';
import type { DepartmentDetail, Deliverable } from '@/types';
import { motion } from 'motion/react';
import LiveAgentMap from '@/components/departments/LiveAgentMap';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  Image,
  Film,
  FileType,
  ChevronRight,
  Activity,
  ShieldAlert,
  DollarSign,
  AlertTriangle,
  Database,
} from 'lucide-react';

/* ── file icon map ── */
const fileIconMap: Record<Deliverable['type'], React.ElementType> = {
  document: FileText,
  code: FileCode,
  spreadsheet: FileSpreadsheet,
  image: Image,
  video: Film,
  pdf: FileType,
  presentation: FileText,
};

/* ── color maps ── */
const healthColor: Record<string, string> = {
  good: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  critical: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const healthDot: Record<string, string> = {
  good: 'bg-emerald-400',
  warning: 'bg-yellow-400',
  critical: 'bg-rose-400',
};

const statusColor: Record<string, string> = {
  draft: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  'in-progress': 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  ready: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  approved: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
};

const riskColor: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-yellow-400',
  High: 'text-rose-400',
};

const sparklineStroke: Record<string, string> = {
  good: '#10b981',
  warning: '#eab308',
  critical: '#f43f5e',
};

/* ── Sparkline SVG ── */
function BudgetSparkline({ data, health }: { data: number[]; health: string }) {
  const w = 140;
  const h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  const fillPoints = `0,${h} ${polyline} ${w},${h}`;
  const color = sparklineStroke[health] || '#38bdf8';

  return (
    <svg width={w} height={h} className="shrink-0">
      <defs>
        <linearGradient id={`fill-${health}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#fill-${health})`} />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Department Card ── */
function DepartmentCard({ dept, index }: { dept: DepartmentDetail; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="card-depth rounded-xl border"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 p-5 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-lg ${dept.head.color} flex items-center justify-center text-white text-sm font-semibold shrink-0`}
          >
            {dept.head.avatar}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white truncate">{dept.name}</h3>
            <p className="text-xs text-slate-400 truncate">
              {dept.head.name} &middot; {dept.head.role}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border shrink-0 ${healthColor[dept.healthStatus]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${healthDot[dept.healthStatus]}`} />
          {dept.healthStatus.charAt(0).toUpperCase() + dept.healthStatus.slice(1)}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* ── Description ── */}
        <p className="text-sm text-slate-400 leading-relaxed">{dept.description}</p>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-4 gap-3">
          <StatTile icon={Activity} label="Active" value={String(dept.active)} accent="text-sky-400" />
          <StatTile icon={ShieldAlert} label="Blocked" value={String(dept.blocked)} accent={dept.blocked > 0 ? 'text-rose-400' : 'text-slate-500'} />
          <StatTile icon={DollarSign} label="Spend / Budget" value={`${dept.spend} / ${dept.budget}`} accent="text-emerald-400" />
          <StatTile icon={AlertTriangle} label="Risk" value={dept.risk} accent={riskColor[dept.risk]} />
        </div>

        {/* ── Budget Sparkline ── */}
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-lg border"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium mb-1">7-Day Budget Trend</p>
            <p className="text-xs text-slate-400">
              {dept.spend} of {dept.budget} consumed
            </p>
          </div>
          <BudgetSparkline data={dept.weeklyBudgetTrend} health={dept.healthStatus} />
        </div>

        {/* ── Active Missions ── */}
        <div>
          <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium mb-2">Active Missions</p>
          <div className="flex flex-wrap gap-1.5">
            {dept.activeMissions.map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 rounded-md text-xs font-medium border"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: '#94a3b8',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* ── Team ── */}
        <div>
          <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium mb-2">
            Team ({dept.employees.length})
          </p>
          <div className="flex flex-wrap gap-3">
            {dept.employees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full ${emp.color} flex items-center justify-center text-white text-[10px] font-semibold`}
                >
                  {emp.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-300 truncate leading-tight">{emp.name}</p>
                  <p className="text-[10px] text-slate-500 truncate leading-tight">{emp.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Deliverables ── */}
        <div>
          <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium mb-2">Recent Deliverables</p>
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--bg-elevated)' }}>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">File</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-slate-500 font-medium">Creator</th>
                  <th className="text-right py-2 px-3 text-slate-500 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {dept.recentDeliverables.map((d, i) => {
                  const Icon = fileIconMap[d.type] || FileText;
                  return (
                    <tr
                      key={i}
                      className="border-t"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Icon size={13} className="text-slate-500 shrink-0" />
                          <span className="truncate max-w-[200px]">{d.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${statusColor[d.status]}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-400">{d.creator}</td>
                      <td className="py-2 px-3 text-slate-500 text-right">{d.createdAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Reporting Chain ── */}
        <div>
          <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium mb-2">Reporting Chain</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {dept.reportingChain.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full ${p.color} flex items-center justify-center text-white text-[9px] font-semibold`}
                  >
                    {p.avatar}
                  </div>
                  <span className="text-xs text-slate-400">{p.name}</span>
                </div>
                {i < dept.reportingChain.length - 1 && (
                  <ChevronRight size={12} className="text-slate-600 mx-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Memory Namespace ── */}
        <div className="flex items-center gap-2 pt-1">
          <Database size={12} className="text-slate-600" />
          <code className="text-[11px] font-mono text-slate-500">{dept.memoryNamespace}</code>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Stat Tile ── */
function StatTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-lg border px-3 py-2.5"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} className="text-slate-500" />
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className={`text-sm font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

/* ── Page ── */
export default function DepartmentsPage() {
  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-1">Departments</h1>
          <p className="text-sm text-slate-400">Department desks and operational intelligence</p>
        </motion.div>

        {/* Live Agent Map */}
        <div className="mb-8">
          <LiveAgentMap />
        </div>

        {/* Department Cards */}
        <div className="space-y-6">
          {departmentDetails.map((dept, i) => (
            <DepartmentCard key={dept.name} dept={dept} index={i} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
