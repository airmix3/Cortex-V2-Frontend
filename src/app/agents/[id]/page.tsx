'use client';

import { useMemo, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import PageShell from '@/components/shared/PageShell';
import { employees, allMissions, fullTimeline, escalations } from '@/data/pages-data';
import { agentProfiles, agentLogs } from '@/data/agent-profiles';
import { agentDailySummaries, agentEvaluations } from '@/data/evaluations-data';
import type { Employee, Mission, ActivityEntry } from '@/types';
import {
  Zap, Clock, FileText, Terminal, ChevronRight, ArrowUpRight,
  TrendingUp, DollarSign, Timer, BarChart3, Shield, AlertTriangle,
  CheckCircle2, MessageSquare, Search, Beaker, Database, User,
  ArrowLeft, Calendar, Star, ArrowRight, Cpu, Plus, BookOpen,
  GitBranch, ArrowUpDown, Check, Wrench, Brain, LineChart as LineChartIcon,
  Network, FlaskConical, Sparkles, X, GripVertical,
} from 'lucide-react';
import type { AgentSkill, SkillCategory } from '@/types';

/* ── Color maps ── */
const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  busy: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
  idle: { bg: 'bg-slate-500/15', text: 'text-slate-400', dot: 'bg-slate-400' },
  terminated: { bg: 'bg-rose-500/15', text: 'text-rose-400', dot: 'bg-rose-400' },
};

const typeBadge: Record<string, { bg: string; text: string }> = {
  executive: { bg: 'bg-amber-500/15 border-amber-500/25', text: 'text-amber-400' },
  permanent: { bg: 'bg-blue-500/15 border-blue-500/25', text: 'text-blue-400' },
  temp: { bg: 'bg-purple-500/15 border-purple-500/25', text: 'text-purple-400' },
};

const impactColors: Record<string, { dot: string; text: string }> = {
  high: { dot: 'bg-emerald-400', text: 'text-emerald-400' },
  medium: { dot: 'bg-amber-400', text: 'text-amber-400' },
  low: { dot: 'bg-slate-500', text: 'text-slate-500' },
};

const activityTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  task: { icon: CheckCircle2, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  deliverable: { icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  escalation: { icon: AlertTriangle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  communication: { icon: MessageSquare, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  research: { icon: Search, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
};

const priorityColors: Record<string, string> = {
  critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  medium: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const columnLabels: Record<string, string> = {
  'act-now': 'Act Now',
  'approve-decide': 'Approve',
  'review': 'Review',
};

/* ── SVG Charts ── */
function BarChart({ data, color, label }: { data: number[]; color: string; label: string }) {
  const max = Math.max(...data);
  const w = 280;
  const h = 80;
  const barW = 28;
  const gap = (w - barW * 7) / 6;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">{label}</p>
      <svg width={w} height={h + 16} className="w-full">
        {data.map((v, i) => {
          const barH = (v / (max || 1)) * h;
          const x = i * (barW + gap);
          return (
            <g key={i}>
              <rect x={x} y={h - barH} width={barW} height={barH} rx={4} fill={color} opacity={0.6 + (v / max) * 0.4} />
              <text x={x + barW / 2} y={h + 12} textAnchor="middle" fill="#475569" fontSize="8" fontFamily="var(--font-sans)">{days[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LineChart({ data, color, label }: { data: number[]; color: string; label: string }) {
  const w = 280;
  const h = 80;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return { x, y };
  });
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const fill = `0,${h} ${polyline} ${w},${h}`;

  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">{label}</p>
      <svg width={w} height={h + 16} className="w-full">
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <polygon points={fill} fill="url(#lineFill)" />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="var(--bg-card)" stroke={color} strokeWidth="1.5" />
        ))}
        {days.map((d, i) => (
          <text key={d} x={(i / 6) * w} y={h + 12} textAnchor="middle" fill="#475569" fontSize="8" fontFamily="var(--font-sans)">{d}</text>
        ))}
      </svg>
    </div>
  );
}

/* ── Skill Radar Chart ── */
const SKILL_CATEGORY_META: Record<SkillCategory, { label: string; color: string }> = {
  technical:     { label: 'Technical', color: '#38bdf8' },
  'ai-ml':       { label: 'AI / ML',   color: '#a78bfa' },
  analysis:      { label: 'Analysis',  color: '#34d399' },
  communication: { label: 'Comms',     color: '#f59e0b' },
  domain:        { label: 'Domain',    color: '#fb923c' },
};

function SkillRadar({ skills }: { skills: AgentSkill[] }) {
  const cats: SkillCategory[] = ['technical', 'ai-ml', 'analysis', 'communication', 'domain'];
  const cx = 80, cy = 80, maxR = 60;
  const angles = cats.map((_, i) => (Math.PI * 2 * i) / cats.length - Math.PI / 2);

  // Score per category: expert=1.0, intermediate=0.6, learning=0.3 → avg, max 1
  const scores = cats.map(cat => {
    const catSkills = skills.filter(s => s.category === cat);
    if (!catSkills.length) return 0;
    const total = catSkills.reduce((sum, s) =>
      sum + (s.proficiency === 'expert' ? 1 : s.proficiency === 'intermediate' ? 0.6 : 0.3), 0);
    return Math.min(1, total / catSkills.length);
  });

  const pts = scores.map((s, i) => ({
    x: cx + Math.cos(angles[i]) * maxR * (s || 0.08),
    y: cy + Math.sin(angles[i]) * maxR * (s || 0.08),
  }));
  const polyPts = pts.map(p => `${p.x},${p.y}`).join(' ');

  // Grid rings
  const gridRings = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={160} height={160} className="shrink-0">
      {/* Grid rings */}
      {gridRings.map(r => {
        const gPts = cats.map((_, i) => ({
          x: cx + Math.cos(angles[i]) * maxR * r,
          y: cy + Math.sin(angles[i]) * maxR * r,
        })).map(p => `${p.x},${p.y}`).join(' ');
        return <polygon key={r} points={gPts} fill="none" stroke="var(--border-subtle)" strokeWidth="0.75" />;
      })}
      {/* Axis lines */}
      {cats.map((_, i) => (
        <line key={i} x1={cx} y1={cy}
          x2={cx + Math.cos(angles[i]) * maxR}
          y2={cy + Math.sin(angles[i]) * maxR}
          stroke="var(--border-subtle)" strokeWidth="0.75" />
      ))}
      {/* Filled polygon */}
      <polygon points={polyPts} fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Data points */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={SKILL_CATEGORY_META[cats[i]].color} stroke="var(--bg-card)" strokeWidth="1.5" />
      ))}
      {/* Labels */}
      {cats.map((cat, i) => {
        const lx = cx + Math.cos(angles[i]) * (maxR + 14);
        const ly = cy + Math.sin(angles[i]) * (maxR + 14);
        return (
          <text key={cat} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fill={SKILL_CATEGORY_META[cat].color} fontSize="7" fontWeight="600" fontFamily="var(--font-sans)">
            {SKILL_CATEGORY_META[cat].label}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Value Score Arc ── */
function ValueArc({ score }: { score: number }) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width={80} height={80} className="absolute inset-0 -rotate-90">
        <circle cx={40} cy={40} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
        <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeLinecap="round" />
      </svg>
      <span className="text-xl font-bold text-white">{score}</span>
    </div>
  );
}

/* ── Terminal Log Colorizer ── */
function colorize(line: string) {
  if (line.startsWith('[ERR]')) return 'text-rose-400';
  if (line.startsWith('[SEND]')) return 'text-emerald-400';
  if (line.startsWith('[RECV]')) return 'text-sky-400';
  if (line.startsWith('[PROC]')) return 'text-slate-300';
  if (line.startsWith('[SYS]')) return 'text-slate-500';
  if (line.startsWith('[WAIT]')) return 'text-amber-400';
  if (line.startsWith('[NOTE]')) return 'text-violet-400';
  if (line.startsWith('[IDLE]')) return 'text-slate-600';
  return 'text-slate-400';
}

/* ── Skills Manager (Interactive) ── */
const CATS: SkillCategory[] = ['technical', 'ai-ml', 'analysis', 'communication', 'domain'];
const CAT_ICONS: Record<SkillCategory, React.ElementType> = {
  technical: Wrench, 'ai-ml': Brain, analysis: LineChartIcon, communication: Network, domain: FlaskConical,
};
const PROF_LABEL: Record<string, string> = { expert: 'Expert', intermediate: 'Intermediate', learning: 'Learning' };
const PROF_COLORS: Record<string, { dot: string; badge: string }> = {
  expert:       { dot: 'bg-emerald-400', badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  intermediate: { dot: 'bg-amber-400',   badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  learning:     { dot: 'bg-sky-400',      badge: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
};
const PROF_CYCLE: Record<string, 'expert' | 'intermediate' | 'learning'> = {
  learning: 'intermediate', intermediate: 'expert', expert: 'learning',
};

function SkillsManager({ profile }: { profile: import('@/types').AgentProfile }) {
  const [skills, setSkills] = useState<AgentSkill[]>(profile.skills);
  const [suggestions, setSuggestions] = useState(profile.suggestedSkills ?? []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>('technical');
  const [newProficiency, setNewProficiency] = useState<'expert' | 'intermediate' | 'learning'>('learning');
  const [removingSkill, setRemovingSkill] = useState<string | null>(null);

  const skillsByCategory = useMemo(() => {
    return CATS.reduce((acc, cat) => {
      acc[cat] = skills.filter(s => s.category === cat);
      return acc;
    }, {} as Record<SkillCategory, AgentSkill[]>);
  }, [skills]);

  const totalUsedToday = skills.filter(s => s.usedToday).length;
  const expertCount = skills.filter(s => s.proficiency === 'expert').length;
  const newSkills = skills.filter(s => s.isNew);

  const cycleProficiency = useCallback((skillName: string) => {
    setSkills(prev => prev.map(s =>
      s.name === skillName ? { ...s, proficiency: PROF_CYCLE[s.proficiency] } : s
    ));
  }, []);

  const removeSkill = useCallback((skillName: string) => {
    setRemovingSkill(skillName);
    setTimeout(() => {
      setSkills(prev => prev.filter(s => s.name !== skillName));
      setRemovingSkill(null);
    }, 300);
  }, []);

  const addFromSuggestion = useCallback((sg: { name: string; category: SkillCategory; reason: string }) => {
    setSkills(prev => [...prev, { name: sg.name, category: sg.category, proficiency: 'learning', usedToday: false, isNew: true }]);
    setSuggestions(prev => prev.filter(s => s.name !== sg.name));
  }, []);

  const addCustomSkill = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed || skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    setSkills(prev => [...prev, { name: trimmed, category: newCategory, proficiency: newProficiency, usedToday: false, isNew: true }]);
    setNewName('');
    setShowAddForm(false);
  }, [newName, newCategory, newProficiency, skills]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="card-depth rounded-xl border p-5"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Wrench size={14} className="text-violet-400" />
        <h2 className="text-sm font-semibold text-white">Tools &amp; Skills Map</h2>
        <span className="text-[11px] text-slate-500">{skills.length} skills</span>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Expert: {expertCount}
          </span>
          <span className="text-[10px] text-slate-500">·</span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Zap size={9} className="text-amber-400" /> Used today: {totalUsedToday}
          </span>
          {newSkills.length > 0 && (
            <>
              <span className="text-[10px] text-slate-500">·</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Sparkles size={9} /> {newSkills.length} new
              </span>
            </>
          )}
          <span className="text-[10px] text-slate-500">·</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all"
            style={{
              background: showAddForm ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showAddForm ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: showAddForm ? '#fcd34d' : '#94a3b8',
            }}
          >
            <Plus size={11} /> Add Skill
          </motion.button>
        </div>
      </div>

      {/* Add skill form (inline) */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 rounded-xl border p-4"
          style={{ background: 'rgba(245,158,11,0.03)', borderColor: 'rgba(245,158,11,0.15)' }}
        >
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium block mb-1">Skill Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                placeholder="e.g. Sentiment Analysis"
                className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-amber-500/40 transition-colors"
                style={{ borderColor: 'var(--border-subtle)' }}
                autoFocus
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as SkillCategory)}
                className="bg-transparent border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none cursor-pointer"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
              >
                {CATS.map(c => (
                  <option key={c} value={c} style={{ background: '#0a0f1a' }}>{SKILL_CATEGORY_META[c].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium block mb-1">Proficiency</label>
              <div className="flex items-center gap-1">
                {(['learning', 'intermediate', 'expert'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setNewProficiency(p)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                      newProficiency === p
                        ? PROF_COLORS[p].badge
                        : 'text-slate-600 border-transparent'
                    }`}
                  >
                    {PROF_LABEL[p]}
                  </button>
                ))}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={addCustomSkill}
              disabled={!newName.trim()}
              className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-30"
              style={{ background: 'rgba(245,158,11,0.85)', color: '#0a0f1a' }}
            >
              Add
            </motion.button>
            <button
              onClick={() => { setShowAddForm(false); setNewName(''); }}
              className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex gap-5">
        {/* Radar chart */}
        <div className="shrink-0 flex flex-col items-center justify-start">
          <SkillRadar skills={skills} />
          <p className="text-[9px] text-slate-600 mt-1 text-center">Category Coverage</p>
        </div>

        {/* Skill categories grid */}
        <div className="flex-1 grid grid-cols-2 xl:grid-cols-3 gap-3 min-w-0">
          {CATS.filter(cat => skillsByCategory[cat].length > 0).map((cat, ci) => {
            const CatIcon = CAT_ICONS[cat];
            const meta = SKILL_CATEGORY_META[cat];
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + ci * 0.05 }}
                className="rounded-lg border p-3"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
              >
                {/* Category header */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <CatIcon size={11} style={{ color: meta.color }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                  <span className="text-[9px] text-slate-600 ml-auto">{skillsByCategory[cat].length}</span>
                </div>

                {/* Skills list */}
                <div className="space-y-1">
                  {skillsByCategory[cat].map(skill => (
                    <motion.div
                      key={skill.name}
                      layout
                      initial={{ opacity: 1 }}
                      animate={{ opacity: removingSkill === skill.name ? 0 : 1, x: removingSkill === skill.name ? -20 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="group flex items-center gap-1.5 py-0.5 rounded-md hover:bg-white/3 px-1 -mx-1 transition-colors"
                    >
                      {/* Proficiency dot — clickable */}
                      <button
                        onClick={() => cycleProficiency(skill.name)}
                        className="shrink-0 focus:outline-none"
                        title={`${PROF_LABEL[skill.proficiency]} — click to change`}
                      >
                        <motion.span
                          key={skill.proficiency}
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className={`block w-2 h-2 rounded-full ${PROF_COLORS[skill.proficiency].dot} cursor-pointer`}
                          style={{ boxShadow: `0 0 4px ${skill.proficiency === 'expert' ? 'rgba(52,211,153,0.5)' : skill.proficiency === 'intermediate' ? 'rgba(251,191,36,0.4)' : 'rgba(56,189,248,0.4)'}` }}
                        />
                      </button>
                      {/* Skill name */}
                      <span className="text-[11px] text-slate-300 flex-1 truncate">{skill.name}</span>
                      {/* Badges */}
                      <div className="flex items-center gap-1 shrink-0">
                        {skill.usedToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 shrink-0"
                            title="Used today" style={{ boxShadow: '0 0 4px rgba(251,191,36,0.5)' }} />
                        )}
                        {skill.isNew && (
                          <span className="text-[8px] font-bold text-emerald-400 uppercase leading-none border border-emerald-500/30 rounded px-0.5">
                            new
                          </span>
                        )}
                        {/* Remove button */}
                        <button
                          onClick={() => removeSkill(skill.name)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-600 hover:text-rose-400 transition-all"
                          title="Remove skill"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend + Suggested skills (actionable) */}
      <div className="mt-4 pt-4 border-t flex items-start gap-6" style={{ borderColor: 'var(--border-subtle)' }}>
        {/* Legend */}
        <div>
          <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1.5">Proficiency (click dot to change)</p>
          <div className="flex items-center gap-3">
            {(['expert', 'intermediate', 'learning'] as const).map(p => (
              <div key={p} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${PROF_COLORS[p].dot}`} />
                <span className="text-[9px] text-slate-500 capitalize">{PROF_LABEL[p]}</span>
              </div>
            ))}
            <div className="w-px h-3 bg-[var(--border-subtle)]" />
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" style={{ boxShadow: '0 0 4px rgba(251,191,36,0.5)' }} />
              <span className="text-[9px] text-slate-500">Used today</span>
            </div>
          </div>
        </div>

        {/* Suggested skills — now actionable */}
        {suggestions.length > 0 && (
          <div className="flex-1">
            <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles size={9} className="text-slate-600" /> Suggested Additions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(sg => {
                const CatIcon2 = CAT_ICONS[sg.category];
                return (
                  <motion.button
                    key={sg.name}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => addFromSuggestion(sg)}
                    className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed transition-all hover:border-solid"
                    style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.03)' }}
                    title={sg.reason}
                  >
                    <Plus size={10} className="text-amber-400/60 group-hover:text-amber-400 transition-colors" />
                    <CatIcon2 size={10} style={{ color: SKILL_CATEGORY_META[sg.category].color, opacity: 0.7 }} />
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors">{sg.name}</span>
                    <span className="text-[9px] text-slate-600 group-hover:text-amber-300 transition-colors ml-0.5">Add</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function AgentProfilePage() {
  const params = useParams();
  const agentId = params.id as string;

  const employee = useMemo(() => employees.find(e => e.id === agentId), [agentId]);
  const profile = useMemo(() => agentProfiles[agentId], [agentId]);

  const agentMissions = useMemo(() => {
    if (!employee) return [];
    return allMissions.filter(m =>
      m.owner.name === employee.name ||
      m.touchTrail.some(p => p.name === employee.name)
    );
  }, [employee]);

  const agentTimeline = useMemo(() => {
    if (!employee) return [];
    return fullTimeline.filter(e => e.actor === employee.name);
  }, [employee]);

  const agentEscalations = useMemo(() => {
    if (!employee) return [];
    return escalations.filter(e =>
      e.originatedBy.name === employee.name ||
      e.chain.some(p => p.name === employee.name)
    );
  }, [employee]);

  const logs = employee ? (agentLogs[employee.name] || []) : [];
  const recentLogs = logs.slice(-10);

  const directReports = useMemo(() => {
    if (!employee) return [];
    return employees.filter(e => e.reportsTo === employee.name || e.reportsTo === employee.role);
  }, [employee]);

  const teammates = useMemo(() => {
    if (!employee) return [];
    return employees.filter(e => e.department === employee.department && e.id !== employee.id);
  }, [employee]);

  // Not found
  if (!employee) {
    return (
      <PageShell>
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-500/10 flex items-center justify-center">
            <User className="w-8 h-8 text-slate-500" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Agent Not Found</h1>
          <p className="text-sm text-slate-400 mb-6">No agent with ID "{agentId}" exists in the system.</p>
          <Link href="/people" className="text-sm text-sky-400 hover:text-sky-300">View all agents</Link>
        </div>
      </PageShell>
    );
  }

  const status = statusColors[employee.status];
  const badge = typeBadge[employee.type];
  const effColor = (profile?.costEfficiency ?? 0) >= 20 ? 'text-emerald-400' : (profile?.costEfficiency ?? 0) >= 10 ? 'text-amber-400' : 'text-rose-400';

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* ── Back Link ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Link href="/people" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={12} /> Back to People
          </Link>
        </motion.div>

        {/* ── 1. Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-depth rounded-xl border p-6"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-start gap-5 flex-wrap">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-16 h-16 rounded-2xl ${employee.color} flex items-center justify-center text-white text-xl font-bold`}
                style={{ boxShadow: `0 0 0 3px var(--bg-card), 0 0 0 5px ${status.dot === 'bg-emerald-400' ? '#10b981' : status.dot === 'bg-amber-400' ? '#f59e0b' : '#64748b'}` }}>
                {employee.avatar}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${status.dot} ring-2 ring-[var(--bg-card)]`} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-white">{employee.name}</h1>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${badge.bg} ${badge.text} capitalize`}>{employee.type}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${status.bg} ${status.text} capitalize`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} /> {employee.status}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-2">{employee.role} &middot; {employee.department}</p>
              {profile && <p className="text-sm text-slate-500 leading-relaxed">{profile.bio}</p>}
            </div>

            {/* Meta */}
            <div className="text-right space-y-1 shrink-0">
              <p className="text-[11px] text-slate-500">Since {employee.joinedAt}</p>
              <p className="text-[11px] text-slate-500">Reports to <span className="text-slate-300">{employee.reportsTo}</span></p>
              {employee.currentTask && (
                <div className="flex items-center gap-1.5 justify-end mt-2">
                  <Zap size={10} className="text-amber-400" />
                  <span className="text-[11px] text-amber-300">{employee.currentTask}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 justify-end mt-1">
                <Database size={10} className="text-slate-600" />
                <code className="text-[10px] font-mono text-slate-600">{employee.memoryNamespace}</code>
              </div>
            </div>
          </div>

          {/* Skills (quick preview chips) */}
          {profile && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              {profile.skills.map(skill => (
                <span key={skill.name} className={`px-2 py-0.5 rounded-md text-[10px] font-medium border flex items-center gap-1 ${skill.isNew ? 'text-emerald-400 border-emerald-500/25' : 'text-slate-400'}`}
                  style={{ background: skill.isNew ? 'rgba(16,185,129,0.06)' : 'var(--bg-elevated)', borderColor: skill.isNew ? undefined : 'var(--border-subtle)' }}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${skill.proficiency === 'expert' ? 'bg-emerald-400' : skill.proficiency === 'intermediate' ? 'bg-amber-400' : 'bg-sky-400'}`} />
                  {skill.name}
                  {skill.isNew && <span className="ml-0.5 text-[8px] font-bold text-emerald-400 uppercase">New</span>}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── 2. Value Dashboard ── */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card-depth rounded-xl border p-5"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Value Created Today</h2>
            </div>

            <div className="grid grid-cols-6 gap-4">
              {/* Value Score */}
              <div className="flex flex-col items-center justify-center">
                <ValueArc score={profile.valueScore} />
                <p className="text-[10px] text-slate-500 mt-1">Value Score</p>
              </div>

              {/* Tasks Today */}
              <div className="rounded-lg border px-3 py-3 flex flex-col justify-center" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                <p className="text-2xl font-bold text-white">{profile.tasksCompletedToday}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Tasks Completed</p>
              </div>

              {/* Deliverables */}
              <div className="rounded-lg border px-3 py-3 flex flex-col justify-center" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-1.5">
                  <p className="text-2xl font-bold text-white">{profile.deliverablesProducedToday}</p>
                  <FileText size={14} className="text-emerald-400" />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Deliverables</p>
              </div>

              {/* Hours Saved */}
              <div className="rounded-lg border px-3 py-3 flex flex-col justify-center" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-white">{profile.estimatedHoursSaved}</p>
                  <span className="text-[10px] text-slate-500">hrs</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Human Hours Saved</p>
              </div>

              {/* Cost Today */}
              <div className="rounded-lg border px-3 py-3 flex flex-col justify-center" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                <p className="text-2xl font-bold text-emerald-400">{profile.costToday}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Cost Today</p>
              </div>

              {/* Cost Efficiency */}
              <div className="rounded-lg border px-3 py-3 flex flex-col justify-center" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                <p className={`text-2xl font-bold ${effColor}`}>{profile.costEfficiency}x</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Cost Efficiency</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 3. Tools & Skills Map (Interactive) ── */}
        {profile && <SkillsManager profile={profile} />}

        {/* ── 4. Performance Trends (was 3) ── */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="card-depth rounded-xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <BarChart data={profile.weeklyActivity} color="#38bdf8" label="Weekly Task Activity" />
            </div>
            <div className="card-depth rounded-xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
              <LineChart data={profile.weeklyValue} color="#10b981" label="Weekly Value Score" />
            </div>
          </motion.div>
        )}

        {/* ── 4. Today's Activity Timeline ── */}
        {profile && profile.todayActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-depth rounded-xl border p-5"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-sky-400" />
              <h2 className="text-sm font-semibold text-white">Today's Activity</h2>
              <span className="text-[11px] text-slate-500">{profile.todayActivity.length} actions</span>
            </div>

            <div className="space-y-0">
              {profile.todayActivity.map((entry, i) => {
                const impact = impactColors[entry.impact];
                const typeConf = activityTypeConfig[entry.type];
                const TypeIcon = typeConf.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
                    className="flex items-start gap-3 py-2.5 border-b last:border-b-0"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    {/* Time */}
                    <span className="text-[11px] font-mono text-slate-600 w-10 shrink-0 pt-0.5">{entry.time}</span>

                    {/* Impact dot + line */}
                    <div className="flex flex-col items-center shrink-0 pt-1.5">
                      <div className={`w-2 h-2 rounded-full ${impact.dot}`} />
                      {i < profile.todayActivity.length - 1 && (
                        <div className="w-px flex-1 mt-1" style={{ background: 'var(--border-subtle)', minHeight: '16px' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 leading-relaxed">{entry.action}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border ${typeConf.color}`}>
                          <TypeIcon size={9} />
                          {entry.type}
                        </span>
                        {entry.relatedMission && (
                          <span className="text-[10px] text-slate-500">
                            <Zap size={8} className="inline text-amber-400 mr-0.5" />
                            {entry.relatedMission}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Impact badge */}
                    <span className={`text-[9px] font-medium ${impact.text} shrink-0 pt-0.5 uppercase`}>{entry.impact}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── 5. Active Missions ── */}
        {agentMissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="card-depth rounded-xl border p-5"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={14} className="text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Active Missions</h2>
              <span className="text-[11px] text-slate-500">{agentMissions.length} missions</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {agentMissions.map(mission => {
                const isOwner = mission.owner.name === employee.name;
                return (
                  <div
                    key={mission.id}
                    className="rounded-lg border p-3 space-y-2"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{mission.title}</p>
                        <p className="text-[10px] text-slate-500">{mission.department}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${priorityColors[mission.priority]}`}>
                          {mission.priority}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium text-slate-400 bg-slate-500/10 border border-slate-500/20">
                          {columnLabels[mission.column]}
                        </span>
                      </div>
                    </div>

                    {/* Flow stage */}
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map(s => (
                        <div key={s} className={`h-1 flex-1 rounded-full ${s <= mission.flowStage ? 'bg-sky-500' : 'bg-slate-700'}`} />
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FileText size={10} className="text-slate-500" />
                        <span className="text-[10px] text-slate-500">{mission.deliverables.length} deliverables</span>
                      </div>
                      <span className={`text-[10px] font-medium ${isOwner ? 'text-amber-400' : 'text-slate-500'}`}>
                        {isOwner ? 'Owner' : 'Contributor'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── 6. Recent Terminal Output ── */}
        {recentLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="terminal-panel rounded-xl border overflow-hidden"
            style={{ background: '#080c14', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="w-px h-3.5 bg-[var(--border-subtle)]" />
                <Terminal size={12} className="text-slate-500" />
                <span className="text-xs font-medium text-slate-400">Recent Output</span>
              </div>
              <Link href="/terminal" className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300">
                Open in Terminal <ArrowUpRight size={10} />
              </Link>
            </div>
            <div className="px-4 py-3 font-mono text-[11px] leading-relaxed space-y-0.5">
              {recentLogs.map((line, i) => (
                <div key={i} className="terminal-line flex gap-2">
                  <span className="text-slate-600 shrink-0 select-none">{String(i + 1).padStart(2, '0')}</span>
                  <span className={colorize(line)}>{line}</span>
                </div>
              ))}
              <div className="flex items-center gap-1 mt-1">
                <span className="text-emerald-400">$</span>
                <span className="terminal-cursor text-emerald-400 font-bold">_</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 7. Relationships ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="card-depth rounded-xl border p-5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <User size={14} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-white">Relationships</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Reports To */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Reports To</p>
              <p className="text-sm text-slate-300">{employee.reportsTo}</p>
            </div>

            {/* Direct Reports */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Direct Reports ({directReports.length})</p>
              {directReports.length === 0 ? (
                <p className="text-xs text-slate-600">None</p>
              ) : (
                <div className="space-y-1.5">
                  {directReports.map(dr => (
                    <Link key={dr.id} href={`/agents/${dr.id}`} className="flex items-center gap-2 group">
                      <div className={`w-6 h-6 rounded-full ${dr.color} flex items-center justify-center text-white text-[9px] font-bold`}>
                        {dr.avatar}
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{dr.name}</span>
                      <span className="text-[10px] text-slate-600">{dr.role}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Team */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Department Team ({teammates.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {teammates.map(tm => (
                  <Link key={tm.id} href={`/agents/${tm.id}`} className="flex items-center gap-1.5 px-2 py-1 rounded-md border hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className={`w-5 h-5 rounded-full ${tm.color} flex items-center justify-center text-white text-[8px] font-bold`}>
                      {tm.avatar}
                    </div>
                    <span className="text-[10px] text-slate-400">{tm.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 8. Daily Summary ── */}
        {agentDailySummaries[agentId] && (() => {
          const summary = agentDailySummaries[agentId];
          const evaluation = agentEvaluations.find(e => e.agentId === agentId);
          const qualityColor = summary.efficiency.outputQuality === 'excellent' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            : summary.efficiency.outputQuality === 'good' ? 'text-sky-400 bg-sky-500/10 border-sky-500/20'
            : summary.efficiency.outputQuality === 'acceptable' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

          const actionTypeIcon: Record<string, React.ElementType> = {
            'add-skill': Plus,
            'add-context': BookOpen,
            'modify-workflow': GitBranch,
            'adjust-priority': ArrowUpDown,
          };
          const actionTypeColor: Record<string, string> = {
            'add-skill': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            'add-context': 'text-sky-400 bg-sky-500/10 border-sky-500/20',
            'modify-workflow': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            'adjust-priority': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
          };

          return (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card-depth rounded-xl border p-5"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={14} className="text-sky-400" />
                <h2 className="text-sm font-semibold text-white">Daily Summary</h2>
                <span className="text-[11px] text-slate-500">Day 47 &middot; {summary.date}</span>
              </div>

              {/* Accomplishments */}
              <div className="mb-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Accomplishments</p>
                <div className="space-y-1.5">
                  {summary.accomplishments.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-relaxed">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Efficiency Snapshot */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-lg border px-3 py-2.5" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Cpu size={10} className="text-slate-500" />
                    <span className="text-[10px] text-slate-500">Tokens Used</span>
                  </div>
                  <p className="text-lg font-bold text-white">{summary.efficiency.tokensUsed.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border px-3 py-2.5" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Timer size={10} className="text-slate-500" />
                    <span className="text-[10px] text-slate-500">Avg Response</span>
                  </div>
                  <p className="text-lg font-bold text-white">{summary.efficiency.avgResponseTime}</p>
                </div>
                <div className="rounded-lg border px-3 py-2.5" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Shield size={10} className="text-slate-500" />
                    <span className="text-[10px] text-slate-500">Output Quality</span>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border capitalize ${qualityColor}`}>
                    {summary.efficiency.outputQuality}
                  </span>
                </div>
              </div>

              {/* Blockers */}
              {summary.blockers.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Blockers</p>
                  <div className="space-y-2">
                    {summary.blockers.map((b, i) => (
                      <div key={i} className="rounded-lg border px-3 py-2.5" style={{
                        background: b.severity === 'high' ? 'rgba(244, 63, 94, 0.05)' : 'var(--bg-elevated)',
                        borderColor: b.severity === 'high' ? 'rgba(244, 63, 94, 0.15)' : 'var(--border-subtle)',
                      }}>
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={11} className={b.severity === 'high' ? 'text-rose-400' : b.severity === 'medium' ? 'text-amber-400' : 'text-slate-500'} />
                          <span className="text-xs text-slate-300 flex-1">{b.description}</span>
                          <span className={`text-[9px] font-medium uppercase ${b.resolved ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {b.resolved ? 'Resolved' : b.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Self Assessment */}
              <div className="flex items-start gap-6 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1.5">Self-Assessment</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={16} className={s <= summary.selfAssessment.score ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed flex-1 pt-3">{summary.selfAssessment.rationale}</p>
              </div>

              {/* Tomorrow's Focus */}
              <div className="mb-4">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">Tomorrow&apos;s Focus</p>
                <div className="space-y-1">
                  {summary.tomorrowFocus.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ArrowRight size={10} className="text-sky-400 shrink-0" />
                      <span className="text-xs text-slate-400">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manager Evaluation (if exists) */}
              {evaluation && (
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={12} className="text-violet-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Manager Evaluation</span>
                    <span className="text-[10px] text-slate-600">by {employees.find(e => e.id === evaluation.evaluatorId)?.name}</span>
                  </div>

                  {/* Rating bars */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {(['efficiency', 'outputQuality', 'initiative'] as const).map(dim => {
                      const val = evaluation.rating[dim];
                      const barColor = val >= 4 ? '#10b981' : val >= 3 ? '#f59e0b' : '#ef4444';
                      const labels = { efficiency: 'Efficiency', outputQuality: 'Output Quality', initiative: 'Initiative' };
                      return (
                        <div key={dim}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-500">{labels[dim]}</span>
                            <span className="text-[10px] font-bold" style={{ color: barColor }}>{val}/5</span>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <div key={s} className="h-1.5 flex-1 rounded-full" style={{ background: s <= val ? barColor : 'var(--bg-base)' }} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Flagged issues */}
                  {evaluation.flaggedIssues.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {evaluation.flaggedIssues.map((issue, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                          issue.severity === 'serious' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          : issue.severity === 'moderate' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                        }`}>
                          {issue.category.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Corrective actions */}
                  {evaluation.correctiveActions.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {evaluation.correctiveActions.map(action => {
                        const ActionIcon = actionTypeIcon[action.type] || Plus;
                        const acColor = actionTypeColor[action.type] || '';
                        return (
                          <div key={action.id} className="rounded-lg border px-3 py-2" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border ${acColor}`}>
                                <ActionIcon size={9} />
                                {action.type.replace(/-/g, ' ')}
                              </span>
                              <span className="text-xs text-slate-300">{action.description}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{action.detail}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Disposition + notes */}
                  <div className="flex items-center gap-2 mb-2">
                    {evaluation.disposition === 'autonomous' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                        <Check size={10} /> Handled Autonomously
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 escalation-glow">
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
              )}
            </motion.div>
          );
        })()}

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="flex items-center justify-center gap-6 py-4 text-[11px] text-slate-600"
        >
          <span>{employee.tasksCompleted} total tasks completed</span>
          <span className="text-slate-700">|</span>
          <span>Joined {employee.joinedAt}</span>
          <span className="text-slate-700">|</span>
          <span>{employee.memoryNamespace}</span>
        </motion.div>
      </div>
    </PageShell>
  );
}
