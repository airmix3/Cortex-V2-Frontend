'use client';

import { motion } from 'motion/react';
import { allMissions } from '@/data/pages-data';
import { AlertTriangle, Zap, FileText } from 'lucide-react';
import { FullChatMessage } from '../chat-data';

const priorityBadge: Record<string, { bg: string; color: string }> = {
  critical: { bg: 'rgba(244,63,94,0.18)', color: '#fda4af' },
  high: { bg: 'rgba(245,158,11,0.18)', color: '#fcd34d' },
  medium: { bg: 'rgba(100,116,139,0.18)', color: '#94a3b8' },
  low: { bg: 'rgba(100,116,139,0.18)', color: '#64748b' },
};

const btnBg: Record<string, string> = {
  'act-now': 'rgba(245,158,11,0.85)',
  'approve-decide': 'rgba(16,185,129,0.85)',
  review: 'rgba(14,165,233,0.85)',
};

export default function InlineMissionCard({ msg }: { msg: FullChatMessage }) {
  const mission = allMissions.find(m => m.id === msg.missionId);
  if (!mission) return null;
  const badge = priorityBadge[mission.priority];

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
        style={{ background: 'rgba(8,14,32,0.65)', border: `1px solid ${mission.priority === 'critical' ? 'rgba(244,63,94,0.30)' : 'rgba(255,255,255,0.10)'}`, boxShadow: '0 4px 20px rgba(0,0,0,0.30)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full ${mission.owner.color} flex items-center justify-center text-[10px] font-bold text-white`}>
              {mission.owner.avatar}
            </div>
            <h4 className="text-[13px] font-bold text-white">{mission.title}</h4>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: badge.bg, color: badge.color }}>
            {mission.priority}
          </span>
        </div>

        {mission.blocker && (
          <div className="flex items-center gap-1.5 text-[11px] text-rose-300 mb-2">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            <span className="truncate">{mission.blocker}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-amber-300/80 mb-3">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{mission.ceoAction}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <FileText className="w-3 h-3" />
            <span>{mission.deliverables.length} deliverable{mission.deliverables.length !== 1 ? 's' : ''}</span>
            {mission.age && <span className="text-slate-600">· {mission.age}</span>}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-3 py-1.5 text-[11px] font-bold rounded-lg"
            style={{ background: btnBg[mission.column] ?? 'rgba(56,189,248,0.85)', color: '#0a0f1a' }}
          >
            {mission.primaryCTA}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
