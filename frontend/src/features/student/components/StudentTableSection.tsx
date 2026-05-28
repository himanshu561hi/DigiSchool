import { memo } from "react";

import { SearchX } from "lucide-react";

import DataTable from "@/components/ui/DataTable";

import Pagination from "@/components/ui/Pagination";

import type { Student } from "../types/student.types";

import type { Column } from "@/components/ui/DataTable";

import StudentDetails from "./StudentDetails";

type StudentTableSectionProps = {
  data: Student[];

  loading: boolean;

  columns: Column<Student>[];

  search: string;

  currentPage: number;

  totalPages: number;

  onPageChange: (page: number) => void;

  onBulkDelete?: (selectedIds: string[]) => void;

  onEdit?: (student: Student) => void;

  onDelete?: (id: string) => void;
};

const StudentTableSection = memo(function StudentTableSection({
  data,
  loading,
  columns,
  search,
  currentPage,
  totalPages,
  onPageChange,
  onBulkDelete,
  onEdit,
  onDelete,
}: StudentTableSectionProps) {
  return (
    <div className="space-y-6">
      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

      <DataTable
        data={data}
        loading={loading}
        columns={columns}
        selectable={true}
        onBulkDelete={onBulkDelete}
        renderExpandedRow={(row) => <StudentDetails row={row} />}
        emptyMessage={
          search ? "No students found" : "No student records available"
        }
        emptyDescription={
          search
            ? "Try searching with another name, class, or roll number."
            : "Students added to your school will appear here."
        }
        emptyIcon={<SearchX className="h-10 w-10" />}
        renderMobileCard={(student, isSelected, onSelect, isExpanded, onExpand) => (
          <div className={`relative flex flex-col p-4 rounded-2xl border transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'} hover:shadow-md`}>
            
            {/* Selection Checkbox (Absolute positioning for cleaner UI) */}
            <div className="absolute top-4 right-4 z-10">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
              />
            </div>
            
            {/* Header info */}
            <div className="flex items-center gap-4 mb-4 pr-8 cursor-pointer" onClick={() => onSelect()}>
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-500 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 shrink-0">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
                  {student.firstName} {student.lastName}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {student.email || 'No email provided'}
                </span>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
                Class {student.className}
              </div>
              <div className="bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                Roll: {student.rollNumber}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${student.attendance >= 75 ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'}`}>
                {student.attendance}% Att.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
               <button 
                 type="button" 
                 onClick={onExpand} 
                 className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${isExpanded ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
               >
                 {isExpanded ? 'Hide Details' : 'View Details'}
               </button>
               
               <div className="flex items-center gap-2">
                 {onEdit && (
                   <button type="button" onClick={() => onEdit(student)} className="text-xs font-bold text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition">Edit</button>
                 )}
                 {onDelete && (
                   <button type="button" onClick={() => onDelete(student.id)} className="text-xs font-bold text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 transition">Delete</button>
                 )}
               </div>
            </div>
          </div>
        )}
      />

      {/* ========================= */}
      {/* PAGINATION */}
      {/* ========================= */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
});

export default StudentTableSection;
