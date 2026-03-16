'use client';

import { motion } from 'motion/react';
import { Mic, Send } from 'lucide-react';

export default function ChatBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      className="px-6 py-2.5 relative z-10"
    >
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <div className="flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
          <Mic className="w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Ask Tamir anything..." className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none" readOnly />
          <button className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg"><Mic className="w-4 h-4" /></button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors">
            <Send className="w-3.5 h-3.5" />Send
          </motion.button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        {[
          { label: 'Daily Briefing', icon: '📋' },
          { label: 'Show Blockers', icon: '🚧' },
          { label: 'Approval Queue', icon: '✅' },
          { label: 'Costs', icon: '💰' },
          { label: 'Risks', icon: '⚠️' },
        ].map((pill) => (
          <motion.button key={pill.label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 rounded-lg hover:text-slate-300 transition-colors" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <span>{pill.icon}</span>{pill.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
