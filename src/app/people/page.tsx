'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import PageShell from '@/components/shared/PageShell';
import { employees } from '@/data/pages-data';
import type { Employee } from '@/types';

type FilterType = 'all' | 'executive' | 'permanent' | 'temp';

const statusColor: Record<Employee['status'], string> = {
  active: 'bg-emerald-500',
  busy: 'bg-amber-500',
  idle: 'bg-slate-500',
  terminated: 'bg-rose-500',
};

const statusLabel: Record<Employee['status'], string> = {
  active: 'Active',
  busy: 'Busy',
  idle: 'Idle',
  terminated: 'Terminated',
};

const typeBadge: Record<Employee['type'], { bg: string; text: string }> = {
  executive: { bg: 'bg-amber-500/20 border-amber-500/30', text: 'text-amber-400' },
  permanent: { bg: 'bg-blue-500/20 border-blue-500/30', text: 'text-blue-400' },
  temp: { bg: 'bg-purple-500/20 border-purple-500/30', text: 'text-purple-400' },
};

// --- CEO node (not in employees data) ---
const ceoNode = {
  id: 'ceo',
  name: 'Dor',
  role: 'CEO / Founder',
  avatar: 'D',
  color: 'bg-yellow-500',
  status: 'active' as const,
};

// --- Build org hierarchy from data ---
const tamir = employees.find((e) => e.id === 'tamir')!;
const cto = employees.find((e) => e.id === 'cto')!;
const cmo = employees.find((e) => e.id === 'cmo')!;
const coo = employees.find((e) => e.id === 'coo')!;

const deptHeads = [cto, cmo, coo];
const techReports = employees.filter((e) => e.reportsTo === 'CTO');
const mktReports = employees.filter((e) => e.reportsTo === 'CMO');
const opsReports = employees.filter((e) => e.reportsTo === 'COO');

// --- Org Node Component ---
function OrgNode({
  name,
  role,
  avatar,
  color,
  status,
  delay = 0,
}: {
  name: string;
  role: string;
  avatar: string;
  color: string;
  status: Employee['status'];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="relative">
        <div
          className={`w-11 h-11 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
        >
          {avatar}
        </div>
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${statusColor[status]} border-2`}
          style={{ borderColor: 'var(--bg-card)' }}
        />
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-white leading-tight">{name}</p>
        <p className="text-[10px] text-slate-400 leading-tight">{role}</p>
      </div>
    </motion.div>
  );
}

// --- Connector ---
function Connector() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-4" style={{ background: 'var(--border-medium)' }} />
      <ChevronDown className="w-3.5 h-3.5 text-slate-500 -mt-1" />
    </div>
  );
}

// --- Horizontal line between nodes ---
function HorizontalBranch({ count }: { count: number }) {
  if (count <= 1) return null;
  return (
    <div className="relative w-full flex justify-center">
      <div
        className="h-px absolute top-0"
        style={{
          background: 'var(--border-medium)',
          width: `${Math.min(90, (count - 1) * 28)}%`,
        }}
      />
    </div>
  );
}

// --- Vertical drop lines from horizontal branch ---
function DropLines({ count }: { count: number }) {
  if (count <= 1) return null;
  return (
    <div
      className="flex justify-around w-full"
      style={{ maxWidth: `${Math.min(90, (count - 1) * 28)}%`, margin: '0 auto' }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-px h-4" style={{ background: 'var(--border-medium)' }} />
        </div>
      ))}
    </div>
  );
}

export default function PeoplePage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered =
    filter === 'all' ? employees : employees.filter((e) => e.type === filter);

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Executive', value: 'executive' },
    { label: 'Permanent', value: 'permanent' },
    { label: 'Temp', value: 'temp' },
  ];

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white tracking-tight">People</h1>
          <p className="text-sm text-slate-400 mt-1">
            Organizational chart and team overview
          </p>
        </motion.div>

        {/* ── Org Chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-depth rounded-xl p-6 overflow-x-auto"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
            Organization Chart
          </h2>

          <div className="flex flex-col items-center min-w-[700px]">
            {/* Level 0: CEO */}
            <OrgNode
              name={ceoNode.name}
              role={ceoNode.role}
              avatar={ceoNode.avatar}
              color={ceoNode.color}
              status={ceoNode.status}
              delay={0.15}
            />

            <Connector />

            {/* Level 1: Tamir */}
            <OrgNode
              name={tamir.name}
              role={tamir.role}
              avatar={tamir.avatar}
              color={tamir.color}
              status={tamir.status}
              delay={0.25}
            />

            <Connector />

            {/* Branch to dept heads */}
            <HorizontalBranch count={deptHeads.length} />
            <DropLines count={deptHeads.length} />

            {/* Level 2: Department Heads */}
            <div className="flex justify-around w-full" style={{ maxWidth: '80%' }}>
              {deptHeads.map((head, i) => (
                <OrgNode
                  key={head.id}
                  name={head.name}
                  role={head.role}
                  avatar={head.avatar}
                  color={head.color}
                  status={head.status}
                  delay={0.35 + i * 0.08}
                />
              ))}
            </div>

            {/* Level 3: Reports per department */}
            <div className="flex justify-around w-full mt-2" style={{ maxWidth: '80%' }}>
              {[techReports, mktReports, opsReports].map((reports, deptIdx) => (
                <div key={deptIdx} className="flex flex-col items-center flex-1">
                  {reports.length > 0 && (
                    <>
                      <Connector />
                      <HorizontalBranch count={reports.length} />
                      <DropLines count={reports.length} />
                      <div className="flex justify-around w-full gap-2 flex-wrap">
                        {reports.map((emp, i) => (
                          <OrgNode
                            key={emp.id}
                            name={emp.name}
                            role={emp.role}
                            avatar={emp.avatar}
                            color={emp.color}
                            status={emp.status}
                            delay={0.5 + deptIdx * 0.1 + i * 0.06}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Filters ── */}
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                filter === f.value
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-xs text-slate-500 ml-2">
            {filtered.length} {filtered.length === 1 ? 'person' : 'people'}
          </span>
        </div>

        {/* ── Employee Detail Cards ── */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.map((emp, i) => (
            <Link key={emp.id} href={`/agents/${emp.id}`} className="block">
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="card-depth rounded-xl p-5 space-y-4 hover:border-sky-500/30 transition-colors cursor-pointer border border-transparent"
            >
              {/* Top row: avatar + name + badge */}
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full ${emp.color} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {emp.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${statusColor[emp.status]} border-2`}
                    style={{ borderColor: 'var(--bg-card)' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {emp.name}
                    </h3>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${typeBadge[emp.type].bg} ${typeBadge[emp.type].text}`}
                    >
                      {emp.type.charAt(0).toUpperCase() + emp.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{emp.role}</p>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department</span>
                  <span className="text-slate-300">{emp.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reports to</span>
                  <span className="text-slate-300">{emp.reportsTo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${statusColor[emp.status]}`}
                    />
                    <span className="text-slate-300">{statusLabel[emp.status]}</span>
                  </span>
                </div>
                {emp.currentTask && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 shrink-0">Current task</span>
                    <span className="text-slate-300 text-right truncate">
                      {emp.currentTask}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Tasks completed</span>
                  <span className="text-white font-medium">{emp.tasksCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Joined</span>
                  <span className="text-slate-300">{emp.joinedAt}</span>
                </div>
              </div>

              {/* Memory namespace */}
              <div
                className="rounded-lg px-3 py-2 text-[11px] font-mono text-slate-400"
                style={{ background: 'var(--bg-base)' }}
              >
                {emp.memoryNamespace}
              </div>
            </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </PageShell>
  );
}
