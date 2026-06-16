import React from 'react';
import { User, Phone, Briefcase, GraduationCap, Calendar } from 'lucide-react';
import type { Teacher } from '../types/teacher.types';

type TeacherDetailsProps = {
  row: Teacher;
};

export default function TeacherDetails({ row }: TeacherDetailsProps) {
  return (
    <div className="flex items-start gap-5 px-2 py-3">
      {/* Avatar */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg border-2 border-primary/20">
        {row.fullName?.charAt(0)?.toUpperCase() ?? 'T'}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-2 text-sm flex-1 min-w-0">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <User className="h-3 w-3" /> Name
          </p>
          <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{row.fullName}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Email</p>
          <p className="text-slate-600 dark:text-slate-300 truncate">{row.email}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <Phone className="h-3 w-3" /> Phone
          </p>
          <p className="text-slate-600 dark:text-slate-300">{row.phone ?? '--'}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <Briefcase className="h-3 w-3" /> Department
          </p>
          <p className="text-slate-600 dark:text-slate-300 truncate">{row.department}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Subject</p>
          <p className="text-slate-600 dark:text-slate-300 truncate">{row.subject}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <GraduationCap className="h-3 w-3" /> Qualification
          </p>
          <p className="text-slate-600 dark:text-slate-300 truncate">{row.qualification ?? '--'}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Experience</p>
          <p className="text-slate-600 dark:text-slate-300">{row.experienceYears ?? 0} yrs</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Joined
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            {row.joiningDate ? new Date(row.joiningDate).toLocaleDateString() : '--'}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Employee ID</p>
          <p className="text-slate-600 dark:text-slate-300">{row.employeeId}</p>
        </div>
      </div>
    </div>
  );
}
