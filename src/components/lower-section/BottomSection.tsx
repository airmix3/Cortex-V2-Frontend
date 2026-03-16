'use client';

import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { timelineEvents } from '@/data/mock-data';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.4 } } };
const row = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } };

export default function BottomSection() {
  return (
    <div className="px-4 pb-3 relative z-10">
      <div className="grid grid-cols-1 gap-3">
        {/* Live Timeline table */}
        <motion.div variants={container} initial="hidden" animate="show" className="panel p-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Live Timeline</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>
          </div>
          <div className="space-y-0">
            {timelineEvents.map((event, i) => (
              <motion.div key={i} variants={row} className="flex items-center gap-4 py-1 text-[11px]" style={{ borderBottom: i < timelineEvents.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <span className="text-slate-500 font-mono w-10 shrink-0">{event.time}</span>
                <span className="text-slate-300 font-semibold w-16 shrink-0">{event.actor}</span>
                <span className="text-slate-400 flex-1 truncate">{event.action}</span>
                <span className="text-slate-600 text-[10px] shrink-0">{event.timeAgo}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
