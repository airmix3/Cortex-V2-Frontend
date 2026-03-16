'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { employees } from '@/data/pages-data';
import type { InteractionEvent } from '@/types';

const typeColor: Record<string, string> = {
  send: '#10b981',
  receive: '#38bdf8',
  route: '#f59e0b',
  escalate: '#f43f5e',
  handoff: '#eab308',
  feedback: '#a855f7',
};

const deptColor: Record<string, string> = {
  Executive: '#f59e0b',
  Tech: '#3b82f6',
  Marketing: '#a855f7',
  Operations: '#10b981',
};

export default function SwimLaneTimeline({
  events,
  selectedAgent,
}: {
  events: InteractionEvent[];
  selectedAgent: string | null;
}) {
  // Filter & limit to relevant events
  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedAgent) {
      filtered = events.filter(e => e.from === selectedAgent || e.to === selectedAgent);
    }
    return filtered.slice(0, 25);
  }, [events, selectedAgent]);

  // Get unique agents involved
  const involvedIds = useMemo(() => {
    const ids = new Set<string>();
    filteredEvents.forEach(e => { ids.add(e.from); ids.add(e.to); });
    // Keep order from employees
    return employees.filter(emp => ids.has(emp.id)).map(e => e.id);
  }, [filteredEvents]);

  const laneCount = involvedIds.length;
  if (laneCount === 0) return null;

  const LANE_W = 80;
  const HEADER_H = 40;
  const ROW_H = 36;
  const LEFT_PAD = 60;
  const svgW = LEFT_PAD + laneCount * LANE_W + 20;
  const svgH = HEADER_H + filteredEvents.length * ROW_H + 20;

  const laneX = (id: string) => {
    const idx = involvedIds.indexOf(id);
    return LEFT_PAD + idx * LANE_W + LANE_W / 2;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card-depth rounded-xl border overflow-hidden"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold text-white">Communication Swim Lanes</h3>
        <p className="text-[11px] text-slate-500 mt-0.5">Chronological message flow between agents</p>
      </div>

      <div className="overflow-x-auto p-4">
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          {/* Lane headers */}
          {involvedIds.map((id, i) => {
            const emp = employees.find(e => e.id === id);
            if (!emp) return null;
            const x = laneX(id);
            return (
              <g key={`header-${id}`}>
                {/* Lane line */}
                <line
                  x1={x} y1={HEADER_H} x2={x} y2={svgH}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                />
                {/* Header circle */}
                <circle
                  cx={x} cy={18} r={12}
                  fill="var(--bg-elevated)"
                  stroke={deptColor[emp.department] || '#64748b'}
                  strokeWidth="1.5" strokeOpacity="0.5"
                />
                <text
                  x={x} y={19} textAnchor="middle" dominantBaseline="central"
                  fill="#e2e8f0" fontSize="8" fontWeight="700" fontFamily="var(--font-sans)"
                >
                  {emp.avatar}
                </text>
                <text
                  x={x} y={36} textAnchor="middle"
                  fill="#64748b" fontSize="7" fontFamily="var(--font-sans)"
                >
                  {emp.name}
                </text>
              </g>
            );
          })}

          {/* Event arrows */}
          {filteredEvents.map((event, i) => {
            const y = HEADER_H + i * ROW_H + ROW_H / 2 + 10;
            const fromX = laneX(event.from);
            const toX = laneX(event.to);
            if (!fromX || !toX) return null;

            const color = typeColor[event.type] || '#64748b';
            const isLeft = toX < fromX;
            const arrowDir = isLeft ? -1 : 1;

            return (
              <g key={event.id}>
                {/* Time label */}
                <text
                  x={8} y={y + 1}
                  fill="#475569" fontSize="8" fontFamily="var(--font-mono)"
                >
                  {event.time}
                </text>

                {/* Row background on hover */}
                <rect
                  x={LEFT_PAD - 5} y={y - ROW_H / 2 + 2}
                  width={svgW - LEFT_PAD} height={ROW_H - 4}
                  fill="transparent" rx="4"
                  className="hover:fill-white/[0.02] transition-colors"
                />

                {/* Arrow line */}
                <line
                  x1={fromX} y1={y} x2={toX} y2={y}
                  stroke={color} strokeWidth="1.5" strokeOpacity="0.6"
                />

                {/* Arrowhead */}
                <polygon
                  points={`${toX - arrowDir * 5},${y - 3} ${toX},${y} ${toX - arrowDir * 5},${y + 3}`}
                  fill={color} fillOpacity="0.7"
                />

                {/* Dot at origin */}
                <circle cx={fromX} cy={y} r={3} fill={color} fillOpacity="0.8" />

                {/* Label */}
                <text
                  x={(fromX + toX) / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill="#64748b" fontSize="7" fontFamily="var(--font-sans)"
                >
                  {event.message.length > 35 ? event.message.slice(0, 35) + '...' : event.message}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}
