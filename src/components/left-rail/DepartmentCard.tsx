'use client';

import { motion } from 'motion/react';
import { Department } from '@/types';
import { FileText, FileCode, FileSpreadsheet, Image, Film, FileType, ChevronRight, AlertTriangle } from 'lucide-react';

const fileIcons: Record<string, React.ElementType> = { document: FileText, code: FileCode, spreadsheet: FileSpreadsheet, image: Image, video: Film, pdf: FileType };
const healthDot: Record<string, string> = { good: 'bg-emerald-400', warning: 'bg-yellow-400', critical: 'bg-rose-400' };
const healthBorder: Record<string, string> = { good: 'health-good', warning: 'health-warning', critical: 'health-critical' };

export default function DepartmentCard({ dept }: { dept: Department }) {
  const FileIcon = fileIcons[dept.topDeliverable.type] || FileText;
  const activityBars = [3, 5, 2, 7, 4, 6];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`card-depth rounded-xl p-4 ${healthBorder[dept.healthStatus]}`}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-bold text-white">{dept.name}</h3>
          <span className="text-xs text-slate-500">{dept.head.role}</span>
        </div>
        <div className={`w-10 h-10 rounded-full ${dept.head.color} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>{dept.head.avatar}</div>
      </div>
      <div className="flex items-center gap-2 mt-2 mb-2">
        <span className="text-[11px] text-slate-500">Health:</span>
        <span className={`w-2 h-2 rounded-full ${healthDot[dept.healthStatus]}`} />
        {dept.healthStatus !== 'good' && <AlertTriangle className={`w-3 h-3 ${dept.healthStatus === 'warning' ? 'text-yellow-400' : 'text-rose-400'}`} />}
        <span className="text-[11px] text-slate-500 ml-auto">Active:</span>
        <span className="text-[11px] font-semibold text-slate-300">{dept.active}</span>
      </div>
      <div className="flex items-end gap-1 mb-3 h-6">
        {activityBars.map((h, i) => (
          <div key={i} className="flex-1">
            <div className={`w-full rounded-sm pulse-bar ${dept.healthStatus === 'warning' ? 'bg-yellow-500/70' : dept.healthStatus === 'critical' ? 'bg-rose-500/70' : 'bg-emerald-500/70'}`} style={{ height: `${h * 3}px` }} />
          </div>
        ))}
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Blocked:</span>
          <span className={`text-[11px] font-semibold ${dept.blocked > 0 ? 'text-rose-400' : 'text-slate-400'}`}>{dept.blocked}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Spend:</span>
          <span className="text-[11px] font-semibold text-slate-300">{dept.spend} / {dept.budget}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
        <FileIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span className="text-[11px] text-slate-300 truncate flex-1">{dept.topDeliverable.name}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${dept.topDeliverable.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' : dept.topDeliverable.status === 'in-progress' ? 'bg-sky-500/20 text-sky-400' : dept.topDeliverable.status === 'approved' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-500/20 text-slate-400'}`}>{dept.topDeliverable.status}</span>
      </div>
      <div className="flex items-center gap-1 mb-2">
        {dept.reportingChain.map((person, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`w-5 h-5 rounded-full ${person.color} flex items-center justify-center text-[9px] font-bold text-white ${i === dept.reportingChain.length - 1 ? 'ring-2 ring-amber-400/60' : ''}`} title={`${person.name} (${person.role})`}>{person.avatar}</div>
            {i < dept.reportingChain.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600" />}
          </div>
        ))}
      </div>
      <div className="space-y-1 mt-2 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Top:</span>
          <span className="text-[11px] text-slate-300">{dept.topMission}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Next:</span>
          <span className="text-[11px] text-slate-300">{dept.nextTouchpoint}</span>
        </div>
      </div>
    </motion.div>
  );
}
