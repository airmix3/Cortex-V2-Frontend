'use client';

import { motion } from 'motion/react';
import { escalations } from '@/data/pages-data';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { FullChatMessage } from '../chat-data';

const levelColors: Record<string, string> = {
  L1: '#64748b', L2: '#7dd3fc', L3: '#fcd34d', L4: '#fda4af',
};

export default function EscalationAlert({ msg }: { msg: FullChatMessage }) {
  const esc = escalations.find(e => e.id === msg.escalationId);
  if (!esc) return null;

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
        style={{ background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.22)', boxShadow: '0 0 20px rgba(244,63,94,0.06)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span
            className="text-[10px] px-2 py-0.5 rounded font-bold"
            style={{ background: 'rgba(244,63,94,0.15)', color: levelColors[esc.level] }}
          >
            {esc.level}
          </span>
          <h4 className="text-[13px] font-bold text-rose-200">{esc.title}</h4>
        </div>

        <p className="text-[12px] text-slate-300 mb-2 leading-relaxed">{esc.situation}</p>

        <div className="text-[11px] text-rose-300 mb-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(244,63,94,0.08)' }}>
          <span className="font-semibold">Blocker: </span>{esc.blocker}
        </div>

        <div className="text-[11px] text-slate-400 mb-2">
          <span className="font-semibold text-slate-300">Impact if ignored: </span>{esc.impactIfIgnored}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500">{esc.department} · {esc.createdAt}</span>
          <div className="flex items-center gap-1 text-[11px] text-amber-300">
            <span className="font-medium">{esc.needFromFounder.slice(0, 50)}{esc.needFromFounder.length > 50 ? '...' : ''}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
