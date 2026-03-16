'use client';

import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';
import { departments } from '@/data/mock-data';
import DepartmentCard from './DepartmentCard';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } } };

export default function DepartmentRail() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <Building2 className="w-4 h-4 text-slate-400" />
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Departments</h2>
      </div>
      {departments.map((dept) => (
        <motion.div key={dept.name} variants={item}>
          <DepartmentCard dept={dept} />
        </motion.div>
      ))}
    </motion.div>
  );
}
