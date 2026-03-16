'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { employees } from '@/data/pages-data';
import { people } from '@/data/mock-data';
import type { Employee } from '@/types';
import { X, Zap, Clock, ChevronRight, Terminal, User } from 'lucide-react';
import Link from 'next/link';

/* ── Layout constants ── */
const MAP_W = 900;
const MAP_H = 480;

/* ── Department cluster positions ── */
const deptClusters: Record<string, { x: number; y: number; color: string; glowColor: string; label: string }> = {
  Tech: { x: 280, y: 240, color: '#3b82f6', glowColor: 'rgba(59,130,246,0.15)', label: 'Tech' },
  Marketing: { x: 620, y: 160, color: '#a855f7', glowColor: 'rgba(168,85,247,0.15)', label: 'Marketing' },
  Operations: { x: 620, y: 340, color: '#10b981', glowColor: 'rgba(16,185,129,0.15)', label: 'Operations' },
  Executive: { x: 140, y: 120, color: '#f59e0b', glowColor: 'rgba(245,158,11,0.15)', label: 'Executive' },
};

/* ── Status colors ── */
const statusColors: Record<string, string> = {
  active: '#10b981',
  busy: '#f59e0b',
  idle: '#64748b',
  terminated: '#ef4444',
};

/* ── Position agents around their department cluster ── */
function getAgentPositions(emps: Employee[]) {
  const grouped: Record<string, Employee[]> = {};
  emps.forEach(e => {
    if (!grouped[e.department]) grouped[e.department] = [];
    grouped[e.department].push(e);
  });

  const positions: { emp: Employee; x: number; y: number }[] = [];

  Object.entries(grouped).forEach(([dept, agents]) => {
    const cluster = deptClusters[dept];
    if (!cluster) return;
    const radius = 70 + agents.length * 8;
    agents.forEach((emp, i) => {
      const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
      positions.push({
        emp,
        x: cluster.x + Math.cos(angle) * radius,
        y: cluster.y + Math.sin(angle) * radius,
      });
    });
  });

  return positions;
}

/* ── Connection lines between agents and department centers ── */
function ConnectionLines({ positions }: { positions: { emp: Employee; x: number; y: number }[] }) {
  return (
    <g>
      {positions.map(({ emp, x, y }) => {
        const cluster = deptClusters[emp.department];
        if (!cluster) return null;
        const isActive = emp.status === 'active' || emp.status === 'busy';
        return (
          <line
            key={`conn-${emp.id}`}
            x1={cluster.x}
            y1={cluster.y}
            x2={x}
            y2={y}
            stroke={isActive ? cluster.color : '#1e293b'}
            strokeWidth={isActive ? 1.5 : 0.5}
            strokeOpacity={isActive ? 0.4 : 0.15}
            className={isActive ? 'connection-line' : ''}
          />
        );
      })}
      {/* Cross-department lines: Executive (Tamir) to each dept */}
      {Object.entries(deptClusters).filter(([k]) => k !== 'Executive').map(([dept, cluster]) => {
        const exec = deptClusters.Executive;
        return (
          <line
            key={`cross-${dept}`}
            x1={exec.x}
            y1={exec.y}
            x2={cluster.x}
            y2={cluster.y}
            stroke="#f59e0b"
            strokeWidth={1}
            strokeOpacity={0.15}
            className="connection-line-reverse"
          />
        );
      })}
    </g>
  );
}

/* ── Animated particles flowing along connections ── */
function FlowParticles({ positions }: { positions: { emp: Employee; x: number; y: number }[] }) {
  const activeAgents = positions.filter(p => p.emp.status === 'active' || p.emp.status === 'busy');
  return (
    <g>
      {activeAgents.map(({ emp, x, y }, i) => {
        const cluster = deptClusters[emp.department];
        if (!cluster) return null;
        return (
          <circle key={`particle-${emp.id}`} r="2" fill={cluster.color} opacity="0.8">
            <animateMotion
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
              path={`M${cluster.x},${cluster.y} L${x},${y}`}
            />
          </circle>
        );
      })}
    </g>
  );
}

/* ── Agent detail slide-out ── */
function AgentDetail({ emp, onClose }: { emp: Employee; onClose: () => void }) {
  const missionMap: Record<string, string> = {
    'Dev Agent': 'ZUNA Deployment',
    'Infra Agent': 'AWS Capacity Blocker',
    'Content Agent': 'Content Strategy Plans',
    'Research Agent': 'EEG Model Optimization',
    'Ops Agent': 'Logistics Optimization',
    'Market Intel': 'Q2 Campaign Planning',
    'EEG Researcher': 'EEG Study Scope',
    'Data Scientist': 'EEG Model Optimization',
    'Tamir': 'Cross-department coordination',
    'Alex': 'AWS Capacity Blocker',
    'Maya': 'Content Strategy Plans',
    'Liam': 'Investor Update Deck',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="absolute right-4 top-4 w-72 card-depth rounded-xl border z-30"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-medium)' }}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${emp.color} flex items-center justify-center text-white text-sm font-bold`}
              style={{ boxShadow: `0 0 0 2px ${statusColors[emp.status]}` }}>
              {emp.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{emp.name}</p>
              <p className="text-[11px] text-slate-400">{emp.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-white/5 cursor-pointer">
            <X size={14} />
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: statusColors[emp.status] }} />
          <span className="text-xs text-slate-400 capitalize">{emp.status}</span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-500">{emp.department}</span>
        </div>

        {/* Current Task */}
        {emp.currentTask && (
          <div className="rounded-lg px-3 py-2.5 border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">Current Task</p>
            <p className="text-xs text-slate-300">{emp.currentTask}</p>
          </div>
        )}

        {/* Mission */}
        <div className="rounded-lg px-3 py-2.5 border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">Active Mission</p>
          <div className="flex items-center gap-1.5">
            <Zap size={11} className="text-amber-400" />
            <p className="text-xs text-amber-300">{missionMap[emp.name] || 'Standby'}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg px-2.5 py-2 border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
            <p className="text-[10px] text-slate-500 mb-0.5">Tasks Done</p>
            <p className="text-sm font-semibold text-white">{emp.tasksCompleted}</p>
          </div>
          <div className="rounded-lg px-2.5 py-2 border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
            <p className="text-[10px] text-slate-500 mb-0.5">Reports To</p>
            <p className="text-sm font-semibold text-white">{emp.reportsTo}</p>
          </div>
        </div>

        {/* Memory namespace */}
        <div className="flex items-center gap-1.5 pt-1">
          <Clock size={10} className="text-slate-600" />
          <code className="text-[10px] font-mono text-slate-500">{emp.memoryNamespace}</code>
        </div>

        {/* View Profile link */}
        <Link
          href={`/agents/${emp.id}`}
          className="flex items-center justify-center gap-1.5 w-full mt-2 px-3 py-2 rounded-lg text-xs font-medium text-sky-300 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
        >
          <User size={12} />
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Main Component ── */
export default function LiveAgentMap() {
  const positions = useMemo(() => getAgentPositions(employees), []);
  const [selectedAgent, setSelectedAgent] = useState<Employee | null>(null);
  const [tick, setTick] = useState(0);

  // Heartbeat tick for "alive" feel
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = employees.filter(e => e.status === 'active' || e.status === 'busy').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="card-depth rounded-xl border relative overflow-hidden"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Scanline overlay */}
      <div className="terminal-scanline" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 node-pulse-ring" />
          </div>
          <h3 className="text-sm font-semibold text-white">Live Agent Network</h3>
          <span className="text-[11px] text-slate-500">{activeCount} active agents</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px]">
            {Object.entries(statusColors).filter(([k]) => k !== 'terminated').map(([status, color]) => (
              <div key={status} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                <span className="text-slate-500 capitalize">{status}</span>
              </div>
            ))}
          </div>
          <Link
            href="/terminal"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-sky-300 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-colors cursor-pointer"
          >
            <Terminal size={12} />
            Multi-Agent Terminal
          </Link>
        </div>
      </div>

      {/* SVG Map */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="w-full"
          style={{ height: '420px' }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
            </pattern>
            {/* Glow filters */}
            {Object.entries(deptClusters).map(([dept, { color }]) => (
              <filter key={dept} id={`glow-${dept}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feFlood floodColor={color} floodOpacity="0.3" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>
          <rect width={MAP_W} height={MAP_H} fill="url(#grid)" />

          {/* Connection lines */}
          <ConnectionLines positions={positions} />

          {/* Flow particles */}
          <FlowParticles positions={positions} />

          {/* Department cluster centers */}
          {Object.entries(deptClusters).map(([dept, cluster]) => {
            const agentsInDept = positions.filter(p => p.emp.department === dept);
            const orbitRadius = 70 + agentsInDept.length * 8;
            return (
              <g key={dept}>
                {/* Orbit ring */}
                <circle
                  cx={cluster.x}
                  cy={cluster.y}
                  r={orbitRadius}
                  fill="none"
                  stroke={cluster.color}
                  strokeWidth="0.5"
                  className="orbit-ring"
                />
                {/* Glow */}
                <circle
                  cx={cluster.x}
                  cy={cluster.y}
                  r={30}
                  fill={cluster.glowColor}
                  className="network-node"
                />
                {/* Center node */}
                <circle
                  cx={cluster.x}
                  cy={cluster.y}
                  r={20}
                  fill="var(--bg-elevated)"
                  stroke={cluster.color}
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
                <text
                  x={cluster.x}
                  y={cluster.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={cluster.color}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="var(--font-sans)"
                >
                  {cluster.label}
                </text>
              </g>
            );
          })}

          {/* Agent nodes */}
          {positions.map(({ emp, x, y }) => {
            const isActive = emp.status === 'active' || emp.status === 'busy';
            const statusColor = statusColors[emp.status];
            const isSelected = selectedAgent?.id === emp.id;

            return (
              <g
                key={emp.id}
                className="cursor-pointer network-node"
                onClick={() => setSelectedAgent(isSelected ? null : emp)}
                style={{ transformOrigin: `${x}px ${y}px` }}
              >
                {/* Pulse ring for active agents */}
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={14}
                    fill="none"
                    stroke={statusColor}
                    strokeWidth="1"
                    className="node-pulse-ring"
                  />
                )}
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={18}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}
                {/* Node body */}
                <circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill="var(--bg-card)"
                  stroke={isSelected ? '#38bdf8' : isActive ? statusColor : '#1e293b'}
                  strokeWidth={isSelected ? 2 : 1.5}
                />
                {/* Avatar text */}
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isActive ? '#e2e8f0' : '#64748b'}
                  fontSize="8"
                  fontWeight="700"
                  fontFamily="var(--font-sans)"
                >
                  {emp.avatar}
                </text>
                {/* Status dot */}
                <circle
                  cx={x + 9}
                  cy={y - 9}
                  r={3}
                  fill={statusColor}
                  stroke="var(--bg-card)"
                  strokeWidth="1.5"
                />
                {/* Name label */}
                <text
                  x={x}
                  y={y + 22}
                  textAnchor="middle"
                  fill={isActive ? '#94a3b8' : '#475569'}
                  fontSize="8"
                  fontFamily="var(--font-sans)"
                >
                  {emp.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Agent detail panel */}
        <AnimatePresence>
          {selectedAgent && (
            <AgentDetail emp={selectedAgent} onClose={() => setSelectedAgent(null)} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
