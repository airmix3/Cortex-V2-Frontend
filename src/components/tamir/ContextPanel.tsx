'use client';

import { motion } from 'motion/react';
import { X, Shield, Users, AlertTriangle } from 'lucide-react';
import { allMissions, departmentDetails, escalations } from '@/data/pages-data';

type EntityRef = { type: 'mission' | 'department' | 'escalation'; id: string };

function MissionDetail({ id }: { id: string }) {
  const m = allMissions.find((x) => x.id === id);
  if (!m) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full ${m.owner.color} flex items-center justify-center text-[11px] font-bold text-white`}>
          {m.owner.avatar}
        </div>
        <div>
          <div className="text-[13px] font-bold text-white">{m.title}</div>
          <div className="text-[11px] text-slate-500">{m.owner.name} · {m.department}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="px-2 py-1.5 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="text-[11px] text-slate-500">Priority</div>
          <div className="text-[12px] font-bold text-amber-300 capitalize">{m.priority}</div>
        </div>
        <div className="px-2 py-1.5 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="text-[11px] text-slate-500">Stage</div>
          <div className="text-[12px] font-bold text-sky-300 capitalize">{m.column.replace('-', ' ')}</div>
        </div>
      </div>
      {m.blocker && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-300 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(244,63,94,0.08)' }}>
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>{m.blocker}</span>
        </div>
      )}
      <div className="text-[11px] text-slate-500">{m.ceoAction}</div>
      {m.deliverables.length > 0 && (
        <div>
          <div className="text-[11px] text-slate-400 font-semibold mb-1">Deliverables</div>
          {m.deliverables.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] py-1">
              <span className="text-slate-300 truncate">{d.name}</span>
              <span className="text-[10px] text-slate-500 capitalize">{d.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DepartmentDetail({ id }: { id: string }) {
  const d = departmentDetails.find((x) => x.name === id);
  if (!d) return null;
  const spendNum = parseFloat(d.spend.replace(/[^0-9.]/g, ''));
  const budgetNum = parseFloat(d.budget.replace(/[^0-9.]/g, ''));
  const pct = Math.round((spendNum / budgetNum) * 100);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full ${d.head.color} flex items-center justify-center text-[11px] font-bold text-white`}>
          {d.head.avatar}
        </div>
        <div>
          <div className="text-[13px] font-bold text-white">{d.name}</div>
          <div className="text-[11px] text-slate-500">{d.head.name} · {d.head.role}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: 'Active', v: d.active, c: '#7dd3fc' },
          { l: 'Blocked', v: d.blocked, c: d.blocked > 0 ? '#fda4af' : '#64748b' },
          { l: 'Risk', v: d.risk, c: d.risk === 'High' ? '#fda4af' : d.risk === 'Medium' ? '#fcd34d' : '#6ee7b7' },
        ].map((s) => (
          <div key={s.l} className="text-center px-2 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-sm font-bold" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[10px] text-slate-500">{s.l}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-slate-400">Budget</span>
          <span className="text-slate-300">{d.spend} / {d.budget}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 75 ? '#f59e0b' : '#10b981' }} />
        </div>
      </div>
      <div className="text-[11px] text-slate-500">{d.summary}</div>
    </div>
  );
}

function EscalationDetail({ id }: { id: string }) {
  const e = escalations.find((x) => x.id === id);
  if (!e) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-400" />
        <div className="text-[13px] font-bold text-rose-200">{e.title}</div>
      </div>
      <div className="text-[10px] px-2 py-0.5 rounded font-bold inline-block" style={{ background: 'rgba(244,63,94,0.15)', color: '#fda4af' }}>
        {e.level}
      </div>
      <div className="text-[12px] text-slate-300 leading-relaxed">{e.situation}</div>
      <div className="text-[11px] text-rose-300 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(244,63,94,0.08)' }}>
        <span className="font-semibold">Blocker: </span>{e.blocker}
      </div>
      <div className="text-[11px] text-slate-400">
        <span className="font-semibold text-slate-300">Impact: </span>{e.impactIfIgnored}
      </div>
      <div className="text-[11px] text-amber-300">
        <span className="font-semibold">Need: </span>{e.needFromFounder}
      </div>
    </div>
  );
}

const typeIcons = { mission: Shield, department: Users, escalation: AlertTriangle };
const typeLabels = { mission: 'Mission', department: 'Department', escalation: 'Escalation' };

export default function ContextPanel({
  entity,
  onClose,
}: {
  entity: EntityRef | null;
  onClose: () => void;
}) {
  if (!entity) return null;

  const Icon = typeIcons[entity.type];

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="shrink-0 overflow-hidden"
      style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="w-[280px] h-full flex flex-col" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-sky-400" />
            <span className="text-[12px] font-semibold text-slate-300">{typeLabels[entity.type]} Details</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
          {entity.type === 'mission' && <MissionDetail id={entity.id} />}
          {entity.type === 'department' && <DepartmentDetail id={entity.id} />}
          {entity.type === 'escalation' && <EscalationDetail id={entity.id} />}
        </div>
      </div>
    </motion.div>
  );
}
