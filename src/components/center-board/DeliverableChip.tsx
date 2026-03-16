'use client';

import { Deliverable } from '@/types';
import { FileText, FileCode, FileSpreadsheet, Image, Film, FileType, Eye } from 'lucide-react';

const fileIcons: Record<string, React.ElementType> = {
  document: FileText, code: FileCode, spreadsheet: FileSpreadsheet,
  image: Image, video: Film, pdf: FileType, presentation: FileText,
};

const statusColors: Record<string, string> = {
  draft: 'bg-slate-500/20 text-slate-400',
  'in-progress': 'bg-sky-500/20 text-sky-400',
  ready: 'bg-emerald-500/20 text-emerald-400',
  approved: 'bg-violet-500/20 text-violet-400',
};

export default function DeliverableChip({ deliverable }: { deliverable: Deliverable }) {
  const Icon = fileIcons[deliverable.type] || FileText;

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg group cursor-pointer transition-all hover:brightness-125"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
    >
      <Icon className="w-4 h-4 text-sky-400 shrink-0" />
      <span className="text-xs text-slate-200 truncate flex-1 font-medium">{deliverable.name}</span>
      <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${statusColors[deliverable.status]}`}>
        {deliverable.status}
      </span>
      <Eye className="w-3 h-3 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
    </div>
  );
}
