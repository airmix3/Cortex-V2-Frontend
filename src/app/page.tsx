import TopNav from '@/components/layout/TopNav';
import StatusBar from '@/components/layout/StatusBar';
import MissionBoard from '@/components/center-board/MissionBoard';
import TamirPanel from '@/components/right-rail/TamirPanel';

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="ambient-bg" />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', width: '500px', height: '500px', top: '30%', left: '38%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'ambientFloat 18s ease-in-out infinite', animationDelay: '4s' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', top: '20%', right: '0%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'ambientFloat 22s ease-in-out infinite reverse', animationDelay: '2s' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', bottom: '10%', right: '5%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'ambientFloat 16s ease-in-out infinite', animationDelay: '1s' }} />
      </div>
      <TopNav />
      <StatusBar />
      <div className="flex-1 grid grid-cols-[1fr_340px] gap-3 px-4 pb-3 pt-1 min-h-0" style={{ overflow: 'hidden' }}>
        <div className="min-h-0 h-full">
          <MissionBoard />
        </div>
        <div className="min-h-0 h-full py-1">
          <TamirPanel />
        </div>
      </div>
    </div>
  );
}
