'use client';

import { motion } from 'motion/react';
import { ActionItem } from '@/types';
import { Zap } from 'lucide-react';

const urgencyDot: Record<string, string> = { urgent: 'bg-rose-400', pending: 'bg-amber-400', scheduled: 'bg-sky-400' };

export default function ActionCard({ item }: { item: ActionItem }) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors group"
      style={{ background: 'var(--bg-card)' }}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${urgencyDot[item.urgency]}`} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-slate-200 truncate">{item.title}</div>
        <div className="text-[11px] text-slate-500 truncate">
          {item.subtitle}{item.timeAgo && <span className="ml-2 text-slate-600">{item.timeAgo}</span>}
        </div>
      </div>
      {item.urgency === 'urgent' && (
        <button className="opacity-0 group-hover:opacity-100 p-1 rounded text-amber-400 transition-all" style={{ background: 'rgba(245,158,11,0.15)' }} title="Send Directive">
          <Zap className="w-3 h-3" />
        </button>
      )}
      <div className="flex items-end gap-0.5 shrink-0">
        {[2, 4, 3, 5].map((h, i) => (
          <div key={i} className={`w-0.5 rounded-full pulse-bar ${item.urgency === 'urgent' ? 'bg-rose-500/60' : item.urgency === 'pending' ? 'bg-amber-500/60' : 'bg-sky-500/60'}`} style={{ height: `${h * 3}px` }} />
        ))}
      </div>
    </motion.div>
  );
}
