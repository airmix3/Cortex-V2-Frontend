'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { employees } from '@/data/pages-data';
import { collaborationEdges } from '@/data/collaboration-data';
import type { CollaborationEdge } from '@/types';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const W = 900;
const H = 560;
const CX = W / 2;
const CY = H / 2 + 10;
const RX = 340;
const RY = 210;

/* ── Department colors ── */
const deptColor: Record<string, string> = {
  Executive: '#f59e0b',
  Tech: '#3b82f6',
  Marketing: '#a855f7',
  Operations: '#10b981',
};

/* ── Interaction type colors ── */
const typeColor: Record<string, string> = {
  send: '#10b981',
  receive: '#38bdf8',
  route: '#f59e0b',
  escalate: '#f43f5e',
  handoff: '#eab308',
  feedback: '#a855f7',
};

/* ── Position agents on ellipse grouped by department ── */
function getNodePositions() {
  const deptOrder = ['Executive', 'Tech', 'Marketing', 'Operations'];
  const grouped: Record<string, typeof employees> = {};
  employees.forEach(e => {
    if (!grouped[e.department]) grouped[e.department] = [];
    grouped[e.department].push(e);
  });

  // Assign angle ranges per department
  const ranges: Record<string, [number, number]> = {
    Executive: [-0.4, 0.1],
    Tech: [0.15, 1.55],
    Marketing: [1.7, 2.6],
    Operations: [2.75, 3.5],
  };

  const positions: Record<string, { x: number; y: number; dept: string }> = {};

  deptOrder.forEach(dept => {
    const agents = grouped[dept] || [];
    const [start, end] = ranges[dept];
    agents.forEach((emp, i) => {
      const t = agents.length === 1 ? (start + end) / 2 : start + (i / (agents.length - 1)) * (end - start);
      positions[emp.id] = {
        x: CX + Math.cos(t) * RX,
        y: CY + Math.sin(t) * RY,
        dept,
      };
    });
  });

  return positions;
}

/* ── Quadratic bezier control point ── */
function getControlPoint(x1: number, y1: number, x2: number, y2: number, offset = 0.3) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Pull toward center
  const cx = mx + (CX - mx) * offset;
  const cy = my + (CY - my) * offset;
  return { cx, cy };
}

/* ── Get dominant interaction type for an edge ── */
function getDominantType(edge: CollaborationEdge): string {
  let max = 0;
  let dominant = 'send';
  Object.entries(edge.types).forEach(([t, c]) => {
    if (c > max) { max = c; dominant = t; }
  });
  return dominant;
}

/* ── Edge detail panel ── */
function EdgePanel({ edge, onClose }: { edge: CollaborationEdge; onClose: () => void }) {
  const fromEmp = employees.find(e => e.id === edge.from);
  const toEmp = employees.find(e => e.id === edge.to);
  if (!fromEmp || !toEmp) return null;

  const totalTypes = Object.entries(edge.types).filter(([, c]) => c > 0);
  const maxCount = Math.max(...totalTypes.map(([, c]) => c));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="absolute right-4 top-4 w-80 card-depth rounded-xl border z-30"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-medium)' }}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${fromEmp.color} flex items-center justify-center text-white text-xs font-bold`}>
              {fromEmp.avatar}
            </div>
            <ArrowRight size={14} className="text-slate-500" />
            <div className={`w-8 h-8 rounded-full ${toEmp.color} flex items-center justify-center text-white text-xs font-bold`}>
              {toEmp.avatar}
            </div>
            <div className="ml-1">
              <p className="text-sm font-semibold text-white">{fromEmp.name} & {toEmp.name}</p>
              <p className="text-[10px] text-slate-500">{edge.count} interactions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-white/5 cursor-pointer">
            <X size={14} />
          </button>
        </div>

        {/* Type breakdown */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Interaction Breakdown</p>
          {totalTypes.map(([type, count]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-14 capitalize">{type}</span>
              <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-base)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(count / maxCount) * 100}%`, background: typeColor[type] || '#64748b' }}
                />
              </div>
              <span className="text-[10px] text-slate-500 w-4 text-right">{count}</span>
            </div>
          ))}
        </div>

        {/* Related missions */}
        {edge.missions.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1.5">Related Missions</p>
            <div className="flex flex-wrap gap-1.5">
              {edge.missions.map(m => (
                <span key={m} className="px-2 py-0.5 rounded text-[10px] font-medium border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: '#94a3b8' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Profile links */}
        <div className="flex gap-2 pt-1">
          <Link href={`/agents/${fromEmp.id}`} className="flex-1 text-center px-2 py-1.5 rounded-lg text-[11px] font-medium text-sky-300 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-colors">
            {fromEmp.name} Profile
          </Link>
          <Link href={`/agents/${toEmp.id}`} className="flex-1 text-center px-2 py-1.5 rounded-lg text-[11px] font-medium text-sky-300 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-colors">
            {toEmp.name} Profile
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Component ── */
export default function InteractionConstellation({
  selectedAgent,
  onSelectAgent,
}: {
  selectedAgent: string | null;
  onSelectAgent: (id: string | null) => void;
}) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<CollaborationEdge | null>(null);
  const positions = useMemo(() => getNodePositions(), []);

  const activeHighlight = hoveredNode || selectedAgent;

  // Department label positions
  const deptLabels = [
    { label: 'Executive', x: CX + Math.cos(-0.15) * (RX + 45), y: CY + Math.sin(-0.15) * (RY + 35) },
    { label: 'Tech', x: CX + Math.cos(0.85) * (RX + 45), y: CY + Math.sin(0.85) * (RY + 35) },
    { label: 'Marketing', x: CX + Math.cos(2.15) * (RX + 45), y: CY + Math.sin(2.15) * (RY + 35) },
    { label: 'Operations', x: CX + Math.cos(3.1) * (RX + 45), y: CY + Math.sin(3.1) * (RY + 35) },
  ];

  return (
    <div className="card-depth rounded-xl border relative overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
      {/* Scanline */}
      <div className="terminal-scanline" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 node-pulse-ring" />
          </div>
          <h3 className="text-sm font-semibold text-white">Interaction Constellation</h3>
          <span className="text-[11px] text-slate-500">{collaborationEdges.length} active channels</span>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px]">
          {Object.entries(typeColor).slice(0, 4).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-3 h-0.5 rounded-full" style={{ background: color }} />
              <span className="text-slate-500 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG */}
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '500px' }}>
          <defs>
            <pattern id="collab-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
            </pattern>
            {/* Glow filters per department */}
            {Object.entries(deptColor).map(([dept, color]) => (
              <filter key={dept} id={`collab-glow-${dept}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feFlood floodColor={color} floodOpacity="0.25" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>
          <rect width={W} height={H} fill="url(#collab-grid)" />

          {/* Edges */}
          <g>
            {collaborationEdges.map((edge, i) => {
              const fromPos = positions[edge.from];
              const toPos = positions[edge.to];
              if (!fromPos || !toPos) return null;

              const { cx, cy } = getControlPoint(fromPos.x, fromPos.y, toPos.x, toPos.y, 0.35);
              const path = `M ${fromPos.x} ${fromPos.y} Q ${cx} ${cy} ${toPos.x} ${toPos.y}`;

              const dominant = getDominantType(edge);
              const color = typeColor[dominant] || '#64748b';
              const strokeW = Math.min(1 + edge.count * 0.5, 4);

              const isHighlighted = !activeHighlight ||
                activeHighlight === edge.from || activeHighlight === edge.to;
              const isSelected = selectedEdge?.from === edge.from && selectedEdge?.to === edge.to;

              return (
                <g key={`edge-${i}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={isSelected ? strokeW + 1 : strokeW}
                    strokeOpacity={isHighlighted ? (isSelected ? 0.8 : 0.4) : 0.06}
                    strokeLinecap="round"
                    className="collab-edge cursor-pointer transition-opacity duration-300"
                    onClick={() => setSelectedEdge(isSelected ? null : edge)}
                  />
                  {/* Animated particle */}
                  {isHighlighted && (
                    <circle r="2.5" fill={color} opacity="0.9">
                      <animateMotion
                        dur={`${2.5 + (i % 3)}s`}
                        repeatCount="indefinite"
                        path={path}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* Department labels */}
          {deptLabels.map(({ label, x, y }) => (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={deptColor[label]}
              fontSize="10"
              fontWeight="600"
              fontFamily="var(--font-sans)"
              opacity="0.5"
            >
              {label}
            </text>
          ))}

          {/* Agent nodes */}
          {employees.map(emp => {
            const pos = positions[emp.id];
            if (!pos) return null;

            const isHighlighted = !activeHighlight || activeHighlight === emp.id ||
              collaborationEdges.some(e =>
                (e.from === activeHighlight || e.to === activeHighlight) &&
                (e.from === emp.id || e.to === emp.id)
              );
            const isActive = emp.status === 'active' || emp.status === 'busy';
            const color = deptColor[emp.department] || '#64748b';
            const isSelected = selectedAgent === emp.id;

            return (
              <g
                key={emp.id}
                className="cursor-pointer"
                onClick={() => onSelectAgent(isSelected ? null : emp.id)}
                onMouseEnter={() => setHoveredNode(emp.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                {/* Pulse ring */}
                {isActive && isHighlighted && (
                  <circle cx={pos.x} cy={pos.y} r={18} fill="none" stroke={color} strokeWidth="1" className="node-pulse-ring" />
                )}
                {/* Selection ring */}
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r={22} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                )}
                {/* Glow */}
                <circle cx={pos.x} cy={pos.y} r={20} fill={`${color}15`} opacity={isHighlighted ? 1 : 0.2} className="network-node" />
                {/* Node */}
                <circle
                  cx={pos.x} cy={pos.y} r={15}
                  fill="var(--bg-card)"
                  stroke={isSelected ? '#38bdf8' : color}
                  strokeWidth={isSelected ? 2 : 1.5}
                  strokeOpacity={isHighlighted ? 0.8 : 0.15}
                />
                {/* Avatar */}
                <text
                  x={pos.x} y={pos.y + 1}
                  textAnchor="middle" dominantBaseline="central"
                  fill={isHighlighted ? '#e2e8f0' : '#475569'}
                  fontSize="9" fontWeight="700" fontFamily="var(--font-sans)"
                >
                  {emp.avatar}
                </text>
                {/* Name */}
                <text
                  x={pos.x} y={pos.y + 28}
                  textAnchor="middle"
                  fill={isHighlighted ? '#94a3b8' : '#334155'}
                  fontSize="9" fontFamily="var(--font-sans)"
                >
                  {emp.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Edge detail panel */}
        <AnimatePresence>
          {selectedEdge && (
            <EdgePanel edge={selectedEdge} onClose={() => setSelectedEdge(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
