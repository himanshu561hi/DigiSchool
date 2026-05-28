import type { Column } from "@/components/ui/DataTable";

import type { ReactNode } from "react";

import type { Student } from "../types/student.types";


import StatusBadge from "@/components/ui/StatusBadge";
import StudentActionCell from "../components/StudentActionCell";

type StudentTableColumnsProps = {
  onEdit: (student: Student) => void;

  onDelete: (studentId: string) => void;
};

export function getStudentTableColumns({
  onEdit,
  onDelete,
}: StudentTableColumnsProps): Column<Student>[] {
  return [
    /*
     =========================
     NAME
     =========================
    */

    {
      key: "firstName",

      header: "Name",

      render: (_: ReactNode, row: Student) => (
        <div className="flex flex-col">
          <p className="font-semibold text-slate-800 dark:text-white">
            {row.firstName} {row.lastName}
          </p>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            {row.email}
          </span>
        </div>
      ),
    },

    /*
     =========================
     CLASS
     =========================
    */

    {
      key: "className",

      header: "Class",
    },

    /*
     =========================
     ROLL NUMBER
     =========================
    */

    {
      key: "rollNumber",

      header: "Roll No.",
    },

    /*
     =========================
     ATTENDANCE
     =========================
    */

    {
      key: "attendance",

      header: "Attendance",

      render: (value: ReactNode) => {
        const attendance = Number(value);

        return (
          <StatusBadge
            label={`${attendance}%`}
            variant={
              attendance >= 90
                ? "success"
                : attendance >= 75
                  ? "warning"
                  : "danger"
            }
          />
        );
      },
    },

    /*
     =========================
     ACTIONS
     =========================
    */

    {
      key: "id",
      header: "Actions",
      sortable: false,
      className: "w-20",
      render: (_: ReactNode, row: Student) => (
        <StudentActionCell row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
}
