'use client';

import AppShell from '@/components/layout/AppShell';
import Link from 'next/link';
import { FileText, ArrowRight, Sparkles, BookOpen, Play, TrendingUp, Activity, Upload, UserCheck, Swords } from 'lucide-react';

const docs = [
  {
    href: '/manifesto',
    icon: Sparkles,
    iconColor: '#a78bfa',
    iconBg: 'rgba(167,139,250,0.10)',
    borderColor: 'rgba(167,139,250,0.15)',
    hoverBorder: 'rgba(167,139,250,0.35)',
    tag: 'PHILOSOPHY',
    tagColor: '#a78bfa',
    title: 'The Upload',
    subtitle: 'What it means to give life to a company.',
    description:
      'A philosophical foundation for everything Cortex is built on. Understand the organism metaphor, the three layers of transfer, and why this changes what a company even is.',
    meta: '~10 min read',
  },
  {
    href: '/guide',
    icon: BookOpen,
    iconColor: '#38bdf8',
    iconBg: 'rgba(56,189,248,0.10)',
    borderColor: 'rgba(56,189,248,0.15)',
    hoverBorder: 'rgba(56,189,248,0.35)',
    tag: 'GUIDE',
    tagColor: '#38bdf8',
    title: 'Giving Life',
    subtitle: 'The step-by-step guide to building your living company.',
    description:
      'The practical roadmap. Whether you\'re uploading an existing business or summoning something new — five stages, real examples, gamified milestones, and everything you need to know before your organism runs.',
    meta: '2–3 hours to complete',
  },
  {
    href: '/metabolism',
    icon: TrendingUp,
    iconColor: '#34d399',
    iconBg: 'rgba(52,211,153,0.10)',
    borderColor: 'rgba(52,211,153,0.15)',
    hoverBorder: 'rgba(52,211,153,0.35)',
    tag: 'ECONOMICS',
    tagColor: '#34d399',
    title: 'The Metabolism',
    subtitle: 'How a living company converts intelligence into economic value.',
    description:
      'Why activity is not value, how agents become economically conscious, the six universal growth levers, and how the system tracks real business outcomes — not just deliverables.',
    meta: '~12 min read',
  },
  {
    href: '/living-company',
    icon: Activity,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.10)',
    borderColor: 'rgba(245,158,11,0.15)',
    hoverBorder: 'rgba(245,158,11,0.35)',
    tag: 'INTELLIGENCE',
    tagColor: '#f59e0b',
    title: 'The Living Company',
    subtitle: 'What separates an intelligent system that runs from one that lives.',
    description:
      'Five properties that define genuine organizational life. Five stages of intelligence development. And the single line that separates every AI tool on the market from a system that actually thinks.',
    meta: '~15 min read',
  },
  {
    href: '/executive-assistant',
    icon: UserCheck,
    iconColor: '#f97316',
    iconBg: 'rgba(249,115,22,0.10)',
    borderColor: 'rgba(249,115,22,0.15)',
    hoverBorder: 'rgba(249,115,22,0.35)',
    tag: 'OPERATIONS',
    tagColor: '#f97316',
    title: 'The Executive Assistant',
    subtitle: 'Tamir\'s second mode — one intelligence, two spaces.',
    description:
      'Why the same AI that runs the company should also run the CEO. Two spaces, one intelligence — and why that context advantage makes Tamir a better personal assistant than any human could be.',
    meta: '~12 min read',
  },
  {
    href: '/command-layer',
    icon: Swords,
    iconColor: '#ef4444',
    iconBg: 'rgba(239,68,68,0.10)',
    borderColor: 'rgba(239,68,68,0.15)',
    hoverBorder: 'rgba(239,68,68,0.35)',
    tag: 'DESIGN PHILOSOPHY',
    tagColor: '#ef4444',
    title: 'The Command Layer',
    subtitle: 'Why running a company should feel like commanding one.',
    description:
      'The case against task management and for command design. Scarcity, trade-offs, fog of war, consequence loops, and progression — how the structural properties of strategy games map onto the reality of running a living company. Not gamification. Command.',
    meta: '~18 min read',
  },
  {
    href: '/upload-demo',
    icon: Upload,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.10)',
    borderColor: 'rgba(245,158,11,0.15)',
    hoverBorder: 'rgba(245,158,11,0.35)',
    tag: 'INTERACTIVE DEMO',
    tagColor: '#f59e0b',
    title: 'The Upload',
    subtitle: 'Transfer your intelligence into a living company — in five sessions.',
    description:
      'The full Upload journey. Five sessions: transmit your identity, install economic consciousness, seed institutional memory, set your first mission, and witness the organism\'s first act of emergence. This is how a company comes to life.',
    meta: '~15 min interactive',
  },
  {
    href: '/onboarding',
    icon: Play,
    iconColor: '#34d399',
    iconBg: 'rgba(52,211,153,0.10)',
    borderColor: 'rgba(52,211,153,0.15)',
    hoverBorder: 'rgba(52,211,153,0.35)',
    tag: 'QUICK DEMO',
    tagColor: '#34d399',
    title: 'Quick Onboarding',
    subtitle: 'A shorter version — plant your DNA, activate a department, set a mission.',
    description:
      'The condensed onboarding experience. Five stages, real examples, gamified milestones. Good for a quick taste of what the Upload feels like.',
    meta: '~10 min interactive',
  },
];

export default function DocsPage() {
  return (
    <AppShell>
      <div className="h-full overflow-y-auto bg-[#0a0e1a]">
        <div className="max-w-2xl mx-auto px-6 py-16">

          {/* Header */}
          <div className="mb-14">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.20)' }}>
                <FileText size={15} className="text-indigo-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-400">
                Documentation
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight leading-tight mb-4">
              The Cortex Library
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-lg">
              Everything you need to understand the philosophy behind Cortex and
              how to bring your company to life inside it.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mb-12" />

          {/* Doc cards */}
          <div className="space-y-5">
            {docs.map((doc) => {
              const Icon = doc.icon;
              return (
                <Link
                  key={doc.href}
                  href={doc.href}
                  className="group block rounded-2xl p-6 transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: `1px solid ${doc.borderColor}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.border = `1px solid ${doc.hoverBorder}`;
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.border = `1px solid ${doc.borderColor}`;
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                  }}
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div
                      className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
                      style={{ background: doc.iconBg, border: `1px solid ${doc.borderColor}` }}
                    >
                      <Icon size={19} style={{ color: doc.iconColor }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-[9px] font-bold uppercase tracking-[0.16em]"
                          style={{ color: doc.tagColor }}
                        >
                          {doc.tag}
                        </span>
                        <span className="text-white/20 text-[9px]">·</span>
                        <span className="text-white/30 text-[10px]">{doc.meta}</span>
                      </div>
                      <h2 className="text-[18px] font-bold text-white leading-snug mb-1 tracking-tight">
                        {doc.title}
                      </h2>
                      <p className="text-white/40 text-[12px] font-medium mb-3">
                        {doc.subtitle}
                      </p>
                      <p className="text-white/55 text-[13px] leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowRight size={16} style={{ color: doc.iconColor }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-16 pt-8 border-t border-white/[0.05]">
            <p className="text-white/20 text-[11px] leading-relaxed text-center">
              More documentation will appear here as the system grows.
            </p>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
