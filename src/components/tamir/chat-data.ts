import { Deliverable } from '@/types';

// ─── TYPES ───

export type PushUrgency = 'critical' | 'warn' | 'info' | 'update';
export type ChatMode = 'chat' | 'act' | 'brief' | 'investigate';

export type MessageContentType =
  | 'text'
  | 'brief'
  | 'mission-card'
  | 'deliverable'
  | 'department-summary'
  | 'escalation-alert'
  | 'action-confirmation'
  | 'push';

export interface BriefBullet {
  icon: 'alert' | 'pending' | 'ok';
  text: string;
  detail: string;
}

export interface FullChatMessage {
  id: number;
  sender: 'tamir' | 'ceo';
  time: string;
  contentType: MessageContentType;
  content: string;
  urgency?: PushUrgency;
  bullets?: BriefBullet[];
  missionId?: string;
  deliverables?: Deliverable[];
  departmentId?: string;
  escalationId?: string;
  actionResult?: { label: string; detail: string; success: boolean };
}

export interface ChatThread {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messages: FullChatMessage[];
  contextEntity?: { type: 'mission' | 'department' | 'escalation'; id: string };
}

// ─── URGENCY STYLES ───

export const urgencyStyle: Record<PushUrgency, { bg: string; border: string; glow: string; dot: string; label: string; labelColor: string }> = {
  critical: { bg: 'rgba(244,63,94,0.07)', border: 'rgba(244,63,94,0.25)', glow: 'rgba(244,63,94,0.6)', dot: '#f43f5e', label: 'Urgent', labelColor: '#fda4af' },
  warn:     { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.22)', glow: 'rgba(245,158,11,0.5)', dot: '#f59e0b', label: 'Time-sensitive', labelColor: '#fcd34d' },
  info:     { bg: 'rgba(56,189,248,0.06)', border: 'rgba(56,189,248,0.20)', glow: 'rgba(56,189,248,0.4)', dot: '#38bdf8', label: 'Action needed', labelColor: '#7dd3fc' },
  update:   { bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.18)', glow: 'rgba(52,211,153,0.4)', dot: '#34d399', label: 'Update', labelColor: '#6ee7b7' },
};

// ─── MAIN CONVERSATION ───

export const mainThread: ChatThread = {
  id: 'thread-today-1',
  title: 'Morning Briefing & GPU Approval',
  preview: 'Done — g4dn.xlarge approved in us-west-2',
  timestamp: new Date(),
  contextEntity: { type: 'mission', id: 'm1' },
  messages: [
    {
      id: 1, sender: 'tamir', time: '07:15', contentType: 'brief',
      content: "Good morning. Here's your situation:",
      bullets: [
        { icon: 'alert', text: 'AWS GPU blocked 3h — $2,400 idle cost', detail: 'g4dn.xlarge needed in us-west-2, +$0.12/hr' },
        { icon: 'pending', text: 'Research Analyst hire — candidate brief ready', detail: 'Expires tonight, CTO ranked Priya K. #1' },
        { icon: 'ok', text: 'Marketing Q2 plans submitted for review', detail: 'Maya sent content_plans.pdf + editorial calendar' },
      ],
    },
    {
      id: 2, sender: 'ceo', time: '10:25', contentType: 'text',
      content: "What's most urgent?",
    },
    {
      id: 3, sender: 'tamir', time: '10:25', contentType: 'mission-card',
      content: "This one. Dev team has been blocked for 3 hours and every hour costs ~$800 in idle agent time. Alex confirmed us-west-2 has capacity.",
      missionId: 'm1',
    },
    {
      id: 4, sender: 'ceo', time: '10:27', contentType: 'text',
      content: 'Approve the GPU.',
    },
    {
      id: 5, sender: 'tamir', time: '10:27', contentType: 'action-confirmation',
      content: '',
      actionResult: {
        label: 'GPU Approved',
        detail: 'g4dn.xlarge provisioned in us-west-2 at +$0.12/hr. ZUNA deployment resuming. Dev and Infra agents back online.',
        success: true,
      },
    },
    {
      id: 6, sender: 'ceo', time: '10:29', contentType: 'text',
      content: 'Show me the Research hire candidate.',
    },
    {
      id: 7, sender: 'tamir', time: '10:29', contentType: 'deliverable',
      content: "Here's Priya K.'s package. CTO's top pick — EEG domain expert with 6 years of Python. Compensation is within the Research band. Recruiter needs a decision by 6pm or the slot opens back up.",
      deliverables: [
        { name: 'candidate_brief.docx', type: 'document', status: 'ready' },
        { name: 'compensation_model.xlsx', type: 'spreadsheet', status: 'ready' },
        { name: 'eeg_study_scope.pdf', type: 'pdf', status: 'draft' },
      ],
    },
    {
      id: 8, sender: 'ceo', time: '10:31', contentType: 'text',
      content: "How's Tech doing?",
    },
    {
      id: 9, sender: 'tamir', time: '10:31', contentType: 'department-summary',
      content: "GPU approval just cleared their biggest blocker. Here's the snapshot:",
      departmentId: 'Tech Dept',
    },
    {
      id: 10, sender: 'tamir', time: '10:35', contentType: 'push',
      content: "Liam just pinged me. He needs your investor deck feedback before his 11am call — that's in 20 minutes. Should I push his deadline to EOD?",
      urgency: 'warn',
    },
  ],
};

// ─── OLDER THREADS ───

export const olderThreads: ChatThread[] = [
  {
    id: 'thread-yesterday-1',
    title: 'ZUNA Deployment Strategy',
    preview: 'Staging environment ready. Integration tests queued.',
    timestamp: new Date(Date.now() - 86400000),
    messages: [
      { id: 100, sender: 'ceo', time: '14:30', contentType: 'text', content: "What's the ZUNA deployment timeline?" },
      { id: 101, sender: 'tamir', time: '14:30', contentType: 'text', content: '47 unit tests passed. Staging is ready but blocked on GPU capacity — same issue we resolved this morning. Once GPU is live, integration tests run automatically. ETA to full staging: 48 hours.' },
    ],
  },
  {
    id: 'thread-week-1',
    title: 'Q2 Budget Review',
    preview: 'Tech at $1.5K of $4K. Marketing on track.',
    timestamp: new Date(Date.now() - 3 * 86400000),
    messages: [
      { id: 200, sender: 'ceo', time: '09:00', contentType: 'text', content: 'Run me through department budgets.' },
      { id: 201, sender: 'tamir', time: '09:00', contentType: 'text', content: 'Tech is at $1.5K of $4K — flagged medium risk due to GPU + temp hire overlap. Marketing at $2.2K of $5K, well on track. Operations at $0.8K of $3K, lean and ahead of plan.' },
    ],
  },
  {
    id: 'thread-week-2',
    title: 'Marketing Content Approval',
    preview: 'Content strategy approved. Brand guidelines in progress.',
    timestamp: new Date(Date.now() - 5 * 86400000),
    messages: [
      { id: 300, sender: 'ceo', time: '11:00', contentType: 'text', content: 'Status on the content strategy?' },
      { id: 301, sender: 'tamir', time: '11:00', contentType: 'text', content: 'Maya submitted the 3-pillar framework and Q2 editorial calendar. 48 posts mapped across 12 weeks. Brand guidelines v3 still in progress — Maya wants those finalized before publishing.' },
    ],
  },
];

// ─── RESPONSE SIMULATOR ───

export function simulateResponse(input: string, mode: ChatMode): FullChatMessage {
  const lower = input.toLowerCase();
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (mode === 'act') {
    if (lower.includes('approve') && lower.includes('hire')) {
      return { id: Date.now(), sender: 'tamir', time, contentType: 'action-confirmation', content: '', actionResult: { label: 'Hire Approved', detail: 'Priya K. offer letter queued. Recruiter notified. Onboarding packet will generate automatically.', success: true } };
    }
    if (lower.includes('approve') || lower.includes('unblock')) {
      return { id: Date.now(), sender: 'tamir', time, contentType: 'action-confirmation', content: '', actionResult: { label: 'Action Completed', detail: 'Done. I\'ve notified the relevant team and updated the mission status.', success: true } };
    }
    return { id: Date.now(), sender: 'tamir', time, contentType: 'action-confirmation', content: '', actionResult: { label: 'Processing', detail: 'I\'ve queued this action. The relevant department head will execute and confirm within the hour.', success: true } };
  }

  if (mode === 'brief') {
    return {
      id: Date.now(), sender: 'tamir', time, contentType: 'brief',
      content: "Here's your current situation:",
      bullets: [
        { icon: 'ok', text: 'GPU approved — ZUNA deployment resuming', detail: 'Dev + Infra agents back online' },
        { icon: 'pending', text: 'Research hire decision needed by 6pm', detail: 'Priya K. — CTO\'s top pick' },
        { icon: 'alert', text: 'Investor deck data discrepancy unresolved', detail: '15% gap between Tech and Ops projections' },
      ],
    };
  }

  if (lower.includes('aws') || lower.includes('gpu') || lower.includes('capacity')) {
    return { id: Date.now(), sender: 'tamir', time, contentType: 'mission-card', content: "Here's the current state of the GPU situation:", missionId: 'm1' };
  }
  if (lower.includes('zuna') || lower.includes('deploy')) {
    return { id: Date.now(), sender: 'tamir', time, contentType: 'mission-card', content: "ZUNA deployment status:", missionId: 'm4' };
  }
  if (lower.includes('research') || lower.includes('hire') || lower.includes('analyst')) {
    return { id: Date.now(), sender: 'tamir', time, contentType: 'mission-card', content: "Research Analyst hire details:", missionId: 'm2' };
  }
  if (lower.includes('tech') && (lower.includes('dept') || lower.includes('department') || lower.includes('doing') || lower.includes('how'))) {
    return { id: Date.now(), sender: 'tamir', time, contentType: 'department-summary', content: "Here's where Tech stands right now:", departmentId: 'Tech Dept' };
  }
  if (lower.includes('marketing')) {
    return { id: Date.now(), sender: 'tamir', time, contentType: 'department-summary', content: "Marketing department overview:", departmentId: 'Marketing Dept' };
  }
  if (lower.includes('escalat')) {
    return { id: Date.now(), sender: 'tamir', time, contentType: 'escalation-alert', content: "Here's the active L4 escalation:", escalationId: 'e1' };
  }
  if (lower.includes('investor') || lower.includes('deck')) {
    return { id: Date.now(), sender: 'tamir', time, contentType: 'escalation-alert', content: "The investor deck situation:", escalationId: 'e4' };
  }
  if (lower.includes('urgent') || lower.includes('priority') || lower.includes('important')) {
    return { id: Date.now(), sender: 'tamir', time, contentType: 'text', content: "Two things need you right now: (1) Research Analyst hire expires tonight — recommend approving Priya K. before 6pm. (2) Investor deck has a 15% revenue projection gap between Tech and Ops — Liam needs the unified methodology approved to finalize the deck. Everything else is on track." };
  }

  return { id: Date.now(), sender: 'tamir', time, contentType: 'text', content: "I'll look into that. Based on what I'm tracking: 9 missions active, 2 require your direct action, 1 escalation resolved (GPU). The biggest open item is the Research hire decision — Priya K.'s slot expires at midnight. Want me to pull up the details?" };
}
