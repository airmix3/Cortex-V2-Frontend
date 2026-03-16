'use client';

import { motion } from 'motion/react';
import { Mission } from '@/types';
import { Zap, ChevronRight } from 'lucide-react';
import DeliverableChip from './DeliverableChip';

const flowStages = ['Created', 'Agent Work', 'Dept Review', 'CEO Review', 'Done'];
const priorityBorder: Record<string, string> = { critical: 'rgba(244,63,94,0.3)', high: 'rgba(245,158,11,0.2)', medium: 'var(--border-subtle)', low: 'var(--border-subtle)' };
const priorityBadge: Record<string, string> = { critical: 'bg-rose-500/20 text-rose-300', high: 'bg-amber-500/20 text-amber-300', medium: 'bg-slate-500/20 text-slate-400', low: 'bg-slate-500/20 text-slate-500' };

export default function MissionCard({ mission, showIntervene }: { mission: Mission; showIntervene?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="card-depth rounded-xl p-4"
      style={{ background: 'var(--bg-card)', border: `1px solid ${priorityBorder[mission.priority]}` }}
    >
      <div className="flex items-start justify-between mb-1.5">
        <h4 className="text-[13px] font-bold text-white leading-tight">{mission.title}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2 ${priorityBadge[mission.priority]}`}>{mission.priority}</span>
      </div>
      <p className="text-[11px] text-slate-500 mb-3">{mission.escalationPath}</p>
      {mission.blocker && (
        <div className="text-[11px] text-rose-400 px-2.5 py-1.5 rounded-lg mb-3" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.15)' }}>
          Blocker: {mission.blocker}{mission.attempts && <span className="ml-2 text-slate-500">&middot; {mission.attempts} retries</span>}
        </div>
      )}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Deliverables</div>
        <div className="flex flex-col gap-1.5">
          {mission.deliverables.map((d, i) => (<DeliverableChip key={i} deliverable={d} />))}
        </div>
      </div>
      <div className="mb-3">
        <div className="flex items-center gap-0.5">
          {flowStages.map((stage, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i < mission.flowStage ? 'w-4 bg-emerald-500' : i === mission.flowStage ? 'w-6 bg-amber-400' : 'w-4 bg-slate-700'}`} title={stage} />
          ))}
        </div>
        <div className="text-[10px] text-slate-500 mt-1">Stage: <span className="text-slate-300">{flowStages[mission.flowStage]}</span></div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {mission.touchTrail.map((person, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <div className={`w-5 h-5 rounded-full ${person.color} flex items-center justify-center text-[9px] font-bold text-white ${i === mission.touchTrail.length - 1 ? 'ring-2 ring-amber-400/60' : 'opacity-60'}`} title={`${person.name} (${person.role})`}>{person.avatar}</div>
              {i < mission.touchTrail.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-slate-600" />}
            </div>
          ))}
          <span className="text-[10px] text-slate-500 ml-2">Owner: <span className="text-slate-300">{mission.owner.name}</span></span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-xs text-amber-300 font-medium">{mission.ceoAction}</span>
      </div>
      {showIntervene && (
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded-lg transition-all intervention-glow">
            <Zap className="w-3.5 h-3.5" />Approve
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            Send Directive
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            More Info
          </motion.button>
        </div>
      )}
      {!showIntervene && mission.column === 'approve-decide' && (
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors">Approve</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>Reject</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>Details</motion.button>
        </div>
      )}
      {!showIntervene && mission.column === 'review' && (
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex-1 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors">Review</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 px-3 py-2 text-xs font-medium text-slate-400 rounded-lg transition-colors hover:text-slate-200" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>Request Changes</motion.button>
        </div>
      )}
    </motion.div>
  );
}
