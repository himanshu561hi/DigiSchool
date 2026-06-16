
import { User, Phone, MapPin, Users } from 'lucide-react';
import type { Student } from '../types/student.types';

type StudentDetailsProps = {
  row: Student;
};

export default function StudentDetails({ row }: StudentDetailsProps) {
  return (
    <div className="flex items-start gap-5 px-2 py-3">
      {/* Avatar */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg border-2 border-primary/20">
        {row.firstName?.charAt(0)?.toUpperCase() ?? 'S'}
      </div>

      {/* Details — compact horizontal grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-2 text-sm flex-1 min-w-0">
        {/* Personal */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <User className="h-3 w-3" /> Name
          </p>
          <p className="font-medium text-slate-800 dark:text-slate-100 truncate">
            {row.firstName} {row.lastName}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Email</p>
          <p className="text-slate-600 dark:text-slate-300 truncate">{row.email}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">Class / Roll</p>
          <p className="text-slate-600 dark:text-slate-300">{row.className} / {row.rollNumber}</p>
        </div>

        {/* Family */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <Users className="h-3 w-3" /> Father
          </p>
          <p className="text-slate-600 dark:text-slate-300 truncate">{row.fatherName ?? '--'}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <Users className="h-3 w-3" /> Mother
          </p>
          <p className="text-slate-600 dark:text-slate-300 truncate">{row.motherName ?? '--'}</p>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <Phone className="h-3 w-3" /> Phone
          </p>
          <p className="text-slate-600 dark:text-slate-300">{row.phone ?? '--'}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <Phone className="h-3 w-3" /> Alt Phone
          </p>
          <p className="text-slate-600 dark:text-slate-300">{row.fatherPhone ?? row.motherPhone ?? '--'}</p>
        </div>

        {/* Address */}
        <div className="col-span-2 sm:col-span-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Address
          </p>
          <p className="text-slate-600 dark:text-slate-300 truncate">{row.address ?? '--'}</p>
        </div>
      </div>
    </div>
  );
}
