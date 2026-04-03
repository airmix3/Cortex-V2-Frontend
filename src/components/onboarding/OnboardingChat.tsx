'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, Send, FileText } from 'lucide-react';
import {
  ONBOARDING_SCRIPT,
  STAGE_LABELS,
  getStageFromIndex,
  ScriptFormQuestion,
} from '@/data/onboarding-script';

// ── Types ─────────────────────────────────────────────────────────────────────

type FormData = {
  questions: ScriptFormQuestion[];
  submitLabel: string;
  intro: string;
  submitted: boolean;
  answers: Record<string, string>;
};

type OMessage = {
  id: number;
  role: 'user' | 'tamir';
  type: 'text' | 'form' | 'achievement' | 'deliverable' | 'stage-header';
  content?: string;
  quickReplies?: string[];
  form?: FormData;
  achievement?: { emoji: string; title: string; description: string };
  deliverable?: {
    agentName: string; agentAvatar: string; agentColor: string;
    filename: string; contentPreview: string; stats: string[];
  };
  stage?: { number: number; title: string; subtitle: string };
};

// ── Text formatter ────────────────────────────────────────────────────────────

function Formatted({ text }: { text: string }) {
  const paragraphs = text.split('\n\n');
  return (
    <>
      {paragraphs.map((para, i) => {
        if (para === '---') {
          return <hr key={i} className="border-white/10 my-3" />;
        }
        // Bullet list
        const lines = para.split('\n');
        const isList = lines.every(l => l.startsWith('- ') || l.startsWith('• ') || l.startsWith('*"') || l === '');
        if (lines.length > 1 && lines.some(l => l.startsWith('- ') || l.startsWith('• '))) {
          return (
            <ul key={i} className="space-y-1.5 my-2 first:mt-0 last:mb-0">
              {lines.filter(l => l.startsWith('- ') || l.startsWith('• ')).map((l, j) => (
                <li key={j} className="flex gap-2 items-start">
                  <span className="text-white/30 shrink-0 mt-0.5 text-xs">•</span>
                  <span
                    className="text-[13px] leading-relaxed text-white/80"
                    dangerouslySetInnerHTML={{
                      __html: l.replace(/^[-•]\s+/, '')
                        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                        .replace(/\*(.+?)\*/g, '<em class="italic text-white/70">$1</em>')
                    }}
                  />
                </li>
              ))}
            </ul>
          );
        }
        // Normal paragraph
        return (
          <p
            key={i}
            className="text-[13px] leading-relaxed text-white/80 mb-2 last:mb-0"
            dangerouslySetInnerHTML={{
              __html: para
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                .replace(/\*(.+?)\*/g, '<em class="italic text-white/70">$1</em>')
                .replace(/`(.+?)`/g, '<code class="text-sky-300 bg-sky-900/30 px-1 rounded text-[11px]">$1</code>')
            }}
          />
        );
      })}
    </>
  );
}

// ── Stage Progress Bar ────────────────────────────────────────────────────────

function StageProgress({ currentStage }: { currentStage: number }) {
  return (
    <div
      className="shrink-0 flex items-center px-6 py-3 gap-0"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,10,19,0.6)' }}
    >
      {STAGE_LABELS.map((s, i) => {
        const isDone = s.number < currentStage;
        const isActive = s.number === currentStage;
        return (
          <div key={s.number} className="flex items-center flex-1 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              {/* Dot */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: isDone
                    ? 'rgba(52,211,153,0.15)'
                    : isActive
                    ? 'rgba(56,189,248,0.12)'
                    : 'rgba(255,255,255,0.04)',
                  border: isDone
                    ? '1px solid rgba(52,211,153,0.4)'
                    : isActive
                    ? '1px solid rgba(56,189,248,0.35)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {isDone ? (
                  <Check size={9} className="text-emerald-400" strokeWidth={3} />
                ) : isActive ? (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-sky-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                ) : (
                  <span className="text-[9px] text-white/20 font-bold">{s.number}</span>
                )}
              </div>

              {/* Labels */}
              <div className="hidden sm:block">
                <div
                  className="text-[10px] font-bold leading-none"
                  style={{
                    color: isDone ? '#34d399' : isActive ? '#38bdf8' : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {s.label}
                </div>
                <div className="text-[9px] text-white/20 leading-none mt-0.5">{s.sublabel}</div>
              </div>
            </div>

            {/* Connector */}
            {i < STAGE_LABELS.length - 1 && (
              <div className="flex-1 mx-3 h-px" style={{ background: isDone ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Message: Tamir text bubble ────────────────────────────────────────────────

function TamirBubble({ msg, onQuickReply }: { msg: OMessage; onQuickReply: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-1.5"
    >
      {/* Byline */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] font-bold text-white shrink-0">TA</div>
        <span className="text-[11px] text-amber-400 font-medium">Tamir</span>
      </div>

      {/* Bubble */}
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[520px]"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {msg.content && <Formatted text={msg.content} />}
      </div>

      {/* Quick replies */}
      {msg.quickReplies && msg.quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1 pl-0">
          {msg.quickReplies.map((reply, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => onQuickReply(reply)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer max-w-[400px] text-left"
              style={{
                background: 'rgba(56,189,248,0.06)',
                border: '1px solid rgba(56,189,248,0.18)',
                color: '#7dd3fc',
              }}
            >
              {reply.length > 80 ? `${reply.slice(0, 80)}…` : reply}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Message: User text bubble ─────────────────────────────────────────────────

function UserBubble({ msg }: { msg: OMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-end gap-1.5"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-sky-400 font-medium">You</span>
        <div className="w-5 h-5 rounded-full bg-sky-600 flex items-center justify-center text-[8px] font-bold text-white shrink-0">YO</div>
      </div>
      <div
        className="rounded-2xl rounded-tr-sm px-4 py-3 max-w-[520px] text-[13px] leading-relaxed text-white/80"
        style={{
          background: 'rgba(56,189,248,0.08)',
          border: '1px solid rgba(56,189,248,0.15)',
        }}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

// ── Message: DNA Form ─────────────────────────────────────────────────────────

function FormMessage({ msg, onSubmit }: { msg: OMessage; onSubmit: (answers: Record<string, string>) => void }) {
  const form = msg.form!;
  const [answers, setAnswers] = useState<Record<string, string>>(form.answers ?? {});
  const [submitted, setSubmitted] = useState(form.submitted ?? false);

  const allAnswered = form.questions.every(q => answers[q.id]?.trim());

  const handleSubmit = () => {
    if (!allAnswered || submitted) return;
    setSubmitted(true);
    onSubmit(answers);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-1.5"
    >
      {/* Byline */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] font-bold text-white shrink-0">TA</div>
        <span className="text-[11px] text-amber-400 font-medium">Tamir</span>
        <span className="text-[10px] text-slate-600">· DNA Mode</span>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden max-w-[520px]"
        style={{
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(167,139,250,0.18)',
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(167,139,250,0.05)' }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">DNA Mode</span>
        </div>

        <div className="px-4 py-3.5 space-y-4">
          <p className="text-[12px] text-slate-300 leading-relaxed">{form.intro}</p>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                {form.questions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.25 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{
                          background: answers[q.id] ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.07)',
                          color: answers[q.id] ? '#34d399' : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {answers[q.id] ? <Check size={8} strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="text-[12px] font-semibold text-white">{q.label}</span>
                    </div>
                    {q.options ? (
                      <div className="flex flex-wrap gap-1.5 pl-5">
                        {q.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt === answers[q.id] ? '' : opt }))}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
                            style={{
                              background: answers[q.id] === opt ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${answers[q.id] === opt ? '#a78bfa' : 'rgba(255,255,255,0.08)'}`,
                              color: answers[q.id] === opt ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="pl-5">
                        <input
                          type="text"
                          value={answers[q.id] ?? ''}
                          onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder={q.placeholder}
                          className="w-full px-3 py-2 rounded-lg text-[12px] text-white placeholder-slate-600 outline-none"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        />
                        {q.hint && !answers[q.id] && (
                          <p className="text-[10px] text-slate-600 mt-1">{q.hint}</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                <motion.button
                  whileHover={allAnswered ? { scale: 1.02 } : {}}
                  whileTap={allAnswered ? { scale: 0.97 } : {}}
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: allAnswered ? '#a78bfa' : 'rgba(255,255,255,0.05)',
                    color: allAnswered ? '#0f0f1a' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {form.submitLabel} <ChevronRight size={14} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <div className="flex items-center gap-1.5 mb-3">
                  <Check size={11} className="text-emerald-400" />
                  <span className="text-[11px] text-emerald-400 font-semibold">DNA locked in</span>
                </div>
                {form.questions.map(q => (
                  <div key={q.id} className="flex gap-2">
                    <Check size={9} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500">{q.label}: </span>
                      <span className="text-[10px] font-semibold text-slate-300">{answers[q.id] || '—'}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Message: Achievement ──────────────────────────────────────────────────────

function AchievementMessage({ msg }: { msg: OMessage }) {
  const a = msg.achievement!;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center"
    >
      <div
        className="flex items-center gap-4 px-5 py-4 rounded-2xl max-w-[460px] w-full"
        style={{
          background: 'rgba(52,211,153,0.04)',
          border: '1px solid rgba(52,211,153,0.2)',
        }}
      >
        <span className="text-3xl shrink-0">{a.emoji}</span>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Achievement Unlocked</div>
          <div className="text-[14px] font-bold text-white">{a.title}</div>
          <p className="text-[11.5px] text-white/50 leading-snug mt-0.5">{a.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Message: Stage Header ─────────────────────────────────────────────────────

function StageHeaderMessage({ msg }: { msg: OMessage }) {
  const s = msg.stage!;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 py-2"
    >
      <div className="flex-1 h-px bg-white/[0.06]" />
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">Stage {s.number}</span>
        <span className="text-[10px] text-white/15">·</span>
        <span className="text-[11px] font-semibold text-white/40">{s.title}</span>
      </div>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </motion.div>
  );
}

// ── Message: Deliverable ──────────────────────────────────────────────────────

function DeliverableMessage({ msg }: { msg: OMessage }) {
  const d = msg.deliverable!;
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-1.5"
    >
      {/* Agent byline */}
      <div className="flex items-center gap-1.5">
        <div className={`w-5 h-5 rounded-full ${d.agentColor} flex items-center justify-center text-[8px] font-bold text-white shrink-0`}>
          {d.agentAvatar}
        </div>
        <span className="text-[11px] text-sky-400 font-medium">{d.agentName}</span>
        <span className="text-[10px] text-slate-600">· Business Development · delivered</span>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden max-w-[520px]"
        style={{
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(56,189,248,0.15)',
        }}
      >
        {/* File header */}
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.15)' }}>
            <FileText size={14} className="text-sky-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate">{d.filename}</p>
            <div className="flex gap-2 mt-0.5">
              {d.stats.map((s, i) => (
                <span key={i} className="text-[10px] text-slate-500">{s}</span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-[10px] text-sky-400 font-medium cursor-pointer hover:text-sky-300 transition-colors shrink-0"
          >
            {expanded ? 'Collapse' : 'Preview'}
          </button>
        </div>

        {/* Preview */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 py-3">
                <pre className="text-[11px] text-white/50 leading-relaxed whitespace-pre-wrap font-sans">
                  {d.contentPreview}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] font-bold text-white shrink-0">TA</div>
        <span className="text-[11px] text-amber-400 font-medium">Tamir</span>
      </div>
      <div
        className="flex gap-1 items-center px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          width: 'fit-content',
        }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/30"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── Input bar ─────────────────────────────────────────────────────────────────

function InputBar({
  onSend,
  disabled,
  placeholder,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder: string;
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div
      className="shrink-0 px-4 py-3"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,10,19,0.8)' }}
    >
      <div
        className="flex items-end gap-3 rounded-2xl px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => {
            setText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-[13px] text-white placeholder-slate-600 outline-none resize-none leading-relaxed disabled:opacity-40"
          style={{ minHeight: 24, maxHeight: 160 }}
        />
        <motion.button
          whileHover={!disabled && text.trim() ? { scale: 1.08 } : {}}
          whileTap={!disabled && text.trim() ? { scale: 0.94 } : {}}
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: text.trim() && !disabled ? '#38bdf8' : 'rgba(255,255,255,0.08)',
          }}
        >
          <Send size={13} style={{ color: text.trim() && !disabled ? '#0f172a' : 'rgba(255,255,255,0.3)' }} />
        </motion.button>
      </div>
      <p className="text-[10px] text-slate-600 mt-2 text-center">
        Type your response or click a suggestion above — Tamir will guide you through each stage.
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function OnboardingChat() {
  // Pre-load the greeting (entry 0)
  const [messages, setMessages] = useState<OMessage[]>(() => {
    const entry = ONBOARDING_SCRIPT[0];
    return [{
      id: 1,
      role: 'tamir',
      type: 'text',
      content: entry.content,
      quickReplies: entry.quickReplies,
    }];
  });

  const [scriptIndex, setScriptIndex] = useState(1); // next entry to inject
  const [isTyping, setIsTyping] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [quickRepliesKey, setQuickRepliesKey] = useState(0); // bump to hide quick replies
  const lastUserTextRef = useRef('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentStage = getStageFromIndex(scriptIndex);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Advance script: inject next scripted Tamir entry ──────────────────────
  const advanceScript = useCallback((indexOverride?: number) => {
    const idx = indexOverride ?? scriptIndex;
    if (idx >= ONBOARDING_SCRIPT.length) return;

    const entry = ONBOARDING_SCRIPT[idx];
    const nextIndex = idx + 1;

    const newMsg: OMessage = {
      id: Date.now() + Math.random(),
      role: 'tamir',
      type: entry.type,
      content: entry.content,
      quickReplies: entry.type === 'text' ? entry.quickReplies : undefined,
      achievement: entry.achievement,
      deliverable: entry.deliverable,
      stage: entry.stage,
      form: entry.form
        ? { ...entry.form, submitted: false, answers: {} }
        : undefined,
    };

    // Replace placeholder in closing message
    if (newMsg.content?.includes('{{lastFeedback}}')) {
      const feedback = lastUserTextRef.current;
      const truncated = feedback.length > 90 ? `${feedback.slice(0, 90)}…` : feedback;
      newMsg.content = newMsg.content.replace('{{lastFeedback}}', truncated || 'your reasoning');
    }

    setMessages(prev => [...prev, newMsg]);
    setScriptIndex(nextIndex);

    // Hide quick replies when we add a new Tamir message
    setQuickRepliesKey(k => k + 1);

    // If form: disable text input until form is submitted
    if (entry.type === 'form') {
      setInputDisabled(true);
    }

    // Auto-advance for achievement, stage-header, deliverable
    if (entry.autoAdvance && nextIndex < ONBOARDING_SCRIPT.length) {
      const delay = entry.autoAdvanceDelay ?? 1500;
      setTimeout(() => {
        advanceScript(nextIndex);
      }, delay);
    }
  }, [scriptIndex]);

  // ── Handle user send ───────────────────────────────────────────────────────
  const handleSend = useCallback((text: string) => {
    if (isTyping || inputDisabled) return;

    lastUserTextRef.current = text;

    // Add user message
    const userMsg: OMessage = {
      id: Date.now() + Math.random(),
      role: 'user',
      type: 'text',
      content: text,
    };
    setMessages(prev => {
      // Hide quick replies on the last Tamir message by clearing them
      const updated = prev.map((m, i) =>
        i === prev.length - 1 && m.role === 'tamir' ? { ...m, quickReplies: [] } : m
      );
      return [...updated, userMsg];
    });

    // Show typing indicator, then advance script
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      advanceScript();
    }, 1200 + Math.random() * 600);
  }, [isTyping, inputDisabled, advanceScript]);

  // ── Handle form submit ─────────────────────────────────────────────────────
  const handleFormSubmit = useCallback((msgId: number, answers: Record<string, string>) => {
    // Mark form as submitted in messages
    setMessages(prev =>
      prev.map(m =>
        m.id === msgId && m.form ? { ...m, form: { ...m.form, submitted: true, answers } } : m
      )
    );
    setInputDisabled(false);

    // Short delay then advance
    setTimeout(() => {
      advanceScript();
    }, 600);
  }, [advanceScript]);

  // Current input state
  const isWaitingForForm = messages.some(m => m.form && !m.form.submitted);
  const isAtEnd = scriptIndex >= ONBOARDING_SCRIPT.length && !isTyping;

  const inputPlaceholder = isWaitingForForm
    ? 'Fill in the form above to continue...'
    : isAtEnd
    ? 'Your company is alive. This is the beginning.'
    : 'Type your response...';

  return (
    <div className="flex flex-col h-full">
      {/* Stage progress */}
      <StageProgress currentStage={currentStage} />

      {/* Chat thread */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
        {messages.map(msg => {
          if (msg.role === 'user') {
            return <UserBubble key={msg.id} msg={msg} />;
          }
          if (msg.type === 'text') {
            return (
              <TamirBubble
                key={`${msg.id}-${quickRepliesKey}`}
                msg={msg}
                onQuickReply={handleSend}
              />
            );
          }
          if (msg.type === 'form') {
            return (
              <FormMessage
                key={msg.id}
                msg={msg}
                onSubmit={(answers) => handleFormSubmit(msg.id, answers)}
              />
            );
          }
          if (msg.type === 'achievement') {
            return <AchievementMessage key={msg.id} msg={msg} />;
          }
          if (msg.type === 'stage-header') {
            return <StageHeaderMessage key={msg.id} msg={msg} />;
          }
          if (msg.type === 'deliverable') {
            return <DeliverableMessage key={msg.id} msg={msg} />;
          }
          return null;
        })}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && <TypingIndicator key="typing" />}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <InputBar
        onSend={handleSend}
        disabled={isTyping || isWaitingForForm || isAtEnd}
        placeholder={inputPlaceholder}
      />
    </div>
  );
}
