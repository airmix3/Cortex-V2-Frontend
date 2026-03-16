'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { Send, Mic, AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react';

// ─── MOCK CHAT DATA ───

interface ChatMessage {
  id: number;
  sender: 'tamir' | 'ceo';
  time: string;
  content: string;
  type?: 'brief';
  bullets?: { icon: 'alert' | 'pending' | 'ok'; text: string; detail: string }[];
}

const chatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'tamir',
    type: 'brief',
    time: '07:15',
    content: 'Good morning. Here\'s your brief for today:',
    bullets: [
      { icon: 'alert', text: '2 blockers need your attention', detail: 'AWS GPU capacity + Revenue projection gap' },
      { icon: 'pending', text: '3 items awaiting approval', detail: 'Research hire, GPU cost increase, content plans' },
      { icon: 'ok', text: 'ZUNA deployment on track', detail: 'All 47 tests passed, staging queued' },
      { icon: 'ok', text: 'Marketing Q2 plans submitted', detail: 'Maya sent content_plans.pdf for review' },
    ],
  },
  {
    id: 2,
    sender: 'tamir',
    time: '10:24',
    content: 'The GPU escalation has been packaged as L4 for your review. Alex recommends provisioning in us-west-2 at +$0.12/hr.',
  },
  {
    id: 3,
    sender: 'ceo',
    time: '10:25',
    content: 'What\'s the impact if we delay?',
  },
  {
    id: 4,
    sender: 'tamir',
    time: '10:25',
    content: 'ZUNA deployment blocks for ~48hrs. Dev and Infra teams go idle on GPU-dependent tasks. Alex flagged this as critical path.',
  },
  {
    id: 5,
    sender: 'ceo',
    time: '10:26',
    content: 'And the investor deck status?',
  },
  {
    id: 6,
    sender: 'tamir',
    time: '10:26',
    content: 'Liam\'s deck is blocked on a 15% revenue projection gap between Tech and Ops. I\'ve asked both teams to reconcile by EOD.',
  },
];

const quickActions = [
  { label: 'Brief', emoji: '\uD83D\uDCCB' },
  { label: 'Blockers', emoji: '\uD83D\uDEA7' },
  { label: 'Approvals', emoji: '\u2705' },
  { label: 'Costs', emoji: '\uD83D\uDCB0' },
];

// ─── BULLET ICON MAP ───

const bulletIcons: Record<string, { icon: React.ElementType; color: string }> = {
  alert: { icon: AlertTriangle, color: 'text-amber-400' },
  pending: { icon: Clock, color: 'text-sky-400' },
  ok: { icon: CheckCircle2, color: 'text-emerald-400' },
};

// ─── ANIMATIONS ───

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};
const msgAnim = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

// ─── COMPONENT ───

export default function TamirPanel() {
  const [inputValue, setInputValue] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col h-full panel overflow-hidden"
    >
      {/* Header */}
      <div className="shrink-0 px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">T</div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2" style={{ borderColor: 'var(--bg-panel)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Tamir</span>
            <span className="text-[10px] text-slate-500 font-medium">Chief of Staff</span>
          </div>
          <span className="text-[11px] text-emerald-400/80">Online</span>
        </div>
        <Sparkles className="w-4 h-4 text-amber-400/60" />
      </div>

      {/* Chat Thread */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0"
      >
        {chatMessages.map((msg, idx) => (
          <motion.div key={msg.id} variants={msgAnim}>
            {/* ── BRIEF MESSAGE (special treatment) ── */}
            {msg.type === 'brief' ? (
              <>
                <div
                  className="rounded-xl overflow-hidden border-l-2 border-l-amber-500/60"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}
                >
                  {/* Brief header strip */}
                  <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'rgba(245, 158, 11, 0.06)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Morning Brief</span>
                    <span className="text-[10px] text-slate-600 ml-auto">{msg.time}</span>
                  </div>

                  {/* Brief content */}
                  <div className="px-3 py-2.5">
                    <p className="text-[12px] leading-relaxed text-slate-300 mb-2.5">{msg.content}</p>
                    {msg.bullets && (
                      <div className="space-y-1.5">
                        {msg.bullets.map((bullet, i) => {
                          const { icon: BIcon, color } = bulletIcons[bullet.icon];
                          return (
                            <div key={i} className="flex items-start gap-2 px-2.5 py-2 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                              <BIcon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${color}`} />
                              <div className="min-w-0">
                                <div className="text-[11px] font-medium text-slate-200">{bullet.text}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5">{bullet.detail}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider after brief */}
                <div className="flex items-center gap-2 my-3 px-1">
                  <div className="flex-1 h-px" style={{ background: 'var(--border-medium)' }} />
                  <span className="text-[9px] text-slate-600 uppercase tracking-widest font-medium">Conversation</span>
                  <div className="flex-1 h-px" style={{ background: 'var(--border-medium)' }} />
                </div>
              </>
            ) : (
              /* ── REGULAR MESSAGES ── */
              <div className={`flex flex-col ${msg.sender === 'ceo' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[92%] rounded-xl px-3 py-2.5 ${
                    msg.sender === 'ceo'
                      ? 'bg-sky-600/20 border border-sky-500/20'
                      : ''
                  }`}
                  style={msg.sender === 'tamir' ? { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' } : undefined}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender === 'tamir' && (
                      <span className="text-[10px] font-semibold text-amber-400/80">Tamir</span>
                    )}
                    {msg.sender === 'ceo' && (
                      <span className="text-[10px] font-semibold text-sky-400/80">You</span>
                    )}
                    <span className="text-[10px] text-slate-600">{msg.time}</span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-slate-300">{msg.content}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions + Input */}
      <div className="shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {/* Quick action chips */}
        <div className="flex items-center gap-1.5 mb-2">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium text-slate-400 rounded-md hover:text-slate-200 transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
            >
              <span className="text-[11px]">{action.emoji}</span>
              {action.label}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Tamir..."
            className="flex-1 bg-transparent text-[12px] text-slate-300 placeholder-slate-600 outline-none"
          />
          <button className="p-1 text-slate-500 hover:text-slate-300 transition-colors">
            <Mic className="w-3.5 h-3.5" />
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
          >
            <Send className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
