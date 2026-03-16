'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import PageShell from '@/components/shared/PageShell';
import { employees } from '@/data/pages-data';
import { allMissions } from '@/data/pages-data';
import { interactionEvents, collaborationEdges, collaborationMetrics } from '@/data/collaboration-data';
import InteractionConstellation from '@/components/collaboration/InteractionConstellation';
import MissionFlowCard from '@/components/collaboration/MissionFlowCard';
import SwimLaneTimeline from '@/components/collaboration/SwimLaneTimeline';
import InteractionFeed from '@/components/collaboration/InteractionFeed';
import {
  MessageSquare,
  GitBranch,
  Zap,
  Users,
  AlertTriangle,
  TrendingUp,
  X,
} from 'lucide-react';

/* ── Stat Card ── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border px-4 py-3.5"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-slate-500" />
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className={`text-lg font-bold ${accent}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

/* ── Resolve name from id ── */
function agentName(id: string): string {
  return employees.find(e => e.id === id)?.name || id;
}

/* ── Page ── */
export default function CollaborationPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const metrics = collaborationMetrics;

  // Missions with touchTrail > 1 (have flow to show)
  const flowMissions = allMissions.filter(m => m.touchTrail.length > 1);

  const selectedEmp = selectedAgent ? employees.find(e => e.id === selectedAgent) : null;

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Agent Collaboration</h1>
            <p className="text-sm text-slate-400">How agents interact, collaborate, and move work through the organization</p>
          </div>

          {/* Agent filter indicator */}
          {selectedEmp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-medium)' }}
            >
              <div className={`w-6 h-6 rounded-full ${selectedEmp.color} flex items-center justify-center text-white text-[9px] font-bold`}>
                {selectedEmp.avatar}
              </div>
              <span className="text-xs text-slate-300">Filtered: {selectedEmp.name}</span>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-0.5 text-slate-500 hover:text-slate-300 rounded cursor-pointer"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* ── Metrics Strip ── */}
        <div className="grid grid-cols-5 gap-3">
          <StatCard
            icon={MessageSquare}
            label="Total Interactions"
            value={String(metrics.totalInteractions)}
            accent="text-sky-400"
            delay={0.05}
          />
          <StatCard
            icon={GitBranch}
            label="Active Channels"
            value={String(collaborationEdges.length)}
            accent="text-emerald-400"
            delay={0.1}
          />
          <StatCard
            icon={Zap}
            label="Busiest Channel"
            value={`${agentName(metrics.busiestChannel.from)} - ${agentName(metrics.busiestChannel.to)}`}
            sub={`${metrics.busiestChannel.count} interactions`}
            accent="text-amber-400"
            delay={0.15}
          />
          <StatCard
            icon={Users}
            label="Most Connected"
            value={agentName(metrics.mostConnectedAgent.id)}
            sub={`${metrics.mostConnectedAgent.connections} connections`}
            accent="text-violet-400"
            delay={0.2}
          />
          <StatCard
            icon={AlertTriangle}
            label="Bottleneck"
            value={metrics.bottleneck ? agentName(metrics.bottleneck.id) : 'None'}
            sub={metrics.bottleneck ? `${metrics.bottleneck.waitCount} pending waits` : 'All clear'}
            accent={metrics.bottleneck ? 'text-rose-400' : 'text-emerald-400'}
            delay={0.25}
          />
        </div>

        {/* ── Interaction Constellation ── */}
        <InteractionConstellation
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
        />

        {/* ── Mission Flow Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-white">Mission Flows</h3>
            <span className="text-[11px] text-slate-500">{flowMissions.length} missions with handoff chains</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {flowMissions.map((mission, i) => (
              <MissionFlowCard key={mission.id} mission={mission} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Swim Lane Timeline ── */}
        <SwimLaneTimeline events={interactionEvents} selectedAgent={selectedAgent} />

        {/* ── Interaction Feed ── */}
        <InteractionFeed events={interactionEvents} selectedAgent={selectedAgent} />
      </div>
    </PageShell>
  );
}
