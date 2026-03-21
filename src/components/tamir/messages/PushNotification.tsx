'use client';

import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { FullChatMessage, urgencyStyle } from '../chat-data';

export default function PushNotification({ msg }: { msg: FullChatMessage }) {
  const style = urgencyStyle[msg.urgency ?? 'info'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-1 items-start"
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-amber-400">Tamir</span>
        <span className="text-[10px] text-slate-600">{msg.time}</span>
      </div>
      <div
        className="max-w-[85%] rounded-2xl px-4 py-3.5 w-full"
        style={{ background: style.bg, border: `1px solid ${style.border}`, boxShadow: `0 0 24px ${style.glow}` }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <motion.span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: style.dot, boxShadow: `0 0 8px ${style.dot}` }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-[10px] font-bold tracking-wide uppercase" style={{ color: style.labelColor }}>
            {style.label}
          </span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{msg.content}</p>
      </div>
    </motion.div>
  );
}
