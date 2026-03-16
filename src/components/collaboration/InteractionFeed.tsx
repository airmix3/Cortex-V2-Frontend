'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { employees } from '@/data/pages-data';
import type { InteractionEvent, InteractionType } from '@/types';
import { ArrowRight, Filter } from 'lucide-react';

const typeColor: Record<string, { bg: string; text: string; border: string }> = {
  send: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  receive: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
  route: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  escalate: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  handoff: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  feedback: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
};

const allTypes: InteractionType[] = ['send', 'receive', 'route', 'escalate', 'handoff', 'feedback'];

export default function InteractionFeed({
  events,
  selectedAgent,
}: {
  events: InteractionEvent[];
  selectedAgent: string | null;
}) {
  const [activeTypes, setActiveTypes] = useState<Set<InteractionType>>(new Set(allTypes));

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (!activeTypes.has(e.type)) return false;
      if (selectedAgent && e.from !== selectedAgent && e.to !== selectedAgent) return false;
      return true;
    });
  }, [events, activeTypes, selectedAgent]);

  const toggleType = (type: InteractionType) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const empMap = useMemo(() => {
    const map: Record<string, typeof employees[0]> = {};
    employees.forEach(e => { map[e.id] = e; });
    return map;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card-depth rounded-xl border overflow-hidden"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      {/* Header */}
      <div className="px-5 py-3 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <h3 className="text-sm font-semibold text-white">Interaction Feed</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{filtered.length} interactions</p>
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-1.5">
          <Filter size={11} className="text-slate-500 mr-1" />
          {allTypes.map(type => {
            const isActive = activeTypes.has(type);
            const tc = typeColor[type];
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
                  isActive ? `${tc.bg} ${tc.text} ${tc.border}` : 'text-slate-600 border-transparent hover:text-slate-400'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed */}
      <div className="max-h-[400px] overflow-y-auto">
        {filtered.map((event, i) => {
          const from = empMap[event.from];
          const to = empMap[event.to];
          if (!from || !to) return null;
          const tc = typeColor[event.type];

          return (
            <div
              key={event.id}
              className="flex items-center gap-3 px-5 py-2.5 border-b hover:bg-white/[0.02] transition-colors"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {/* Time */}
              <span className="text-[11px] font-mono text-slate-600 w-10 shrink-0">{event.time}</span>

              {/* From → To */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className={`w-6 h-6 rounded-full ${from.color} flex items-center justify-center text-white text-[8px] font-bold`}>
                  {from.avatar}
                </div>
                <ArrowRight size={10} className="text-slate-600" />
                <div className={`w-6 h-6 rounded-full ${to.color} flex items-center justify-center text-white text-[8px] font-bold`}>
                  {to.avatar}
                </div>
              </div>

              {/* Message */}
              <p className="text-xs text-slate-300 flex-1 min-w-0 truncate">{event.message}</p>

              {/* Type badge */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium border shrink-0 ${tc.bg} ${tc.text} ${tc.border}`}>
                {event.type}
              </span>

              {/* Mission badge */}
              {event.mission && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium border shrink-0" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: '#94a3b8' }}>
                  {event.mission.length > 20 ? event.mission.slice(0, 20) + '...' : event.mission}
                </span>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-slate-600">
            No interactions match the current filters
          </div>
        )}
      </div>
    </motion.div>
  );
}
