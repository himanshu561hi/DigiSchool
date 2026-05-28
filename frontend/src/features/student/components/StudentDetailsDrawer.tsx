import React, { useState } from 'react';
import type { Student } from '../types/student.types';
import StudentDetails from './StudentDetails';
import { X } from 'lucide-react';

type StudentDetailsDrawerProps = {
  student: Student;
};

export default function StudentDetailsDrawer({ student }: StudentDetailsDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Button with three dots */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {/* Sliding panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 h-3/4 bg-white dark:bg-slate-900 shadow-xl transition-transform transform translate-y-0">
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold">Student Details</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
            <StudentDetails row={student} />
          </div>
        </div>
      )}
    </>
  );
}
