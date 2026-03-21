'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PageShell from '@/components/shared/PageShell';
import { allMissions } from '@/data/pages-data';
import { Mission, Deliverable, Person } from '@/types';
import {
  FileText, FileCode, FileSpreadsheet, Image, Film, FileType,
  Zap, ChevronRight, ChevronDown, Eye, AlertTriangle, Filter,
  Send, Mic, Brain, CheckCircle2, Clock, Sparkles, Search,
} from 'lucide-react';

// ─── AGENT THINKING DATA ───

const agentThinking: Record<string, { step: string; detail?: string }[]> = {
  m1: [
    { step: 'Scanned AWS capacity across us-east-1, us-east-2, us-west-1', detail: 'All g4dn.xlarge instances at 100% capacity' },
    { step: 'Evaluated CPU-only inference path', detail: 'Rejected — 12x latency increase exceeds ZUNA 50ms SLA' },
    { step: 'Located g4dn.xlarge availability in us-west-2', detail: 'Cost delta: +$0.12/hr over primary region' },
    { step: 'Verified with Finance API — within approved infrastructure budget', detail: 'Remaining headroom: $620/mo' },
    { step: 'Packaged as L4 escalation — awaiting CEO approval for cross-region commitment' },
  ],
  m2: [
    { step: 'Sourced 14 candidates from 3 recruiting pipelines' },
    { step: 'Filtered to 2 shortlisted based on EEG domain expertise and Python proficiency' },
    { step: 'Assembled candidate_brief.docx with full scoring matrix', detail: 'CTO ranked Priya K. #1 across all dimensions' },
    { step: 'Drafted compensation_model.xlsx at $95K base + equity', detail: 'Within Research band, pre-approved by Tamir' },
    { step: 'Recruiter holding slot — brief expires tonight at midnight' },
  ],
  m3: [
    { step: 'Ingested 300-day company strategy from Vault and brand mission files' },
    { step: 'Generated 3-pillar content framework aligned to EEG launch arc' },
    { step: 'Produced Q2 editorial calendar — 48 posts across 12 weeks', detail: 'Coverage: thought leadership, product education, community' },
    { step: 'CMO Maya reviewed draft and requested brand guidelines refresh first' },
    { step: 'brand_guidelines_v3.pdf 85% complete — ETA 2h' },
  ],
  m4: [
    { step: 'ZUNA v2.1 packaged with 14-channel EEG inference pipeline' },
    { step: 'Generated deployment_manifest.yaml targeting AWS ECS' },
    { step: '47 unit tests passed in staging environment', detail: 'Integration tests gated on GPU instance availability' },
    { step: 'Infra agent attempted 3 alternative GPU configs — all blocked by capacity constraint' },
    { step: 'Critical path: GPU approval unblocks both model inference and data pipeline simultaneously' },
  ],
  m5: [
    { step: 'Audited 4 logistics routes across 3 regions for Ops team' },
    { step: 'Identified 22% route optimization via carrier consolidation', detail: 'Est. $340/mo in recurring savings' },
    { step: 'Generated optimization_report.pdf with step-by-step implementation guide' },
    { step: 'COO Liam reviewed all recommendations and approved implementation' },
    { step: 'All deliverables finalized and approved — mission complete' },
  ],
  m6: [
    { step: 'Ran 400+ benchmark iterations across ZUNA v2.0 and v2.1 architectures' },
    { step: 'v2.1 shows 18% accuracy improvement on 14-channel EEG classification task' },
    { step: 'Latency profiling: v2.1 at 43ms average — within 50ms SLA', detail: 'CPU fallback at 380ms — not viable for production' },
    { step: 'Generated model_accuracy_report.pdf with full statistical analysis' },
    { step: 'CTO recommends v2.1 for production — pending CEO review sign-off' },
  ],
  m7: [
    { step: 'Audited current brand assets across all external touchpoints' },
    { step: 'Synthesized competitor visual benchmarking from Market Intel data' },
    { step: 'Produced 3 brand direction concepts with rationale', detail: 'CMO shortlisted Direction B — navy + amber palette' },
    { step: 'Generated logo_variants.zip with 12 lockup configurations' },
    { step: 'brand_guidelines_v3.pdf in progress — finalizing typography section' },
  ],
  m8: [
    { step: 'Pulled financial data from Tech and Ops systems — found 15% revenue projection discrepancy' },
    { step: 'Root cause: different cost allocation methodologies between departments', detail: 'Tech uses accrual, Ops uses cash basis' },
    { step: 'Proposed unified accrual-based methodology with quarterly reconciliation' },
    { step: 'investor_deck_q1.pptx drafted with placeholder on slide 7 pending methodology approval' },
    { step: 'Investor meeting in 3 days — CEO approval of methodology needed to finalize numbers' },
  ],
  m9: [
    { step: 'Conducted competitor campaign analysis across 5 key players in consumer neuroscience' },
    { step: 'Identified 3 high-ROI channel opportunities: LinkedIn thought leadership, YouTube demos, podcast sponsorships' },
    { step: 'Drafted campaign_brief.md with messaging framework and success metrics' },
    { step: 'Modeled budget proposal: $28K Q2 allocation across channels', detail: 'Projected 4.2x ROAS based on industry benchmarks' },
    { step: 'CMO approved strategy — awaiting CEO sign-off on budget and channel mix' },
  ],
};

// ─── TAMIR CHAT DATA ───

interface TamirMsg { id: number; sender: 'tamir' | 'ceo'; time: string; content: string }

const tamirConvo: TamirMsg[] = [
  { id: 1, sender: 'tamir', time: '07:15', content: "Good morning. 9 active missions today — 3 need your direct action. AWS GPU is most urgent, costing ~$800/hr in idle agent time." },
  { id: 2, sender: 'tamir', time: '10:24', content: "Update on m1: Alex confirmed us-west-2 g4dn.xlarge is available. The +$0.12/hr is within budget. Finance already verified. I've packaged it as a 30-second approval." },
  { id: 3, sender: 'ceo', time: '10:25', content: "What unblocks if I approve the GPU?" },
  { id: 4, sender: 'tamir', time: '10:25', content: "ZUNA deployment resumes immediately. Dev and Infra agents come back online. The EEG inference pipeline, the benchmark validation, and the staging environment all unblock in parallel. ~48hr recovery to full staging." },
  { id: 5, sender: 'ceo', time: '10:26', content: "What's the Research Analyst situation?" },
  { id: 6, sender: 'tamir', time: '10:26', content: "Candidate brief expires tonight. Priya K. is the clear top choice — EEG domain expert, Python specialist, CTO's #1 pick. Compensation is within the Research band. I'd recommend approving before 6pm or the slot opens back up." },
  { id: 7, sender: 'ceo', time: '10:28', content: "And the investor deck blocker?" },
  { id: 8, sender: 'tamir', time: '10:28', content: "Tech and Ops use different cost allocation methods — that's the 15% gap. The fix is straightforward: approve unified accrual methodology. I've pre-drafted the policy language. One approval unlocks the whole deck, which Liam needs finalized in 3 days." },
];

// ─── CONSTANTS ───

const flowStages = ['Created', 'Agent Work', 'Dept Review', 'CEO Review', 'Done'];

const fileIcons: Record<string, React.ElementType> = {
  document: FileText, code: FileCode, spreadsheet: FileSpreadsheet,
  image: Image, video: Film, pdf: FileType, presentation: FileText,
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  draft:        { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8' },
  'in-progress':{ bg: 'rgba(56,189,248,0.12)',  color: '#7dd3fc' },
  ready:        { bg: 'rgba(52,211,153,0.12)',  color: '#6ee7b7' },
  approved:     { bg: 'rgba(167,139,250,0.15)', color: '#c4b5fd' },
};

const columnStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'act-now':       { label: 'Act Now',        color: '#fbbf24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  'approve-decide':{ label: 'Approve/Decide', color: '#7dd3fc', bg: 'rgba(56,189,248,0.10)', border: 'rgba(56,189,248,0.22)' },
  review:          { label: 'Review',         color: '#6ee7b7', bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.20)' },
};

const priorityBorder: Record<string, string> = {
  critical: 'rgba(244,63,94,0.35)', high: 'rgba(245,158,11,0.22)',
  medium: 'rgba(255,255,255,0.09)', low: 'rgba(255,255,255,0.06)',
};

const priorityBadge: Record<string, { bg: string; color: string }> = {
  critical: { bg: 'rgba(244,63,94,0.18)', color: '#fda4af' },
  high:     { bg: 'rgba(245,158,11,0.18)', color: '#fcd34d' },
  medium:   { bg: 'rgba(100,116,139,0.18)', color: '#94a3b8' },
  low:      { bg: 'rgba(100,116,139,0.18)', color: '#64748b' },
};

const btnStyle: Record<string, { bg: string; border: string; color: string }> = {
  'act-now':       { bg: 'rgba(245,158,11,0.90)', border: 'rgba(245,158,11,0.45)', color: '#0a0f1a' },
  'approve-decide':{ bg: 'rgba(16,185,129,0.90)', border: 'rgba(16,185,129,0.45)', color: '#ffffff' },
  review:          { bg: 'rgba(14,165,233,0.90)', border: 'rgba(14,165,233,0.45)', color: '#ffffff' },
};

// ─── TAMIR CHAT PANEL ───

function TamirChatPanel() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<TamirMsg[]>(tamirConvo);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), sender: 'ceo', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: input.trim(),
    }]);
    setInput('');
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: 'rgba(6,10,24,0.70)',
        backdropFilter: 'blur(24px) saturate(140%) brightness(1.04)',
        WebkitBackdropFilter: 'blur(24px) saturate(140%) brightness(1.04)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-5 py-4"
        style={{
          background: 'linear-gradient(180deg, rgba(6,10,24,0.95) 0%, rgba(8,14,30,0.80) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            T
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#060a18]" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">Tamir</div>
          <div className="text-[11px] text-slate-400">Chief of Staff · Missions briefing</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
          <span className="text-[11px] text-emerald-400">Live</span>
        </div>
      </div>

      {/* Thread */}
      <div
        ref={threadRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-none"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col gap-1 ${msg.sender === 'ceo' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">
                {msg.sender === 'tamir' ? 'Tamir' : 'You'}
              </span>
              <span className="text-[10px] text-slate-600">{msg.time}</span>
            </div>
            <div
              className="max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed"
              style={msg.sender === 'tamir' ? {
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: '#e2e8f0',
              } : {
                background: 'rgba(56,189,248,0.12)',
                border: '1px solid rgba(56,189,248,0.20)',
                color: '#bae6fd',
              }}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
        {['What\'s most urgent?', 'Summary for m1', 'Who\'s blocked?'].map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="shrink-0 px-2.5 py-1 text-[11px] text-slate-400 rounded-lg whitespace-nowrap transition-colors hover:text-slate-200"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="shrink-0 px-4 py-3 flex items-center gap-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask Tamir about any mission..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
        />
        <button
          onClick={sendMessage}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: input.trim() ? 'rgba(56,189,248,0.20)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          <Send className="w-3.5 h-3.5 text-sky-400" />
        </button>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
        >
          <Mic className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    </div>
  );
}

// ─── MISSION DETAIL CARD ───

function MissionDetailCard({ mission, index }: { mission: Mission; index: number }) {
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const thinking = agentThinking[mission.id] ?? [];
  const col = columnStyle[mission.column];
  const badge = priorityBadge[mission.priority];
  const btn = btnStyle[mission.column];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(8,14,32,0.55)',
        backdropFilter: 'blur(20px) saturate(140%) brightness(1.05)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%) brightness(1.05)',
        border: `1px solid ${priorityBorder[mission.priority]}`,
        boxShadow: '0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* ── HEADER ── */}
      <div
        className="flex items-start gap-4 px-5 py-4"
        style={{
          background: 'linear-gradient(180deg, rgba(6,12,28,0.75) 0%, rgba(8,16,36,0.55) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className={`w-9 h-9 rounded-full ${mission.owner.color} flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5`}>
          {mission.owner.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold text-white leading-tight">{mission.title}</h3>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
              style={{ background: badge.bg, color: badge.color }}
            >
              {mission.priority}
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-md font-semibold shrink-0"
              style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.color }}
            >
              {col.label}
            </span>
            {mission.age && (
              <span className="text-[11px] text-slate-500 shrink-0">{mission.age}</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">
            {mission.department} · {mission.escalationPath}
          </div>
        </div>
        {/* Flow progress mini */}
        <div className="flex items-center gap-0.5 shrink-0 mt-1">
          {flowStages.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: i === mission.flowStage ? '20px' : '12px',
                background: i < mission.flowStage ? '#10b981' : i === mission.flowStage ? '#fbbf24' : 'rgba(255,255,255,0.10)',
              }}
            />
          ))}
          <span className="text-[10px] text-slate-500 ml-1.5">{flowStages[mission.flowStage]}</span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* ── BLOCKER ── */}
        {mission.blocker && (
          <div
            className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] text-rose-300"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.18)' }}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold">Blocker: </span>{mission.blocker}
              {mission.attempts && <span className="text-slate-500 ml-2">· {mission.attempts} retries</span>}
            </span>
          </div>
        )}

        {/* ── AGENT THINKING ── */}
        {thinking.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <button
              onClick={() => setThinkingOpen(!thinkingOpen)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:brightness-110"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <Brain className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span className="text-[12px] font-semibold text-slate-300">Agent Reasoning</span>
              <span className="text-[10px] text-slate-500 ml-1">{thinking.length} steps</span>
              <ChevronDown
                className="w-3.5 h-3.5 text-slate-500 ml-auto transition-transform duration-200"
                style={{ transform: thinkingOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            <AnimatePresence>
              {thinkingOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-4 py-3 space-y-2.5 font-mono"
                    style={{ background: 'rgba(6,10,20,0.60)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    {thinking.map((t, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-[10px] text-violet-500 shrink-0 mt-0.5 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                        <div>
                          <span className="text-[11px] text-slate-300">{t.step}</span>
                          {t.detail && (
                            <div className="text-[10px] text-slate-500 mt-0.5">{t.detail}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── DELIVERABLES ── */}
        <div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Deliverables
          </div>
          <div className="grid grid-cols-2 gap-2">
            {mission.deliverables.map((d, i) => {
              const Icon = fileIcons[d.type] || FileText;
              const s = statusStyle[d.status];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl group cursor-pointer transition-all hover:brightness-110"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-slate-200 font-medium truncate">{d.name}</div>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-semibold mt-0.5 inline-block"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {d.status}
                    </span>
                  </div>
                  <Eye className="w-3 h-3 text-slate-600 group-hover:text-slate-300 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── TOUCH TRAIL ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {mission.touchTrail.map((person, i) => (
              <div key={i} className="flex items-center gap-0.5">
                <div
                  className={`w-6 h-6 rounded-full ${person.color} flex items-center justify-center text-[10px] font-bold text-white ${
                    i === mission.touchTrail.length - 1 ? 'ring-2 ring-amber-400/50' : 'opacity-55'
                  }`}
                  title={`${person.name} (${person.role})`}
                >
                  {person.avatar}
                </div>
                {i < mission.touchTrail.length - 1 && <ChevronRight className="w-3 h-3 text-slate-700" />}
              </div>
            ))}
            <span className="text-[11px] text-slate-500 ml-2">
              Owner: <span className="text-slate-300">{mission.owner.name}</span>
            </span>
          </div>
        </div>

        {/* ── CEO ACTION + BUTTONS ── */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-0"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[12px] text-amber-300 font-medium truncate">{mission.ceoAction}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold"
            style={{
              background: btn.bg,
              color: btn.color,
              border: `1px solid ${btn.border}`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.20), 0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {mission.primaryCTA ?? 'Take Action'}
          </motion.button>
          {mission.column === 'approve-decide' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-400"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              Decline
            </motion.button>
          )}
          {mission.column === 'review' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-400"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              Request Changes
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── SORT LOGIC ───

const colScore: Record<string, number> = { 'act-now': 3, 'approve-decide': 2, review: 1 };
const priScore: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

function sortMissions(missions: Mission[]): Mission[] {
  return [...missions].sort((a, b) => {
    // Blockers always float to top within their group
    const aScore = colScore[a.column] * 10 + priScore[a.priority] + (a.blocker ? 0.5 : 0);
    const bScore = colScore[b.column] * 10 + priScore[b.priority] + (b.blocker ? 0.5 : 0);
    return bScore - aScore;
  });
}

// ─── COMPACT MISSION CARD ───

const colAccent: Record<string, { bar: string; badge: string; badgeText: string; label: string }> = {
  'act-now':        { bar: '#f59e0b', badge: 'rgba(245,158,11,0.14)', badgeText: '#fcd34d', label: 'Act Now' },
  'approve-decide': { bar: '#38bdf8', badge: 'rgba(56,189,248,0.12)', badgeText: '#7dd3fc', label: 'Approve' },
  review:           { bar: '#34d399', badge: 'rgba(52,211,153,0.12)', badgeText: '#6ee7b7', label: 'Review' },
};

const priDot: Record<string, string> = {
  critical: '#f43f5e', high: '#f59e0b', medium: '#7dd3fc', low: '#64748b',
};

function MissionCardCompact({
  mission,
  selected,
  onClick,
}: {
  mission: Mission;
  selected: boolean;
  onClick: () => void;
}) {
  const col = colAccent[mission.column];

  return (
    <motion.button
      layout
      onClick={onClick}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      className="w-full text-left relative overflow-hidden rounded-xl"
      style={{
        background: selected ? 'rgba(56,189,248,0.07)' : 'rgba(8,14,32,0.50)',
        border: selected ? '1px solid rgba(56,189,248,0.30)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: selected ? '0 0 0 1px rgba(56,189,248,0.15), 0 4px 16px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      {/* Priority bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
        style={{ background: priDot[mission.priority], opacity: mission.priority === 'critical' ? 1 : 0.7 }}
      />

      <div className="pl-3.5 pr-3 py-3">
        {/* Top row: column badge + age */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
            style={{ background: col.badge, color: col.badgeText }}
          >
            {col.label}
          </span>
          {mission.blocker && (
            <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
          )}
          {mission.age && (
            <span className="text-[10px] text-slate-600 ml-auto">{mission.age}</span>
          )}
        </div>

        {/* Title */}
        <div className="text-[13px] font-semibold text-white leading-snug mb-1.5 pr-1">
          {mission.title}
        </div>

        {/* Bottom row: owner + priority dot + deliverable count */}
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full ${mission.owner.color} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}
          >
            {mission.owner.avatar}
          </div>
          <span className="text-[11px] text-slate-500 flex-1 truncate">{mission.owner.name}</span>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: priDot[mission.priority] }} />
          <span className="text-[10px] text-slate-500">{mission.deliverables.length}f</span>
        </div>
      </div>
    </motion.button>
  );
}

// ─── EMPTY DETAIL STATE ───

function EmptyDetail() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Sparkles className="w-5 h-5 text-slate-600" />
      </div>
      <p className="text-sm font-medium text-slate-400">Select a mission</p>
      <p className="text-[12px] text-slate-600">Click any card to see full details,<br />deliverables, and agent reasoning</p>
    </div>
  );
}

// ─── PAGE ───

export default function MissionsPage() {
  const [search, setSearch] = useState('');
  const [columnFilter, setColumnFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>('m1');

  const filtered = sortMissions(
    allMissions.filter((m) => {
      if (columnFilter !== 'all' && m.column !== columnFilter) return false;
      if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
  );

  const selectedMission = allMissions.find(m => m.id === selectedId) ?? null;

  const counts = {
    all: allMissions.length,
    'act-now': allMissions.filter(m => m.column === 'act-now').length,
    'approve-decide': allMissions.filter(m => m.column === 'approve-decide').length,
    review: allMissions.filter(m => m.column === 'review').length,
  };

  return (
    <PageShell>
      <div className="flex h-full overflow-hidden">

        {/* ── LEFT: TAMIR CHAT (38%) ── */}
        <div className="h-full shrink-0" style={{ width: '38%' }}>
          <TamirChatPanel />
        </div>

        {/* ── RIGHT: MASTER-DETAIL (62%) ── */}
        <div className="flex-1 h-full flex overflow-hidden">

          {/* Card list (fixed width) */}
          <div
            className="flex flex-col h-full shrink-0"
            style={{ width: '260px', borderRight: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Toolbar */}
            <div
              className="shrink-0 px-3 py-3 space-y-2"
              style={{ background: 'rgba(6,10,24,0.70)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Search */}
              <div
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Search className="w-3 h-3 text-slate-500 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent text-[12px] text-white placeholder:text-slate-600 outline-none w-full"
                />
              </div>

              {/* Column filter pills */}
              <div className="flex gap-1 flex-wrap">
                {(['all', 'act-now', 'approve-decide', 'review'] as const).map((key) => {
                  const labels: Record<string, string> = { all: 'All', 'act-now': 'Act', 'approve-decide': 'Approve', review: 'Review' };
                  const active = columnFilter === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setColumnFilter(key)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-all"
                      style={active
                        ? { background: 'rgba(245,158,11,0.14)', border: '1px solid rgba(245,158,11,0.28)', color: '#fcd34d' }
                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }
                      }
                    >
                      {labels[key]}
                      <span style={{ color: active ? '#f59e0b' : '#475569' }}>{counts[key]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card list */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((m) => (
                  <MissionCardCompact
                    key={m.id}
                    mission={m}
                    selected={m.id === selectedId}
                    onClick={() => setSelectedId(m.id === selectedId ? null : m.id)}
                  />
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="text-center py-8 text-[12px] text-slate-600">No missions found</div>
              )}
            </div>

            {/* Footer count */}
            <div
              className="shrink-0 px-3 py-2 text-[10px] text-slate-600 text-center"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              {filtered.length} of {allMissions.length} missions
            </div>
          </div>

          {/* Detail panel */}
          <div
            className="flex-1 h-full overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}
          >
            <AnimatePresence mode="wait">
              {selectedMission ? (
                <motion.div
                  key={selectedMission.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="px-5 py-5"
                >
                  <MissionDetailCard mission={selectedMission} index={0} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex"
                >
                  <EmptyDetail />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </PageShell>
  );
}
