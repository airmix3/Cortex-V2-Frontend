'use client';

import { motion } from 'motion/react';
import { LayoutList, AlertTriangle, UserPlus, MessageSquare, AtSign } from 'lucide-react';
import { actionItems } from '@/data/mock-data';
import ActionCard from './ActionCard';

const categories = [
  { key: 'escalation', label: 'Escalations', icon: AlertTriangle, color: 'text-rose-400', borderColor: 'border-l-rose-500' },
  { key: 'hire-request', label: 'Hire Requests', icon: UserPlus, color: 'text-sky-400', borderColor: 'border-l-sky-500' },
  { key: 'consulting', label: 'Consulting Session', icon: MessageSquare, color: 'text-emerald-400', borderColor: 'border-l-emerald-500' },
  { key: 'ceo-mention', label: 'CEO Mentions', icon: AtSign, color: 'text-violet-400', borderColor: 'border-l-violet-500' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.3 } } };
const item = { hidden: { opacity: 0, x: 10 }, show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } };

export default function ActionQueue() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <LayoutList className="w-4 h-4 text-slate-400" />
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Action Queue</h2>
      </div>
      {categories.map((cat) => {
        const items = actionItems.filter((a) => a.category === cat.key);
        if (items.length === 0) return null;
        const Icon = cat.icon;
        return (
          <motion.div key={cat.key} variants={item} className={`mb-3 border-l-2 ${cat.borderColor} pl-3`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
              <span className={`text-[11px] font-semibold ${cat.color}`}>{cat.label}</span>
            </div>
            <div className="space-y-0.5">
              {items.map((actionItem) => (<ActionCard key={actionItem.id} item={actionItem} />))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
