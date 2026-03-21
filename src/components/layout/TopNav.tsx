'use client';

import { motion } from 'motion/react';
import { Brain, HelpCircle, Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Tamir', href: '/tamir' },
  { label: 'Control Center', href: '/control-center' },
  { label: 'Missions', href: '/missions' },
  { label: 'People', href: '/people' },
  { label: 'Departments', href: '/departments' },
  { label: 'Vault', href: '/vault' },
  { label: 'Escalations', href: '/escalations' },
  { label: 'Timeline', href: '/timeline' },
  { label: 'Terminal', href: '/terminal' },
  { label: 'Collaboration', href: '/collaboration' },
  { label: 'Evaluations', href: '/evaluations' },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-6 py-2.5 relative z-20 shrink-0 glass-deep glass-shimmer"
      style={{ backdropFilter: 'blur(28px) saturate(160%) brightness(1.12)', WebkitBackdropFilter: 'blur(28px) saturate(160%) brightness(1.12)' }}
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Brain className="w-7 h-7 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <span className="text-lg font-bold tracking-tight text-white">Myelin</span>
        </Link>
        <div className="flex items-center">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.label} className="flex items-center">
                <Link
                  href={link.href}
                  className={`relative px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                  )}
                </Link>
                {i < navLinks.length - 1 && (
                  <span className="text-slate-700 mx-0.5">|</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-all hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-all hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-all hover:bg-white/8 hover:backdrop-blur-sm hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </motion.nav>
  );
}
