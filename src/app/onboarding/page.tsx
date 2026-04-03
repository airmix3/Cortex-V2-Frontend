import AppShell from '@/components/layout/AppShell';
import OnboardingChat from '@/components/onboarding/OnboardingChat';

export default function OnboardingPage() {
  return (
    <AppShell>
      <div className="relative h-full overflow-hidden bg-[#060a13]">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-[-20%] left-[5%] w-[600px] h-[600px] rounded-full opacity-[0.025]"
            style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)', filter: 'blur(80px)' }}
          />
          <div
            className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.02]"
            style={{ background: 'radial-gradient(circle, #38bdf8, transparent 70%)', filter: 'blur(80px)' }}
          />
          <div
            className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full opacity-[0.015]"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)', filter: 'blur(80px)' }}
          />
        </div>

        {/* Chat */}
        <div className="relative z-10 h-full flex flex-col">
          <OnboardingChat />
        </div>
      </div>
    </AppShell>
  );
}
