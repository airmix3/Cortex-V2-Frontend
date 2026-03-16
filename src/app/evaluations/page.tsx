'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import PageShell from '@/components/shared/PageShell';
import { employees } from '@/data/pages-data';
import { agentDailySummaries, agentEvaluations, correctiveActionLog } from '@/data/evaluations-data';
import type { AgentEvaluation, CorrectiveAction } from '@/types';
import {
  ClipboardCheck, Users, TrendingUp, Wrench, AlertTriangle,
  Star, Check, ArrowUpRight, ChevronDown, ChevronUp,
  Plus, BookOpen, GitBranch, ArrowUpDown, ArrowRight,
  Shield, Zap, X,
} from 'lucide-react';

/* ── Manager info ── */
const managers = [
  { id: 'cto', name: 'Alex', role: 'CTO', dept: 'Tech', color: 'bg-blue-600', deptColor: '#3b82f6' },
  { id: 'cmo', name: 'Maya', role: 'CMO', dept: 'Marketing', color: 'bg-purple-600', deptColor: '#a855f7' },
  { id: 'coo', name: 'Liam', role: 'COO', dept: 'Operations', color: 'bg-emerald-600', deptColor: '#10b981' },
];

/* ── Action type config ── */
const actionTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  'add-skill': { icon: Plus, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Add Skill' },
  'add-context': { icon: BookOpen, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20', label: 'Add Context' },
  'modify-workflow': { icon: GitBranch, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Modify Workflow' },
  'adjust-priority': { icon: ArrowUpDown, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', label: 'Adjust Priority' },
};

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, accent, delay }: {
  icon: React.ElementType; label: string; value: string; accent: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border px-4 py-3.5"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-slate-500" />
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className={`text-lg font-bold ${accent}`}>{value}</p>
    </motion.div>
  );
}

/* ── Rating Bar ── */
function RatingBar({ label, value }: { label: string; value: number }) {
  const color = value >= 4 ? '#10b981' : value >= 3 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-slate-500">{label}</span>
        <span className="text-[10px] font-bold" style={{ color }}>{value}/5</span>
      </div>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} className="h-2 flex-1 rounded-full rating-bar-fill" style={{
            background: s <= value ? color : 'var(--bg-base)',
            '--rating-width': s <= value ? '100%' : '0%',
          } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}

/* ── Report Card (per agent) ── */
function ReportCard({ evaluation, index }: { evaluation: AgentEvaluation; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const agent = employees.find(e => e.id === evaluation.agentId);
  const summary = agentDailySummaries[evaluation.agentId];
  if (!agent || !summary) return null;

  const avgRating = ((evaluation.rating.efficiency + evaluation.rating.outputQuality + evaluation.rating.initiative) / 3).toFixed(1);
  const avgColor = Number(avgRating) >= 4 ? 'text-emerald-400' : Number(avgRating) >= 3 ? 'text-amber-400' : 'text-rose-400';
  const isEscalated = evaluation.disposition === 'escalated';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
      className={`rounded-xl border overflow-hidden ${isEscalated ? 'escalation-glow' : ''}`}
      style={{
        background: 'var(--bg-card)',
        borderColor: isEscalated ? 'rgba(244, 63, 94, 0.25)' : 'var(--border-subtle)',
      }}
    >
      {/* Agent Row — Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
          {agent.avatar}
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{agent.name}</span>
            <span className="text-[10px] text-slate-500">{agent.role}</span>
            {isEscalated && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20">
                <ArrowUpRight size={8} /> Escalated
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {/* Self-assessment stars mini */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={10} className={s <= summary.selfAssessment.score ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
              ))}
            </div>
            <span className="text-[10px] text-slate-500">{summary.accomplishments.length} accomplishments</span>
          </div>
        </div>

        {/* Overall score */}
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-2xl font-bold ${avgColor}`}>{avgRating}</span>
          {expanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>

              {/* Daily Summary Preview */}
              <div className="pt-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Daily Summary Highlights</p>
                <div className="space-y-1.5 mb-3">
                  {summary.accomplishments.slice(0, 3).map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check size={11} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300">{a}</span>
                    </div>
                  ))}
                </div>
                {/* Efficiency mini */}
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="text-slate-500">{summary.efficiency.tokensUsed.toLocaleString()} tokens</span>
                  <span className="text-slate-500">{summary.efficiency.avgResponseTime} avg</span>
                  <span className={`px-1.5 py-0.5 rounded font-medium border capitalize ${
                    summary.efficiency.outputQuality === 'excellent' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : summary.efficiency.outputQuality === 'good' ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                    : summary.efficiency.outputQuality === 'acceptable' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  }`}>{summary.efficiency.outputQuality}</span>
                </div>
              </div>

              {/* Rating bars */}
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Manager Rating</p>
                <div className="grid grid-cols-3 gap-3">
                  <RatingBar label="Efficiency" value={evaluation.rating.efficiency} />
                  <RatingBar label="Output Quality" value={evaluation.rating.outputQuality} />
                  <RatingBar label="Initiative" value={evaluation.rating.initiative} />
                </div>
              </div>

              {/* Flagged Issues */}
              {evaluation.flaggedIssues.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Flagged Issues</p>
                  <div className="space-y-1.5">
                    {evaluation.flaggedIssues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg border px-3 py-2" style={{
                        background: issue.severity === 'serious' ? 'rgba(244, 63, 94, 0.05)' : 'var(--bg-elevated)',
                        borderColor: issue.severity === 'serious' ? 'rgba(244, 63, 94, 0.15)' : 'var(--border-subtle)',
                      }}>
                        <AlertTriangle size={11} className={
                          issue.severity === 'serious' ? 'text-rose-400' : issue.severity === 'moderate' ? 'text-amber-400' : 'text-sky-400'
                        } />
                        <div className="flex-1">
                          <span className="text-xs text-slate-300">{issue.description}</span>
                        </div>
                        <span className={`text-[9px] font-medium uppercase shrink-0 ${
                          issue.severity === 'serious' ? 'text-rose-400' : issue.severity === 'moderate' ? 'text-amber-400' : 'text-sky-400'
                        }`}>{issue.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Corrective Actions */}
              {evaluation.correctiveActions.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Corrective Actions Applied</p>
                  <div className="space-y-2">
                    {evaluation.correctiveActions.map(action => {
                      const conf = actionTypeConfig[action.type];
                      const ActionIcon = conf?.icon || Plus;
                      return (
                        <div key={action.id} className="rounded-lg border px-3 py-2.5" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border ${conf?.color || ''}`}>
                              <ActionIcon size={9} />
                              {conf?.label || action.type}
                            </span>
                            <span className="text-xs text-slate-300 font-medium">{action.description}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{action.detail}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Disposition + Notes */}
              <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2 mb-2">
                  {evaluation.disposition === 'autonomous' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      <Check size={10} /> Handled Autonomously
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20">
                      <ArrowUpRight size={10} /> Escalated to Tamir
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 italic">&ldquo;{evaluation.managerNotes}&rdquo;</p>
                {evaluation.escalationNote && (
                  <div className="mt-2 rounded-lg border px-3 py-2" style={{ background: 'rgba(244, 63, 94, 0.05)', borderColor: 'rgba(244, 63, 94, 0.15)' }}>
                    <p className="text-[10px] text-rose-400 font-medium mb-0.5">Escalation Note</p>
                    <p className="text-xs text-slate-400">{evaluation.escalationNote}</p>
                  </div>
                )}
              </div>

              {/* Link to profile */}
              <Link href={`/agents/${agent.id}`} className="inline-flex items-center gap-1.5 text-[11px] text-sky-400 hover:text-sky-300 transition-colors">
                View Full Profile <ArrowRight size={10} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function EvaluationsPage() {
  const [activeManager, setActiveManager] = useState('cto');

  const managerInfo = managers.find(m => m.id === activeManager)!;
  const managerEmp = employees.find(e => e.id === activeManager);

  // Get evaluations for selected manager
  const managerEvals = useMemo(() =>
    agentEvaluations.filter(e => e.evaluatorId === activeManager),
    [activeManager]
  );

  // Compute manager stats
  const avgScore = useMemo(() => {
    if (managerEvals.length === 0) return '0.0';
    const total = managerEvals.reduce((sum, e) =>
      sum + (e.rating.efficiency + e.rating.outputQuality + e.rating.initiative) / 3, 0);
    return (total / managerEvals.length).toFixed(1);
  }, [managerEvals]);

  const actionsCount = useMemo(() =>
    managerEvals.reduce((sum, e) => sum + e.correctiveActions.length, 0),
    [managerEvals]
  );

  // Escalated evaluations (all managers)
  const escalatedEvals = useMemo(() =>
    agentEvaluations.filter(e => e.disposition === 'escalated'),
    []
  );

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <ClipboardCheck size={20} className="text-violet-400" />
            <h1 className="text-2xl font-bold text-white">Performance Evaluations</h1>
          </div>
          <p className="text-sm text-slate-400">C-Level evaluation and agent improvement system</p>
        </motion.div>

        {/* ── Metrics Strip ── */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard icon={Users} label="Agents Evaluated" value={String(agentEvaluations.length)} accent="text-sky-400" delay={0.05} />
          <StatCard icon={TrendingUp} label="Avg Team Score" value={avgScore} accent="text-emerald-400" delay={0.1} />
          <StatCard icon={Wrench} label="Actions Applied" value={String(correctiveActionLog.length)} accent="text-amber-400" delay={0.15} />
          <StatCard icon={AlertTriangle} label="Escalations" value={String(escalatedEvals.length)} accent="text-rose-400" delay={0.2} />
        </div>

        {/* ── Manager Tabs ── */}
        <div className="flex gap-2">
          {managers.map(mgr => {
            const isActive = activeManager === mgr.id;
            return (
              <button
                key={mgr.id}
                onClick={() => setActiveManager(mgr.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive ? 'border-opacity-50' : 'border-transparent hover:bg-white/[0.03]'
                }`}
                style={{
                  background: isActive ? `${mgr.deptColor}10` : 'transparent',
                  borderColor: isActive ? `${mgr.deptColor}40` : 'transparent',
                }}
              >
                <div className={`w-7 h-7 rounded-lg ${mgr.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {mgr.name[0]}
                </div>
                <div className="text-left">
                  <p className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>{mgr.role} {mgr.name}</p>
                  <p className="text-[10px] text-slate-500">{mgr.dept}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Manager Dashboard ── */}
        <motion.div
          key={activeManager}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* Manager header */}
          {managerEmp && (
            <div className="card-depth rounded-xl border px-5 py-4 flex items-center justify-between" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${managerInfo.color} flex items-center justify-center text-white font-bold`}>
                  {managerEmp.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{managerEmp.name} &middot; {managerInfo.role}</p>
                  <p className="text-[11px] text-slate-500">{managerInfo.dept} Department</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-lg font-bold text-white">{managerEvals.length}</p>
                  <p className="text-[10px] text-slate-500">Reports Evaluated</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-400">{avgScore}</p>
                  <p className="text-[10px] text-slate-500">Avg Score</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-400">{actionsCount}</p>
                  <p className="text-[10px] text-slate-500">Actions Taken</p>
                </div>
              </div>
            </div>
          )}

          {/* Report Cards */}
          {managerEvals.map((evaluation, i) => (
            <ReportCard key={evaluation.id} evaluation={evaluation} index={i} />
          ))}
        </motion.div>

        {/* ── Escalation Reports ── */}
        {escalatedEvals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-rose-400" />
              <h3 className="text-sm font-semibold text-white">Escalated to Chief of Staff</h3>
              <span className="text-[11px] text-slate-500">{escalatedEvals.length} pending review</span>
            </div>

            {escalatedEvals.map(evaluation => {
              const agent = employees.find(e => e.id === evaluation.agentId);
              const manager = employees.find(e => e.id === evaluation.evaluatorId);
              if (!agent || !manager) return null;

              return (
                <div
                  key={evaluation.id}
                  className="card-depth rounded-xl border p-5 escalation-glow"
                  style={{ background: 'var(--bg-card)', borderColor: 'rgba(244, 63, 94, 0.2)' }}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-xl ${agent.color} flex items-center justify-center text-white text-lg font-bold`}>
                      {agent.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{agent.name}</span>
                        <span className="text-[10px] text-slate-500">{agent.role}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20">
                          Serious
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Escalated by {manager.name} ({manager.role})</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
                        Pending Review
                      </span>
                    </div>
                  </div>

                  {evaluation.escalationNote && (
                    <div className="rounded-lg border px-4 py-3 mb-3" style={{ background: 'rgba(244, 63, 94, 0.04)', borderColor: 'rgba(244, 63, 94, 0.12)' }}>
                      <p className="text-xs text-slate-300 leading-relaxed">{evaluation.escalationNote}</p>
                    </div>
                  )}

                  {/* Issues */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {evaluation.flaggedIssues.map((issue, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        issue.severity === 'serious' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        {issue.category.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>

                  <Link href={`/agents/${agent.id}`} className="inline-flex items-center gap-1.5 text-[11px] text-sky-400 hover:text-sky-300">
                    View Agent Profile <ArrowRight size={10} />
                  </Link>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ── Improvement Action History ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="card-depth rounded-xl border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <Wrench size={14} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Improvement Action History</h3>
              <span className="text-[11px] text-slate-500">{correctiveActionLog.length} actions applied today</span>
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {correctiveActionLog.map(action => {
              const manager = employees.find(e => e.id === action.appliedBy);
              const agent = employees.find(e => e.id === action.agentId);
              const conf = actionTypeConfig[action.type];
              const ActionIcon = conf?.icon || Plus;
              if (!manager || !agent) return null;

              return (
                <div key={action.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  {/* Time */}
                  <span className="text-[11px] font-mono text-slate-600 w-10 shrink-0">{action.appliedAt}</span>

                  {/* Manager → Agent */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className={`w-6 h-6 rounded-full ${manager.color} flex items-center justify-center text-white text-[8px] font-bold`}>
                      {manager.avatar}
                    </div>
                    <ArrowRight size={10} className="text-slate-600" />
                    <div className={`w-6 h-6 rounded-full ${agent.color} flex items-center justify-center text-white text-[8px] font-bold`}>
                      {agent.avatar}
                    </div>
                  </div>

                  {/* Type badge */}
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border shrink-0 ${conf?.color || ''}`}>
                    <ActionIcon size={9} />
                    {conf?.label || action.type}
                  </span>

                  {/* Description */}
                  <p className="text-xs text-slate-300 flex-1 min-w-0 truncate">{action.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
