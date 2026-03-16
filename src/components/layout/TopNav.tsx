'use client';

import { motion } from 'motion/react';
import { Brain, HelpCircle, Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
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
    <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="flex items-center justify-between px-6 py-2.5 relative z-20 shrink-0" style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Brain className="w-7 h-7 text-sky-400" />
          <span className="text-lg font-bold tracking-tight text-white">Myelin</span>
        </Link>
        <div className="flex items-center">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.label} className="flex items-center">
                <Link
                  href={link.href}
                  className={`px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {link.label}
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
        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="relative p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </motion.nav>
  );
}
