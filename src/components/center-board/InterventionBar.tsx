'use client';

import { motion } from 'motion/react';
import { Zap, Shield } from 'lucide-react';

export default function InterventionBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-4 py-2.5 rounded-xl intervention-glow directive-shimmer glass-shimmer mb-3"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(245,158,11,0.04), rgba(245,158,11,0.10))',
        border: '1px solid rgba(245,158,11,0.25)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 24px rgba(245,158,11,0.08)',
        backdropFilter: 'blur(18px) saturate(150%) brightness(1.08)',
        WebkitBackdropFilter: 'blur(18px) saturate(150%) brightness(1.08)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(245,158,11,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <Zap className="w-5 h-5 text-amber-400" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-amber-300">CEO Directive</div>
          <div className="text-[11px] text-amber-500/70 truncate">Guide, redirect, or prioritize missions through Tamir</div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-1.5 px-3.5 py-1.5 text-black text-xs font-bold rounded-lg directive-btn flex-shrink-0"
        style={{
          background: 'rgba(245,158,11,0.90)',
          border: '1px solid rgba(245,158,11,0.50)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 12px rgba(245,158,11,0.30)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Shield className="w-3.5 h-3.5" />
        Send Directive
      </motion.button>
    </motion.div>
  );
}
