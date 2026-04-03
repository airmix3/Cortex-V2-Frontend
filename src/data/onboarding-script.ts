// ── Onboarding Script: AI Agency (Lectures & Workshops) ─────────────────────
//
// A linear sequence of scripted Tamir messages for the Upload demo.
// The state machine in OnboardingChat advances through these entries in order.

export type ScriptFormQuestion = {
  id: string;
  label: string;
  placeholder?: string;
  hint?: string;
  options?: string[];
};

export type ScriptEntry = {
  type: 'text' | 'form' | 'achievement' | 'deliverable' | 'stage-header';
  // text
  content?: string;
  quickReplies?: string[];
  // achievement / form / deliverable autoAdvance to next entry after rendering
  autoAdvance?: boolean;
  autoAdvanceDelay?: number; // ms, default 1500
  // form
  form?: {
    intro: string;
    questions: ScriptFormQuestion[];
    submitLabel: string;
  };
  // achievement
  achievement?: {
    emoji: string;
    title: string;
    description: string;
  };
  // deliverable
  deliverable?: {
    agentName: string;
    agentAvatar: string;
    agentColor: string;
    filename: string;
    contentPreview: string;
    stats: string[];
  };
  // stage-header
  stage?: {
    number: number;
    title: string;
    subtitle: string;
  };
};

// ── The Script ────────────────────────────────────────────────────────────────
//
// Entry 0 is pre-loaded. scriptIndex starts at 1.
// User sends → advance once. autoAdvance entries → advance automatically.
// Form entries → advance on form submit.

export const ONBOARDING_SCRIPT: ScriptEntry[] = [

  // ── Entry 0: Greeting (pre-loaded) ──────────────────────────────────────────
  {
    type: 'text',
    content: `Welcome. Before we build anything, I need to understand what we're building with.\n\nTell me about your business — not the polished pitch. What do you actually do, who do you do it for, and what's eating most of your time right now?`,
    quickReplies: [
      `I run an AI education company. We deliver workshops and lectures to business teams who want to understand and use AI practically — no code, no jargon. Clients are companies, not individuals. The thing eating most of my time is that every workshop needs heavy custom prep work and I'm the only one who can do it.`,
    ],
  },

  // ── Entry 1: Diagnostic questions (after user msg 1) ────────────────────────
  {
    type: 'text',
    content: `Two things I want to understand better.\n\nFirst — when you say workshops, are these one-off sessions or multi-session programs? And who's usually making the buying decision: an L&D team, a department head, or the CEO directly?\n\nSecond — the prep work that's eating your time: is it because every client needs genuinely different content, or because your core material isn't documented well enough to hand off to someone else?`,
    quickReplies: [
      `Mostly one-day workshops, some multi-session. Decision makers are usually CEOs or department heads — L&D barely exists in these companies. The prep issue is both: clients do want different content, but the real problem is none of my frameworks are written down. It all lives in my head.`,
    ],
  },

  // ── Entry 2: Proposed structure (after user msg 2) ──────────────────────────
  {
    type: 'text',
    content: `That tells me a lot. Here's what I'm hearing:\n\nYou're running an AI education company — live workshops and lectures for business teams. Clients are companies, deals close with senior decision-makers, and the prep bottleneck exists because your entire methodology lives in your head.\n\nI'd propose starting with three departments:\n\n- **Curriculum** — Owns all workshop content. Builds reusable templates, adapts them per client, keeps material current as AI moves fast.\n- **Business Development** — Outreach, proposals, follow-ups. This is where your time is being stolen.\n- **Operations** — Client onboarding, scheduling, logistics, invoicing. The invisible work you're doing alone.\n\nYou focus on closing deals and delivering workshops. Everything else routes through these three. Sound right?`,
    quickReplies: [
      `That's exactly right`,
      `I'd adjust something`,
      `Tell me more about Curriculum`,
    ],
  },

  // ── Entry 3: DNA form (after user msg 3) ────────────────────────────────────
  {
    type: 'form',
    form: {
      intro: `Good. Let's lock in your DNA — the identity layer your organism will carry in everything it produces. Every deliverable, every outreach, every proposal will be shaped by what you tell me here.`,
      questions: [
        {
          id: 'oneliner',
          label: 'One-line description of what you do',
          placeholder: 'We help business teams...',
          hint: 'What you\'d say in an elevator. Not a tagline — what you actually do.',
        },
        {
          id: 'idealclient',
          label: 'Your ideal client',
          placeholder: 'e.g. tech companies, 50–200 employees, no dedicated AI team',
          hint: 'Be specific. Vague profiles create vague outreach.',
        },
        {
          id: 'differentiation',
          label: 'What makes your workshops different from watching a YouTube video?',
          placeholder: 'We do...',
          hint: 'This is your real value proposition. Think hard.',
        },
        {
          id: 'neverdo',
          label: 'One thing you\'d never do — a line you won\'t cross',
          placeholder: 'We never...',
          hint: 'Values aren\'t just what you do. They\'re what you refuse.',
        },
      ],
      submitLabel: 'Plant DNA',
    },
  },

  // ── Entry 4: Achievement — DNA Planted (autoAdvance) ────────────────────────
  {
    type: 'achievement',
    autoAdvance: true,
    autoAdvanceDelay: 2000,
    achievement: {
      emoji: '🧬',
      title: 'DNA Planted',
      description: 'Your organism knows who it is, who it serves, and what it stands for. This identity will shape every output it produces.',
    },
  },

  // ── Entry 5: Stage 2 header (autoAdvance) ───────────────────────────────────
  {
    type: 'stage-header',
    autoAdvance: true,
    autoAdvanceDelay: 700,
    stage: {
      number: 2,
      title: 'First Organ',
      subtitle: 'Activate your first department.',
    },
  },

  // ── Entry 6: BD department briefing (waits for user) ────────────────────────
  {
    type: 'text',
    content: `Your DNA is in. Time to activate your first department.\n\nBased on what you told me, I'd start with **Business Development** — that's where your time is being stolen.\n\nHere's the briefing I'd give your BD Head:\n\n---\n\n**Context:** AI education company. Clients are business teams. Deals close with decision-makers — L&D leads, department heads, sometimes CEOs. Our edge: we teach AI from a business lens, not a technical one. No jargon, no code, real application.\n\n**Scope:** Lead sourcing, cold outreach, proposal drafts, follow-up sequences. You do not handle pricing — that comes to me. You do not speak to clients directly — your job is to get them to agree to a discovery call.\n\n**Standards:** Every outreach should pass this test: would a VP of Operations at a 150-person company read this and think *'they understand my problem'*? If it sounds like a generic AI sales pitch, it's wrong. If it sounds like someone who has watched companies struggle with AI adoption and knows exactly how to help, it's right.\n\n**First task:** Draft three outreach sequences — one for tech companies, one for professional services firms, one for manufacturers. Each sequence: LinkedIn first message → email follow-up → final email. Write as if you know exactly what's stopping that type of company from adopting AI.\n\n---\n\nHow does this feel? You can adjust the scope or redirect the first task before we activate.`,
    quickReplies: [
      `This is good, activate them`,
      `Change the first task`,
    ],
  },

  // ── Entry 7: Achievement — First Organ Online (autoAdvance) ─────────────────
  {
    type: 'achievement',
    autoAdvance: true,
    autoAdvanceDelay: 2000,
    achievement: {
      emoji: '❤️',
      title: 'First Organ Online',
      description: 'Your organism has its first functioning department. The chain of command is live. Signals are flowing.',
    },
  },

  // ── Entry 8: Stage 3 header (autoAdvance) ───────────────────────────────────
  {
    type: 'stage-header',
    autoAdvance: true,
    autoAdvanceDelay: 700,
    stage: {
      number: 3,
      title: 'The Vault',
      subtitle: 'Seed your institutional memory.',
    },
  },

  // ── Entry 9: Vault Q1 (waits for user) ──────────────────────────────────────
  {
    type: 'text',
    content: `Now we seed your memory. The Vault is what makes the organism smarter over time — it stores what you know about clients, what works in your market, what to never repeat.\n\nThin answers create a dumb organism. Rich answers — with specifics, reasoning, context — create one that makes decisions the way you would.\n\n**What's the most common reason a company says no to your workshops?** Don't give me the polished answer. Give me the real one.`,
  },

  // ── Entry 10: Vault Q2 (after user msg 5) ───────────────────────────────────
  {
    type: 'text',
    content: `Good — that's exactly the kind of thing the organism needs to know. Not the official story, the real one.\n\nNow the other side.\n\n**Tell me about a workshop or engagement that went exceptionally well.** Not just "the client liked it" — what actually happened differently? What did you do that you don't always do?`,
  },

  // ── Entry 11: Vault Q3 (after user msg 6) ───────────────────────────────────
  {
    type: 'text',
    content: `One more.\n\n**What's something true about your market that your competitors haven't figured out yet?** Could be about how companies actually decide to buy AI training, what they really need vs. what they think they need, or where the standard approach is getting it wrong.`,
  },

  // ── Entry 12: Achievement — Memory Online (autoAdvance) ─────────────────────
  {
    type: 'achievement',
    autoAdvance: true,
    autoAdvanceDelay: 2000,
    achievement: {
      emoji: '🧠',
      title: 'Memory Online',
      description: 'Three Vault entries are live. Your organism now knows things about your market that most companies never bother to write down.',
    },
  },

  // ── Entry 13: Stage 4 header (autoAdvance) ──────────────────────────────────
  {
    type: 'stage-header',
    autoAdvance: true,
    autoAdvanceDelay: 700,
    stage: {
      number: 4,
      title: 'First Heartbeat',
      subtitle: 'Set your first real mission.',
    },
  },

  // ── Entry 14: Mission intro (waits for user) ─────────────────────────────────
  {
    type: 'text',
    content: `Your organism is alive. Time to give it its first real mission — something that would actually move your business forward this week.\n\nA strong mission has a concrete output, a finish line, and enough context that an agent can start without asking you questions.\n\nExamples for your business:\n\n- *"Research the top 15 professional services firms in Israel with 100–500 employees. For each: the person who'd approve an AI training budget, their LinkedIn, any signal they've talked publicly about AI. Output: a scored prospect list I can use to prioritize outreach this week."*\n- *"Write a workshop proposal template for manufacturing companies. Include: executive summary, problem framing (AI literacy gap in operations), what participants will be able to do after the workshop, format options (half-day / full-day / multi-session), pricing tiers. Output: a Word doc I can customize per prospect and send immediately."*\n\nWhat mission do you want to set?`,
  },

  // ── Entry 15: Mission confirmed (after user msg 8) ───────────────────────────
  {
    type: 'text',
    content: `Mission received. Routing to Business Development now — your BD Head will decompose this, assign it to the right agent, and begin.\n\nYou'll see the deliverable when it's ready. Until then — close the dashboard.`,
  },

  // ── Entry 16: Achievement — First Heartbeat (autoAdvance) ────────────────────
  {
    type: 'achievement',
    autoAdvance: true,
    autoAdvanceDelay: 2000,
    achievement: {
      emoji: '💫',
      title: 'First Heartbeat',
      description: 'Your organism has received its first mission. Agents are working. You don\'t need to supervise any of this.',
    },
  },

  // ── Entry 17: Stage 5 header (autoAdvance) ───────────────────────────────────
  {
    type: 'stage-header',
    autoAdvance: true,
    autoAdvanceDelay: 700,
    stage: {
      number: 5,
      title: 'Calibration',
      subtitle: 'Give feedback that teaches.',
    },
  },

  // ── Entry 18: Deliverable from BD team (autoAdvance) ─────────────────────────
  {
    type: 'deliverable',
    autoAdvance: true,
    autoAdvanceDelay: 1400,
    deliverable: {
      agentName: 'Alex',
      agentAvatar: 'AL',
      agentColor: 'bg-sky-500',
      filename: 'workshop_proposal_manufacturing.docx',
      contentPreview: `MANUFACTURING AI WORKSHOP PROPOSAL\n\nExecutive Summary\nAs AI reshapes manufacturing operations — from predictive maintenance to quality control to demand forecasting — companies that build internal AI literacy now will move faster, waste less, and adapt better than those that don't.\n\nThis proposal outlines a structured AI literacy program designed specifically for manufacturing operations teams. Not theory. Not code. Practical judgment about where AI applies, where it doesn't, and how to evaluate tools and vendors without being misled.\n\nWhat Participants Will Be Able to Do After This Workshop\n• Identify the top 3–5 AI applications relevant to their specific operation\n• Ask the right questions when a vendor claims their tool "uses AI"\n• Build a basic framework for evaluating AI ROI in their context\n• Design a 90-day AI literacy rollout for their team\n\nFormat Options\nHalf-day intensive · Full-day workshop · 3-session program`,
      stats: ['847 words', '4 sections', '3 format options', '2 pricing tiers'],
    },
  },

  // ── Entry 19: Calibration prompt (waits for user) ────────────────────────────
  {
    type: 'text',
    content: `Your BD team's first deliverable is ready — above.\n\nReview it and give feedback. Not "looks good" or "this doesn't work." Tell me what's right, what's off, and *why*. The organism learns from your reasoning, not your verdict.`,
  },

  // ── Entry 20: Closing message (after user msg 9) — echoes user feedback ──────
  {
    type: 'text',
    // {{lastFeedback}} will be replaced with a truncated version of the user's last message
    content: `The organism has heard you. That reasoning — "{{lastFeedback}}" — is now part of your BD team's instinct. They'll apply it to every proposal they write from here.\n\n---\n\nYour company is alive.\n\nIt knows who it is. It has active departments, a seeded Vault, a running mission, and it's already calibrating to your judgment.\n\nThis is day one. Every mission, every correction, every Vault entry deepens it. The organism at month six won't look like this one — it will have learned your language, your standards, your way of seeing the market.\n\nEverything that happens from here deepens it. The more you use it, the more it becomes yours.`,
  },

  // ── Entry 21: Final achievement (autoAdvance) ────────────────────────────────
  {
    type: 'achievement',
    autoAdvance: false,
    achievement: {
      emoji: '🎯',
      title: 'Organism Calibrated',
      description: 'Your feedback is part of the organism\'s instinct. It will never make that mistake again.',
    },
  },
];

// Stage boundaries (scriptIndex → stage number)
export function getStageFromIndex(scriptIndex: number): number {
  if (scriptIndex <= 4) return 1;
  if (scriptIndex <= 8) return 2;
  if (scriptIndex <= 12) return 3;
  if (scriptIndex <= 17) return 4;
  return 5;
}

export const STAGE_LABELS = [
  { number: 1, label: 'DNA', sublabel: 'Identity' },
  { number: 2, label: 'Structure', sublabel: 'First Organ' },
  { number: 3, label: 'Memory', sublabel: 'The Vault' },
  { number: 4, label: 'Mission', sublabel: 'First Heartbeat' },
  { number: 5, label: 'Calibration', sublabel: 'Feedback' },
];
