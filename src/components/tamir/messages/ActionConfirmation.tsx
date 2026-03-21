'use client';

import { motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { FullChatMessage } from '../chat-data';

export default function ActionConfirmation({ msg }: { msg: FullChatMessage }) {
  if (!msg.actionResult) return null;
  const { label, detail, success } = msg.actionResult;

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
      <div
        className="max-w-[85%] rounded-2xl p-4 w-full"
        style={{
          background: success ? 'rgba(16,185,129,0.06)' : 'rgba(244,63,94,0.06)',
          border: `1px solid ${success ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
          boxShadow: `0 0 20px ${success ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)'}`,
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
          >
            {success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' }} />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400" style={{ filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.5))' }} />
            )}
          </motion.div>
          <h4 className={`text-[13px] font-bold ${success ? 'text-emerald-300' : 'text-rose-300'}`}>{label}</h4>
        </div>
        <p className="text-[12px] text-slate-300 leading-relaxed">{detail}</p>
      </div>
    </motion.div>
  );
}
