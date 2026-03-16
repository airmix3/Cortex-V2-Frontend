'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import TopNav from '@/components/layout/TopNav';
import { employees, departmentDetails } from '@/data/pages-data';
import { agentProfiles } from '@/data/agent-profiles';
import { agentTasks } from '@/data/control-center-data';
import type { AgentTask, TaskStatus, Employee } from '@/types';
import {
  Users, CheckCircle2, FileText, DollarSign, Clock, TrendingUp,
  AlertTriangle, Zap, X, Filter, Activity, Radio,
  Search, MessageSquare, Beaker,
} from 'lucide-react';

/* ── Color maps ── */
const statusColors: Record<string, { dot: string; text: string }> = {
  active: { dot: 'bg-emerald-400', text: 'text-emerald-400' },
  busy: { dot: 'bg-amber-400', text: 'text-amber-400' },
  idle: { dot: 'bg-slate-500', text: 'text-slate-400' },
  terminated: { dot: 'bg-rose-500', text: 'text-rose-400' },
};

const taskStatusConfig: Record<TaskStatus, { label: string; color: string; accent: string; icon: React.ElementType }> = {
  queued: { label: 'Queued', color: 'text-slate-400', accent: 'border-slate-500/30', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'text-sky-400', accent: 'border-sky-500/30', icon: Activity },
  blocked: { label: 'Blocked', color: 'text-rose-400', accent: 'border-rose-500/30', icon: AlertTriangle },
  completed: { label: 'Completed', color: 'text-emerald-400', accent: 'border-emerald-500/30', icon: CheckCircle2 },
};

const typeColors: Record<string, { text: string; bg: string }> = {
  task: { text: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  deliverable: { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  escalation: { text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  communication: { text: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  research: { text: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
};

const typeIcons: Record<string, React.ElementType> = {
  task: CheckCircle2,
  deliverable: FileText,
  escalation: AlertTriangle,
  communication: MessageSquare,
  research: Search,
};

const priorityDot: Record<string, string> = {
  critical: 'bg-rose-400',
  high: 'bg-amber-400',
  medium: 'bg-sky-400',
  low: 'bg-slate-500',
};

/* ── Helpers ── */
function getEmployee(id: string): Employee | undefined {
  return employees.find(e => e.id === id);
}

/* ── Command Stat Card ── */
function CommandStatCard({ icon: Icon, label, value, sub, accent, delay }: {
  icon: React.ElementType; label: string; value: string; sub?: string; accent: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="command-card rounded-lg border px-3 py-2.5"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={11} className="text-slate-500" />
        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className={`text-lg font-bold ${accent}`}>{value}</p>
      {sub && <p className="text-[9px] text-slate-600 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

/* ── Task Card ── */
function TaskCard({ task, index }: { task: AgentTask; index: number }) {
  const emp = getEmployee(task.agentId);
  const tc = typeColors[task.type];
  const TIcon = typeIcons[task.type];
  const isBlocked = task.status === 'blocked';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05 + index * 0.03 }}
      whileHover={{ y: -2 }}
      className={`card-depth rounded-lg border p-2.5 mb-2 cursor-default ${isBlocked ? 'escalation-glow' : ''}`}
      style={{
        background: isBlocked ? 'rgba(244,63,94,0.04)' : 'var(--bg-elevated)',
        borderColor: isBlocked ? 'rgba(244,63,94,0.2)' : 'var(--border-subtle)',
      }}
    >
      {/* Agent + Title */}
      <div className="flex items-start gap-2 mb-1.5">
        {emp && (
          <div className={`w-4 h-4 rounded-full ${emp.color} flex items-center justify-center text-white text-[7px] font-bold shrink-0 mt-0.5`}>
            {emp.avatar}
          </div>
        )}
        <p className="text-[11px] text-slate-300 leading-snug flex-1">{task.title}</p>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Type badge */}
        <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-medium border ${tc.text} ${tc.bg}`}>
          <TIcon size={8} />
          {task.type}
        </span>
        {/* Priority dot */}
        <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority]}`} title={task.priority} />
        {/* Mission tag */}
        {task.mission && (
          <span className="text-[8px] text-slate-600 truncate max-w-[100px]">
            {task.mission}
          </span>
        )}
        {/* Time */}
        {(task.completedAt || task.startedAt) && (
          <span className="text-[8px] font-mono text-slate-600 ml-auto">
            {task.completedAt || task.startedAt}
          </span>
        )}
      </div>

      {/* Blocker */}
      {isBlocked && task.blocker && (
        <div className="flex items-start gap-1 mt-1.5 pt-1.5 border-t" style={{ borderColor: 'rgba(244,63,94,0.15)' }}>
          <AlertTriangle size={9} className="text-rose-400 shrink-0 mt-0.5" />
          <p className="text-[9px] text-rose-300 leading-snug">{task.blocker}</p>
        </div>
      )}
    </motion.div>
  );
}

/* ── Activity Feed Item ── */
function ActivityFeedItem({ entry, delay }: {
  entry: { time: string; action: string; type: string; impact: string; agentId: string; relatedMission?: string };
  delay: number;
}) {
  const emp = getEmployee(entry.agentId);
  const tc = typeColors[entry.type] || typeColors.task;

  return (
    <motion.div
      initial={{ opacity: 0, x: 6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
      className="flex items-start gap-2 py-1.5 border-b last:border-b-0"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <span className="text-[9px] font-mono text-slate-600 w-8 shrink-0 pt-0.5">{entry.time}</span>
      {emp && (
        <div className={`w-4 h-4 rounded-full ${emp.color} flex items-center justify-center text-white text-[6px] font-bold shrink-0 mt-0.5`}>
          {emp.avatar}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-400 leading-snug truncate" title={entry.action}>{entry.action}</p>
        <span className={`inline-flex px-1 py-0 rounded text-[7px] font-medium border mt-0.5 ${tc.text} ${tc.bg}`}>
          {entry.type}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function ControlCenterPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState<string | null>(null);

  // ── Computed metrics ──
  const metrics = useMemo(() => {
    const profiles = Object.values(agentProfiles);
    const activeEmps = employees.filter(e => e.status !== 'terminated');
    const busyCount = activeEmps.filter(e => e.status === 'busy').length;
    const idleCount = activeEmps.filter(e => e.status === 'idle').length;
    const totalTasks = profiles.reduce((s, p) => s + p.tasksCompletedToday, 0);
    const totalDeliverables = profiles.reduce((s, p) => s + p.deliverablesProducedToday, 0);
    const totalCost = profiles.reduce((s, p) => s + parseFloat(p.costToday.replace('$', '')), 0);
    const totalHours = profiles.reduce((s, p) => s + p.estimatedHoursSaved, 0);
    const avgValue = Math.round(profiles.reduce((s, p) => s + p.valueScore, 0) / profiles.length);
    return { activeCount: activeEmps.length, busyCount, idleCount, totalTasks, totalDeliverables, totalCost, totalHours, avgValue };
  }, []);

  // ── Merged activity feed ──
  const allActivity = useMemo(() => {
    return Object.entries(agentProfiles)
      .flatMap(([id, p]) => p.todayActivity.map(a => ({ ...a, agentId: id })))
      .sort((a, b) => b.time.localeCompare(a.time));
  }, []);

  // ── Filtered tasks ──
  const filteredTasks = useMemo(() => {
    if (!selectedAgent) return agentTasks;
    return agentTasks.filter(t => t.agentId === selectedAgent);
  }, [selectedAgent]);

  // ── Filtered feed ──
  const filteredFeed = useMemo(() => {
    let feed = allActivity;
    if (selectedAgent) feed = feed.filter(a => a.agentId === selectedAgent);
    if (feedFilter) feed = feed.filter(a => a.type === feedFilter);
    return feed;
  }, [allActivity, selectedAgent, feedFilter]);

  // ── Group tasks by status ──
  const columns: TaskStatus[] = ['queued', 'in-progress', 'blocked', 'completed'];
  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, AgentTask[]> = { queued: [], 'in-progress': [], blocked: [], completed: [] };
    filteredTasks.forEach(t => map[t.status].push(t));
    return map;
  }, [filteredTasks]);

  // ── Group employees by department ──
  const departments = useMemo(() => {
    const depts: Record<string, Employee[]> = {};
    employees.filter(e => e.status !== 'terminated').forEach(e => {
      const dept = e.department || 'Other';
      if (!depts[dept]) depts[dept] = [];
      depts[dept].push(e);
    });
    return depts;
  }, []);

  const selectedEmp = selectedAgent ? getEmployee(selectedAgent) : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="ambient-bg" />
      <TopNav />

      {/* ── Metrics Command Strip ── */}
      <div className="shrink-0 px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Radio size={12} className="text-rose-400" />
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 live-dot" />
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Live</span>
          </span>
          <span className="text-[11px] text-slate-500 ml-1">Agents Control Center</span>

          {/* Agent filter indicator */}
          {selectedEmp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-md border"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
            >
              <div className={`w-4 h-4 rounded-full ${selectedEmp.color} flex items-center justify-center text-white text-[7px] font-bold`}>
                {selectedEmp.avatar}
              </div>
              <span className="text-[10px] text-slate-300">{selectedEmp.name}</span>
              <button onClick={() => setSelectedAgent(null)} className="p-0.5 text-slate-500 hover:text-slate-300 rounded cursor-pointer">
                <X size={10} />
              </button>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-6 gap-2.5">
          <CommandStatCard icon={Users} label="Active Agents" value={`${metrics.activeCount}`} sub={`${metrics.busyCount} busy · ${metrics.idleCount} idle`} accent="text-sky-400" delay={0.05} />
          <CommandStatCard icon={CheckCircle2} label="Tasks Today" value={String(metrics.totalTasks)} accent="text-emerald-400" delay={0.08} />
          <CommandStatCard icon={FileText} label="Deliverables" value={String(metrics.totalDeliverables)} accent="text-violet-400" delay={0.11} />
          <CommandStatCard icon={DollarSign} label="Total Cost" value={`$${metrics.totalCost.toFixed(2)}`} accent="text-emerald-400" delay={0.14} />
          <CommandStatCard icon={Clock} label="Hours Saved" value={`${metrics.totalHours}`} sub="human-equivalent" accent="text-amber-400" delay={0.17} />
          <CommandStatCard icon={TrendingUp} label="Avg Value Score" value={String(metrics.avgValue)} accent={metrics.avgValue >= 75 ? 'text-emerald-400' : 'text-amber-400'} delay={0.2} />
        </div>
      </div>

      {/* ── 3-Panel Main Area ── */}
      <div className="flex-1 flex gap-3 px-4 pb-2 min-h-0">

        {/* ── Left: Agent Roster ── */}
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-[260px] shrink-0 rounded-xl border overflow-y-auto"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="px-3 py-2.5 border-b sticky top-0 z-10" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-slate-500" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Agent Roster</span>
              <span className="text-[9px] text-slate-600 ml-auto">{employees.filter(e => e.status !== 'terminated').length}</span>
            </div>
          </div>

          {Object.entries(departments).map(([dept, emps]) => (
            <div key={dept}>
              <div className="px-3 py-1.5 sticky top-[41px] z-10" style={{ background: 'var(--bg-card)' }}>
                <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider">{dept}</span>
              </div>
              {emps.map(emp => {
                const isSelected = selectedAgent === emp.id;
                const profile = agentProfiles[emp.id];
                const sc = statusColors[emp.status];
                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedAgent(isSelected ? null : emp.id)}
                    className={`w-full text-left px-3 py-2 transition-colors cursor-pointer border-l-2 ${
                      isSelected
                        ? 'border-l-sky-400 bg-sky-500/5'
                        : 'border-l-transparent hover:bg-white/3'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full ${emp.color} flex items-center justify-center text-white text-[8px] font-bold shrink-0`}>
                        {emp.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-slate-300 truncate">{emp.name}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shrink-0`} />
                        </div>
                        <p className="text-[9px] text-slate-600 truncate">{emp.role}</p>
                      </div>
                      {profile && (
                        <span className="text-[9px] font-mono text-slate-600 shrink-0">{profile.costToday}</span>
                      )}
                    </div>
                    {emp.currentTask && (
                      <p className="text-[9px] text-slate-600 mt-0.5 ml-7 truncate">{emp.currentTask}</p>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </motion.aside>

        {/* ── Center: Task Board ── */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex-1 min-w-0 overflow-y-auto"
        >
          <div className="grid grid-cols-4 gap-3 h-full">
            {columns.map(col => {
              const conf = taskStatusConfig[col];
              const ColIcon = conf.icon;
              const tasks = tasksByStatus[col];
              return (
                <div key={col} className="flex flex-col min-h-0">
                  {/* Column header */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-2 mb-2 rounded-lg border ${conf.accent}`}
                    style={{ background: 'var(--bg-card)' }}>
                    <ColIcon size={11} className={conf.color} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${conf.color}`}>
                      {conf.label}
                    </span>
                    <span className={`ml-auto text-[10px] font-bold ${conf.color}`}>{tasks.length}</span>
                  </div>
                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto pr-0.5 space-y-0">
                    {tasks.map((task, i) => (
                      <TaskCard key={task.id} task={task} index={i} />
                    ))}
                    {tasks.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-[10px] text-slate-700">No tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.main>

        {/* ── Right: Live Activity Feed ── */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-[300px] shrink-0 rounded-xl border overflow-hidden flex flex-col"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          {/* Feed header */}
          <div className="px-3 py-2.5 border-b shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Live Activity</span>
              <span className="text-[9px] text-slate-600 ml-auto">{filteredFeed.length} events</span>
            </div>
            {/* Type filters */}
            <div className="flex gap-1 flex-wrap">
              {['task', 'deliverable', 'escalation', 'communication', 'research'].map(t => {
                const isActive = feedFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setFeedFilter(isActive ? null : t)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-medium border cursor-pointer transition-colors ${
                      isActive
                        ? `${typeColors[t].text} ${typeColors[t].bg}`
                        : 'text-slate-600 border-transparent hover:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feed entries */}
          <div className="flex-1 overflow-y-auto px-3 py-1">
            {filteredFeed.slice(0, 50).map((entry, i) => (
              <ActivityFeedItem key={`${entry.agentId}-${entry.time}-${i}`} entry={entry} delay={0.02 + i * 0.01} />
            ))}
          </div>
        </motion.aside>
      </div>

      {/* ── Department Cost Bars ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="shrink-0 px-4 pb-3"
      >
        <div className="grid grid-cols-3 gap-3">
          {departmentDetails.map((dept, i) => {
            const spendNum = parseFloat(dept.spend.replace('$', '').replace('K', '')) * 1000;
            const budgetNum = parseFloat(dept.budget.replace('$', '').replace('K', '')) * 1000;
            const pct = Math.round((spendNum / budgetNum) * 100);
            const barColor = pct >= 75 ? '#f43f5e' : pct >= 50 ? '#f59e0b' : '#10b981';
            const deptEmps = employees.filter(e => e.department === dept.name && e.status !== 'terminated');

            return (
              <div
                key={dept.name}
                className="rounded-lg border px-3 py-2"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold text-slate-400">{dept.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-500">{deptEmps.length} agents</span>
                    <span className="text-[10px] font-mono text-slate-400">{dept.spend} / {dept.budget}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-base)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.35 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: barColor }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-slate-600">{pct}% consumed</span>
                  <span className={`text-[9px] font-medium ${dept.risk === 'High' ? 'text-rose-400' : dept.risk === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    Risk: {dept.risk}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
