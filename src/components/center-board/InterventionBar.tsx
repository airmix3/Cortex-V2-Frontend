'use client';

import { motion } from 'motion/react';
import { Zap, Shield } from 'lucide-react';

export default function InterventionBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
      className="flex items-center justify-between px-4 py-2.5 rounded-xl intervention-glow directive-shimmer mb-3"
      style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03), rgba(245,158,11,0.08))', border: '1px solid rgba(245,158,11,0.2)' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(245,158,11,0.15)' }}>
          <Zap className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-amber-300">CEO Directive</div>
          <div className="text-[11px] text-amber-500/70">Guide, redirect, or prioritize any active mission through Tamir</div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold rounded-lg directive-btn"
      >
        <Shield className="w-3.5 h-3.5" />
        Send Directive
      </motion.button>
    </motion.div>
  );
}
