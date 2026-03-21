'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Send, Mic, AlertTriangle, CheckCircle2, Clock, Sparkles, Zap, ChevronDown, Bell } from 'lucide-react';

// ─── TYPES ───

type PushUrgency = 'critical' | 'warn' | 'info' | 'update';

interface ChatMessage {
  id: number;
  sender: 'tamir' | 'ceo';
  time: string;
  content: string;
  type?: 'brief' | 'push';
  urgency?: PushUrgency;
  bullets?: { icon: 'alert' | 'pending' | 'ok'; text: string; detail: string }[];
}

// ─── INITIAL CONVERSATION ───

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'tamir',
    type: 'brief',
    time: '07:15',
    content: "Good morning. Here's today's context:",
    bullets: [
      { icon: 'ok',      text: 'ZUNA — 47 tests passed, staging queued',  detail: 'Blocked only on GPU approval' },
      { icon: 'pending', text: 'Research hire — candidate brief ready',    detail: 'Compensation model attached' },
      { icon: 'ok',      text: 'Marketing Q2 plans submitted',             detail: 'Maya sent content_plans.pdf' },
    ],
  },
  {
    id: 2,
    sender: 'tamir',
    time: '10:24',
    content: "GPU escalation packaged as L4. Alex recommends g4m.xlarge in us-west-2 at +$0.12/hr — within budget. I've verified with Finance.",
  },
  {
    id: 3,
    sender: 'ceo',
    time: '10:25',
    content: "What's the impact if we delay?",
  },
  {
    id: 4,
    sender: 'tamir',
    time: '10:25',
    content: 'ZUNA blocks for ~48hrs. Dev and Infra go idle on GPU-dependent tasks. Alex flagged as critical path — every hour of delay costs ~$800 in idle agent time.',
  },
  {
    id: 5,
    sender: 'ceo',
    time: '10:26',
    content: 'And the investor deck?',
  },
  {
    id: 6,
    sender: 'tamir',
    time: '10:26',
    content: "Liam's deck is blocked on a 15% revenue projection gap. I've asked Tech and Ops to reconcile by EOD — will update you.",
  },
];

// ─── PUSH MESSAGE QUEUE ───
// Each message: delay (when it arrives), typingDelay (when "typing" indicator starts, 2s before)

interface PushEntry {
  message: ChatMessage;
  delay: number;       // ms from session start when message appears
  typingAt: number;   // ms from session start when typing indicator shows
}

const pushQueue: PushEntry[] = [
  {
    message: {
      id: 101,
      sender: 'tamir',
      type: 'push',
      urgency: 'critical',
      time: '10:34',
      content: "Dev team blocked 3h 12m — $2,400 in idle time so far. This is your most urgent action. Recommend approving the GPU before the 11am standup.",
    },
    delay: 10000,
    typingAt: 8000,
  },
  {
    message: {
      id: 102,
      sender: 'tamir',
      type: 'push',
      urgency: 'warn',
      time: '10:38',
      content: "Liam just pinged me. He needs your investor deck feedback before his 11am call — that's in 20 minutes. Should I push his deadline to EOD and buy you more time?",
    },
    delay: 25000,
    typingAt: 23000,
  },
  {
    message: {
      id: 103,
      sender: 'tamir',
      type: 'push',
      urgency: 'info',
      time: '10:42',
      content: "The Research Analyst hire has been pending 1 day. Candidate brief expires tonight — the recruiter needs a decision by EOD or the slot reopens. Approve or decline?",
    },
    delay: 45000,
    typingAt: 43000,
  },
  {
    message: {
      id: 104,
      sender: 'tamir',
      type: 'push',
      urgency: 'update',
      time: '10:47',
      content: "Quick update: I've asked Alex to prep a 2-minute GPU brief in case you want a fast sync before approving. Also — Infra agent has been reallocated to non-GPU tasks to reduce idle cost.",
    },
    delay: 70000,
    typingAt: 68000,
  },
];

// ─── URGENCY STYLE MAP ───

const urgencyStyle: Record<PushUrgency, { bg: string; border: string; glow: string; dot: string; label: string; labelColor: string }> = {
  critical: {
    bg: 'rgba(244,63,94,0.07)',
    border: '1px solid rgba(244,63,94,0.25)',
    glow: '0 0 16px rgba(244,63,94,0.07)',
    dot: '#f43f5e',
    label: 'Tamir · Urgent',
    labelColor: '#fca5a5',
  },
  warn: {
    bg: 'rgba(245,158,11,0.07)',
    border: '1px solid rgba(245,158,11,0.22)',
    glow: '0 0 16px rgba(245,158,11,0.06)',
    dot: '#f59e0b',
    label: 'Tamir · Time-sensitive',
    labelColor: '#fcd34d',
  },
  info: {
    bg: 'rgba(56,189,248,0.06)',
    border: '1px solid rgba(56,189,248,0.18)',
    glow: '0 0 12px rgba(56,189,248,0.05)',
    dot: '#38bdf8',
    label: 'Tamir · Action needed',
    labelColor: '#7dd3fc',
  },
  update: {
    bg: 'rgba(52,211,153,0.05)',
    border: '1px solid rgba(52,211,153,0.15)',
    glow: '',
    dot: '#34d399',
    label: 'Tamir · Update',
    labelColor: '#6ee7b7',
  },
};

// ─── QUICK ACTIONS ───

const quickActions = [
  { label: 'Brief',     emoji: '📋' },
  { label: 'Blockers',  emoji: '🚧' },
  { label: 'Approvals', emoji: '✅' },
  { label: 'Costs',     emoji: '💰' },
];

// ─── MONITORING STATUS CYCLE ───

const monitoringStates = [
  { text: 'Monitoring 5 missions',    color: '#34d399' },
  { text: 'Scanning for blockers...', color: '#7dd3fc' },
  { text: 'All agents checked in',    color: '#34d399' },
];

// ─── BULLET ICON MAP ───

const bulletIcons: Record<string, { icon: React.ElementType; color: string }> = {
  alert:   { icon: AlertTriangle,  color: 'text-amber-400' },
  pending: { icon: Clock,          color: 'text-sky-400' },
  ok:      { icon: CheckCircle2,   color: 'text-emerald-400' },
};

// ─── ANIMATIONS ───

const containerAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};
const msgAnim = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const pushAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

// ─── COLOR TOKENS ───

const glassMain   = 'rgba(255,255,255,0.05)';
const glassHeader = 'rgba(255,255,255,0.07)';
const glassCard   = 'rgba(255,255,255,0.04)';
const glassMuted  = 'rgba(255,255,255,0.03)';
const textPrimary   = '#e2e8f0';
const textSecondary = '#94a3b8';
const textMuted     = '#64748b';
const divider       = 'rgba(255,255,255,0.09)';

// ─── RIGHT NOW CARD ───

function RightNowCard() {
  const [resolved, setResolved] = useState(false);

  if (resolved) return (
    <motion.div
      initial={{ opacity: 1, height: 'auto' }}
      animate={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl overflow-hidden mb-1"
      style={{
        background: 'linear-gradient(135deg, rgba(244,63,94,0.10) 0%, rgba(245,158,11,0.06) 100%)',
        border: '1.5px solid rgba(244,63,94,0.30)',
        boxShadow: '0 0 20px rgba(244,63,94,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center justify-between px-3 py-2" style={{ background: 'rgba(244,63,94,0.10)', borderBottom: '1px solid rgba(244,63,94,0.18)' }}>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 priority-pulse" style={{ boxShadow: '0 0 6px rgba(244,63,94,0.9)' }} />
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Right Now</span>
        </div>
        <span className="text-[10px]" style={{ color: textMuted }}>waiting 3h 12m</span>
      </div>
      <div className="px-3 py-3">
        <div className="text-[13px] font-bold text-white leading-tight mb-1">Approve AWS GPU capacity</div>
        <div className="text-[11px] mb-2.5" style={{ color: textSecondary }}>
          g4m.xlarge · us-west-2 · <span className="text-emerald-400">+$0.12/hr</span> · within budget
        </div>
        <div className="flex items-start gap-2 px-2.5 py-2 rounded-lg mb-3" style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.15)' }}>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed" style={{ color: '#fca5a5' }}>
            Dev + Infra idle. Every hour costs <span className="font-bold">~$800</span> in blocked agent time. ZUNA is critical path.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setResolved(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.95) 0%, rgba(234,130,8,0.95) 100%)', color: '#0a0f1a', border: '1px solid rgba(245,158,11,0.50)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 12px rgba(245,158,11,0.25)' }}
          >
            <Zap className="w-3.5 h-3.5" />
            Approve Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-3 py-2 rounded-lg text-[11px] font-medium"
            style={{ background: glassMuted, border: `1px solid ${divider}`, color: textSecondary }}
          >
            Ask Tamir
          </motion.button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px]" style={{ color: textMuted }}>~30 seconds to resolve</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── TYPING INDICATOR ───

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-2"
    >
      <div
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
        style={{ background: glassCard, border: `1px solid ${divider}` }}
      >
        <span className="text-[10px] font-bold text-amber-400">Tamir</span>
        <div className="flex items-center gap-0.5 ml-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full bg-amber-400/60"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── PUSH MESSAGE ───

function PushMessageBubble({ msg }: { msg: ChatMessage }) {
  const style = urgencyStyle[msg.urgency ?? 'update'];
  return (
    <motion.div
      variants={pushAnim}
      initial="hidden"
      animate="show"
      className="flex flex-col items-start"
    >
      <div
        className="w-full rounded-xl px-3 py-2.5"
        style={{ background: style.bg, border: style.border, boxShadow: style.glow ? `${style.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` : 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full priority-pulse" style={{ background: style.dot, boxShadow: `0 0 6px ${style.dot}` }} />
          <span className="text-[10px] font-bold" style={{ color: style.labelColor }}>{style.label}</span>
          <span className="text-[10px] ml-auto" style={{ color: textMuted }}>{msg.time}</span>
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: textPrimary }}>{msg.content}</p>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───

export default function TamirPanel() {
  const [inputValue, setInputValue]     = useState('');
  const [unread, setUnread]             = useState(0);
  const [messages, setMessages]         = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping]         = useState(false);
  const [monitoringIdx, setMonitoringIdx] = useState(0);
  const [briefExpanded, setBriefExpanded] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages or typing changes
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Cycling monitoring status
  useEffect(() => {
    const id = setInterval(() => setMonitoringIdx((i) => (i + 1) % monitoringStates.length), 4000);
    return () => clearInterval(id);
  }, []);

  // Push message queue — typing then message
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    pushQueue.forEach(({ message, delay, typingAt }) => {
      // Show typing indicator
      timers.push(setTimeout(() => setIsTyping(true), typingAt));
      // Show message + hide typing + increment badge
      timers.push(setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, message]);
        setUnread((n) => n + 1);
      }, delay));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const clearUnread = () => setUnread(0);
  const monitoring = monitoringStates[monitoringIdx];

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full rounded-2xl overflow-hidden glass-panel"
      style={{
        background: glassMain,
        backdropFilter: 'blur(32px) saturate(160%) brightness(2.2)',
        WebkitBackdropFilter: 'blur(32px) saturate(160%) brightness(2.2)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.22)',
      }}
    >
      {/* ── HEADER ── */}
      <div
        className="shrink-0 px-4 py-3 flex items-center gap-3 cursor-pointer"
        style={{ background: glassHeader, borderBottom: `1px solid ${divider}`, backdropFilter: 'blur(8px)' }}
        onClick={clearUnread}
      >
        {/* Avatar + unread badge */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold text-white" style={{ boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>T</div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2" style={{ borderColor: '#0a1020' }} />
          <AnimatePresence>
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: '#f43f5e', boxShadow: '0 0 8px rgba(244,63,94,0.8)' }}
              >
                {unread}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Name + cycling status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: textPrimary }}>Tamir</span>
            <span className="text-[10px] font-medium" style={{ color: textSecondary }}>Chief of Staff</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={monitoringIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full live-dot" style={{ background: monitoring.color }} />
              <span className="text-[11px] font-medium" style={{ color: monitoring.color }}>{monitoring.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bell with unread dot */}
        <div className="relative shrink-0">
          <Bell className="w-4 h-4" style={{ color: unread > 0 ? '#f43f5e' : textMuted }} />
          <AnimatePresence>
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full priority-pulse"
                style={{ background: '#f43f5e' }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── CHAT THREAD ── */}
      <div ref={threadRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">

        {/* RIGHT NOW pinned card */}
        <RightNowCard />

        {/* Message list */}
        <motion.div variants={containerAnim} initial="hidden" animate="show" className="space-y-3">
          {messages.map((msg) => (
            <motion.div key={msg.id} variants={msgAnim}>
              {/* ── MORNING BRIEF (collapsible) ── */}
              {msg.type === 'brief' ? (
                <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.16)', borderLeft: '2px solid rgba(245,158,11,0.50)' }}>
                  <button
                    onClick={() => setBriefExpanded(!briefExpanded)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left"
                    style={{ background: 'rgba(245,158,11,0.06)', borderBottom: briefExpanded ? '1px solid rgba(245,158,11,0.12)' : 'none' }}
                  >
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex-1">Morning Brief</span>
                    <span className="text-[10px]" style={{ color: textMuted }}>{msg.time}</span>
                    <ChevronDown className="w-3 h-3 text-amber-400/50 transition-transform duration-200" style={{ transform: briefExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                  <AnimatePresence>
                    {briefExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 py-2.5">
                          <p className="text-[11px] leading-relaxed mb-2" style={{ color: textSecondary }}>{msg.content}</p>
                          {msg.bullets && (
                            <div className="space-y-1.5">
                              {msg.bullets.map((bullet, i) => {
                                const { icon: BIcon, color } = bulletIcons[bullet.icon];
                                return (
                                  <div key={i} className="flex items-start gap-2 px-2 py-1.5 rounded-lg" style={{ background: glassMuted, border: `1px solid ${divider}` }}>
                                    <BIcon className={`w-3 h-3 mt-0.5 shrink-0 ${color}`} />
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!briefExpanded && (
                    <div className="px-3 py-1.5">
                      <span className="text-[10px]" style={{ color: textMuted }}>3 items · tap to expand</span>
                    </div>
                  )}
                </div>

              ) : msg.type === 'push' ? (
                /* ── PUSH MESSAGE ── */
                <PushMessageBubble msg={msg} />

              ) : (
                /* ── REGULAR MESSAGE ── */
                <div className={`flex flex-col ${msg.sender === 'ceo' ? 'items-end' : 'items-start'}`}>
                  <div
                    className="max-w-[92%] rounded-xl px-3 py-2.5"
                    style={
                      msg.sender === 'tamir'
                        ? { background: glassCard, backdropFilter: 'blur(8px)', border: `1px solid ${divider}`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.15)' }
                        : { background: 'rgba(56,189,248,0.10)', backdropFilter: 'blur(8px)', border: '1px solid rgba(56,189,248,0.18)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold ${msg.sender === 'tamir' ? 'text-amber-400' : 'text-sky-400'}`}>
                        {msg.sender === 'tamir' ? 'Tamir' : 'You'}
                      </span>
                      <span className="text-[10px]" style={{ color: textMuted }}>{msg.time}</span>
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: textPrimary }}>{msg.content}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
      </div>

      {/* ── QUICK ACTIONS + INPUT ── */}
      <div className="shrink-0 px-3 pb-3 pt-2" style={{ background: glassHeader, borderTop: `1px solid ${divider}` }}>
        <div className="flex items-center gap-1.5 mb-2">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors"
              style={{ background: 'rgba(22,34,68,0.60)', border: `1px solid ${divider}`, color: textSecondary, backdropFilter: 'blur(6px)' }}
            >
              <span className="text-[11px]">{action.emoji}</span>
              {action.label}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(14,22,48,0.70)', backdropFilter: 'blur(12px)', border: '1px solid rgba(245,158,11,0.20)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Tamir..."
            className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-slate-600"
            style={{ color: textPrimary }}
          />
          <button className="p-1 transition-colors hover:text-amber-400" style={{ color: textMuted }}>
            <Mic className="w-3.5 h-3.5" />
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-md"
            style={{ background: 'rgba(245,158,11,0.85)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}
          >
            <Send className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
