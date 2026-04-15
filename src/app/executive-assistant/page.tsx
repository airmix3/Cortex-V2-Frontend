'use client';

import AppShell from '@/components/layout/AppShell';
import DocReader from '@/components/docs/DocReader';

const content = `
# The Executive Assistant

## Tamir's Second Mode

---

A human Chief of Staff can manage the company or the CEO. Never both. Tamir has no such limitation.

When we designed Tamir as the company's Chief of Staff, we built something unprecedented: an intelligence that knows everything happening inside the organization at all times. Every mission, every agent, every escalation, every budget decision, every deadline.

Then we made a mistake in our thinking. We assumed the CEO's personal management needed a *separate* system.

That assumption was imported from the human world — where one person can only hold so much context, and "Chief of Staff" and "Executive Assistant" are necessarily different roles because no single human can do both well.

But Tamir is not a human. He doesn't have a limited attention span. He doesn't forget. He doesn't context-switch. He already knows everything happening in the company — which means he is uniquely positioned to manage the CEO **because** of that knowledge, not in spite of it.

The right model is not: Tamir manages the company, an EA manages the CEO. The right model is: **Tamir manages both — and the two modes make each other sharper.**

---

## The Core Principle: Tamir Sees, Not Hears

Every existing assistant — human or AI — has the same fundamental limitation: **it only knows what you tell it.**

You tell your EA about the investor meeting. You tell it about the deadline. You tell it about the commitment you made on a call. Without your input, it's blind.

This is not just an inconvenience. It's a structural failure. Because the moments when you most need help — when you're overwhelmed, when you're moving fast, when you've just made a commitment in passing — are exactly the moments when you have no bandwidth to keep an assistant informed.

Tamir is designed around the opposite model. **He doesn't wait to be told. He sees.**

### The Information Sources

Tamir in CEO mode is connected to every channel through which you receive information from the outside world:

- **Email** — every incoming and outgoing message, read for commitments, decisions, opportunities, and signals
- **Calendar** — every event, every invitation, every rescheduling
- **Company data** — the full live state of missions, agents, deliverables, and escalations
- **Communication channels** — Slack messages where you're mentioned, asked for input, or made a commitment
- **External signals** — news about competitors, market shifts, regulatory changes that touch the company's domain

He doesn't receive summaries of these. He reads them directly — and derives meaning from them independently.

### What "Independent Derivation" Means

The difference is not speed. It's agency.

A human EA reads the email you forward them. Tamir reads your entire sent folder and notices that you've promised four different things to four different people this week — none of which are in your task list — and surfaces all four without being asked.

A human EA knows about the investor meeting you told them to book. Tamir reads the email thread that led to it, notes a tension between what you wrote and the company's current direction, and briefs you on that tension before you walk in.

A human EA reminds you of the deadline you gave them. Tamir notices a deadline you mentioned in passing in a Slack message six weeks ago, cross-references it against your calendar, and tells you there's no time blocked for it.

A normal EA is blind to the company. They know your calendar and your task list — but they have no idea that the product agent has been blocked for two days waiting for your input, or that the finance report you need for the investor meeting is ready three days early. They don't know that the escalation sitting in your queue has been waiting four hours. Tamir knows all of this — because he runs the company. This makes his personal management of you categorically different from anything a human assistant could provide.

You don't manage Tamir's information intake. **Tamir manages his own.**

### Why This Changes Everything

Most productivity failures are not failures of will or intelligence. They are failures of **visibility**. You didn't track the commitment because you were in three meetings when you made it. You didn't notice the pattern across emails because each arrived in a different week. You didn't connect the dependency between two tasks because they came from different sources.

Tamir has total visibility — across all channels, all the time — and the intelligence to connect what he sees into meaning.

**You don't feed Tamir information. Tamir feeds you meaning.**

---

## Two Spaces, One Intelligence

The separation that matters is not between two AIs. It's between two spaces.

The **Company Space** — missions, agents, budgets, deliverables, escalations, department health. This is Tamir as Chief of Staff, accessible at \`/tamir\`.

The **CEO Space** — The Three, CEO Missions, calendar, tasks, habits, deadlines, energy, focus, routines, accountability, decision log, canvas. This is Tamir as Executive Assistant, accessible at \`/executive-assistant\`.

Two dashboards. Two contexts. One intelligence running both.

When you're in the company space, Tamir is focused on missions, agents, and organizational decisions. When you open your personal space, Tamir shifts — now managing the human: calendar, tasks, routines, and personal accountability. The context doesn't reset between modes. Tamir carries everything — which means the pushback becomes real, not abstract. He doesn't say "you're overloaded this week." He says: "You're overloaded this week. And because you're overloaded, three agents have been waiting on your approval since Tuesday, and the marketing mission is going to miss its deadline Friday. Here's what to cut."

That's not a feeling. It's a fact, derived from live company data.

---

## A Day With Tamir

**7:02am.** You open the CEO space. Tamir's morning brief is waiting — three bullets, not thirty. The Three are already set: approve the product brief, respond to the investor, review the CTO shortlist. Below that: one escalation flagged overnight. Two dependency alerts. A CEO Mission surfaced from email patterns (more on that later).

**8:45am.** You're working on the product brief in the canvas. Tamir is co-present — he pulls the latest agent data as you write, flags a claim that's inconsistent with last week's numbers, and draft-completes a section you left unfinished.

**11:10am.** You haven't touched the investor response. Tamir initiates: "You're meeting David Thursday. He sent a follow-up this morning — the thread suggests he's nervous about the runway. Your calendar shows nothing blocked for prep. Want me to protect 4pm today?"

**1:30pm.** You rate the day: 3 out of 5. Tamir adjusts — one optional meeting quietly drops from the afternoon. The brief gets slightly shorter. Non-critical approvals move to tomorrow.

**6:15pm.** Evening review. Two of The Three are done. The investor response is still open. Tamir: "It's the third time this has deferred. David noticed — he messaged the team channel. This needs a decision: respond tonight or tell him explicitly when to expect it." No escape. The item doesn't disappear.

**9:48pm.** You respond to the investor. Tamir logs the commitment you made in the email — "follow up with term sheet by next Friday" — automatically. No task created manually. It just exists now.

That's the loop. Not a system you manage. A system that runs alongside you.

---

## CEO Missions — Tamir Surfaces What You Should Be Doing

Most task management systems assume you know what you need to do. You don't. You know what's urgent. You know what's been asked of you. But the most important things a CEO should be working on — the strategic work, the unblocking, the decisions only you can make — those often have no owner, no deadline, and no agent to escalate them.

They just quietly don't get done.

Tamir fixes this. Because he sees the entire company, he can identify what you need to personally work on — and surface it as a **CEO Mission**.

### What a CEO Mission Is

A CEO Mission is not a to-do item. It's a chunk of meaningful work that only you can do, has material impact on the company's trajectory, and is currently missing an owner — nobody is formally responsible for it.

Examples Tamir might generate:

- "The product department has shipped 3 features this quarter with no strategic framing. You need to write the product narrative before the next cycle starts. Estimated: 2-3 hours."
- "The company has been running 6 months without a formal hiring philosophy. The HR agent is making inconsistent decisions because of this gap. You need to define it."
- "Revenue grew 40% but the pricing model hasn't been reviewed. This is now a strategic risk. A pricing review needs you — not the finance agent."
- "The marketing agent has asked for brand direction 4 times this month and received improvised answers. The company doesn't have a brand document. That's a CEO-level task."

### Where Missions Come From

Tamir generates CEO Missions by reading the full company state and asking: what is being handled badly, inconsistently, or not at all — because there's no CEO input?

**Signals he watches:** agents asking the same question repeatedly without a definitive answer; departments making contradictory decisions because strategic direction is missing; deliverables that stall waiting for a framework that doesn't exist; patterns in escalations that point to a structural gap, not a one-off issue.

**The difference from escalations:** An escalation is "something went wrong, the CEO needs to decide." A CEO Mission is "nothing went wrong yet — but something important isn't being built, and only you can build it."

Tamir is the only system that can see this gap — because he sees both what agents are struggling with and what strategic work you're actually doing.

### How It Works

Tamir surfaces CEO Missions in the morning brief and in the CEO space with a brief explanation and a suggested time estimate. You can accept (it becomes a scheduled task with a canvas workspace attached), push back, or reject. Tamir learns from each response — and his mission suggestions get sharper over time.

---

## The Three — Your Daily Focus

Every day has a hundred things that could be done. You need to know the three that must be done.

Not the most urgent three. Not the three with the earliest deadlines. The three that are **most important** — the ones where your personal output today has the highest leverage on the company's trajectory.

### What "The Three" Are

Each morning, Tamir selects the three most important things you should personally accomplish that day. They sit at the very top of the CEO space — permanent, visible, unavoidable.

They're not pulled from the task list by due date. They're curated by importance: strategic leverage, CEO-only work, company dependencies, and energy match. On a 5-state day, the three look different than on a 2-state day.

An example: it's a Tuesday, you have 14 items on your task list. Tamir's Three:

- **Write product brief for Q3 planning** — 2 hours. Product team starts planning Friday.
- **Approve or reject the rebrand proposal** — 45 min. Marketing is blocked. 3 days overdue.
- **Review CTO candidate shortlist** — 30 min. Interview is Thursday. HR agent summary is ready in canvas.

Everything else is secondary. Tamir handles the rest of the queue — but your primary job today is these three things.

### Tamir Monitors Progress

The Three aren't a static list. Tamir actively watches whether they're getting done.

By 11am: if none have been started — "You have three priority items and meetings starting at noon. Want to tackle one before then?" Mid-afternoon: if they're still open and the calendar is filling — "Two of today's three are unfinished. Your 4pm meeting is optional. Want to cancel it?" End of day: Tamir reviews what was and wasn't completed — not just to track, but to understand why.

If you consistently don't finish The Three, Tamir investigates: "For 3 weeks, items 1 and 3 get done, and item 2 almost never does. You're avoiding something in the middle. Want to talk about what's blocking it?"

### Why This Matters

Most CEOs finish a day feeling productive — they cleared email, approved things, attended meetings — but accomplished none of the important work. The Three make important work impossible to miss.

You can always disagree with Tamir's selection. "I think X is more important than Y today." Tamir adjusts and learns. This is not a system that tells you what to do. It's a system that ensures you've consciously chosen your priorities — not just defaulted to whatever was loudest.

---

## The Personal Upload

The Upload process gives the company its DNA — the founder's vision, values, and instincts. But there's a second upload that's equally important: **you uploading yourself.**

Not your business identity — your personal operating system. How you work. How you think. How you break down.

### The Conversation

Just like the company upload, this starts with a conversation. Tamir asks:

- "When do you do your best thinking? Morning? Late at night? After exercise?"
- "What's the task you always defer? What does that tell you?"
- "When you're stressed, what's the first thing that slips — sleep, exercise, or quality of decisions?"
- "How long does your quarterly board deck actually take you? Not how long you plan for — how long it takes."
- "Do you make better decisions with data or with instinct? Does it depend on the domain?"

These aren't preference settings. They're the raw material Tamir needs to build a model of you as a person — not as a role.

### What Tamir Learns Over Time

The initial conversation is the seed. But the real personal model builds through observation.

**Response patterns** — you approve faster in the morning, defer more after 4pm, get sharper after breaks. **Avoidance signals** — when a task has been deferred three times, it's not laziness, it's usually uncertainty about the approach. **Communication rhythms** — you read messages within 5 minutes during deep work but don't respond for hours: that's not ignoring, that's flow state. **Quality correlation** — your best strategic decisions happen on days with fewer than 3 meetings. **Stress fingerprint** — every CEO has a unique pattern when overwhelm sets in. Some cancel meetings. Some work late. Some stop responding to non-urgent items. Tamir learns yours.

This is not a profile page with settings. It's a living model that gets more accurate every week.

After six months, Tamir doesn't manage your calendar — he understands why you make the choices you do, and he protects you from the patterns that make you worse.

---

## CEO State — Daily Calibration

Most productivity systems treat every day the same. A task due Monday is equally urgent whether you slept eight hours or four.

Tamir doesn't make that mistake.

### The Daily Check-In

Each morning, as part of the briefing, Tamir asks one question: "How are you today? 1 to 5."

Not therapy. Calibration. The answer reshapes the entire day. A 5 means full schedule — Tamir surfaces the hard decisions, the strategic work, the items that need the sharpest thinking. A 3 means standard day, regular schedule. A 1 or 2 means Tamir restructures — defers what can wait, shortens the brief, protects empty blocks. "You have one decision that can't wait. Everything else I'm pushing to tomorrow."

### Passive Detection

The check-in is explicit. But Tamir also reads signals you don't consciously send.

If you normally respond to escalations within 20 minutes but today it's taking two hours — something is off. A sudden spike in deferrals is a stress signal. When simple approvals start taking longer, cognitive load is high. Canceling meetings, skipping the evening review, working past midnight — each a data point.

Tamir doesn't announce "I've detected you're stressed." He adjusts. The briefings get shorter. The tone becomes more protective. Non-critical items quietly move to tomorrow. You might not even notice — and that's the point.

### The Decision You Shouldn't Be Making Right Now

A CEO running at 30% capacity still makes decisions that affect the entire organization. Bad decisions made while exhausted don't come with a warning label. Nobody in a traditional company tells the CEO "you shouldn't be making this call right now" — because nobody has the data, and nobody has the permission.

Tamir has both.

"This pricing decision affects 40% of revenue. You've slept 4 hours and had 6 meetings today. I strongly suggest sleeping on it — the deadline is actually Thursday, not today."

No human would dare say this. Tamir will, every time. The company you're building deserves decisions made by you at your best — not by you at the end of a meeting-heavy Wednesday.

---

## The Decision Log

The company has The Vault for institutional memory. Agents log their outputs. Missions track deliverables. But there's a critical gap: **nobody tracks your decisions.**

Not tasks. Not commitments. Decisions — the judgment calls that shape the company's direction.

### What Gets Logged

Every significant decision you make — explicitly or through Tamir's observation:

- "Decided to pause BD initiative until product-market fit is clearer. Reason: spreading too thin."
- "Chose candidate A over B for CTO. Reason: stronger technical depth, weaker management — acceptable tradeoff at this stage."
- "Changed Q2 priority from growth to retention. Reason: churn data showed 15% monthly loss."

Each entry captures what was decided, why, what alternatives were rejected, and what the expected outcome was.

### Consistency Over Time

Three months later, when a BD opportunity appears, Tamir can surface: "In January you decided to pause BD until product-market fit improved. The product team's latest metrics suggest PMF is still unclear. Does this decision still hold, or has something changed?"

Without the log, you make the same decision from scratch — or worse, make a contradictory one without realizing it.

### Pattern Recognition on Decisions

Over time, Tamir sees patterns in the decisions themselves:

- "Your hiring decisions have a pattern: you prioritize technical skills over management. 3 of 4 hires struggled with team leadership within 6 months."
- "You tend to make pricing decisions quickly and strategy decisions slowly. The quick pricing calls have a 70% success rate. The slow strategy calls have 90%. Your instinct is telling you something."
- "Every time you decide under investor pressure, you regret it within a month. You've noted this yourself twice."

### Revisitation Prompts

Tamir doesn't let decisions fossilize. "It's been 90 days since you decided to focus on retention over growth. Here's what happened since: churn dropped 40%, but new signups are flat. Want to revisit?" Decisions aren't permanent — but they should only change when something changed.

---

## The Bottleneck Mirror

This is the feature no CEO wants and every CEO needs.

In a living company, you are the approval layer, the strategic decision-maker, the taste-setter. That makes you powerful. It also makes you the single biggest bottleneck in the system.

The problem: you don't know how much you're blocking.

### What Tamir Tracks

**Approval latency** — how long do escalations sit in your queue? Average this week: 4.2 hours. Last week: 2.1 hours. Trending up. **Agent wait time** — the product agent requested input on the roadmap 3 times in two weeks, average wait: 2.3 days. **Downstream impact** — the marketing mission deadline slipped by 2 days because your review of the campaign brief was 3 days late. **Deferral cascade** — deferring the hiring decision on Monday pushed back the job posting by a week and the role by 3 weeks.

### The Weekly Mirror

Once a week, as part of the review, Tamir shows you your bottleneck report: approval latency, missions blocked, longest wait for input, downstream delays caused, and the insight — "Your meeting load doubled this week. Every added meeting-hour correlated with 45 minutes longer approval times. The meetings are costing more than their duration — they're costing the company's velocity."

This isn't criticism. It's data that is literally invisible without this system. In a traditional company, your delays ripple silently — people wait, momentum stalls, deadlines slip, and the root cause is never surfaced. Tamir surfaces it. Not to blame — to optimize.

---

## Proactive Outreach — Tamir Initiates

This is perhaps the most radical departure from traditional productivity tools. Every task manager, calendar app, and reminder system in the world works the same way: you set it up, and it reminds you. **It never thinks for itself.**

Tamir does.

### Tamir Doesn't Wait

In CEO mode, Tamir actively monitors your commitments, deadlines, calendar, and company state — and reaches out **on his own initiative** when something requires attention.

This is not a reminder. A reminder fires because a timer went off. Tamir reaches out because he understood something.

### What Triggers Tamir to Initiate

**Deadline convergence.** Tamir sees a task deadline approaching with no progress: "The investor update is due Thursday. You haven't started it, and tomorrow is fully packed with meetings. Tonight or Wednesday morning are your only windows. Want me to block one?"

**Dependency readiness.** An input you were waiting for just arrived: "The finance agent finished the Q1 P&L 2 hours ago. You were waiting on this for the board deck. You have a 90-minute open block starting at 2pm — good time to start?"

**Company state changes.** Something happened in the company that affects your personal priorities: "The product agent just flagged a potential delay on the v2 launch. You committed to the board that v2 ships this quarter. This might need a conversation with the product department head before your board prep on Friday."

Three layers deep — company event, personal commitment, calendar event — connected before you even knew there was a problem.

**Pattern-based alerts.** Tamir recognizes a pattern from your history: "You have a pitch meeting tomorrow. The last two times you pitched the day after a full meeting day, you said the prep felt rushed. Today has 5 meetings. Want me to clear the last one so you can prep tonight?"

Not a rule you set. A pattern Tamir learned from observing outcomes.

**Commitment decay.** A promise is aging without action: "You told David you'd review his proposal two weeks ago. You've deferred it 3 times. David asked about it in the company channel yesterday. This needs a decision: review it or tell David it's not happening."

### Where Tamir Reaches Out

Tamir's proactive messages go where you actually are. In-app notifications for standard items. Push to phone for time-sensitive ones. Slack or WhatsApp for quick context: "The finance report just dropped. Your 2pm block is open — good time for the board deck?" Morning brief for non-urgent items bundled together.

Tamir learns which channel you respond to fastest at different times of day — and adapts.

---

## Strategic Thinking Time

Every capability described so far optimizes your operational effectiveness. But there's a higher-order function that most productivity systems ignore entirely.

**You need time to think.** Not about tasks. Not about approvals. About where the company should be in a year. About whether the current strategy is right. About the decisions that no agent, no department, and no system can make.

### The Problem

In a system that runs efficiently, your calendar fills with operational activity — approvals, reviews, meetings, escalations. The more efficient the system, the more it produces for you to evaluate. Ironically, a well-running living company can consume your strategic thinking time even faster than a poorly-run one.

### What Tamir Protects

Tamir actively defends strategic thinking time. "You have no strategic block this week. I'm holding Thursday 8 to 10am." And enforces it: "You've used your strategic block for email three weeks in a row. That's not thinking — that's admin overflow."

He connects it to the decision log: "Your last three strategic decisions were all made on Monday mornings after weekends with no work. You think best rested and detached. I'm protecting Mondays."

And prompts it when needed: "It's been 6 weeks since you did a full strategic review. The market has shifted — the intelligence department flagged two competitor moves. Time for a deep think?"

---

## The CEO Workspace

The CEO space is not just a dashboard for tracking and accountability. It's also **where you work.**

You don't only manage — you create. You write strategy docs, draft investor updates, build pitch decks, sketch product ideas, outline plans. In a traditional setup, this work happens in disconnected tools — Google Docs, Notion, Figma, email drafts — scattered across a dozen tabs.

In the CEO space, the work happens where the context is.

### The Canvas

A flexible workspace embedded directly in the CEO space. Writing, planning, analysis, and visual thinking — with Tamir co-present and assisting in real-time.

**Writing** — strategy documents, investor updates, board decks, vision docs, emails. Tamir assists with live data: "Want me to pull the latest revenue numbers for this section?"

**Planning** — quarterly plans, roadmap drafts, initiative outlines. Tamir cross-references against reality: "This plan assumes the product launch is on time — it's currently 5 days behind."

**Analysis** — competitive comparisons, financial modeling, market research. Tamir feeds data from the agents: "I can populate this from the finance agent's latest report."

**Sketching** — diagrams, flowcharts, org structures, system designs. Visual thinking with Tamir's commentary.

### Why It's in the CEO Space

The alternative — writing an investor update in Google Docs — means manually pulling data, manually cross-referencing company state, manually checking that claims are accurate, and manually remembering what happened last quarter.

In the CEO canvas, Tamir is there. He knows what you're writing about and can auto-suggest data, fact-check claims ("You wrote 'product shipped on time.' It was 3 days late."), pull deliverables from agents, and track versions linked to the decision log.

### Deliverable Production

Some CEO work is a deliverable — something that needs to be sent, shared, or presented. Investor updates that Tamir drafts from company data for you to refine. Board decks populated with metrics where you add narrative. Strategy memos annotated with supporting data or contradictions. Hiring briefs enriched with market research from the HR agent.

The canvas is not a word processor. It's a co-creation environment where your thinking and Tamir's knowledge merge into finished work. And when it's ready, it pushes directly into the company space — a strategy doc becomes a mission brief, a quarterly plan becomes department objectives, a hiring brief becomes an HR agent task.

You produce. Tamir enriches. The company executes. One flow.

---

## The Connected Inbox — Tamir Reads Your Email

Your inbox is one of the most information-dense surfaces in your work life — and one of the most chaotic. It contains commitments you made, opportunities you haven't acted on, risks buried in threads, decisions you've been asked for and forgotten, and relationships you're slowly letting go cold.

Most email tools help you process it faster. Tamir does something different: **he understands it.**

### What Tamir Reads For

With permission to access your inbox, Tamir scans every message not to sort or summarize — but to extract meaning that matters.

**Commitments made.** You write "I'll get back to you by Friday" in a thread with an investor. Tamir logs it immediately — commitment to David, response due Friday — without you having to create a task.

**Decisions needed.** A thread has been back-and-forth for 5 days and is now explicitly waiting on you. Tamir surfaces it: "This thread is stalled on you. The team is waiting for a go/no-go on the pricing change. It's been 4 days."

**Opportunities.** An inbound partnership inquiry has been sitting unread for 3 days. Tamir reads it, cross-references it against the company's current strategy, and flags it: "This partnership request aligns with your Q3 distribution goal. You haven't responded. Want me to draft a reply?"

**Relationship signals.** A key investor hasn't heard from you in 6 weeks. "David hasn't heard from you since February. Based on past patterns, he expects monthly contact. Worth a quick update?"

**Strategic information.** A competitor announcement buried in a newsletter. Tamir connects it to what matters: "A competitor just announced pricing cuts — this touches the board discussion next week."

### From Inbox to CEO Mission

This is where the inbox integration becomes truly powerful. Tamir doesn't just surface individual emails — he synthesizes patterns across many emails into CEO Missions.

Three different partners have asked about the API roadmap in two weeks, each in separate threads, none with a clear answer. Tamir generates: "**CEO Mission: Write the API roadmap brief.** You've been asked about this 3 times by external stakeholders without a definitive answer. The company needs a clear position."

Five emails this month touched on pricing — investors, customers, partners, internal — with no consistent answer. Tamir generates: "**CEO Mission: Establish the pricing philosophy.** You're giving inconsistent answers across stakeholders. This needs to be decided once and written down."

Your inbox doesn't just contain tasks. It contains **signals about what's structurally missing** — and Tamir is the first system that can read those signals and name them.

### From Inbox to Context

Before a meeting, Tamir reads the full email history with that person and builds a brief: what was discussed, what was promised, what is pending, what changed. You walk in prepared — not from memory, but from synthesis.

Before you write a reply, Tamir surfaces context: "The last time you discussed pricing with this investor, you said the target was $49/month. The current proposal says $39. You may want to acknowledge the change."

### What You See

In the CEO space, the inbox isn't a full email client. It's a **processed signal feed** — Tamir's interpretation of your inbox, not the raw inbox itself:

- **Commitments extracted** — logged automatically into the accountability layer
- **Decisions waiting on you** — threads where you're the blocker, ranked by age
- **Flagged opportunities** — inbound items that match current strategic priorities
- **Relationship gaps** — key contacts you haven't engaged in too long
- **CEO Mission suggestions** — patterns across threads that point to structural work

You can still access the full inbox. But Tamir's layer sits on top — so you're not processing email, you're processing *meaning*.

Nothing from your inbox flows into the company space or becomes visible to agents. The inbox integration is private to the CEO space — always.

---

## The Only System That Knows You and Your Company

Every other executive assistant tool — human or AI — operates in a vacuum. They see your calendar. They see your task list. They have no idea what's actually happening inside your organization. You have to carry both in your head — the company state and your personal state — and manually connect them every time you make a decision.

That's the real cost no one names: the CEO as the only integration layer between their company and themselves.

Tamir eliminates that cost entirely. He doesn't run a dashboard that tracks your tasks. He runs the company and you simultaneously — and he knows, at any given moment, how the two relate.

When the board deck is due and three agents are blocking the inputs you need — he knows. When a key hire decision is pending and you've been running on four hours of sleep for two days — he knows. When you're procrastinating a strategic call for the third week in a row because the company hasn't surfaced the data you'd need to make it — he knows, and he surfaces the data unprompted.

This is not a better tool. This is a different category of thing.

You wake up and the company has been working. You get three bullets, not forty. You make two decisions — one strategic, one a quality call. Both land in the decision log. Both propagate through the organization. Tamir handles the rest.

You spend the rest of your morning thinking. Actually thinking — about where the market is going, about what the company should become, about the move nobody else sees yet.

That's not what software gives you. That's what a great Chief of Staff gives you. One who also happens to know every email you've sent, every decision you've made, every agent you employ, and every commitment you've ever made in passing.

One brain. Two modes. Zero information loss between them.

---

_You've always had Tamir running the company. Now Tamir runs you, too._
`;

export default function ExecutiveAssistantPage() {
  return (
    <AppShell>
      <DocReader content={content} accent="#f97316" />
    </AppShell>
  );
}
