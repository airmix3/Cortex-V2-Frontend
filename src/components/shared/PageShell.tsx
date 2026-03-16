'use client';

import TopNav from '@/components/layout/TopNav';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="ambient-bg" />
      <TopNav />
      <div className="flex-1 overflow-y-auto relative z-10">
        {children}
      </div>
    </div>
  );
}
