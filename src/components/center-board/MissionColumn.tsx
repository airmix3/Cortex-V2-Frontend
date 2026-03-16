'use client';

import { motion } from 'motion/react';
import { Mission } from '@/types';
import MissionCard from './MissionCard';

const columnConfigs: Record<string, { title: string; subtitle: string; color: string }> = {
  'act-now': { title: 'Act Now', subtitle: 'Your Move — Immediate action required', color: 'text-amber-400' },
  'approve-decide': { title: 'Approve / Decide', subtitle: 'Sign-off required to advance', color: 'text-sky-400' },
  review: { title: 'Review', subtitle: 'Inspect output and deliverables', color: 'text-emerald-400' },
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } } };

export default function MissionColumn({ columnKey, missions }: { columnKey: string; missions: Mission[] }) {
  const config = columnConfigs[columnKey];
  if (!config) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="rounded-xl p-3 flex flex-col gap-3"
      style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="px-1 mb-0.5">
        <h3 className={`text-sm font-bold ${config.color}`}>{config.title}</h3>
        <p className="text-[11px] text-slate-500">{config.subtitle}</p>
      </div>
      {missions.map((mission) => (
        <motion.div key={mission.id} variants={item}>
          <MissionCard mission={mission} showIntervene={columnKey === 'act-now'} />
        </motion.div>
      ))}
    </motion.div>
  );
}
