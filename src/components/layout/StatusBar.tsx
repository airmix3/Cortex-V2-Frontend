'use client';

import { motion } from 'motion/react';
import { Activity, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value, className }: { value: number; className: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span className={className}>{display}</span>;
}

const metrics = [
  { label: 'Active Missions', value: 12, color: 'text-sky-400' },
  { label: 'Need Decision', value: 3, color: 'text-amber-400' },
  { label: 'Blocked', value: 2, color: 'text-rose-400' },
  { label: 'Ready to Review', value: 4, color: 'text-emerald-400' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const pill = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } };

export default function StatusBar() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="px-6 py-2 relative z-10">
      <div className="flex items-center gap-2">
        <motion.div variants={pill} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <Activity className="w-4 h-4 text-emerald-400" />
          <div className="flex items-center gap-0.5">
            {[3, 5, 2, 6, 4, 7, 3, 5, 8, 4, 6, 3].map((h, i) => (
              <div key={i} className="w-1 bg-emerald-500/60 rounded-full pulse-bar" style={{ height: `${h * 3}px` }} />
            ))}
          </div>
        </motion.div>
        {metrics.map((m) => (
          <motion.div key={m.label} variants={pill} className="flex items-center gap-2.5 px-4 py-2 rounded-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <span className="text-xs text-slate-400">{m.label}</span>
            <AnimatedNumber value={m.value} className={`text-xl font-bold ${m.color}`} />
          </motion.div>
        ))}
        <motion.div variants={pill} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <span className="text-xs text-slate-400">Spend vs Budget</span>
          <span className="text-sm font-bold text-emerald-400">$18.4K</span>
          <span className="text-xs text-slate-600">/</span>
          <span className="text-sm font-semibold text-slate-400">$25K</span>
        </motion.div>
        <motion.div variants={pill} className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-950/40" style={{ border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-medium text-rose-300">High Risk</span>
          <AnimatedNumber value={2} className="text-xl font-bold text-rose-400" />
        </motion.div>
      </div>
    </motion.div>
  );
}
