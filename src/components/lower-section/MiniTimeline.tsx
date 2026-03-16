'use client';

import { timelineEvents } from '@/data/mock-data';
import { Clock } from 'lucide-react';

export default function MiniTimeline() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto">
      {timelineEvents.map((event, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-zinc-800 shrink-0 hover:border-zinc-700 transition-colors"
        >
          <Clock className="w-3 h-3 text-zinc-500 shrink-0" />
          <span className="text-[11px] text-zinc-400 font-medium whitespace-nowrap">{event.time}</span>
          <span className="text-[11px] text-zinc-300 whitespace-nowrap">{event.actor}</span>
          <span className="text-[11px] text-zinc-500 whitespace-nowrap truncate max-w-[180px]">{event.action}</span>
          <span className="text-[10px] text-zinc-600 whitespace-nowrap">{event.timeAgo}</span>
        </div>
      ))}
    </div>
  );
}
