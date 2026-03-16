'use client';

import { motion } from 'motion/react';
import type { Mission } from '@/types';

const priorityColor: Record<string, string> = {
  critical: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
  high: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  medium: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  low: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

export default function MissionFlowCard({ mission, index }: { mission: Mission; index: number }) {
  const trail = mission.touchTrail;
  const nodeSpacing = 100;
  const svgW = Math.max(300, trail.length * nodeSpacing + 60);
  const svgH = 80;
  const startX = 40;
  const midY = svgH / 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="w-[380px] shrink-0 card-depth rounded-xl border overflow-hidden"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <h4 className="text-xs font-semibold text-white truncate">{mission.title}</h4>
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${priorityColor[mission.priority]}`}>
          {mission.priority}
        </span>
      </div>

      {/* Flow SVG */}
      <div className="px-4 py-3 overflow-x-auto">
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          {/* Connection lines */}
          {trail.map((_, i) => {
            if (i === trail.length - 1) return null;
            const x1 = startX + i * nodeSpacing + 14;
            const x2 = startX + (i + 1) * nodeSpacing - 14;
            return (
              <g key={`line-${i}`}>
                <line
                  x1={x1} y1={midY} x2={x2} y2={midY}
                  stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.3"
                  className="connection-line"
                />
                {/* Arrow */}
                <polygon
                  points={`${x2 - 4},${midY - 3} ${x2},${midY} ${x2 - 4},${midY + 3}`}
                  fill="#38bdf8" fillOpacity="0.5"
                />
                {/* Particle */}
                <circle r="2" fill="#38bdf8" opacity="0.8">
                  <animateMotion
                    dur={`${1.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={`M${x1},${midY} L${x2},${midY}`}
                  />
                </circle>
              </g>
            );
          })}

          {/* Agent nodes */}
          {trail.map((person, i) => {
            const x = startX + i * nodeSpacing;
            return (
              <g key={`node-${i}`}>
                <circle cx={x} cy={midY} r={14} fill="var(--bg-elevated)" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />
                <text
                  x={x} y={midY + 1}
                  textAnchor="middle" dominantBaseline="central"
                  fill="#e2e8f0" fontSize="9" fontWeight="700" fontFamily="var(--font-sans)"
                >
                  {person.avatar}
                </text>
                <text
                  x={x} y={midY + 26}
                  textAnchor="middle"
                  fill="#64748b" fontSize="8" fontFamily="var(--font-sans)"
                >
                  {person.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer: deliverables count + flow stage */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <span className="text-[10px] text-slate-500">{mission.deliverables.length} deliverables</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(s => (
            <div
              key={s}
              className="w-5 h-1 rounded-full"
              style={{
                background: s <= mission.flowStage ? '#38bdf8' : 'var(--bg-elevated)',
                opacity: s <= mission.flowStage ? 0.8 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
