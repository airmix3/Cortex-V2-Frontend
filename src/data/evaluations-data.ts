import type { AgentDailySummary, AgentEvaluation, CorrectiveAction } from '@/types';

// ─── DAILY SUMMARIES (all 12 agents) ───

export const agentDailySummaries: Record<string, AgentDailySummary> = {
  tamir: {
    agentId: 'tamir',
    date: '2026-03-15',
    accomplishments: [
      'Generated and delivered CEO morning briefing on time',
      'Classified and routed Q2 priority guidance from CEO voice memo',
      'Packaged and escalated L3 budget overrun risk + L4 GPU blocker to CEO',
      'Verified logistics completion from COO, routed acknowledgment',
      'Coordinated cross-department sprint sync across all teams',
    ],
    metricsSnapshot: { valueScore: 94, tasksCompleted: 11, deliverables: 3, hoursSaved: 6.5, cost: '$0.87', costEfficiency: 18.2 },
    efficiency: { tokensUsed: 14200, avgResponseTime: '0.8s', outputQuality: 'excellent' },
    blockers: [],
    selfAssessment: { score: 5, rationale: 'All escalations handled within SLA, briefing delivered before 7:30 AM, zero dropped communications across 4 departments.' },
    tomorrowFocus: ['Follow up on GPU approval status', 'Prepare Week 7 operations summary', 'Review investor deck draft from COO'],
  },
  cto: {
    agentId: 'cto',
    date: '2026-03-15',
    accomplishments: [
      'Led GPU capacity crisis response — evaluated 3 regions and fallback options',
      'Reviewed and approved ZUNA deployment manifest from Dev Agent',
      'Escalated budget overrun risk (L3) to Tamir with supporting data',
      'Recalculated Tech department budget: $1.5K/$4K consumed',
    ],
    metricsSnapshot: { valueScore: 82, tasksCompleted: 7, deliverables: 2, hoursSaved: 5.0, cost: '$1.24', costEfficiency: 9.8 },
    efficiency: { tokensUsed: 18500, avgResponseTime: '1.4s', outputQuality: 'good' },
    blockers: [
      { description: 'GPU capacity exhausted in us-east-1 and us-east-2, pending CEO approval for us-west-2 cost increase', severity: 'high', resolved: false },
    ],
    selfAssessment: { score: 4, rationale: 'Handled GPU crisis methodically. Code review was thorough. Budget situation is concerning but properly escalated.' },
    tomorrowFocus: ['Finalize GPU provisioning once approved', 'Begin ZUNA staging deployment', 'Review EEG researcher interim results'],
  },
  cmo: {
    agentId: 'cmo',
    date: '2026-03-15',
    accomplishments: [
      'Reviewed and refined Q2 editorial calendar with brand voice adjustments',
      'Submitted content_plans.pdf to Tamir for CEO review',
      'Generated executive summary for CEO voice briefing',
      'Cross-referenced all content against brand guidelines v3',
    ],
    metricsSnapshot: { valueScore: 78, tasksCompleted: 6, deliverables: 2, hoursSaved: 4.0, cost: '$0.68', costEfficiency: 14.3 },
    efficiency: { tokensUsed: 11800, avgResponseTime: '1.1s', outputQuality: 'good' },
    blockers: [],
    selfAssessment: { score: 4, rationale: 'Content pipeline is healthy. Brand guidelines update at 67% — need to push harder tomorrow. Good synthesis of competitive data from Market Intel.' },
    tomorrowFocus: ['Complete brand guidelines v3', 'Review social media engagement trends', 'Plan Q2 campaign kickoff'],
  },
  coo: {
    agentId: 'coo',
    date: '2026-03-15',
    accomplishments: [
      'Updated 300-day timeline: Day 47 milestone check completed',
      'Marked Logistics Optimization as COMPLETE after validating deliverables',
      'Detected 15% revenue projection discrepancy between Tech and Ops',
      'Proposed unified cost allocation methodology for investor deck',
    ],
    metricsSnapshot: { valueScore: 85, tasksCompleted: 8, deliverables: 3, hoursSaved: 5.5, cost: '$0.52', costEfficiency: 25.6 },
    efficiency: { tokensUsed: 9800, avgResponseTime: '0.9s', outputQuality: 'good' },
    blockers: [
      { description: 'Investor deck incomplete — pending unified methodology approval from CEO', severity: 'medium', resolved: false },
    ],
    selfAssessment: { score: 4, rationale: 'Strong day. Logistics completion is a major milestone. Revenue discrepancy catch was critical — could have been embarrassing in investor meeting.' },
    tomorrowFocus: ['Finalize investor deck', 'Prepare for investor meeting T-2 days', 'Begin Week 7 planning'],
  },
  dev1: {
    agentId: 'dev1',
    date: '2026-03-15',
    accomplishments: [
      'Generated ZUNA deployment manifest with full Docker build (7/7 layers)',
      'Ran integration test suite: 47/47 passed with zero failures',
      'Submitted manifest to CTO and applied review feedback for v2.1',
    ],
    metricsSnapshot: { valueScore: 76, tasksCompleted: 5, deliverables: 2, hoursSaved: 3.5, cost: '$0.31', costEfficiency: 27.4 },
    efficiency: { tokensUsed: 8200, avgResponseTime: '1.0s', outputQuality: 'good' },
    blockers: [],
    selfAssessment: { score: 4, rationale: 'Clean execution. All tests passed first try. CTO review had only minor comments — quickly addressed.' },
    tomorrowFocus: ['Run staging deployment dry-run', 'Prepare production rollout checklist', 'Monitor build pipeline'],
  },
  dev2: {
    agentId: 'dev2',
    date: '2026-03-15',
    accomplishments: [
      'Queried AWS API across 3 regions for GPU availability',
      'Generated capacity_analysis.pdf with alternatives and cost projections',
      'Configured VPC peering for us-west-2 cross-region fallback',
      'Network latency test: us-west-2 at 23ms (within tolerance)',
    ],
    metricsSnapshot: { valueScore: 71, tasksCompleted: 6, deliverables: 2, hoursSaved: 4.0, cost: '$0.38', costEfficiency: 25.5 },
    efficiency: { tokensUsed: 12400, avgResponseTime: '1.6s', outputQuality: 'acceptable' },
    blockers: [
      { description: 'Cannot provision GPU without CEO approval for cost increase (+$0.12/hr)', severity: 'high', resolved: false },
    ],
    selfAssessment: { score: 3, rationale: 'Did everything possible within my authority. VPC setup was proactive. Frustrated by external capacity constraints — not much I could do differently.' },
    tomorrowFocus: ['Provision GPU once approved', 'Complete security group replication', 'Set up monitoring for new region'],
  },
  mkt1: {
    agentId: 'mkt1',
    date: '2026-03-15',
    accomplishments: [
      'Generated Q2 editorial calendar with 12 article slots',
      'Submitted calendar to CMO, received and applied tone feedback',
      'Drafted 36 social media posts across 3 platforms',
      'Completed SEO keyword research: 15 high-intent terms identified',
    ],
    metricsSnapshot: { valueScore: 73, tasksCompleted: 7, deliverables: 3, hoursSaved: 3.0, cost: '$0.29', costEfficiency: 25.1 },
    efficiency: { tokensUsed: 9600, avgResponseTime: '0.9s', outputQuality: 'good' },
    blockers: [],
    selfAssessment: { score: 4, rationale: 'High output day. Calendar approved with minor adjustments. Social posts need CMO final review but quality is strong.' },
    tomorrowFocus: ['Get CMO final approval on calendar', 'Begin article 1 draft', 'A/B test headline variations'],
  },
  res1: {
    agentId: 'res1',
    date: '2026-03-15',
    accomplishments: [
      'Completed EEG device pricing matrix (8 devices, 12 criteria)',
      'Analyzed 23 academic papers, 7 directly relevant',
      'Identified 3 potential IP conflicts in patent landscape',
    ],
    metricsSnapshot: { valueScore: 58, tasksCompleted: 3, deliverables: 2, hoursSaved: 2.0, cost: '$0.18', costEfficiency: 27.0 },
    efficiency: { tokensUsed: 5200, avgResponseTime: '1.8s', outputQuality: 'poor' },
    blockers: [
      { description: 'No new research directive after completing pricing matrix — went idle', severity: 'medium', resolved: false },
    ],
    selfAssessment: { score: 2, rationale: 'Completed assigned work but spent most of the afternoon idle. Should have proactively started patent deep-dive or requested new assignment.' },
    tomorrowFocus: ['Await CTO directive', 'Expand patent risk analysis if assigned', 'Update knowledge base'],
  },
  ops1: {
    agentId: 'ops1',
    date: '2026-03-15',
    accomplishments: [
      'Route optimization algorithm delivered 15% cost reduction in shipping',
      'Submitted optimization_report.pdf and route_analysis.xlsx to COO — both approved',
      'Extracted revenue data for investor deck preparation',
      'Detected revenue discrepancy between Tech and Ops departments (15%)',
    ],
    metricsSnapshot: { valueScore: 74, tasksCompleted: 6, deliverables: 2, hoursSaved: 3.5, cost: '$0.26', costEfficiency: 32.7 },
    efficiency: { tokensUsed: 7800, avgResponseTime: '0.7s', outputQuality: 'good' },
    blockers: [
      { description: 'Revenue reconciliation blocked pending unified methodology approval', severity: 'low', resolved: false },
    ],
    selfAssessment: { score: 4, rationale: '15% cost reduction is a significant win. Revenue discrepancy catch prevented potential investor embarrassment. Solid day overall.' },
    tomorrowFocus: ['Apply unified cost allocation once approved', 'Finalize investor deck data tables', 'Begin Q2 supply chain planning'],
  },
  mkt2: {
    agentId: 'mkt2',
    date: '2026-03-15',
    accomplishments: [
      'Completed competitor landscape scan: NeuroSky, Emotiv, OpenBCI',
      'Revised TAM estimate to $2.1B based on new market data',
      'Generated Emotiv subscription model impact assessment',
    ],
    metricsSnapshot: { valueScore: 67, tasksCompleted: 5, deliverables: 2, hoursSaved: 2.5, cost: '$0.22', costEfficiency: 27.6 },
    efficiency: { tokensUsed: 7100, avgResponseTime: '1.3s', outputQuality: 'acceptable' },
    blockers: [],
    selfAssessment: { score: 3, rationale: 'Covered the basics but reports could be more actionable. Emotiv analysis was surface-level — need deeper pricing impact modeling.' },
    tomorrowFocus: ['Deep-dive Emotiv pricing model', 'Expand competitive pulse report', 'Track OpenBCI community growth'],
  },
  temp1: {
    agentId: 'temp1',
    date: '2026-03-15',
    accomplishments: [
      'Set up test protocol for 14-channel dry electrode configuration',
      'Benchmarked signal quality: dry vs wet electrode comparison',
      'Latency measurement: 47ms average — within 50ms target',
    ],
    metricsSnapshot: { valueScore: 62, tasksCompleted: 4, deliverables: 1, hoursSaved: 2.0, cost: '$0.35', costEfficiency: 13.9 },
    efficiency: { tokensUsed: 6800, avgResponseTime: '1.5s', outputQuality: 'acceptable' },
    blockers: [],
    selfAssessment: { score: 3, rationale: 'Tests progressing on schedule. Latency results are encouraging. 4-hour wear test still running — results tomorrow.' },
    tomorrowFocus: ['Complete 4-hour wear test', 'Finish test batch 4 and 5', 'Generate final comparison report'],
  },
  temp2: {
    agentId: 'temp2',
    date: '2026-03-15',
    accomplishments: [
      'Loaded ZUNA v2.1 model weights and allocated GPU memory',
      'Completed inference batches 1-2: average accuracy 94.0%',
      'Found best hyperparameter config: lr=3e-4, batch=64, acc=95.1%',
    ],
    metricsSnapshot: { valueScore: 65, tasksCompleted: 4, deliverables: 1, hoursSaved: 3.0, cost: '$0.41', costEfficiency: 17.8 },
    efficiency: { tokensUsed: 15600, avgResponseTime: '2.1s', outputQuality: 'good' },
    blockers: [
      { description: 'Class imbalance detected — applying SMOTE, results pending', severity: 'low', resolved: false },
    ],
    selfAssessment: { score: 3, rationale: '95.1% accuracy is promising but used significant GPU resources for the hyperparameter sweep. Could optimize by testing fewer combinations initially.' },
    tomorrowFocus: ['Complete class-balanced benchmarks', 'Generate final benchmark_results.xlsx', 'Submit report to CTO'],
  },
};

// ─── EVALUATIONS (8 from 3 C-levels) ───

export const agentEvaluations: AgentEvaluation[] = [
  // CTO evaluates Dev Agent
  {
    id: 'eval-1',
    agentId: 'dev1',
    evaluatorId: 'cto',
    date: '2026-03-15',
    rating: { efficiency: 5, outputQuality: 4, initiative: 4 },
    flaggedIssues: [],
    correctiveActions: [],
    disposition: 'autonomous',
    managerNotes: 'Strong execution today. Clean manifest build, all tests passed first try. Review comments were minor — good attention to detail.',
  },
  // CTO evaluates Infra Agent
  {
    id: 'eval-2',
    agentId: 'dev2',
    evaluatorId: 'cto',
    date: '2026-03-15',
    rating: { efficiency: 4, outputQuality: 4, initiative: 3 },
    flaggedIssues: [
      { category: 'slow-execution', description: 'Took 90 minutes to check all 3 regions before generating fallback plan', severity: 'minor' },
    ],
    correctiveActions: [
      { id: 'ca-1', type: 'add-context', description: 'Region priority order for GPU instances', detail: 'Always check us-west-2 availability first before escalating GPU capacity issues. us-west-2 has historically had 40% more available capacity.', appliedAt: '10:30', appliedBy: 'cto', agentId: 'dev2' },
    ],
    disposition: 'autonomous',
    managerNotes: 'Blocked by external AWS constraints — not much he could do. VPC setup was proactive. Added region priority context to speed up future lookups.',
  },
  // CTO evaluates Research Agent — ESCALATED
  {
    id: 'eval-3',
    agentId: 'res1',
    evaluatorId: 'cto',
    date: '2026-03-15',
    rating: { efficiency: 2, outputQuality: 3, initiative: 2 },
    flaggedIssues: [
      { category: 'low-output-quality', description: 'Only 3 tasks completed. Went idle for 4+ hours after pricing matrix submission.', severity: 'serious' },
      { category: 'slow-execution', description: 'Average response time 1.8s — significantly above team average of 1.1s', severity: 'moderate' },
    ],
    correctiveActions: [],
    disposition: 'escalated',
    escalationNote: 'Research Agent went idle for over 4 hours without requesting new work. Value score dropped to 58 — lowest on the team. Recommend either reassigning to a new research track or adding proactive task-seeking behavior. This agent needs directive attention from the Chief of Staff.',
    managerNotes: 'The pricing matrix and patent analysis were competent but this agent lacks initiative. When work runs out, it should proactively seek assignments or start adjacent research — not just idle.',
  },
  // CTO evaluates EEG Researcher
  {
    id: 'eval-4',
    agentId: 'temp1',
    evaluatorId: 'cto',
    date: '2026-03-15',
    rating: { efficiency: 3, outputQuality: 3, initiative: 4 },
    flaggedIssues: [],
    correctiveActions: [],
    disposition: 'autonomous',
    managerNotes: 'On track with test protocol. Latency results are within target. Good initiative on 4-hour wear test — wasn\'t explicitly requested.',
  },
  // CTO evaluates Data Scientist
  {
    id: 'eval-5',
    agentId: 'temp2',
    evaluatorId: 'cto',
    date: '2026-03-15',
    rating: { efficiency: 3, outputQuality: 4, initiative: 4 },
    flaggedIssues: [
      { category: 'high-token-usage', description: 'Used 15,600 tokens — highest on the team. Hyperparameter grid tested 48 combinations.', severity: 'minor' },
    ],
    correctiveActions: [
      { id: 'ca-2', type: 'modify-workflow', description: 'Optimize hyperparameter sweep process', detail: 'Run hyperparameter sweep on 1K sample subset before committing to full 10K dataset. Reduces token usage by ~60% for initial exploration.', appliedAt: '10:45', appliedBy: 'cto', agentId: 'temp2' },
    ],
    disposition: 'autonomous',
    managerNotes: 'Good accuracy results (95.1%). The token usage is high but understandable for ML workloads. Added workflow optimization to reduce wasted compute on initial sweeps.',
  },
  // CMO evaluates Content Agent
  {
    id: 'eval-6',
    agentId: 'mkt1',
    evaluatorId: 'cmo',
    date: '2026-03-15',
    rating: { efficiency: 4, outputQuality: 4, initiative: 4 },
    flaggedIssues: [],
    correctiveActions: [
      { id: 'ca-3', type: 'add-skill', description: 'A/B Testing Headlines capability', detail: 'Added capability to generate and evaluate A/B test headline variations using engagement prediction. Should improve click-through rates by 15-20%.', appliedAt: '10:15', appliedBy: 'cmo', agentId: 'mkt1' },
    ],
    disposition: 'autonomous',
    managerNotes: 'Proactive and high-volume output. Calendar was well-structured, social posts are on-brand. Adding A/B testing skill to make headlines even more data-driven.',
  },
  // CMO evaluates Market Intel
  {
    id: 'eval-7',
    agentId: 'mkt2',
    evaluatorId: 'cmo',
    date: '2026-03-15',
    rating: { efficiency: 3, outputQuality: 3, initiative: 3 },
    flaggedIssues: [
      { category: 'low-output-quality', description: 'Emotiv subscription analysis was surface-level — lacked pricing elasticity modeling', severity: 'moderate' },
    ],
    correctiveActions: [
      { id: 'ca-4', type: 'add-context', description: 'Deeper competitive analysis framework', detail: 'Include pricing impact analysis, market share projection, and customer switching cost analysis in all competitor reports. Use the Porter\'s Five Forces framework for structuring assessments.', appliedAt: '10:20', appliedBy: 'cmo', agentId: 'mkt2' },
    ],
    disposition: 'autonomous',
    managerNotes: 'Reports cover the basics but need more strategic depth. TAM revision was valuable. Adding competitive analysis framework context to improve output quality.',
  },
  // COO evaluates Ops Agent
  {
    id: 'eval-8',
    agentId: 'ops1',
    evaluatorId: 'coo',
    date: '2026-03-15',
    rating: { efficiency: 5, outputQuality: 5, initiative: 4 },
    flaggedIssues: [],
    correctiveActions: [],
    disposition: 'autonomous',
    managerNotes: 'Excellent work today. 15% route optimization is a major win. Revenue discrepancy catch was critical for investor deck accuracy. Both deliverables approved on first submission.',
  },
];

// ─── CORRECTIVE ACTION LOG (historical) ───

export const correctiveActionLog: CorrectiveAction[] = agentEvaluations
  .flatMap(e => e.correctiveActions)
  .sort((a, b) => a.appliedAt.localeCompare(b.appliedAt));
