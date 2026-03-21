'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronDown, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { FullChatMessage } from '../chat-data';

const bulletIcons = {
  alert: AlertTriangle,
  pending: Clock,
  ok: CheckCircle2,
};
const bulletColors = {
  alert: 'text-rose-400',
  pending: 'text-amber-400',
  ok: 'text-emerald-400',
};

export default function MorningBrief({ msg }: { msg: FullChatMessage }) {
  const [expanded, setExpanded] = useState(true);

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
      <div
        className="max-w-[85%] rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
          style={{ borderBottom: expanded ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-sm font-semibold text-slate-200 flex-1">{msg.content}</span>
          <ChevronDown
            className="w-4 h-4 text-slate-500 transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        <AnimatePresence>
          {expanded && msg.bullets && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 py-3 space-y-3">
                {msg.bullets.map((b, i) => {
                  const Icon = bulletIcons[b.icon];
                  return (
                    <div key={i} className="flex items-start gap-2.5">
                      <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${bulletColors[b.icon]}`} />
                      <div>
                        <div className="text-sm text-slate-200">{b.text}</div>
                        <div className="text-[12px] text-slate-500 mt-0.5">{b.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
