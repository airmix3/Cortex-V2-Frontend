'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PageShell from '@/components/shared/PageShell';
import { employees } from '@/data/pages-data';
import { agentLogs } from '@/data/agent-profiles';
import type { Employee } from '@/types';
import Link from 'next/link';
import {
  Terminal,
  Maximize2,
  Minimize2,
  Search,
  Pause,
  Play,
  Filter,
  X,
  Circle,
} from 'lucide-react';

/* ── Terminal Panel Component ── */
function TerminalPanel({
  emp,
  logs,
  isExpanded,
  isPaused,
  onToggleExpand,
  index,
}: {
  emp: Employee;
  logs: string[];
  isExpanded: boolean;
  isPaused: boolean;
  onToggleExpand: () => void;
  index: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);

  // Simulate log streaming
  useEffect(() => {
    if (isPaused) return;
    const startDelay = index * 400; // stagger start
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setLineIndex(prev => {
          const next = prev + 1;
          if (next >= logs.length) return 0; // loop
          return next;
        });
      }, 1200 + Math.random() * 2000); // variable speed per agent
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [isPaused, logs.length, index]);

  // Update visible lines when lineIndex changes
  useEffect(() => {
    setVisibleLines(prev => {
      const newLine = logs[lineIndex];
      const updated = [...prev, newLine];
      if (updated.length > 50) updated.shift(); // keep last 50 lines
      return updated;
    });
  }, [lineIndex, logs]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const statusColor = emp.status === 'active' || emp.status === 'busy' ? '#10b981' : emp.status === 'idle' ? '#64748b' : '#f59e0b';
  const deptColors: Record<string, string> = {
    Tech: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Marketing: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Operations: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Executive: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      layout
      className={`terminal-panel rounded-xl border overflow-hidden flex flex-col ${isExpanded ? 'expanded col-span-full' : ''}`}
      style={{
        background: '#080c14',
        borderColor: 'var(--border-subtle)',
        height: isExpanded ? '500px' : '280px',
      }}
    >
      {/* Terminal header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b shrink-0"
        style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2.5">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <div className="w-px h-3.5 bg-[var(--border-subtle)]" />
          {/* Agent info */}
          <div className={`w-6 h-6 rounded-full ${emp.color} flex items-center justify-center text-white text-[9px] font-bold`}>
            {emp.avatar}
          </div>
          <Link href={`/agents/${emp.id}`} className="text-xs font-semibold text-white hover:text-sky-300 transition-colors">
            {emp.name}
          </Link>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${deptColors[emp.department] || 'text-slate-400'}`}>
            {emp.department}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
            <span className="text-[10px] text-slate-500 capitalize">{emp.status}</span>
          </div>
        </div>
        <button
          onClick={onToggleExpand}
          className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-white/5 cursor-pointer"
        >
          {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        </button>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed relative"
      >
        {/* Scanline overlay */}
        <div className="terminal-scanline opacity-30" />

        {visibleLines.map((line, i) => {
          const time = new Date();
          time.setMinutes(time.getMinutes() - (visibleLines.length - i));
          const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
          return (
            <div key={`${i}-${line}`} className="terminal-line flex gap-2">
              <span className="text-slate-600 shrink-0 select-none">{timeStr}</span>
              <span className={colorize(line)}>{line}</span>
            </div>
          );
        })}

        {/* Blinking cursor */}
        {!isPaused && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-slate-600 select-none">
              {new Date().getHours().toString().padStart(2, '0')}:
              {new Date().getMinutes().toString().padStart(2, '0')}:
              {new Date().getSeconds().toString().padStart(2, '0')}
            </span>
            <span className="text-emerald-400">$</span>
            <span className="terminal-cursor text-emerald-400 font-bold">_</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function TerminalPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (deptFilter !== 'all' && emp.department !== deptFilter) return false;
      if (searchQuery && !emp.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [deptFilter, searchQuery]);

  const departments = ['all', 'Executive', 'Tech', 'Marketing', 'Operations'];
  const activeCount = filteredEmployees.filter(e => e.status === 'active' || e.status === 'busy').length;

  return (
    <PageShell>
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Terminal className="w-4.5 h-4.5 text-sky-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Multi-Agent Terminal</h1>
                <p className="text-sm text-slate-500">Real-time agent output streams across all departments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                <div className="relative">
                  <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  {!isPaused && <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 node-pulse-ring" />}
                </div>
                <span className="text-xs text-slate-400">{isPaused ? 'Paused' : 'Live'}</span>
                <span className="text-[11px] text-slate-500">{activeCount} active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="panel px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex items-center gap-3 flex-wrap">
            {/* Department filters */}
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)' }}>
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    deptFilter === dept
                      ? 'bg-white/10 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {dept === 'all' ? 'All Agents' : dept}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-[var(--border-subtle)]" />

            {/* Pause/Play */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isPaused
                  ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'text-amber-300 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'
              }`}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              {isPaused ? 'Resume' : 'Pause All'}
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
            <Search size={12} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-300 placeholder:text-slate-600 outline-none w-36"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300 cursor-pointer">
                <X size={10} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Terminal Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`grid gap-4 ${
            expandedId
              ? 'grid-cols-1'
              : filteredEmployees.length <= 4
                ? 'grid-cols-2'
                : 'grid-cols-3'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredEmployees
              .filter(emp => !expandedId || emp.id === expandedId)
              .map((emp, i) => (
                <TerminalPanel
                  key={emp.id}
                  emp={emp}
                  logs={agentLogs[emp.name] || [
                    '[SYS] Agent initialized',
                    '[PROC] Awaiting task assignment...',
                    '[IDLE] Standing by',
                  ]}
                  isExpanded={expandedId === emp.id}
                  isPaused={isPaused}
                  onToggleExpand={() => setExpandedId(expandedId === emp.id ? null : emp.id)}
                  index={i}
                />
              ))}
          </AnimatePresence>
        </motion.div>

        {/* Collapsed terminals indicator */}
        {expandedId && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <button
              onClick={() => setExpandedId(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-slate-400 bg-white/5 border border-[var(--border-subtle)] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Minimize2 size={12} />
              Show all {filteredEmployees.length} terminals
            </button>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
