'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Mission } from '@/types';
import MissionCard from './MissionCard';

const columnConfigs: Record<string, {
  title: string;
  subtitle: string;
  titleColor: string;
  bg: string;
  border: string;
  boxShadow: string;
  topAccent: string;
  opacity: number;
  subtitleColor: string;
}> = {
  'act-now': {
    title: 'Act Now',
    subtitle: 'Your Move — Immediate action required',
    titleColor: '#fbbf24',
    bg: 'rgba(245,158,11,0.04)',
    border: '1.5px solid rgba(245,158,11,0.28)',
    boxShadow: '0 0 24px rgba(245,158,11,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
    topAccent: 'linear-gradient(90deg, rgba(245,158,11,0.0) 0%, rgba(245,158,11,0.90) 40%, rgba(245,158,11,0.90) 60%, rgba(245,158,11,0.0) 100%)',
    opacity: 1,
    subtitleColor: '#92400e',
  },
  'approve-decide': {
    title: 'Approve / Decide',
    subtitle: 'Sign-off required to advance',
    titleColor: '#7dd3fc',
    bg: 'rgba(14,165,233,0.03)',
    border: '1px solid rgba(56,189,248,0.16)',
    boxShadow: '0 0 16px rgba(56,189,248,0.05), inset 0 1px 0 rgba(255,255,255,0.04)',
    topAccent: 'linear-gradient(90deg, rgba(56,189,248,0.0) 0%, rgba(56,189,248,0.60) 50%, rgba(56,189,248,0.0) 100%)',
    opacity: 1,
    subtitleColor: '#1e3a5f',
  },
  review: {
    title: 'Review',
    subtitle: 'Inspect output and deliverables',
    titleColor: '#6ee7b7',
    bg: 'rgba(16,185,129,0.02)',
    border: '1px solid rgba(52,211,153,0.10)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
    topAccent: 'linear-gradient(90deg, rgba(52,211,153,0.0) 0%, rgba(52,211,153,0.35) 50%, rgba(52,211,153,0.0) 100%)',
    opacity: 0.85,
    subtitleColor: '#134e4a',
  },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

export default function MissionColumn({
  columnKey,
  missions,
  onComplete,
}: {
  columnKey: string;
  missions: Mission[];
  onComplete: (id: string) => void;
}) {
  const config = columnConfigs[columnKey];
  if (!config) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      layout
      className="rounded-xl flex flex-col gap-3 h-full overflow-y-auto relative"
      style={{
        background: config.bg,
        backdropFilter: 'blur(18px) saturate(150%) brightness(1.08)',
        WebkitBackdropFilter: 'blur(18px) saturate(150%) brightness(1.08)',
        border: config.border,
        boxShadow: config.boxShadow,
        opacity: config.opacity,
        padding: columnKey === 'act-now' ? '14px' : '12px',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{ background: config.topAccent }}
      />

      {/* Column header */}
      <div className="px-1 pt-1 mb-0.5">
        <h3
          className="text-sm font-bold"
          style={{ color: config.titleColor }}
        >
          {config.title}
        </h3>
        <p className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>{config.subtitle}</p>
      </div>

      <AnimatePresence mode="popLayout">
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            variants={item}
            exit={{ opacity: 0, scale: 0.92, y: -10, filter: 'blur(2px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            layout
          >
            <MissionCard
              mission={mission}
              showIntervene={columnKey === 'act-now'}
              onComplete={() => onComplete(mission.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
