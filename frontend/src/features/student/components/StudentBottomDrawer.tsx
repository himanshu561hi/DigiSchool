import React, { useState } from 'react';
import { MoreVertical, X } from 'lucide-react';
import StudentDetails from './StudentDetails';
import type { Student } from '../types/student.types';

type StudentBottomDrawerProps = {
  row: Student;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
};

export default function StudentBottomDrawer({ row, onEdit, onDelete }: StudentBottomDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Three‑dot button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        aria-label="Show student details"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {/* Bottom sliding drawer */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 h-3/4 bg-white dark:bg-slate-900 shadow-xl rounded-t-2xl transition-transform transform translate-y-0">
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
            <StudentDetails row={row} />
            <div className="mt-4 flex space-x-4 justify-center">
              <button
                type="button"
                onClick={() => {
                  onEdit(row);
                  setOpen(false);
                }}
                className="rounded-xl px-4 py-2 bg-primary text-white hover:opacity-90"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(row.id);
                  setOpen(false);
                }}
                className="rounded-xl px-4 py-2 bg-red-600 text-white hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
