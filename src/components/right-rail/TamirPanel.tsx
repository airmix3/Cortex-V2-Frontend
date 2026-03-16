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

  // Light navy panel color tokens — same hue family as the dark bg, inverted
  const bg = '#e8edf8';
  const bgCard = '#f4f7fd';
  const bgMuted = '#dde3f0';
  const textPrimary = '#0f172a';
  const textSecondary = '#475569';
  const textMuted = '#94a3b8';
  const divider = 'rgba(15,23,42,0.08)';

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: bg,
        boxShadow: '0 8px 40px rgba(6,10,19,0.5), 0 2px 12px rgba(6,10,19,0.3), 0 0 0 1px rgba(99,130,200,0.2)',
      }}
    >
      {/* Header */}
      <div className="shrink-0 px-4 py-3 flex items-center gap-3" style={{ background: '#f0f4fc', borderBottom: `1px solid rgba(15,23,42,0.1)` }}>
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold text-white" style={{ boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>T</div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: textPrimary }}>Tamir</span>
            <span className="text-[10px] font-medium" style={{ color: textSecondary }}>Chief of Staff</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
            <span className="text-[11px] text-emerald-600 font-medium">Online</span>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-amber-500/60" />
      </div>

      {/* Chat Thread */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0"
        style={{ background: bg }}
      >
        {chatMessages.map((msg) => (
          <motion.div key={msg.id} variants={msgAnim}>
            {/* ── BRIEF MESSAGE ── */}
            {msg.type === 'brief' ? (
              <>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: bgCard,
                    border: '1px solid rgba(245,158,11,0.3)',
                    borderLeft: '3px solid #f59e0b',
                    boxShadow: '0 2px 12px rgba(245,158,11,0.1)',
                  }}
                >
                  {/* Brief header */}
                  <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#fdf6e3', borderBottom: '1px solid rgba(245,158,11,0.15)' }}>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Morning Brief</span>
                    <span className="text-[10px] ml-auto" style={{ color: textMuted }}>{msg.time}</span>
                  </div>
                  {/* Brief content */}
                  <div className="px-3 py-2.5">
                    <p className="text-[12px] leading-relaxed mb-2.5" style={{ color: textSecondary }}>{msg.content}</p>
                    {msg.bullets && (
                      <div className="space-y-1.5">
                        {msg.bullets.map((bullet, i) => {
                          const { icon: BIcon, color } = bulletIcons[bullet.icon];
                          return (
                            <div key={i} className="flex items-start gap-2 px-2.5 py-2 rounded-lg" style={{ background: bgMuted, border: `1px solid ${divider}` }}>
                              <BIcon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${color}`} />
                              <div className="min-w-0">
                                <div className="text-[11px] font-semibold" style={{ color: textPrimary }}>{bullet.text}</div>
                                <div className="text-[10px] mt-0.5" style={{ color: textSecondary }}>{bullet.detail}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 my-3 px-1">
                  <div className="flex-1 h-px" style={{ background: divider }} />
                  <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: textMuted }}>Conversation</span>
                  <div className="flex-1 h-px" style={{ background: divider }} />
                </div>
              </>
            ) : (
              /* ── REGULAR MESSAGES ── */
              <div className={`flex flex-col ${msg.sender === 'ceo' ? 'items-end' : 'items-start'}`}>
                <div
                  className="max-w-[92%] rounded-xl px-3 py-2.5"
                  style={
                    msg.sender === 'tamir'
                      ? { background: bgCard, border: `1px solid ${divider}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
                      : { background: '#dbeafe', border: '1px solid #bfdbfe' }
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender === 'tamir' && (
                      <span className="text-[10px] font-bold text-amber-600">Tamir</span>
                    )}
                    {msg.sender === 'ceo' && (
                      <span className="text-[10px] font-bold text-blue-600">You</span>
                    )}
                    <span className="text-[10px]" style={{ color: textMuted }}>{msg.time}</span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: textPrimary }}>{msg.content}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions + Input */}
      <div className="shrink-0 px-3 pb-3 pt-2" style={{ background: '#f0f4fc', borderTop: `1px solid rgba(15,23,42,0.1)` }}>
        {/* Quick action chips */}
        <div className="flex items-center gap-1.5 mb-2">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors hover:bg-amber-100"
              style={{ background: bgCard, border: `1px solid ${divider}`, color: textSecondary }}
            >
              <span className="text-[11px]">{action.emoji}</span>
              {action.label}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: bgCard, border: '1px solid rgba(245,158,11,0.25)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Tamir..."
            className="flex-1 bg-transparent text-[12px] outline-none"
            style={{ color: textPrimary }}
          />
          <button className="p-1 transition-colors hover:text-amber-500" style={{ color: textMuted }}>
            <Mic className="w-3.5 h-3.5" />
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors"
          >
            <Send className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
