type ModulePageProps = {
  title: string;

  description: string;
};

function ModulePage({
  title,
  description,
}: ModulePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          {title}
        </h1>

        <p className="mt-2 text-slate-500">
          {description}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-lg text-slate-600">
          This module is initialized and ready
          for enterprise feature development.
        </p>
      </div>
    </div>
  );
}

export function StudentsPage() {
  return (
    <ModulePage
      title="Students Module"
      description="Manage student records, admissions, and class allocations."
    />
  );
}

export function TeachersPage() {
  return (
    <ModulePage
      title="Teachers Module"
      description="Manage teachers, staff, and faculty operations."
    />
  );
}

export function FeesPage() {
  return (
    <ModulePage
      title="Fees Module"
      description="Track payments, pending balances, and financial analytics."
    />
  );
}

export function AttendancePage() {
  return (
    <ModulePage
      title="Attendance Module"
      description="Manage and monitor attendance records."
    />
  );
}

export function AssignmentsPage() {
  return (
    <ModulePage
      title="Assignments Module"
      description="Create, assign, and review assignments."
    />
  );
}

export function ExamsPage() {
  return (
    <ModulePage
      title="Exams Module"
      description="Manage exams, marks, and report generation."
    />
  );
}

export function ReportsPage() {
  return (
    <ModulePage
      title="Reports Module"
      description="Generate analytical and operational reports."
    />
  );
}