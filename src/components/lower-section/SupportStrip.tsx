'use client';

import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import MiniTimeline from './MiniTimeline';

export default function SupportStrip() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-t border-zinc-800/50 bg-zinc-950/80">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-6 py-1.5 text-zinc-500 hover:text-zinc-400 transition-colors w-full"
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        <span className="text-[10px] uppercase tracking-wider font-medium">Live Activity</span>
        <div className="flex items-center gap-1 ml-2">
          {[2, 4, 3, 5, 3, 6, 2, 4].map((h, i) => (
            <div
              key={i}
              className="w-0.5 bg-emerald-500/40 rounded-full"
              style={{ height: `${h * 2}px` }}
            />
          ))}
        </div>
      </button>
      {expanded && (
        <div className="px-6 pb-3 flex items-center gap-4">
          {/* Mini pulse */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-lg shrink-0">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-zinc-500">System Pulse</span>
            <div className="flex items-center gap-0.5">
              {[3, 5, 2, 7, 4, 6, 3, 5, 4, 6, 8, 5].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-500/50 rounded-full"
                  style={{ height: `${h * 2}px` }}
                />
              ))}
            </div>
          </div>
          {/* Timeline */}
          <MiniTimeline />
        </div>
      )}
    </div>
  );
}
