'use client';

import { motion } from 'motion/react';
import { departmentDetails } from '@/data/pages-data';
import { Users, AlertTriangle } from 'lucide-react';
import { FullChatMessage } from '../chat-data';

const healthColors: Record<string, { dot: string; label: string; labelColor: string }> = {
  good: { dot: '#10b981', label: 'Healthy', labelColor: '#6ee7b7' },
  warning: { dot: '#f59e0b', label: 'Warning', labelColor: '#fcd34d' },
  critical: { dot: '#f43f5e', label: 'Critical', labelColor: '#fda4af' },
};

export default function DepartmentSummary({ msg }: { msg: FullChatMessage }) {
  const dept = departmentDetails.find(d => d.name === msg.departmentId);
  if (!dept) return null;
  const health = healthColors[dept.healthStatus];
  const spendNum = parseFloat(dept.spend.replace(/[^0-9.]/g, ''));
  const budgetNum = parseFloat(dept.budget.replace(/[^0-9.]/g, ''));
  const spendPct = Math.round((spendNum / budgetNum) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-1 items-start"
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-amber-400">Tamir</span>
        <span className="text-[10px] text-slate-600">{msg.time}</span>
      </div>
      {msg.content && (
        <div
          className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed mb-1"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#e2e8f0' }}
        >
          {msg.content}
        </div>
      )}
      <div
        className="max-w-[85%] rounded-2xl p-4 w-full"
        style={{ background: 'rgba(8,14,32,0.65)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full ${dept.head.color} flex items-center justify-center text-[11px] font-bold text-white`}>
              {dept.head.avatar}
            </div>
            <div>
              <div className="text-[13px] font-bold text-white">{dept.name}</div>
              <div className="text-[11px] text-slate-500">{dept.head.name} · {dept.head.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: health.dot, boxShadow: `0 0 6px ${health.dot}` }} />
            <span className="text-[11px] font-semibold" style={{ color: health.labelColor }}>{health.label}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: 'Active', value: String(dept.active), color: '#7dd3fc' },
            { label: 'Blocked', value: String(dept.blocked), color: dept.blocked > 0 ? '#fda4af' : '#64748b' },
            { label: 'Risk', value: dept.risk, color: dept.risk === 'Medium' ? '#fcd34d' : dept.risk === 'High' ? '#fda4af' : '#6ee7b7' },
          ].map((s) => (
            <div key={s.label} className="text-center px-2 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Budget bar */}
        <div className="mb-2">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">Budget</span>
            <span className="text-slate-300">{dept.spend} / {dept.budget}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${spendPct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: spendPct > 75 ? '#f59e0b' : '#10b981' }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-500">{dept.summary}</div>
      </div>
    </motion.div>
  );
}
