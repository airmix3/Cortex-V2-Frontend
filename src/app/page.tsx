import TopNav from '@/components/layout/TopNav';
import StatusBar from '@/components/layout/StatusBar';
import MissionBoard from '@/components/center-board/MissionBoard';
import TamirPanel from '@/components/right-rail/TamirPanel';
import BottomSection from '@/components/lower-section/BottomSection';

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="ambient-bg" />
      <TopNav />
      <StatusBar />
      <div className="flex-1 grid grid-cols-[1fr_340px] gap-3 px-4 pb-2 min-h-0" style={{ overflow: 'hidden' }}>
        {/* Mission Board */}
        <div className="overflow-y-auto min-h-0">
          <MissionBoard />
        </div>
        {/* Tamir Panel */}
        <div className="min-h-0">
          <TamirPanel />
        </div>
      </div>
      <div className="shrink-0">
        <BottomSection />
      </div>
    </div>
  );
}
