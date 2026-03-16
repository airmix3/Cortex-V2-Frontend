import type { AgentTask } from '@/types';

// ─── AGENT TASKS (derived from existing todayActivity narratives) ───

export const agentTasks: AgentTask[] = [
  // ── Tamir (Chief of Staff) ──
  { id: 'ct-01', agentId: 'tamir', title: 'Generate daily CEO morning briefing', status: 'completed', priority: 'high', type: 'deliverable', mission: 'Daily Operations', completedAt: '07:15' },
  { id: 'ct-02', agentId: 'tamir', title: 'Classify CEO voice memo: Q2 priority guidance', status: 'completed', priority: 'high', type: 'communication', completedAt: '07:30' },
  { id: 'ct-03', agentId: 'tamir', title: 'Route Q2 directive to CTO via chain of command', status: 'completed', priority: 'medium', type: 'communication', completedAt: '08:00' },
  { id: 'ct-04', agentId: 'tamir', title: 'Package GPU escalation L4 for CEO review', status: 'completed', priority: 'critical', type: 'escalation', mission: 'AWS Capacity Blocker', completedAt: '10:24' },
  { id: 'ct-05', agentId: 'tamir', title: 'Cross-department sprint sync coordination', status: 'in-progress', priority: 'medium', type: 'communication', startedAt: '10:20' },

  // ── CTO Alex ──
  { id: 'ct-06', agentId: 'cto', title: 'AWS capacity check for us-east-1 GPU', status: 'completed', priority: 'high', type: 'task', mission: 'AWS Capacity Blocker', completedAt: '07:30' },
  { id: 'ct-07', agentId: 'cto', title: 'Review ZUNA deployment manifest from Dev Agent', status: 'completed', priority: 'high', type: 'task', mission: 'ZUNA Deployment', completedAt: '09:00' },
  { id: 'ct-08', agentId: 'cto', title: 'Provision g4dn.xlarge in us-west-2', status: 'blocked', priority: 'critical', type: 'task', mission: 'AWS Capacity Blocker', blocker: 'Pending CEO approval for +$0.12/hr cost increase', startedAt: '09:30' },
  { id: 'ct-09', agentId: 'cto', title: 'Tech department budget recalculation', status: 'in-progress', priority: 'medium', type: 'task', startedAt: '10:15' },

  // ── CMO Maya ──
  { id: 'ct-10', agentId: 'cmo', title: 'Review Q2 editorial calendar from Content Agent', status: 'completed', priority: 'medium', type: 'task', mission: 'Content Strategy Plans', completedAt: '08:30' },
  { id: 'ct-11', agentId: 'cmo', title: 'Submit content_plans.pdf to Tamir for CEO review', status: 'completed', priority: 'high', type: 'deliverable', mission: 'Content Strategy Plans', completedAt: '09:58' },
  { id: 'ct-12', agentId: 'cmo', title: 'Generate executive summary for CEO voice briefing', status: 'completed', priority: 'high', type: 'deliverable', completedAt: '10:10' },
  { id: 'ct-13', agentId: 'cmo', title: 'Brand guidelines v3 alignment review', status: 'in-progress', priority: 'medium', type: 'task', mission: 'Brand Guidelines Update', startedAt: '10:15' },

  // ── COO Liam ──
  { id: 'ct-14', agentId: 'coo', title: '300-day timeline update: Day 47 milestone check', status: 'completed', priority: 'medium', type: 'task', completedAt: '07:00' },
  { id: 'ct-15', agentId: 'coo', title: 'Mark Logistics Optimization as COMPLETE', status: 'completed', priority: 'high', type: 'task', mission: 'Logistics Optimization', completedAt: '08:00' },
  { id: 'ct-16', agentId: 'coo', title: 'Investor deck preparation with unified methodology', status: 'blocked', priority: 'high', type: 'task', mission: 'Investor Update Deck', blocker: 'Revenue projection discrepancy (Tech vs Ops: 15%)', startedAt: '09:00' },
  { id: 'ct-17', agentId: 'coo', title: 'Week 6 operations summary generation', status: 'completed', priority: 'medium', type: 'deliverable', completedAt: '08:30' },

  // ── Dev Agent ──
  { id: 'ct-18', agentId: 'dev1', title: 'ZUNA deployment manifest generation + Docker build', status: 'completed', priority: 'high', type: 'deliverable', mission: 'ZUNA Deployment', completedAt: '08:00' },
  { id: 'ct-19', agentId: 'dev1', title: 'Integration test suite execution (47/47 passed)', status: 'completed', priority: 'high', type: 'task', mission: 'ZUNA Deployment', completedAt: '08:30' },
  { id: 'ct-20', agentId: 'dev1', title: 'Apply CTO review comments, generate manifest v2.1', status: 'completed', priority: 'medium', type: 'deliverable', mission: 'ZUNA Deployment', completedAt: '09:30' },
  { id: 'ct-21', agentId: 'dev1', title: 'Staging deployment dry-run', status: 'queued', priority: 'medium', type: 'task', mission: 'ZUNA Deployment' },

  // ── Infra Agent ──
  { id: 'ct-22', agentId: 'dev2', title: 'Generate capacity_analysis.pdf with alternatives', status: 'completed', priority: 'high', type: 'deliverable', mission: 'AWS Capacity Blocker', completedAt: '08:00' },
  { id: 'ct-23', agentId: 'dev2', title: 'GPU allocation request (g4dn.xlarge)', status: 'blocked', priority: 'critical', type: 'task', mission: 'AWS Capacity Blocker', blocker: 'InsufficientInstanceCapacity in us-east-1 and us-east-2', startedAt: '07:00' },
  { id: 'ct-24', agentId: 'dev2', title: 'VPC peering configuration for us-west-2', status: 'in-progress', priority: 'medium', type: 'task', mission: 'AWS Capacity Blocker', startedAt: '09:00' },

  // ── Content Agent ──
  { id: 'ct-25', agentId: 'mkt1', title: 'Q2 editorial calendar (12 article slots)', status: 'completed', priority: 'high', type: 'deliverable', mission: 'Content Strategy Plans', completedAt: '08:30' },
  { id: 'ct-26', agentId: 'mkt1', title: 'Generate 36 social media posts across platforms', status: 'completed', priority: 'medium', type: 'deliverable', mission: 'Content Strategy Plans', completedAt: '09:30' },
  { id: 'ct-27', agentId: 'mkt1', title: 'SEO keyword research: 15 high-intent terms', status: 'completed', priority: 'medium', type: 'research', mission: 'Content Strategy Plans', completedAt: '10:00' },

  // ── Research Agent ──
  { id: 'ct-28', agentId: 'res1', title: 'EEG device pricing matrix compilation', status: 'completed', priority: 'high', type: 'deliverable', mission: 'EEG Model Optimization', completedAt: '07:00' },
  { id: 'ct-29', agentId: 'res1', title: 'Patent risk report: 3 IP conflicts identified', status: 'completed', priority: 'high', type: 'research', mission: 'EEG Model Optimization', completedAt: '09:00' },
  { id: 'ct-30', agentId: 'res1', title: 'Await next research directive from CTO', status: 'queued', priority: 'low', type: 'task' },

  // ── Ops Agent ──
  { id: 'ct-31', agentId: 'ops1', title: 'Route optimization analysis (15% cost reduction)', status: 'completed', priority: 'high', type: 'task', mission: 'Logistics Optimization', completedAt: '07:00' },
  { id: 'ct-32', agentId: 'ops1', title: 'Submit optimization_report.pdf to COO', status: 'completed', priority: 'high', type: 'deliverable', mission: 'Logistics Optimization', completedAt: '07:30' },
  { id: 'ct-33', agentId: 'ops1', title: 'Cost allocation reconciliation for investor deck', status: 'in-progress', priority: 'medium', type: 'task', mission: 'Investor Update Deck', startedAt: '10:00' },

  // ── Market Intel ──
  { id: 'ct-34', agentId: 'mkt2', title: 'Competitor landscape scan (NeuroSky, Emotiv, OpenBCI)', status: 'completed', priority: 'medium', type: 'research', mission: 'Q2 Campaign Planning', completedAt: '07:00' },
  { id: 'ct-35', agentId: 'mkt2', title: 'Market sizing update: TAM revised to $2.1B', status: 'completed', priority: 'high', type: 'research', completedAt: '08:30' },
  { id: 'ct-36', agentId: 'mkt2', title: 'Weekly competitive pulse report', status: 'completed', priority: 'medium', type: 'deliverable', completedAt: '09:30' },

  // ── EEG Researcher (temp) ──
  { id: 'ct-37', agentId: 'temp1', title: '14-channel dry electrode test protocol (batch 4/5)', status: 'in-progress', priority: 'high', type: 'research', mission: 'EEG Model Optimization', startedAt: '09:00' },
  { id: 'ct-38', agentId: 'temp1', title: 'Submit interim results report to CTO', status: 'completed', priority: 'high', type: 'deliverable', mission: 'EEG Model Optimization', completedAt: '10:00' },

  // ── Data Scientist (temp) ──
  { id: 'ct-39', agentId: 'temp2', title: 'ZUNA v2.1 accuracy benchmark (best: 95.1%)', status: 'completed', priority: 'high', type: 'research', mission: 'EEG Model Optimization', completedAt: '09:00' },
  { id: 'ct-40', agentId: 'temp2', title: 'Generate benchmark_results.xlsx with confusion matrix', status: 'in-progress', priority: 'high', type: 'deliverable', mission: 'EEG Model Optimization', startedAt: '10:00' },
  { id: 'ct-41', agentId: 'temp2', title: 'Apply SMOTE for class balancing evaluation', status: 'queued', priority: 'medium', type: 'research', mission: 'EEG Model Optimization' },
];
