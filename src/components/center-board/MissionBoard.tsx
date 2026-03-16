'use client';

import { missions } from '@/data/mock-data';
import InterventionBar from './InterventionBar';
import MissionColumn from './MissionColumn';

export default function MissionBoard() {
  const actNow = missions.filter((m) => m.column === 'act-now');
  const approveDecide = missions.filter((m) => m.column === 'approve-decide');
  const review = missions.filter((m) => m.column === 'review');

  return (
    <div className="flex flex-col overflow-y-auto pr-1">
      <InterventionBar />
      <div className="grid grid-cols-3 gap-3 flex-1">
        <MissionColumn columnKey="act-now" missions={actNow} />
        <MissionColumn columnKey="approve-decide" missions={approveDecide} />
        <MissionColumn columnKey="review" missions={review} />
      </div>
    </div>
  );
}
