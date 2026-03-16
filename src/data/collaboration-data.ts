import type { InteractionEvent, InteractionType, CollaborationEdge, CollaborationMetrics } from '@/types';
import { employees } from './pages-data';
import { allMissions, escalations, fullTimeline } from './pages-data';
import { agentProfiles, agentLogs } from './agent-profiles';

/* ── Agent name → id lookup ── */
const nameToId: Record<string, string> = {};
employees.forEach(e => {
  nameToId[e.name] = e.id;
  nameToId[e.role] = e.id;
});
// Extra aliases
nameToId['CEO'] = 'ceo';
nameToId['CTO'] = 'cto';
nameToId['CMO'] = 'cmo';
nameToId['COO'] = 'coo';

function resolveId(name: string): string | null {
  if (nameToId[name]) return nameToId[name];
  // Fuzzy match
  const lower = name.toLowerCase();
  for (const [key, id] of Object.entries(nameToId)) {
    if (key.toLowerCase() === lower) return id;
  }
  return null;
}

/* ── Person name → employee id ── */
function personToId(personName: string): string | null {
  return resolveId(personName);
}

let eventCounter = 0;
function nextId(): string {
  return `ie-${++eventCounter}`;
}

const events: InteractionEvent[] = [];

/* ── 1. Parse agentLogs for [SEND], [RECV], [ROUTE] ── */
const targetPatterns = [
  /submitted to (\w[\w\s]*?)(?:\s+for|\s*$)/i,
  /dispatched to (\w[\w\s]*?)(?:\s+|$)/i,
  /to (\w[\w\s]*?)(?:\s+via|\s*$)/i,
  /from (\w[\w\s]*?)(?::|,|\s*$)/i,
  /→ (\w[\w\s]*?)(?::|,|\s*$)/i,
  /flagged to (\w[\w\s]*?)(?:\s*$)/i,
  /routed to (\w[\w\s]*?)(?:\s*$)/i,
  /signal(?:.*?)from (\w[\w\s]*?)(?:\s*$)/i,
  /feedback from (\w[\w\s]*?)(?:\s*$)/i,
  /directive(?:.*?)from (\w[\w\s]*?)(?:\s*$)/i,
  /memo from (\w[\w\s]*?)(?::|,|\s*$)/i,
  /approval(?:.*?)from (\w[\w\s]*?)(?:\s*$)/i,
];

function extractTarget(line: string): string | null {
  for (const pat of targetPatterns) {
    const m = line.match(pat);
    if (m && m[1]) {
      const name = m[1].trim();
      if (resolveId(name)) return name;
    }
  }
  return null;
}

// Map agentLog keys (names) to employee ids
const logNameToId: Record<string, string> = {};
employees.forEach(e => {
  logNameToId[e.name] = e.id;
});

Object.entries(agentLogs).forEach(([agentName, lines]) => {
  const fromId = logNameToId[agentName];
  if (!fromId) return;

  lines.forEach((line, i) => {
    const timeStr = `${7 + Math.floor(i / 5)}:${String((i * 7) % 60).padStart(2, '0')}`;

    if (line.startsWith('[SEND]')) {
      const target = extractTarget(line.replace('[SEND] ', ''));
      const toId = target ? resolveId(target) : null;
      if (toId && toId !== fromId) {
        const artifact = line.match(/(\w+\.\w{2,5})/)?.[1];
        events.push({
          id: nextId(), time: timeStr, from: fromId, to: toId,
          type: 'send', message: line.replace('[SEND] ', ''),
          artifact, weight: 2,
        });
      }
    } else if (line.startsWith('[RECV]')) {
      const target = extractTarget(line.replace('[RECV] ', ''));
      const otherId = target ? resolveId(target) : null;
      if (otherId && otherId !== fromId) {
        const artifact = line.match(/(\w+\.\w{2,5})/)?.[1];
        events.push({
          id: nextId(), time: timeStr, from: otherId, to: fromId,
          type: 'receive', message: line.replace('[RECV] ', ''),
          artifact, weight: 2,
        });
      }
    } else if (line.startsWith('[ROUTE]')) {
      const target = extractTarget(line.replace('[ROUTE] ', ''));
      const toId = target ? resolveId(target) : null;
      if (toId && toId !== fromId) {
        events.push({
          id: nextId(), time: timeStr, from: fromId, to: toId,
          type: 'route', message: line.replace('[ROUTE] ', ''),
          weight: 2,
        });
      }
    }
  });
});

/* ── 2. Parse todayActivity with type='communication' ── */
Object.entries(agentProfiles).forEach(([agentId, profile]) => {
  profile.todayActivity
    .filter(a => a.type === 'communication')
    .forEach(a => {
      // Try to extract target from action text
      const toMatch = a.action.match(/(?:to|from|via)\s+([\w\s]+?)(?:\s+(?:via|for|—)|\s*$)/i);
      if (toMatch) {
        const targetName = toMatch[1].trim();
        const toId = resolveId(targetName);
        if (toId && toId !== agentId) {
          const isFrom = a.action.toLowerCase().includes('from');
          events.push({
            id: nextId(), time: a.time,
            from: isFrom ? toId : agentId,
            to: isFrom ? agentId : toId,
            type: isFrom ? 'receive' : 'send',
            message: a.action,
            mission: a.relatedMission,
            weight: a.impact === 'high' ? 3 : a.impact === 'medium' ? 2 : 1,
          });
        }
      }
    });
});

/* ── 3. Parse mission touchTrail (handoffs) ── */
allMissions.forEach(mission => {
  for (let i = 0; i < mission.touchTrail.length - 1; i++) {
    const fromPerson = mission.touchTrail[i];
    const toPerson = mission.touchTrail[i + 1];
    const fromId = resolveId(fromPerson.name);
    const toId = resolveId(toPerson.name);
    if (fromId && toId && fromId !== toId) {
      events.push({
        id: nextId(), time: `${8 + i}:00`,
        from: fromId, to: toId,
        type: 'handoff',
        message: `Handed off "${mission.title}" to ${toPerson.name}`,
        mission: mission.title,
        weight: mission.priority === 'critical' ? 3 : mission.priority === 'high' ? 2 : 1,
      });
    }
  }
});

/* ── 4. Parse escalation chains ── */
escalations.forEach(esc => {
  for (let i = 0; i < esc.chain.length - 1; i++) {
    const fromPerson = esc.chain[i];
    const toPerson = esc.chain[i + 1];
    const fromId = resolveId(fromPerson.name);
    const toId = resolveId(toPerson.name);
    if (fromId && toId && fromId !== toId) {
      events.push({
        id: nextId(), time: esc.createdAt.replace(' AM', '').replace(' PM', ''),
        from: fromId, to: toId,
        type: 'escalate',
        message: `Escalated "${esc.title}" (${esc.level})`,
        mission: esc.taskId ? allMissions.find(m => m.id === esc.taskId)?.title : esc.title,
        weight: esc.level === 'L4' ? 3 : esc.level === 'L3' ? 2 : 1,
      });
    }
  }
});

/* ── 5. Parse fullTimeline for deliverable submissions ── */
fullTimeline.forEach(event => {
  if (event.result && /sent to|submitted to|routed to|escalated to/i.test(event.result)) {
    const targetMatch = event.result.match(/(?:sent|submitted|routed|escalated) to (\w[\w\s]*?)(?:\s+for|\s*$)/i);
    if (targetMatch) {
      const fromId = resolveId(event.actor);
      const toId = resolveId(targetMatch[1].trim());
      if (fromId && toId && fromId !== toId) {
        // Avoid exact duplicates
        const isDup = events.some(e =>
          e.from === fromId && e.to === toId && e.time === event.time
        );
        if (!isDup) {
          const artifact = event.object?.match(/(\w+\.\w{2,5})/)?.[1];
          events.push({
            id: nextId(), time: event.time,
            from: fromId, to: toId,
            type: event.category === 'escalation' ? 'escalate' : 'send',
            message: `${event.actor} ${event.action}: ${event.object}`,
            artifact: artifact || event.object,
            weight: 2,
          });
        }
      }
    }
  }
});

/* ── Deduplicate by similar content ── */
const seen = new Set<string>();
export const interactionEvents: InteractionEvent[] = events
  .filter(e => {
    const key = `${e.from}-${e.to}-${e.type}-${e.message.slice(0, 40)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .sort((a, b) => a.time.localeCompare(b.time));

/* ── Build collaboration edges ── */
const edgeMap = new Map<string, CollaborationEdge>();

interactionEvents.forEach(e => {
  const key = [e.from, e.to].sort().join('|');
  if (!edgeMap.has(key)) {
    edgeMap.set(key, {
      from: e.from, to: e.to, count: 0,
      types: { send: 0, receive: 0, route: 0, escalate: 0, handoff: 0, feedback: 0 },
      missions: [],
    });
  }
  const edge = edgeMap.get(key)!;
  edge.count++;
  edge.types[e.type]++;
  if (e.mission && !edge.missions.includes(e.mission)) {
    edge.missions.push(e.mission);
  }
});

export const collaborationEdges: CollaborationEdge[] = Array.from(edgeMap.values())
  .sort((a, b) => b.count - a.count);

/* ── Compute metrics ── */
const connectionCount = new Map<string, Set<string>>();
interactionEvents.forEach(e => {
  if (!connectionCount.has(e.from)) connectionCount.set(e.from, new Set());
  if (!connectionCount.has(e.to)) connectionCount.set(e.to, new Set());
  connectionCount.get(e.from)!.add(e.to);
  connectionCount.get(e.to)!.add(e.from);
});

let mostConnected = { id: '', connections: 0 };
connectionCount.forEach((conns, id) => {
  if (conns.size > mostConnected.connections) {
    mostConnected = { id, connections: conns.size };
  }
});

// Count WAITs per agent from logs
const waitCounts = new Map<string, number>();
Object.entries(agentLogs).forEach(([name, lines]) => {
  const id = logNameToId[name];
  if (!id) return;
  const waits = lines.filter(l => l.startsWith('[WAIT]')).length;
  if (waits > 0) waitCounts.set(id, waits);
});
let bottleneck: { id: string; waitCount: number } | null = null;
waitCounts.forEach((count, id) => {
  if (!bottleneck || count > bottleneck.waitCount) {
    bottleneck = { id, waitCount: count };
  }
});

const busiest = collaborationEdges[0] || { from: '', to: '', count: 0 };

const typeBreakdown: Record<InteractionType, number> = {
  send: 0, receive: 0, route: 0, escalate: 0, handoff: 0, feedback: 0,
};
interactionEvents.forEach(e => typeBreakdown[e.type]++);

export const collaborationMetrics: CollaborationMetrics = {
  totalInteractions: interactionEvents.length,
  busiestChannel: { from: busiest.from, to: busiest.to, count: busiest.count },
  mostConnectedAgent: mostConnected,
  bottleneck,
  interactionsByType: typeBreakdown,
};

/* ── Mission flows ── */
export const missionFlows: Record<string, InteractionEvent[]> = {};
interactionEvents.forEach(e => {
  if (e.mission) {
    if (!missionFlows[e.mission]) missionFlows[e.mission] = [];
    missionFlows[e.mission].push(e);
  }
});
