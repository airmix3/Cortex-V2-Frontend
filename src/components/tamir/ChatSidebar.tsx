'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ChevronLeft, ChevronRight, MessageSquare, Shield, FileText, AlertTriangle } from 'lucide-react';
import { ChatThread } from './chat-data';

const monitoringStates = [
  'Scanning 9 missions…',
  'Checking escalation queue…',
  'Reviewing vault updates…',
  'Monitoring department health…',
  'Analyzing blockers…',
];

function groupThreads(threads: ChatThread[]) {
  const now = Date.now();
  const today: ChatThread[] = [];
  const yesterday: ChatThread[] = [];
  const week: ChatThread[] = [];

  threads.forEach((t) => {
    const age = now - t.timestamp.getTime();
    if (age < 86400000) today.push(t);
    else if (age < 172800000) yesterday.push(t);
    else week.push(t);
  });

  return { today, yesterday, week };
}

export default function ChatSidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onNewThread,
  collapsed,
  onToggleCollapse,
}: {
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const [monitorIdx, setMonitorIdx] = useState(0);
  const groups = groupThreads(threads);

  useEffect(() => {
    const iv = setInterval(() => setMonitorIdx((i) => (i + 1) % monitoringStates.length), 3000);
    return () => clearInterval(iv);
  }, []);

  if (collapsed) {
    return (
      <motion.div
        initial={{ width: 260 }}
        animate={{ width: 48 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center py-3 gap-3 shrink-0"
        style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button onClick={onToggleCollapse} className="p-2 text-slate-500 hover:text-slate-300 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={onNewThread} className="p-2 text-amber-400 hover:text-amber-300 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
        {threads.slice(0, 5).map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectThread(t.id)}
            className={`p-2 rounded-lg transition-colors ${t.id === activeThreadId ? 'text-white bg-white/5' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        ))}
      </motion.div>
    );
  }

  const renderGroup = (label: string, items: ChatThread[]) => {
    if (items.length === 0) return null;
    return (
      <div key={label}>
        <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1.5">{label}</div>
        {items.map((t) => {
          const active = t.id === activeThreadId;
          return (
            <button
              key={t.id}
              onClick={() => onSelectThread(t.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all mb-0.5 ${
                active ? 'bg-white/5' : 'hover:bg-white/3'
              }`}
              style={active ? { borderLeft: '2px solid rgba(56,189,248,0.7)' } : { borderLeft: '2px solid transparent' }}
            >
              <div className={`text-[13px] font-medium truncate ${active ? 'text-white' : 'text-slate-300'}`}>{t.title}</div>
              <div className="text-[11px] text-slate-600 truncate mt-0.5">{t.preview}</div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ width: 48 }}
      animate={{ width: 260 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col shrink-0 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNewThread}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold text-amber-300 transition-all"
          style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.20)' }}
        >
          <Plus className="w-4 h-4" /> New Conversation
        </motion.button>
        <button onClick={onToggleCollapse} className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto px-1.5 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
        {renderGroup('Today', groups.today)}
        {renderGroup('Yesterday', groups.yesterday)}
        {renderGroup('This Week', groups.week)}
      </div>

      {/* Context awareness */}
      <div className="px-3 py-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex items-center gap-3 mb-2">
            {[
              { icon: Shield, count: 9, color: '#7dd3fc', label: 'Missions' },
              { icon: AlertTriangle, count: 4, color: '#fda4af', label: 'Escalations' },
              { icon: FileText, count: 12, color: '#c4b5fd', label: 'Vault' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1" title={item.label}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 4px ${item.color}` }} />
                <span className="text-[11px] font-semibold" style={{ color: item.color }}>{item.count}</span>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={monitorIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] text-slate-600"
            >
              {monitoringStates[monitorIdx]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
