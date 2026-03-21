'use client';

import { motion } from 'motion/react';
import { FileText, FileCode, FileSpreadsheet, Image, Film, FileType, Eye } from 'lucide-react';
import { FullChatMessage } from '../chat-data';

const fileIcons: Record<string, React.ElementType> = {
  document: FileText, code: FileCode, spreadsheet: FileSpreadsheet,
  image: Image, video: Film, pdf: FileType, presentation: FileText,
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  draft: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
  'in-progress': { bg: 'rgba(56,189,248,0.12)', color: '#7dd3fc' },
  ready: { bg: 'rgba(52,211,153,0.12)', color: '#6ee7b7' },
  approved: { bg: 'rgba(167,139,250,0.15)', color: '#c4b5fd' },
};

export default function DeliverableAttachment({ msg }: { msg: FullChatMessage }) {
  if (!msg.deliverables?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
      <div className="max-w-[85%] flex flex-col gap-2 w-full">
        {msg.deliverables.map((d, i) => {
          const Icon = fileIcons[d.type] || FileText;
          const s = statusStyle[d.status];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.08 }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl group cursor-pointer transition-all hover:brightness-110"
              style={{ background: 'rgba(8,14,32,0.65)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Icon className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="text-[13px] text-slate-200 font-medium truncate flex-1">{d.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: s.bg, color: s.color }}>
                {d.status}
              </span>
              <Eye className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 shrink-0" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
