'use client';

import AppShell from '@/components/layout/AppShell';
import React from 'react';
import { FadeIn } from '@/components/docs/DocReader';

// ── Achievement Badge ────────────────────────────────────────────────────────

function Achievement({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <FadeIn>
      <div className="my-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="text-2xl leading-none mt-0.5">{emoji}</div>
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-1">
              Achievement Unlocked
            </div>
            <div className="text-base font-semibold text-white mb-1">{title}</div>
            <div className="text-sm text-white/60 leading-relaxed">{description}</div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ── Stage Header ─────────────────────────────────────────────────────────────

function StageHeader({ number, title, time, quote }: { number: string; title: string; time: string; quote: string }) {
  return (
    <FadeIn>
      <div className="mt-16 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-xs font-semibold tracking-widest uppercase text-white/30">
            {number}
          </div>
          <div className="h-px flex-1 bg-white/5" />
          <div className="text-xs text-white/30">{time}</div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-sky-300/70 italic text-sm border-l-2 border-sky-500/30 pl-4">
          {quote}
        </p>
      </div>
    </FadeIn>
  );
}

// ── Path Divider ─────────────────────────────────────────────────────────────

function PathDivider({ label }: { label: string }) {
  return (
    <div className="my-16">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <div className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-widest uppercase text-white/40">
          {label}
        </div>
        <div className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}

// ── Checklist ────────────────────────────────────────────────────────────────

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="my-4 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
          <span className="mt-0.5 text-white/20">◦</span>
          <span dangerouslySetInnerHTML={{ __html: boldFormat(item) }} />
        </li>
      ))}
    </ul>
  );
}

function SignalList({ items, color }: { items: string[]; color: 'emerald' | 'amber' }) {
  const dot = color === 'emerald' ? 'bg-emerald-400' : 'bg-amber-400';
  return (
    <ul className="my-3 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
          <span className={`w-1.5 h-1.5 rounded-full ${dot} mt-1.5 shrink-0`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function boldFormat(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
}

// ── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold tracking-widest uppercase text-white/40 mt-8 mb-3">
      {children}
    </div>
  );
}

// ── Example Exchange ─────────────────────────────────────────────────────────

function Exchange({ messages }: { messages: { from: 'founder' | 'tamir'; text: string }[] }) {
  return (
    <FadeIn distance={14}>
      <div className="my-6 rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
        {messages.map((msg, i) => (
          <div key={i} className={`px-5 py-4 ${i > 0 ? 'border-t border-white/5' : ''}`}>
            <div className={`text-[10px] font-semibold tracking-widest uppercase mb-2 ${msg.from === 'founder' ? 'text-amber-400/70' : 'text-sky-400/70'}`}>
              {msg.from === 'founder' ? 'You' : 'Tamir'}
            </div>
            <div className="text-sm text-white/70 leading-relaxed">{msg.text}</div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

// ── Contrast Table ───────────────────────────────────────────────────────────

function Contrast({ rows }: { rows: { weak: string; strong: string }[] }) {
  return (
    <div className="my-6 rounded-xl border border-white/8 overflow-hidden text-sm">
      <div className="grid grid-cols-2">
        <div className="px-4 py-2.5 bg-rose-500/5 border-b border-white/5 text-[10px] font-semibold tracking-widest uppercase text-rose-400/60">Weak</div>
        <div className="px-4 py-2.5 bg-emerald-500/5 border-b border-white/5 border-l border-white/5 text-[10px] font-semibold tracking-widest uppercase text-emerald-400/60">Strong</div>
      </div>
      {rows.map((row, i) => (
        <div key={i} className={`grid grid-cols-2 ${i > 0 ? 'border-t border-white/5' : ''}`}>
          <div className="px-4 py-3 text-white/40 leading-relaxed bg-rose-500/[0.02]">{row.weak}</div>
          <div className="px-4 py-3 text-white/70 leading-relaxed border-l border-white/5 bg-emerald-500/[0.02]">{row.strong}</div>
        </div>
      ))}
    </div>
  );
}

// ── Feedback Example ─────────────────────────────────────────────────────────

function FeedbackExample({ context, bad, good, learns }: { context: string; bad: string; good: string; learns: string }) {
  return (
    <FadeIn distance={14}>
    <div className="my-6 rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-1">Deliverable</div>
        <div className="text-sm text-white/60">{context}</div>
      </div>
      <div className="grid grid-cols-2">
        <div className="px-5 py-3 border-r border-white/5">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-rose-400/60 mb-2">Teaches nothing</div>
          <div className="text-sm text-white/40 italic leading-relaxed">{bad}</div>
        </div>
        <div className="px-5 py-3">
          <div className="text-[10px] font-semibold tracking-widest uppercase text-emerald-400/60 mb-2">Teaches everything</div>
          <div className="text-sm text-white/70 leading-relaxed">{good}</div>
        </div>
      </div>
      <div className="px-5 py-3 border-t border-white/5 bg-sky-500/[0.03]">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-sky-400/60 mb-1">What the organism learns</div>
        <div className="text-sm text-white/50 leading-relaxed">{learns}</div>
      </div>
    </div>
    </FadeIn>
  );
}

// ── Trap Card ────────────────────────────────────────────────────────────────

function TrapCard({ title, description, fix }: { title: string; description: string; fix: string }) {
  return (
    <FadeIn distance={12}>
      <div className="my-5 rounded-xl border border-amber-500/15 bg-amber-500/[0.03] px-5 py-4">
        <div className="text-sm font-semibold text-white mb-2">{title}</div>
        <div className="text-sm text-white/50 leading-relaxed mb-3">{description}</div>
        <div className="text-sm text-amber-300/70 leading-relaxed">
          <span className="font-semibold text-amber-400/80">Fix: </span>{fix}
        </div>
      </div>
    </FadeIn>
  );
}

// ── Mission Example ──────────────────────────────────────────────────────────

function MissionExample({ type, mission, good }: { type: string; mission: string; good: boolean }) {
  return (
    <div className={`my-3 rounded-lg border px-4 py-3 text-sm ${good ? 'border-emerald-500/15 bg-emerald-500/[0.03]' : 'border-rose-500/15 bg-rose-500/[0.03]'}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`text-xs ${good ? 'text-emerald-400/70' : 'text-rose-400/70'}`}>{good ? '✓' : '✗'}</span>
        <span className={`text-xs font-semibold tracking-wider uppercase ${good ? 'text-emerald-400/60' : 'text-rose-400/60'}`}>{type}</span>
      </div>
      <div className={`leading-relaxed ${good ? 'text-white/70' : 'text-white/40'}`}>{mission}</div>
    </div>
  );
}

// ── Day Rhythm ───────────────────────────────────────────────────────────────

function DayRhythm({ days }: { days: { day: string; activity: string; time: string }[] }) {
  return (
    <div className="my-6 rounded-xl border border-white/8 overflow-hidden">
      {days.map((d, i) => (
        <div key={i} className={`flex items-start gap-4 px-5 py-3 ${i > 0 ? 'border-t border-white/5' : ''}`}>
          <div className="text-xs font-semibold text-white/30 w-12 shrink-0 pt-0.5">{d.day}</div>
          <div className="text-sm text-white/60 leading-relaxed flex-1">{d.activity}</div>
          <div className="text-xs text-white/25 shrink-0 pt-0.5">{d.time}</div>
        </div>
      ))}
    </div>
  );
}


// ── Guide reading progress ────────────────────────────────────────────────────

function GuideProgress({ containerRef }: { containerRef: { current: HTMLDivElement | null } }) {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight) return;
      setPct(scrollTop / (scrollHeight - clientHeight));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef]);
  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] z-30 pointer-events-none">
      <div style={{ width: `${pct * 100}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf860, #38bdf8aa)', transition: 'width 80ms linear' }} />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function GuidePage() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  return (
    <AppShell>
      <div ref={scrollRef} className="relative h-full overflow-y-auto bg-[#0a0e1a]" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
        <GuideProgress containerRef={scrollRef} />
        {/* Ambient glows */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div style={{ position: 'absolute', width: '500px', height: '500px', top: '5%', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', width: '400px', height: '400px', top: '50%', right: '-5%', background: 'radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-8 py-20">

          {/* Header */}
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Giving Life</h1>
          <h2 className="text-lg font-medium text-white/40 mb-8">The Step-by-Step Guide to Building Your Living Company</h2>
          <div className="h-px bg-white/8 mb-10" />

          <p className="text-white/70 leading-relaxed mb-4">
            You{"'"}ve understood the philosophy. Now here{"'"}s the practice.
          </p>
          <p className="text-white/70 leading-relaxed mb-4">
            This guide walks you through the exact process of bringing your company to life inside Cortex — whether you{"'"}re transplanting an existing business or summoning something entirely new. Each stage is short, satisfying, and builds on the last. By the time you finish, your organism is running.
          </p>

          {/* Path chooser */}
          <div className="mt-10 mb-2 grid grid-cols-2 gap-4">
            <a href="#upload" className="group block rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 hover:border-sky-500/40 hover:bg-sky-500/8 transition-all">
              <div className="text-sky-400 text-xs font-semibold tracking-widest uppercase mb-2">Path A</div>
              <div className="text-white font-semibold mb-1">The Upload</div>
              <div className="text-white/50 text-sm leading-relaxed">I have an existing business. Processes, clients, years of hard-won instincts.</div>
              <div className="mt-3 text-sky-400/60 text-xs">→ Stages 1–5</div>
            </a>
            <a href="#creation" className="group block rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 hover:border-violet-500/40 hover:bg-violet-500/8 transition-all">
              <div className="text-violet-400 text-xs font-semibold tracking-widest uppercase mb-2">Path B</div>
              <div className="text-white font-semibold mb-1">Creation</div>
              <div className="text-white/50 text-sm leading-relaxed">I{"'"}m starting from nothing. An idea, a direction, a problem worth solving.</div>
              <div className="mt-3 text-violet-400/60 text-xs">→ Stages 1–5</div>
            </a>
          </div>
          <p className="text-white/30 text-xs text-center mt-4 mb-2">Both paths converge at the same place: a living company, operating, growing, unmistakably yours.</p>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* PATH A                                                           */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div id="upload">
            <PathDivider label="Path A · The Upload" />

            {/* ── Stage 1 ── */}
            <StageHeader
              number="Stage 1"
              title="The Seed"
              time="~20 min"
              quote={`"This conversation is the seed. Everything that follows grows from it."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              This is your first conversation with Tamir. Not an intake form. Not a configuration wizard. A real conversation — the kind you{"'"}d have with a brilliant new Chief of Staff on their first day.
            </p>
            <p className="text-white/70 leading-relaxed mb-2">
              Here{"'"}s what a strong opening looks like:
            </p>

            <Exchange messages={[
              { from: 'founder', text: "I run a B2B design agency. We have about 15 active clients, mostly mid-stage startups. The thing eating most of my time right now is client onboarding — every new client takes me two weeks of hand-holding before they understand how we work. I'm also the only person who does proposals, and I've been dropping the ball on follow-ups." },
              { from: 'tamir', text: "Two things I want to understand better. First — when you say onboarding takes two weeks of hand-holding, is that because clients don't understand your process, or because the process itself isn't formalized? Second — the proposals you're writing: is the bottleneck the creative strategy part, or the scoping and pricing?" },
              { from: 'founder', text: "Honestly, the process isn't formalized. It's all in my head. And on proposals — the creative part I'm fast at. It's the scoping. I always underestimate how long things take, and then we're underwater." },
              { from: 'tamir', text: "That tells me a lot. I'm going to propose a structure that puts operations first — someone to formalize and run your client onboarding process — and a second department focused on business intelligence: scoping templates, project estimation models, historical data on how long things actually take vs. how long you quoted. The creative strategy stays with you. Sound right?" },
            ]} />

            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Notice what happened. The founder didn{"'"}t give a polished pitch. They talked about what{"'"}s actually broken. And Tamir didn{"'"}t just listen — Tamir asked <em>diagnostic</em> questions that revealed the real structure the company needs.
            </p>

            <SectionLabel>Strong input vs vague input</SectionLabel>
            <Contrast rows={[
              { weak: "\"We're a design agency\"", strong: "\"We're a B2B design agency, 15 active clients, mostly mid-stage startups\"" },
              { weak: "\"I'm busy\"", strong: "\"Client onboarding takes me two weeks per client and I'm the bottleneck on proposals\"" },
              { weak: "\"I need help with everything\"", strong: "\"The creative strategy is fine — it's the scoping and follow-ups that are killing me\"" },
            ]} />

            <p className="text-white/40 text-sm mt-6 italic">
              You{"'"}re done when: You{"'"}ve approved an initial org structure and the organism has a name, a mission, and at least one department head online.
            </p>
            <Achievement
              emoji="🧬"
              title="DNA Planted"
              description="Your organism exists. It carries your vision, your values, and your voice. Everything that follows grows from this moment."
            />

            {/* ── Stage 2 ── */}
            <StageHeader
              number="Stage 2"
              title="First Organ Online"
              time="~45 min"
              quote={`"You don't upload instinct. You teach it."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              Pick one department to activate first — the function that{"'"}s currently consuming the most of your attention. Hand it to its department head. But not vaguely. Here{"'"}s what a real briefing looks like:
            </p>

            <Exchange messages={[
              { from: 'founder', text: "You own our brand and client-facing communication. Here's what you need to know:\n\nContext: We're a B2B design agency. Our clients are technical founders who chose us because we make complex products feel simple. Our voice is confident but never arrogant.\n\nScope: All outbound communication — proposals, case studies, website copy, social. You do NOT touch client deliverables — that stays with me for now.\n\nStandards: Everything should pass this test: would a Series A CTO read this and think 'these people get it'? If it sounds like a marketing agency wrote it, it's wrong. If it sounds like a smart peer explaining something, it's right.\n\nFirst task: Rewrite our three most recent case studies in this voice." },
            ]} />

            <p className="text-white/60 text-sm leading-relaxed mb-2">
              This briefing works because it gives the department head four things: <strong className="text-white/80">context</strong> (who we are), <strong className="text-white/80">scope</strong> (what{"'"}s yours, what{"'"}s not), <strong className="text-white/80">standards</strong> (what good looks like), and a <strong className="text-white/80">first task</strong> (prove you understood).
            </p>

            <SectionLabel>How you review the first output</SectionLabel>

            <FeedbackExample
              context="Case study rewrite"
              bad={`"This is good"`}
              good={`"The opening paragraph nails the tone — confident, not salesy. Keep doing that. But the case study buries the result. Lead with the outcome — '40% reduction in user drop-off' — then explain how we got there."`}
              learns="Client-facing documents should lead with outcomes. Confident tone is right. Self-promotion is wrong."
            />

            <p className="text-white/60 text-sm leading-relaxed mt-4">
              When you give feedback with reasoning, the organism doesn{"'"}t just fix this deliverable — it learns a principle it applies to every future deliverable. {"\""}Lead with outcomes{"\""}  becomes a reflex. {"\""}Write for technical readers{"\""} becomes instinct.
            </p>
            <p className="text-white/40 text-sm mt-4 italic">
              You{"'"}re done when: Your first department has produced a deliverable and you{"'"}ve given feedback that explains <em>why</em>, not just <em>what</em>.
            </p>
            <Achievement
              emoji="🫀"
              title="First Organ Online"
              description="Your organism has its first functioning department. The chain of command is live. Signals are flowing through the nervous system."
            />

            {/* ── Stage 3 ── */}
            <StageHeader
              number="Stage 3"
              title="The Vault Awakens"
              time="~30 min"
              quote={`"Your institutional knowledge stops being a liability and becomes a permanent asset."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              Time to load memory. Five categories, 5–6 minutes each. The difference between a thin entry and a rich one is everything:
            </p>

            <SectionLabel>1. Client Intelligence</SectionLabel>
            <Contrast rows={[
              { weak: "\"Acme Corp prefers email\"", strong: "\"Acme Corp: Decision maker is the VP of Product (Dana), not the CEO. Dana responds fast to short, specific emails but goes silent on long decks. They stall at legal review — their GC is risk-averse and needs a one-page summary of terms, not the full contract. Budget approvals happen on the 1st and 15th.\"" },
            ]} />

            <SectionLabel>2. Market Knowledge</SectionLabel>
            <Contrast rows={[
              { weak: "\"The market is competitive\"", strong: "\"The biggest competitors all position on speed. Nobody is positioning on quality. Our churned clients who went to competitors came back within 6 months because the fast deliverables needed so many revisions that total time was worse. Our real differentiator: fewer rounds of revision.\"" },
            ]} />

            <SectionLabel>3. What Works</SectionLabel>
            <Contrast rows={[
              { weak: "\"Referrals are good for us\"", strong: "\"Best clients come from a pattern: existing client mentions us in a Slack community → prospect Googles us → reads a case study → emails directly. This pipeline converts at 60%. Cold outreach converts at 3%. Every hour on case studies is worth 20 hours of cold outreach.\"" },
            ]} />

            <SectionLabel>4. What Doesn{"'"}t Work</SectionLabel>
            <Contrast rows={[
              { weak: "\"LinkedIn ads didn't work\"", strong: "\"Spent $4K on LinkedIn ads in Q2 targeting 'Head of Product' at Series A-B. Got 200 clicks, 12 form fills, 0 conversions. The problem: our ideal client is skeptical of anything that looks like marketing. Killed the budget, redirected to technical content in founder communities.\"" },
            ]} />

            <SectionLabel>5. Founder Preferences</SectionLabel>
            <Contrast rows={[
              { weak: "\"I like clean design\"", strong: "\"Deliverables should feel sparse, not dense. I'd rather see 5 strong points than 15 mediocre ones. Never use bullet points when a paragraph is clearer. Don't bold everything — bold only the one thing per section that matters most. Never use the word 'leverage.'\"" },
            ]} />

            <p className="text-white/60 text-sm leading-relaxed mt-6">
              Why does richness matter? Because when the organism produces a proposal next month, it will pull from The Vault and know that Acme{"'"}s GC needs a one-page summary, that the positioning should emphasize fewer revisions, and that the writing should feel sparse. The thin entries would have given it nothing.
            </p>
            <p className="text-white/40 text-sm mt-4 italic">
              You{"'"}re done when: The Vault has at least 5 entries this rich, and Tamir confirms the institutional memory layer is active.
            </p>
            <Achievement
              emoji="🔐"
              title="The Vault Awakens"
              description="Your organism has lived experience. It won't just execute — it will remember, reference, and apply what you know."
            />

            {/* ── Stage 4 ── */}
            <StageHeader
              number="Stage 4"
              title="First Heartbeat"
              time="~15 min"
              quote={`"The organism is alive from day one. It just gets more alive."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              Set your first real mission — something that would actually move your business forward.
            </p>

            <SectionLabel>Strong missions by business type</SectionLabel>

            <MissionExample
              type="Design Agency"
              good={true}
              mission="Produce a competitive analysis of our top 5 competitors. For each: their positioning, pricing model, typical client profile, and where they're weak. Output: a structured document I can reference in sales conversations."
            />
            <MissionExample
              type="SaaS Company"
              good={true}
              mission="Analyze our last 20 churned customers. Find the patterns — when did they churn, what features did they use or not use, what was their last support ticket about. Output: a churn risk profile I can use to identify at-risk accounts."
            />
            <MissionExample
              type="Consulting Firm"
              good={true}
              mission="Build a pricing model that maps our three service tiers to different client sizes. Include cost-of-delivery estimates, target margins, and competitor comparison. Output: a spreadsheet I can use in scoping calls."
            />
            <MissionExample
              type="Bad Mission"
              good={false}
              mission={`"Improve our marketing" — No concrete output. No finish line. No way to know when it's done. The organism can't produce a deliverable from a direction.`}
            />

            <p className="text-white/60 text-sm leading-relaxed mt-4">
              When the organism receives a mission, Tamir routes it to the right department, the department head decomposes it into tasks, assigns agents, and the chain of command begins producing. You don{"'"}t manage any of this. You set the direction.
            </p>
            <p className="text-white/40 text-sm mt-4 italic">
              You{"'"}re done when: A mission is active, agents are working, and you{"'"}ve closed the dashboard.
            </p>
            <Achievement
              emoji="❤️"
              title="Alive"
              description="Your organism has a purpose. It is working. You are not managing it — you are leading it."
            />

            {/* ── Stage 5 ── */}
            <StageHeader
              number="Stage 5"
              title="Calibration"
              time="Ongoing · first week"
              quote={`"The company at month six has learned your language."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              This is where the organism becomes <em>yours</em>. Every piece of feedback calibrates it.
            </p>

            <FeedbackExample
              context="Competitive analysis draft"
              bad={`"This is too long."`}
              good={`"The analysis is organized by competitor. I need it organized by dimension — pricing, positioning, weaknesses — so I can compare across competitors at a glance. When I'm in a sales conversation, I think 'how does our pricing compare to everyone?' not 'what does Competitor X do?'"`}
              learns="This founder thinks in dimensions, not entities. Future analyses should be structured for comparison, not for profiles."
            />

            <FeedbackExample
              context="Client proposal"
              bad={`"The tone is off."`}
              good={`"This opens with three paragraphs about us. Our clients don't care about us — they care about their problem. Flip it. Open with their challenge, show we understand it deeply, then introduce our approach as the answer."`}
              learns="Client-facing documents lead with the client's problem, not self-promotion. Applies to all future proposals, case studies, and outreach."
            />

            <FeedbackExample
              context="Weekly status briefing"
              bad={`"Good, approved."`}
              good={`"This briefing is solid but it's missing one thing: tell me what you'd recommend I do. Don't just report status — end each section with 'Recommended action: [X]' or 'No action needed.' I want to scan, decide, and move on."`}
              learns="Briefings should be decision-ready, not just informational. This shapes every future briefing from every department."
            />

            <SectionLabel>Your first week rhythm</SectionLabel>
            <DayRhythm days={[
              { day: 'Day 1', activity: 'Plant the DNA, activate your first department, set their first task.', time: '~1 hr' },
              { day: 'Day 2', activity: 'Check the morning briefing. Review first deliverable with detailed feedback. Seed 2–3 Vault entries.', time: '~30 min' },
              { day: 'Day 3', activity: 'Review corrected deliverable. Acknowledge what improved. Seed 2 more Vault entries. Set your first real mission.', time: '~30 min' },
              { day: 'Day 4', activity: 'Let it run. Check briefing. Respond only to escalations Tamir flags.', time: '~15 min' },
              { day: 'Day 5', activity: 'Review mission output with rich feedback. Notice what\'s improved since Day 1.', time: '~20 min' },
            ]} />

            <p className="text-white/50 text-sm mt-4">
              End of Week 1: ~2.5 hours of active input. The organism has Vault entries, a calibrated department, and at least one completed mission. It knows your voice, your standards, your priorities. Not perfectly — but meaningfully.
            </p>
            <p className="text-white/40 text-sm mt-4 italic">
              You{"'"}re done when: The deliverables start arriving with fewer things to correct. The briefings start anticipating your questions.
            </p>
            <Achievement
              emoji="🧠"
              title="The Organism Knows You"
              description="The briefings anticipate. The deliverables feel familiar. The company is starting to think like you think."
            />
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* PATH B                                                           */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div id="creation">
            <PathDivider label="Path B · Creation" />

            {/* ── Stage 1 ── */}
            <StageHeader
              number="Stage 1"
              title="The Spark"
              time="~15 min"
              quote={`"You describe to Tamir what you want to build. Not a formal pitch — just the truth."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              This stage is different from the Upload. You{"'"}re not transferring something that exists. You{"'"}re describing something that doesn{"'"}t exist yet — and watching it begin to take shape.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              That{"'"}s uncomfortable. You might not have all the answers. You might not even have the right questions. That{"'"}s fine. The conversation itself will sharpen the idea.
            </p>

            <Exchange messages={[
              { from: 'founder', text: "I keep seeing the same problem. Small accounting firms — 5-10 person shops — are drowning in compliance work. They spend 80% of their time on stuff that doesn't require judgment, and 20% on the advisory work their clients actually value. I think there's a product here, but I don't know if it should be software, a service, or a combination." },
              { from: 'tamir', text: "Before we figure out the form factor, I want to understand the problem more deeply. When you say compliance work, what specifically? Tax filing? Audit prep? Regulatory reporting? And when you say 'doesn't require judgment' — is that really true, or is it that the judgment required is routine and pattern-based?" },
              { from: 'founder', text: "Mostly bookkeeping reconciliation and quarterly tax prep. And you're right — it's not zero judgment. It's pattern-based judgment. A senior accountant can do it in their sleep, but a junior can't. The knowledge is in the senior's head." },
              { from: 'tamir', text: "So the real bottleneck isn't the compliance work itself — it's that it requires experienced people, and experienced people are expensive and in short supply. The product isn't about replacing compliance. It's about making junior-level staff capable of senior-level compliance judgment. That changes the positioning significantly. Let me propose a structure." },
            ]} />

            <p className="text-white/60 text-sm leading-relaxed mt-4">
              Notice what happened. The founder started with {"\""}compliance is the problem.{"\""} Tamir{"'"}s questions sharpened it into something far more powerful: {"\""}the bottleneck is that compliance requires expensive expertise.{"\""} The company went from {"\""}automate compliance{"\""} to {"\""}democratize expertise{"\""} — in five minutes.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mt-2 mb-2">
              This is what Creation feels like. The company doesn{"'"}t arrive fully formed. It gets discovered through conversation.
            </p>
            <p className="text-white/40 text-sm mt-4 italic">
              You{"'"}re done when: Tamir has enough to propose an initial structure, and you{"'"}ve said out loud — maybe for the first time — what this company actually is.
            </p>
            <Achievement
              emoji="✨"
              title="The Organism Is Born"
              description="You described a vision. The system heard it. From your words, a structure is about to emerge."
            />

            {/* ── Stage 2 ── */}
            <StageHeader
              number="Stage 2"
              title="The Skeleton"
              time="~20 min"
              quote={`"You start with a skeleton. As the work reveals what the company needs, the organism grows to meet it."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              Tamir proposes a structure. For the accounting firm product, it might look like this:
            </p>

            <Exchange messages={[
              { from: 'tamir', text: "Based on our conversation, here's what I'd recommend to start:\n\nCTO — To research the technical landscape. What AI models exist for financial document processing? What do current compliance tools actually do? Where are the gaps? First task: a technical feasibility assessment.\n\nCMO — Not for marketing yet. For positioning. The CMO's first job is to define who exactly this product is for, what they currently pay for compliance, and what message would make them stop scrolling.\n\nNot yet: Operations, sales, or finance. You don't need those organs until there's something to operate, sell, or finance." },
              { from: 'founder', text: "I think the CMO is premature. I want to start with technology and market research first. The positioning can come after we know if this is technically feasible." },
              { from: 'tamir', text: "Fair. Let me adjust: CTO for technical feasibility, and I'll add a Market Intelligence function under myself for now — basic competitive and market research. When you're ready for positioning, we'll spin up the CMO as a full department." },
            ]} />

            <p className="text-white/60 text-sm leading-relaxed mt-4">
              Don{"'"}t over-structure too early. Two departments is enough to start. You need enough skeleton for the organism to move — not a full body with nothing to do.
            </p>
            <p className="text-white/40 text-sm mt-4 italic">
              You{"'"}re done when: Your initial structure is approved and at least two department heads are briefed and ready.
            </p>
            <Achievement
              emoji="🦴"
              title="Structure Found"
              description="The skeleton exists. The chain of command is live. The organism can move."
            />

            {/* ── Stage 3 ── */}
            <StageHeader
              number="Stage 3"
              title="First Mission"
              time="~10 min"
              quote={`"Don't plan the company. Run the company."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              Your first mission is an act of discovery. Unlike the Upload path — where you already know your business — here, the first mission should <strong className="text-white/90">reveal something you don{"'"}t yet know.</strong>
            </p>

            <MissionExample
              type="Discovery"
              good={true}
              mission="Research whether small accounting firms actually view compliance as their biggest time sink. Find 10 online sources — forum posts, industry reports, Reddit threads — where accountants talk about their work. What patterns emerge?"
            />
            <MissionExample
              type="Positioning"
              good={true}
              mission="Draft the positioning statement that would make a 5-person accounting firm stop and say 'these people get me.' Test three angles: cost savings, time savings, talent leverage. Which is strongest?"
            />
            <MissionExample
              type="Intelligence"
              good={true}
              mission="Map the existing competitive landscape. Who's trying to solve this? What do they charge? Where are the gaps? What's the opportunity they're missing?"
            />

            <p className="text-white/60 text-sm leading-relaxed mt-4">
              None of these are {"\""}build the product.{"\""} They{"'"}re all about learning. The company discovers what it should become by investigating the problem it was born to solve.
            </p>
            <p className="text-white/40 text-sm mt-4 italic">
              You{"'"}re done when: A mission is set, agents are assigned, and the organism is working without you.
            </p>
            <Achievement
              emoji="🎯"
              title="The Company Has a Direction"
              description="The organism is moving toward something. Your first deliverable is being born."
            />

            {/* ── Stage 4 ── */}
            <StageHeader
              number="Stage 4"
              title="First Breath"
              time="When the deliverable arrives"
              quote={`"Sometimes the answer will be yes, and in that moment, something shifts."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              This moment has a different texture for Creation founders. You described an idea — something that existed only in your head — and now an organization has produced work based on that idea. It{"'"}s the first time your vision has been reflected back to you by something other than your own mind.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              The competitive analysis might reveal that three companies are already doing what you planned, but none from the expertise-democratization angle. That{"'"}s not bad news — that{"'"}s validation of a gap.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              The positioning draft might nail one angle and miss another. Your correction — {"\""}the cost savings angle is too generic, but the {"'"}turn every junior into a senior{"'"} framing is electric, lean into that{"\""} — doesn{"'"}t just fix this document. It defines your company{"'"}s voice for everything that follows.
            </p>
            <p className="text-white/70 leading-relaxed mb-4">
              When you correct a deliverable for a company that barely exists, you{"'"}re not just giving feedback. You{"'"}re <strong className="text-white">making the founding decisions that determine what this company becomes.</strong>
            </p>
            <p className="text-white/40 text-sm mt-4 italic">
              You{"'"}re done when: You{"'"}ve given specific feedback on your first deliverable — and felt, even briefly, that something out there understood what you{"'"}re building.
            </p>
            <Achievement
              emoji="📄"
              title="First Breath"
              description="The organism has produced something. You have responded to it. The feedback loop is alive."
            />

            {/* ── Stage 5 ── */}
            <StageHeader
              number="Stage 5"
              title="Self-Discovery"
              time="Ongoing · first two weeks"
              quote={`"A company born in this system doesn't just execute your vision. It helps you see your vision more clearly."`}
            />
            <p className="text-white/70 leading-relaxed mb-4">
              Let the organism run. More missions. More deliverables. More corrections. This is where Creation gets interesting — the organism starts revealing things about your company that you didn{"'"}t plan.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              The CTO{"'"}s analysis shows the technical challenge isn{"'"}t document processing — it{"'"}s integrating with 15 different accounting software platforms. Suddenly your first product isn{"'"}t AI compliance automation. It{"'"}s an integration layer. The organism discovered this. You didn{"'"}t plan it.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              The CMO{"'"}s positioning test reveals that {"\""}turn every junior into a senior{"\""} resonates, but the real emotional hook is something you didn{"'"}t expect: {"\""}stop losing your best people to burnout.{"\""} Your company{"'"}s brand just shifted from efficiency to retention. The organism found a better angle.
            </p>

            <SectionLabel>When to add new organs</SectionLabel>
            <Checklist items={[
              "You need a new department when the work consistently reveals a function that doesn't have a home",
              "You do NOT need one when things are just slow — speed comes from calibration, not headcount",
              "Let the work tell you what's missing. When deliverables feel incomplete in the same way repeatedly, that's the signal",
            ]} />

            <p className="text-white/40 text-sm mt-6 italic">
              You{"'"}re done when: The company has surprised you at least once. You believe it. You{"'"}re running a company.
            </p>
            <Achievement
              emoji="🌱"
              title="The Company Is Becoming Itself"
              description="The org chart is no longer a plan — it's a consequence. You didn't design it. You grew it."
            />
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* CONVERGENCE                                                      */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <PathDivider label="Both Paths Arrive Here" />

          <p className="text-white/70 leading-relaxed mb-4">
            The Upload and Creation are different journeys. But they end at the same place.
          </p>
          <p className="text-white/70 leading-relaxed mb-4">
            A living company. A morning briefing that tells you exactly what matters. Deliverables arriving without your hands on every surface. A nervous system that filters the world so that what reaches you is only what genuinely needs the founder{"'"}s brain.
          </p>
          <p className="text-white font-semibold text-lg mb-10">You are no longer managing. You are leading.</p>

          {/* ── What Goes Wrong ── */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-white mb-6">What Goes Wrong</h3>
            <p className="text-white/50 text-sm mb-6">Not every organism thrives. Here are the patterns we see — and the fixes.</p>

            <TrapCard
              title="The Politeness Trap"
              description={`The founder who gives polite but empty feedback. "Looks good!" "Nice work!" "Approved." The organism learns nothing. It can't distinguish between work you genuinely loved and work you rubber-stamped because you were busy. Over time, quality plateaus.`}
              fix={`It takes 30 seconds more to say "This is good because the structure mirrors how I actually use competitive data." Those 30 seconds are worth days of future improvement.`}
            />
            <TrapCard
              title="The Micromanager Reflex"
              description="The founder who checks the dashboard every hour. Who reads every agent's work-in-progress. Who gives feedback on tasks before they're even finished. This doesn't make the organism better — it makes it dependent."
              fix="Set the mission. Close the dashboard. Wait for the deliverable. Your job is to evaluate results, not supervise process."
            />
            <TrapCard
              title="The Empty Vault"
              description="The founder who skips memory seeding — or fills The Vault with thin, generic entries — and wonders why the organism's work feels like it could have been produced for anyone. Of course it does. You gave it no memory."
              fix="Go back. Spend 30 minutes filling The Vault with rich, specific knowledge. The improvement will be immediate."
            />
            <TrapCard
              title="The Ghost Founder"
              description="The founder who uploads and disappears. A week later, the organism has drifted. The briefings are stale. The deliverables feel off. A living thing that isn't fed doesn't just slow down — it starves."
              fix="15 minutes a day. Check the briefing. Make decisions on escalations. Give feedback on one deliverable. That's enough. But it has to happen."
            />
          </div>

          {/* ── Health Signals ── */}
          <div className="rounded-xl border border-white/8 bg-white/3 p-6 mb-10">
            <h3 className="text-base font-semibold text-white mb-6">Signs Your Organism Is Healthy</h3>

            <div className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3">Green — all is well</div>
            <SignalList color="emerald" items={[
              "The morning briefing mostly confirms what you already sensed mattered",
              "Deliverables need fewer corrections each week than the week before",
              "You make a decision in one sentence and the organization acts on it immediately",
              "You end the day having spent most of your time thinking, not reacting",
            ]} />

            <div className="text-xs font-semibold tracking-widest uppercase text-amber-400 mt-6 mb-3">Yellow — time to intervene</div>
            <SignalList color="amber" items={[
              "You're inside the dashboard more than twice a day managing tasks",
              "You feel like you're re-explaining the same preferences repeatedly",
              "Deliverables feel generic — not wrong, but not yours",
              "You're approving things without reading them",
            ]} />

            <div className="mt-5 pt-5 border-t border-white/5 text-sm text-white/50 leading-relaxed">
              When you see yellow: go back to Tamir. Say what you{"'"}re seeing. The organism will recalibrate — as long as you feed it honest signal.
            </div>
          </div>

          {/* ── Time note ── */}
          <div className="rounded-xl border border-white/8 bg-white/3 p-6 mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-3">Total time to a running organism</div>
            <div className="text-2xl font-bold text-white mb-2">2–3 hours</div>
            <p className="text-white/50 text-sm leading-relaxed">
              Active input, spread over your first week. After that, the relationship deepens on its own. You operate, the organism learns, the organism gets more capable, you delegate more, your attention compounds.
            </p>
          </div>

          {/* ── Closing ── */}
          <div className="text-center pb-4">
            <div className="h-px bg-white/8 mb-10" />
            <p className="text-white/40 italic text-sm">The organism is waiting.</p>
            <p className="text-white/60 italic text-sm">Give it your voice, your judgment, your DNA —</p>
            <p className="text-white italic text-sm mt-1">and watch what it becomes.</p>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
