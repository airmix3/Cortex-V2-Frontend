# Myelin / ACS Master Context Document
_Last updated: 2026-03-15_

## Purpose of this file

This document is a **context handoff for an AI software-building agent**. It is meant to give that agent the same high-level and low-level understanding we developed across the project docs and the design discussion.

This file merges three layers of knowledge:

1. **Canonical project truth from the supplied docs**
   - Product Requirements Document
   - Escalation System & Chain of Command
   - Agent Identity & Behavioral Profiles
   - Visual Diagrams & Data Flow
   - Workflow Scenarios
2. **Design decisions we made in the UI discussion**
3. **Current interpretation of the best homepage direction based on the latest mockup**

Important: not every idea here is equally final.

To help the coding agent reason correctly, this document uses three labels:

- **Canonical** - directly grounded in the project docs
- **Design decision** - a product decision we made in discussion and should treat as the current intended direction
- **Open question** - still not fully settled and should not be treated as fixed truth

---

# 1. Project identity

## 1.1 Concrete product

**Myelin** is the concrete product instance described in the supplied docs.

It is an **autonomous, hierarchical AI company operating system** for a neurotech startup. It lets a solo founder operate a company through a team of AI executives and employees rather than through one general chatbot.

### Canonical summary
- Myelin is not "just an assistant"
- It is a **living virtual organization**
- It has:
  - roles
  - departments
  - chain of command
  - memory partitions
  - escalation protocols
  - deliverables
  - governance
  - a management UI called **The Cortex**

## 1.2 Broader abstraction

**ACS - Autonomous Company System** is the broader product abstraction that came up in discussion.

Think of Myelin as:
- a concrete implementation for a neurotech startup
- a strong example of the broader ACS concept

### Design decision
The software should be architected so that:
- **Myelin** is the current company-specific implementation
- the architecture could later generalize into a broader ACS framework for other founder-led businesses

## 1.3 Important naming map

Use this map so the builder AI does not get confused:

- **Myelin** - the current product / company operating system for the neurotech startup
- **The Cortex** - the management UI / dashboard
- **Tamir** - the Chief of Staff / orchestrator / founder's single point of contact
- **CEO / Founder** - the human operator at the top of the system
- **ACS** - the broader concept beyond this specific company instance

---

# 2. Core product philosophy

## 2.1 This is not a chatbot

### Canonical
The system's key differentiator is that it is **not a chatbot**. It is a virtual company.

That means:
- the founder should not feel like they are chatting with one amorphous AI
- they should feel like they are operating a company with structure, delegation, roles, outputs, and accountability

## 2.2 Founder attention is the scarcest resource

### Canonical
The founder is a solo operator. Their attention budget is limited. The chain of command exists partly to protect that budget.

### Design decision
The UI and orchestration should always optimize for:
- reducing noise
- surfacing only high-leverage decisions
- keeping the founder out of low-level execution unless intervention is truly useful

## 2.3 The system must feel like a real organization

### Canonical
The whole architecture is based on:
- departments
- reporting lines
- reviewed deliverables
- escalations
- memory curation
- role-specific behavior

### Design decision
Every major UI surface should communicate:
- who owns what
- where work sits in the chain
- what artifacts exist
- what is blocked
- what founder action changes the outcome

## 2.4 Deliverables matter more than activity

### Canonical
Tasks must have clear deliverables. The system is explicitly deliverable-driven.

### Design decision
The UI must show outputs, not just statuses. The system should feel like it produces:
- files
- graphs
- reports
- plans
- code
- briefings
- media

not just "task updates."

## 2.5 Chain of command is not flavor text

### Canonical
The chain of command is enforced at multiple layers:
- tools
- database schema
- system prompts

This is not optional style. It is an architectural constraint.

## 2.6 Intervene without collapsing the hierarchy

### Canonical
The CEO can intervene via dashboard.
### Design decision
Intervention should be a targeted, high-leverage action that creates a **CEO Directive** inside the system, not a casual bypass of the organization.

---

# 3. Product vision

## 3.1 What problem Myelin solves

### Canonical
A solo founder on a compressed startup timeline cannot personally manage:
- technical research
- cloud/infrastructure decisions
- marketing strategy
- content creation
- market intelligence
- operations and timeline tracking
- knowledge management
- hiring and task delegation

Myelin exists to replace a large portion of a 10+ person operating team with a structured AI company.

## 3.2 What success looks like

The founder should be able to:
- speak to the company through Tamir
- operate the company from Telegram and The Cortex
- receive briefings, outputs, and escalations instead of raw chaos
- intervene only when it changes outcomes
- maintain institutional memory across the organization

## 3.3 Beach mode

### Canonical
A central idea is that the entire system should be operable from a phone via voice memos while the founder is walking on the beach.

This is not a gimmick. It shapes the architecture:
- text + voice input
- voice briefings
- compact executive summaries
- mobile-friendly dashboard

---

# 4. Organizational model

## 4.1 Top-level hierarchy

### Canonical
The intended reporting chain is:

**CEO -> Tamir -> Department Heads -> Employees**

More specifically:

- CEO / Founder
- Tamir (Chief of Staff / Orchestrator)
- CTO
- CMO
- COO
- Permanent employees
- Temporary employees

## 4.2 Tamir - Chief of Staff

### Canonical
Tamir is:
- calm
- hyper-organized
- anticipatory
- the founder's right hand
- cross-functional
- top of the AI chain under the CEO

### Core responsibilities
- classify every CEO message by intent, urgency, department
- route requests to the correct department head
- ask clarifying questions if the founder's request is ambiguous
- coordinate cross-department work
- generate executive briefings
- extract durable facts, preferences, and decisions from casual founder messages
- propose what should go into The Vault

### Important rule
Tamir is the **single point of contact** for the founder.

This is one of the most important truths in the whole product.

## 4.3 CTO

### Canonical
CTO handles:
- technology research
- architecture and infrastructure decisions
- model evaluation
- technical project management
- hiring/managing technical employees
- answering cross-department technical questions

### Typical employees under CTO
- developers
- research specialists
- data scientists

## 4.4 CMO

### Canonical
CMO handles:
- content strategy
- brand consistency
- external messaging
- executive summaries for voice briefings
- marketing-related cross-department synthesis

### Typical employees under CMO
- Content Director
- Market Intelligence Analyst

### Important workflow note
The CMO is the brand gatekeeper. Public-facing outputs should go through CMO approval.

## 4.5 COO

### Canonical
COO handles:
- the 300-day timeline
- milestones
- weekly reviews
- investor meeting tracking
- operational context for other departments

### COO personality
- pragmatic
- timeline-obsessed
- direct
- frames everything in terms of schedule and operational risk

## 4.6 Employees

### Canonical
Employee types include:
- executive
- permanent
- temp

Employees are not autonomous free agents. They operate within:
- department scope
- memory scope
- reporting scope
- task scope

---

# 5. Chain of command

## 5.1 Why it exists

### Canonical
The chain of command solves:
- founder attention protection
- context enrichment as information moves upward
- accountability
- memory protection and curation

## 5.2 Core rules

### Canonical

1. **Employees never message the CEO directly**
2. **Employees submit work to their department head**
3. **Department heads submit deliverables to Tamir**
4. **Tamir briefs or routes to the CEO**
5. **Escalations move upward through the same chain**
6. **The chain is enforced in tools, schema, and prompts**

## 5.3 Practical implication for UI and backend

### Design decision
Any UI text, workflow, or card that implies this path:

`Employee -> CEO`

is wrong.

The correct paths should look like:
- `Employee -> Dept Head -> Tamir -> CEO`
- `Dept Head -> Tamir -> CEO`
- `Employee -> Dept Head -> Tamir` for internal review or submission
- `Employee -> Dept Head -> Tamir -> CEO` for escalations that reach the founder

## 5.4 Critical correction from later homepage mockups

### Design decision
In later homepage mockups, some mission cards showed paths like:
- `Research -> CTO -> CEO`
- `Marketing -> CMO -> CEO`

These should be corrected to include Tamir:
- `Research -> CTO -> Tamir -> CEO`
- `Content Director -> CMO -> Tamir -> CEO`

This is not cosmetic. It is core product truth.

---

# 6. Technical architecture

## 6.1 Runtime model

### Canonical
The whole system runs as:
- a **single Python process**
- on a **Raspberry Pi 4**
- with **4GB RAM**
- headless
- no Docker
- no local LLM inference

## 6.2 Core constraint

### Canonical
All heavy AI inference runs through **AWS Bedrock**.

No local LLMs.
No local embedding models.
No container-heavy setup.

## 6.3 High-level topology

### Canonical
The topology is:

- Founder on phone / Telegram
- Telegram API
- Raspberry Pi Python process
  - Telegram bot layer
  - Agent layer
  - Bedrock queue layer
  - persistence layer
- AWS Bedrock
- Amazon Transcribe
- Amazon Polly
- SQLite
- ChromaDB / Mem0-backed vector memory

## 6.4 Async process model

### Canonical
The Python process includes:
- Telegram polling loop
- a background Bedrock queue worker
- per-message handler coroutines
- later: FastAPI/Uvicorn for The Cortex
- later: APScheduler jobs for routines

## 6.5 Why stateless agents

### Canonical
Agents are stateless callables, not persistent in-memory objects.

This exists to:
- keep memory use low on the Pi
- allow many agents conceptually without dozens of resident objects
- rebuild context fresh from SQLite + memory search on each invocation

### Important implementation truth
An agent at rest is mostly:
- a row in `employees`
- a memory namespace
- historical task/activity data

An agent "exists" at runtime only during invocation.

---

# 7. Core technology stack

## 7.1 Backend and orchestration

### Canonical
Primary stack:
- Python
- asyncio
- python-telegram-bot v20+
- aiosqlite
- boto3 / AWS integrations
- Mem0 + ChromaDB
- AWS Bedrock
- FastAPI + Jinja2 or similar for The Cortex
- SSE or WebSocket for real-time updates
- Tailscale for secure remote access to the dashboard

## 7.2 AI services

### Canonical
- AWS Bedrock for LLM calls
- Claude 3.5 Sonnet via Bedrock
- Amazon Transcribe for voice-to-text
- Amazon Polly for text-to-voice

## 7.3 Queueing

### Canonical
There is a Bedrock priority queue and only **one Bedrock call executes at a time**.

This is a major design constraint because:
- the Pi has only 4GB RAM
- it avoids resource spikes
- it simplifies reliability and rate-limit handling

## 7.4 Security and environment

### Canonical
- `.env` for secrets
- no hardcoded credentials
- Tailscale for Cortex access
- resilience to Pi restarts through disk-backed persistence

---

# 8. Persistence and memory

## 8.1 Memory tiers

### Canonical
There are three main memory tiers:

1. **The Vault** - company-wide durable memory
2. **Department libraries** - dept-specific durable memory
3. **Employee desks** - per-agent working memory and history

## 8.2 The Vault

### Canonical
Namespace: `myelin:vault`

Readable by all.
Writable only by Tamir, and even that should be aligned with founder approval for major durable memory entries.

Typical contents:
- mission
- company vision
- strategy
- major founder decisions
- company-wide policy or code of conduct
- major announcements
- durable product knowledge

## 8.3 Department libraries

### Canonical
Examples:
- `myelin:dept:tech`
- `myelin:dept:marketing`
- `myelin:dept:operations`

Typical contents:
- tech: infra docs, model evals, project summaries, employee roster
- marketing: content plans, brand guide, campaign knowledge, performance data
- operations: timeline, milestones, investor notes, weekly reviews

## 8.4 Employee desks

### Canonical
Examples:
- `myelin:emp:cto`
- `myelin:emp:cmo`
- `myelin:emp:coo`
- `myelin:emp:content_director`

Each employee has a private desk namespace with controlled access.

## 8.5 Temp employee memory

### Canonical
Temporary employee desks are created on hire and purged on termination.

This is very important because temp work should not permanently clutter the company memory structure.

## 8.6 Memory access control

### Canonical
Access is role-based and partitioned.
Important principles:
- all can read the Vault
- department heads read/write their department library
- department employees read their department library
- employees read/write only their own desk
- Tamir has broader read access and special Vault write rights

## 8.7 Memory hygiene

### Canonical plus design interpretation
Do not dump drafts into durable memory by default.
Draft state should live in systems like shared desks and explicit deliverables, not in semantic memory.

---

# 9. Database and key data model

## 9.1 Main tables

### Canonical
Key tables include:
- `employees`
- `tasks`
- `deliverables`
- `activity_log`
- `shared_desk`
- `escalations`
- `message_queue`

## 9.2 employees

Important fields:
- `agent_id`
- `name`
- `role`
- `type`
- `department`
- `reports_to`
- `status`
- `system_prompt`
- timestamps

### Key point
`reports_to` enforces hierarchy structurally.

## 9.3 tasks

Important fields:
- `assigned_to`
- `assigned_by`
- `description`
- `deliverable_spec` (JSON)
- `status`
- `progress_log` (JSON array)
- timestamps

### Important product truth
Tasks are not vague jobs. They must have a clear **deliverable_spec**.

## 9.4 deliverables

Important fields:
- `task_id`
- `creator`
- `department`
- `type`
- `format`
- `file_path`
- `metadata`

Formats may include:
- md
- pdf
- docx
- ppt
- csv
- png
- ogg

## 9.5 shared_desk

### Canonical
The shared desk is where draft content can live and move through states such as:
- draft
- submitted
- approved
- discarded

This prevents polluting memory with immature work.

## 9.6 escalations

Important fields:
- `originated_by`
- `current_level`
- `task_id`
- `situation`
- `blocker`
- `attempts`
- `status`
- `resolution`

## 9.7 message_queue

Supports structured agent-to-agent communication.

---

# 10. File structure and code organization

## 10.1 Intended repo structure

### Canonical
A representative structure from the diagrams doc:

```text
/home/omer/Myelin/
├── .env
├── .env.example
├── PRD.md
├── requirements.txt
├── myelin/
│   ├── main.py
│   ├── config.py
│   ├── db/
│   │   ├── connection.py
│   │   ├── models.py
│   │   ├── employees.py
│   │   ├── tasks.py
│   │   └── activity_log.py
│   ├── memory/
│   │   ├── client.py
│   │   ├── partitions.py
│   │   └── access_control.py
│   ├── llm/
│   │   ├── bedrock.py
│   │   ├── queue.py
│   │   └── tools.py
│   ├── agents/
│   │   ├── base.py
│   │   ├── registry.py
│   │   ├── prompts.py
│   │   └── tamir.py
│   └── telegram/
│       ├── bot.py
│       ├── handlers.py
│       ├── auth.py
│       └── sender.py
├── data/
│   ├── myelin.db
│   └── chromadb/
├── deliverables/
│   ├── tech/
│   ├── marketing/
│   └── operations/
└── tests/
```

## 10.2 Builder guidance

### Design decision
A coding agent should preserve this modular separation:
- orchestration
- persistence
- memory
- LLM calling
- Telegram
- UI
- tests

Do not collapse the whole product into one giant server file.

---

# 11. Agent invocation model

## 11.1 Standard invocation flow

### Canonical
Every invocation roughly follows:

1. Load employee identity from DB
2. Load relevant memories from employee desk + Vault
3. Build messages array fresh
4. Log invocation
5. Submit Bedrock call through priority queue
6. Execute tool-calling loop if tool calls appear
7. Log completion
8. Return final text / results

## 11.2 Tool access by role

### Canonical

**Tamir**
- search_memory
- store_memory
- route_to_department
- ask_ceo
- store_in_vault
- query_agent

**Dept heads**
- search_memory
- store_memory
- query_agent

**Employees**
- search_memory
- store_memory

### Key product truth
Lower-level agents should not have direct tools that bypass the hierarchy.

---

# 12. Employee lifecycle

## 12.1 Types

### Canonical
- executive
- permanent
- temp

## 12.2 Hiring

### Canonical
Hiring may be:
- permanent
- temporary
- department-led
- subject to CEO approval depending on governance settings and thresholds

## 12.3 Onboarding

### Canonical
Onboarding packets should include:
- relevant company context
- task context
- resources
- where files/data live
- what "good" looks like
- what deliverable is required

## 12.4 Deliverable Clarity Rule

### Canonical and critical
This is one of the most important rules in the whole system:

**No task should be assigned without a clear deliverable definition.**

A task should specify:
- what artifact is expected
- in what format
- with what contents
- how completion will be evaluated

## 12.5 Employee work loop

### Canonical
Typical employee loop:
- plan
- execute
- log progress
- submit
- escalate if blocked after self-resolution attempts
- await review or next instruction

## 12.6 Termination

### Canonical
Temp employees may be terminated after task completion and memory purged.
This is especially important for research bursts and comparison tasks.

---

# 13. Escalation system

## 13.1 Escalation is structured, not emotional

### Canonical
Escalations are formal decision packets, not vague alerts.

## 13.2 Escalation levels

### Canonical pattern
- L1: Employee -> Dept Head
- L2: Dept Head internal handling attempts
- L3: Dept Head -> Tamir
- L4: Tamir -> CEO

## 13.3 Trigger pattern

### Canonical
If an employee is blocked:
- they attempt self-resolution
- if still blocked, escalate to dept head
- dept head attempts to resolve
- if still unresolved, move upward through the chain

## 13.4 Required escalation content

### Canonical
An escalation should include:
- originated by
- chain
- situation
- blocker
- what was tried
- why attempts failed
- what is needed from the next level
- context / impact

## 13.5 Best UI interpretation

### Design decision
An escalation card in The Cortex should show:

- Severity + Level
- Originated by
- Chain
- Situation
- Blocker
- Attempts made
- What we need from you
- Impact if ignored
- Actions

Example pattern:

- `AWS Capacity Blocker`
- `L4 Escalation`
- `Originated by: dev_temp_001`
- `Chain: Developer -> CTO -> Tamir -> CEO`
- `Situation: Deploying ZUNA EEG model on AWS for inference`
- `Blocker: Insufficient GPU capacity in selected AZ`
- `Attempts made: ...`
- `Need from you: Approve g4dn.xlarge in us-west-2`
- `Impact if ignored: Deployment paused`

## 13.6 Escalation modulation

### Canonical
The docs include escalation modulation concepts in Phase 9.
This means escalation behavior can depend on governance/profile settings, not just hard rules.

---

# 14. CEO intervention and directives

## 14.1 Core ability

### Canonical
The CEO can intervene via the dashboard.

## 14.2 Best interpretation

### Design decision
This should not be framed as "take over everything manually."
It should be framed as issuing a **CEO Directive**.

## 14.3 Why wording matters

In one of the later mockups, wording like:
- `CEO Intervention Mode`
- `Direct Override`

appeared.

### Design decision
That is directionally useful but too aggressive for the actual operating model.

Prefer language like:
- `Send CEO Directive`
- `Guide selected mission`
- `Intervene via Tamir`
- `Escalate priority`
- `Add founder guidance`

The goal is:
- preserve hierarchy
- let the founder change direction
- avoid making the system feel like the founder constantly bypasses the organization

## 14.4 Directive composer idea

### Design decision
A directive interaction should ideally support:
- recipient
- directive text
- priority
- optional scope note
- whether it is a one-off instruction or reusable guidance

---

# 15. Core operational features

## 15.1 Voice input - Beach Mode

### Canonical
Flow:
1. founder sends voice note
2. bot downloads `.ogg`
3. upload to S3 staging
4. run Amazon Transcribe
5. poll until completion
6. retrieve transcript
7. delete audio from S3
8. feed transcript to Tamir as if it were text
9. confirm routing to founder

## 15.2 Voice output - Executive Briefings

### Canonical
Flow:
1. agent, often CMO or Tamir, generates concise summary
2. Polly synthesizes voice
3. audio sent via Telegram voice
4. related visuals/documents sent separately
5. temp files cleaned up

## 15.3 Auto-extraction and memory storage

### Canonical
Tamir can extract:
- facts
- preferences
- decisions
- ideas

Then classify them into:
- Vault-worthy
- department memory
- maybe not durable enough yet

## 15.4 Proactive scheduled routines

### Canonical
Later phases include routines such as:
- weekly reviews
- milestone checks
- departmental cadence
- possibly market/content monitoring

## 15.5 Deliverables system

### Canonical
Deliverables are first-class system objects.
They should be:
- concrete
- typed
- stored
- visible in the UI
- attributable
- routed upward through the chain

---

# 16. Canonical workflow patterns

## 16.1 General workflow spine

### Canonical
Most workflows follow:

**CEO -> Tamir -> Dept Head -> Employee(s) -> Deliverable -> Dept Head review -> Tamir -> CEO**

That is the spine the builder AI should keep in mind.

## 16.2 Technical research and deployment

### Canonical summary
Example:
- founder asks about ZUNA EEG model
- Tamir classifies as tech and routes to CTO
- CTO researches model and requirements
- CTO hires a temp developer if needed
- developer deploys and evaluates
- if blocked, escalation flows upward
- developer submits graphs and results to CTO
- CTO reviews against founder intent
- CTO creates deliverable
- CTO reports to Tamir
- Tamir briefs founder with summary + media

## 16.3 Content strategy and creation

### Canonical summary
- founder asks for 5 content ideas
- Tamir routes to CMO
- CMO queries CTO and COO for proof points and milestones
- CMO activates Content Director
- Content Director drafts full plans
- CMO reviews and approves
- CMO prepares executive summary
- CMO -> Tamir -> founder, with voice summary and deliverables

## 16.4 Market research

### Canonical summary
- founder asks to compare EEG devices under a price threshold
- Tamir routes to CTO
- CTO hires temp research specialist
- specialist gathers product data, potentially via scraping/Apify-like methods
- specialist evaluates devices against actual company needs
- specialist submits comparison
- CTO adds technical opinion
- CTO -> Tamir -> founder
- temp researcher terminated, memory purged, useful summary archived

## 16.5 Complex data science task

### Canonical summary
- routed to CTO
- CTO may hire data scientist
- outputs include code, accuracy graphs, and report
- CTO validates results vs founder intent
- routed upward through Tamir

## 16.6 Strategic research

### Canonical summary
- routed to CTO
- may involve tooling recommendations the founder did not know about
- deliverable becomes a strategic report with CTO recommendation
- routed upward via Tamir

---

# 17. Governance layer

## 17.1 Company DNA

### Canonical
There is a Phase 9 governance concept with a company DNA profile in something like `data/company_profile.json`.

This governs how the company behaves as a system.

## 17.2 Per-agent budget tracking

### Canonical
Budgets matter.
This is not an "infinite tokens" fantasy system.

### Design implication
The company should visibly care about:
- spend
- budget limits
- approval thresholds
- cost-risk tradeoffs

## 17.3 Hiring approval gate

### Canonical
Hiring can require CEO approval.
This should be surfaced both in logic and UI.

## 17.4 CEO consulting sessions

### Canonical
There is a notion of consulting sessions triggered by factors like founder involvement level and expertise threshold in a department.

This suggests the system can decide that direct founder consultation is useful in some cases.

## 17.5 Trust scores and configurable proactiveness

### Canonical
Later governance phases include:
- trust scoring
- configurable proactiveness
- modulation of escalation / consultation behavior

### Open question
Exact final formulas and UI exposure are not fully settled.

---

# 18. The Cortex - management UI

## 18.1 Canonical UI sections

### Canonical
The Cortex includes:
- Home / Operations Map
- Org Chart / People View
- Department Desks
- The Vault
- Escalation Feed
- Activity Timeline

## 18.2 Original home concept in docs

### Canonical
The docs describe the home as an **Operations Map** with:
- active workflows as connected nodes
- departments engaged
- current phase
- color indicators for status

## 18.3 What we concluded in design discussion

### Design decision
The homepage should **not** primarily be an operations map.

It should primarily be a:

# Founder Attention Board

That was the biggest UI insight from the discussion.

Reason:
- the founder needs decisions, blockers, approvals, and review items
- a pretty network graph is weaker than a decision-first board
- the operations map is useful, but secondary

## 18.4 Final homepage philosophy

### Design decision
The homepage should answer, within seconds:

- What needs my attention now?
- What is blocked?
- What is ready for approval or review?
- What is progressing smoothly without me?
- What did the system finish recently?
- What can I tell Tamir right now?

## 18.5 Best current homepage architecture

### Design decision
The current best homepage structure is:

1. Top navigation
2. Persistent Tamir command dock
3. Executive KPI strip
4. Three-column main area
   - Left: Department Pulse
   - Center: Founder Attention Board
   - Right: Action Queue
5. Bottom: Live Timeline
6. Small supporting Operations Pulse Map, not giant centerpiece

---

# 19. Homepage design evolution from our discussion

## 19.1 V1 insight

The original visual direction still leaned too much toward:
- polished dashboard
- decorative system map
- generic cards

We concluded:
- the center should not be an operations diagram
- it should be a founder decision surface

## 19.2 V2 insight

We improved:
- action queue
- stronger escalation presence
- more command-center feeling

But V2 still had:
- duplicated widgets
- weak clarity
- garbled microcopy
- too much dashboard energy

## 19.3 V3 insight

V3 got much closer to the real product:
- Tamir felt central
- board felt more alive
- escalation card became structured
- timeline mattered
- operations map was demoted

Main remaining issues:
- deliverables still not first-class enough
- chain-of-command path still under-expressed
- intervention power not yet signature enough

## 19.4 V4 correction brief

We then defined V4 corrections:
- make deliverables explicit everywhere
- show reporting path on more cards
- make Intervene / CEO Directive a signature control
- force escalation cards to match documented schema
- make timeline richer and more filterable
- keep operations map quiet and secondary

## 19.5 Best recent screenshot

### Design decision based on latest mockup analysis
The latest screenshot is the strongest mockup so far because it finally does these things well:
- Tamir is central
- the board is decision-first
- deliverables are visible in mission cards
- action queue categories are relevant
- timeline feels operational
- department pulse is useful

Main issues still left:
- some mission paths incorrectly skip Tamir
- "CEO Intervention Mode" / "Direct Override" wording is too aggressive
- the Tamir input tone could be more Tamir-specific
- timeline filters should be more visible
- one more governance KPI may be useful

---

# 20. Current best homepage spec

## 20.1 Top nav

Recommended nav:
- Home
- Missions
- People
- Departments
- Vault
- Escalations
- Timeline

## 20.2 Tamir command dock

### Design decision
This should be the strongest and most obvious control on the screen.

It should include:
- large input
- voice button
- attach button
- send button
- quick chips:
  - Daily Briefing
  - Show Blockers
  - Approval Queue
  - Costs
  - Risks

### Important tone recommendation
Prefer text like:
- `Ask Tamir anything...`
- or `Direct Tamir to review, route, or intervene...`

Less ideal:
- generic admin-console phrasing that weakens Tamir's identity

## 20.3 KPI strip

Recommended KPI set:
- Active Missions
- Need Decision
- Blocked
- Ready to Review
- Spend vs Budget
- High Risk
- Paused Agents or Approvals Pending

### Why
This better reflects:
- operations
- review load
- budget governance
- escalation health

## 20.4 Left rail - Department Pulse

Each department card should show:
- lead
- health state
- active mission count
- blocked count
- spend vs budget
- top mission
- next founder touchpoint
- latest note
- optional cross-department dependency

This should feel like **department intelligence**, not just stats.

## 20.5 Center - Founder Attention Board

Recommended columns:
- Act Now
- Approve / Decide
- Review
- Running Smoothly

The center board is the core homepage feature.

## 20.6 Right rail - Action Queue

Recommended sections:
- Escalations
- Hire Requests
- Consulting Sessions
- CEO Mentions
- Recent Deliverables
- Ready to Send

### Important UI idea
`Ready to Send` is a good bridge widget because it reflects:
- dept head approved work
- artifacts waiting for Tamir packaging or founder delivery

## 20.7 Bottom - Live Timeline

Timeline rows should look like:

`Time - Actor - Action - Object - Result`

Examples:
- `10:24 - CTO - Escalated blocker - ZUNA deployment - waiting for GPU approval`
- `09:58 - CMO - Submitted deliverable - content_plans.pdf - sent to Tamir`
- `09:30 - CEO Directive - Sent to CTO - use us-west-2 for deployment`
- `09:15 - Tamir - Packaged briefing - EEG comparison study - ready for founder review`

Filters should ideally include:
- Tech
- Marketing
- Ops
- Escalations
- Deliverables
- CEO Mentioned

---

# 21. Mission card anatomy

## 21.1 Final recommended mission card structure

### Design decision
Each mission card should include:

- Title
- Owner
- Department
- Stage
- Reporting path
- Deliverables
- Progress
- Status chips
- Founder ask
- Action row

## 21.2 Example anatomy

**Title**  
ZUNA deployment and evaluation

**Meta**  
Owner: CTO | Dept: Tech | Stage: Execution

**Path**  
Developer -> CTO -> Tamir -> CEO

**Deliverables**
- `results.md`
- `accuracy_graph.png`

**Progress**  
Step 5/8 - Run inference

**Status**
- Escalated
- Deliverable clear
- Confidence: High

**Needs from founder**
Approve alternate AWS region spend

**Actions**
- Intervene
- Approve
- Ask Tamir
- Open Deliverable
- Open Thread

## 21.3 What a mission card must not be

Avoid cards that are only:
- a vague title
- one status badge
- generic filler
- no owner
- no artifact
- no explicit ask

That is too SaaS-generic and not faithful to the product.

---

# 22. Deliverables in the UI

## 22.1 Deliverables must be first-class

### Canonical plus design decision
Deliverables are one of the most important product truths.

The UI should show:
- file icon/type
- filename
- creator
- state
- quick preview/open action

## 22.2 Good examples

- `content_plans.pdf`
- `campaign_brief.md`
- `accuracy_graph.png`
- `eeg_comparison.md`
- `results.md`

## 22.3 Review cards should not be vague

Do not say only:
- `Ready for review`

Instead show:
- what file exists
- who produced it
- where it is in the chain
- what the founder can do next

---

# 23. Specific UI wording guidance

## 23.1 Good phrasing

Use:
- `Ask Tamir`
- `Send CEO Directive`
- `Open Deliverable`
- `Ask for Context`
- `Request Changes`
- `Ready to Send`
- `Waiting Decision`
- `Ready to Review`

## 23.2 Risky phrasing

Use carefully or avoid:
- `Direct Override`
- `Take direct control of any mission`
- anything that implies the founder normally bypasses Tamir and dept heads

## 23.3 Why this matters

The language should reinforce:
- hierarchy
- trust
- professionalism
- precise operational semantics

---

# 24. Current build priorities

## 24.1 Canonical phase order from docs

High-level phased sequence:
- Phase 1: foundation
- Phase 2: voice pipeline
- Phase 3: executive team
- Phase 4: employee system
- later phases: deliverables, Cortex UI, scheduling, governance

## 24.2 Practical builder priority now

### Design recommendation
If building from the current state, prioritize in this order:

1. **Core runtime and data model**
   - config
   - db schema
   - memory partition system
   - agent invocation kernel
   - queue
2. **Tamir**
   - classification
   - routing
   - clarification
   - Vault proposal logic
3. **Executive agents**
   - CTO
   - CMO
   - COO
4. **Employee lifecycle**
   - hire
   - onboard
   - assign
   - submit
   - terminate
5. **Deliverables system**
   - file storage
   - metadata
   - previewability
   - routing
6. **Escalation system**
   - schema
   - logic
   - founder-facing packets
7. **Telegram voice in/out**
8. **Cortex UI**
   - homepage first
   - then people/departments/escalations/timeline/vault
9. **Governance**
   - budget
   - approval thresholds
   - consulting sessions
   - trust / proactivity tuning

---

# 25. Implementation invariants

These are the rules the builder AI should treat as non-negotiable unless explicitly changed.

## 25.1 Product invariants

- Tamir is the founder's single point of contact
- Employees never message the founder directly
- Department heads review before work goes upward
- Tasks require explicit deliverable specs
- Deliverables are first-class artifacts
- Escalations are structured decision packets
- Memory is partitioned and access-controlled
- The system runs within tight hardware constraints
- Agents are stateless at rest
- The homepage is decision-first, not map-first

## 25.2 UI invariants

- homepage center = Founder Attention Board
- operations map is secondary
- Tamir dock is always visible
- deliverables are visible in cards
- reporting path should include Tamir when work moves upward
- intervention should create a directive, not destroy the hierarchy

---

# 26. Open questions and not-yet-finalized areas

These should not be treated as fully locked.

## 26.1 Myelin vs ACS product scope
Open question:
- build only the Myelin neurotech version now?
- or architect explicit multi-company / generalized ACS abstraction from day one?

Recommended answer:
- build Myelin concretely
- keep abstractions clean enough to generalize later

## 26.2 Exact governance math
Open question:
- exact formulas for trust, proactiveness, escalation modulation, consulting thresholds are not fully specified in the conversation context here

## 26.3 Final homepage intervention language
Open question:
- exact naming for the intervention strip / action is still tunable
Preferred current direction:
- `Send CEO Directive`

## 26.4 Exact KPI final set
Open question:
- final homepage KPI set may still need one last governance-oriented addition

## 26.5 Multi-device / mobile final UX
Open question:
- the docs require phone viewability, but the desktop homepage has been the main design focus so far

---

# 27. What the builder AI should internalize above all

If the coding AI remembers only ten things, remember these:

1. Myelin is a **company**, not a chatbot.
2. Tamir is the founder's **single operating interface**.
3. The chain of command is **architectural**, not decorative.
4. Every important task needs a **clear deliverable**.
5. Deliverables must be **stored, visible, and attributable**.
6. Escalations are **structured packets** with chain, blocker, attempts, and ask.
7. Agents are **stateless callables** backed by DB + memory, not persistent objects.
8. The system must survive on a **Raspberry Pi 4** with tight resource discipline.
9. The homepage should be a **Founder Attention Board**, not primarily an operations map.
10. The product should feel like a **living autonomous organization** with accountability, memory, and outputs.

---

# 28. Recommended next implementation moves after reading this file

## If the builder is working on backend first
Start with:
- DB schema
- memory partitions
- invoke kernel
- queue
- Tamir routing
- deliverables and escalations as first-class models

## If the builder is working on UI first
Start with:
- homepage shell
- Tamir dock
- KPI strip
- department pulse
- founder attention board
- action queue
- live timeline
- strong mission card / escalation card anatomy

## If the builder is working on product language first
Lock:
- path wording
- directive wording
- deliverable states
- timeline event grammar
- escalation card grammar

---

# 29. Final summary

This project is trying to build something unusually ambitious:

A **hierarchical autonomous company operating system** that feels like a real executive team, runs on constrained hardware, preserves memory and accountability, routes everything through a disciplined chain of command, and gives a solo founder the leverage of an operating company through Tamir and The Cortex.

The best current UI interpretation is no longer vague:
- the homepage should be a **founder command center**
- the center should be a **Founder Attention Board**
- deliverables, escalations, and reporting paths must be visible
- Tamir must stay central
- the system should feel serious, alive, and trustworthy

Any implementation that loses those truths may still "work" technically, but it will miss the essence of the product.
