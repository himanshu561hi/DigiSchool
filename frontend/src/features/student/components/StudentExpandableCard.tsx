import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import StudentDetails from './StudentDetails';
import type { Student } from '../types/student.types';

type StudentExpandableCardProps = {
  row: Student;
};

export default function StudentExpandableCard({ row }: StudentExpandableCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        aria-label="Show more details"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 z-10">
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            >
              ✕
            </button>
          </div>
          <StudentDetails row={row} />
        </div>
      )}
    </div>
  );
}
