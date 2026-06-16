import { Filter } from "lucide-react";

type Props = {
  departments: string[];
  subjects: string[];

  selectedStatus: "ACTIVE" | "INACTIVE" | null;
  setSelectedStatus: (value: "ACTIVE" | "INACTIVE" | null) => void;

  selectedDepartment: string | null;
  setSelectedDepartment: (value: string | null) => void;

  selectedSubject: string | null;
  setSelectedSubject: (value: string | null) => void;

  experienceRange: { min: number; max: number };
  setExperienceRange: (range: { min: number; max: number }) => void;
};

function TeacherFilters({
  departments,
  subjects,
  selectedStatus,
  setSelectedStatus,
  selectedDepartment,
  setSelectedDepartment,
  selectedSubject,
  setSelectedSubject,
  experienceRange,
  setExperienceRange,
}: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      {/* ========================= */}
      {/* ACTIVE FILTERS CHIPS */}
      {/* ========================= */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedStatus && (
          <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            Status: {selectedStatus === "ACTIVE" ? "Active" : "Inactive"}
            <button
              type="button"
              onClick={() => setSelectedStatus(null)}
              className="text-blue-500 hover:text-blue-700"
            >
              ✕
            </button>
          </div>
        )}

        {selectedDepartment && (
          <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            Dep: {selectedDepartment}
            <button
              type="button"
              onClick={() => setSelectedDepartment(null)}
              className="text-emerald-500 hover:text-emerald-700"
            >
              ✕
            </button>
          </div>
        )}

        {selectedSubject && (
          <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            Sub: {selectedSubject}
            <button
              type="button"
              onClick={() => setSelectedSubject(null)}
              className="text-amber-500 hover:text-amber-700"
            >
              ✕
            </button>
          </div>
        )}

        {(experienceRange.min !== 0 || experienceRange.max !== 50) && (
          <div className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
            Exp: {experienceRange.min}-{experienceRange.max} yrs
            <button
              type="button"
              onClick={() => setExperienceRange({ min: 0, max: 50 })}
              className="text-purple-500 hover:text-purple-700"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* FILTER DROPDOWN */}
      {/* ========================= */}
      <div className="relative group">
        {/* BUTTON */}
        <button
          type="button"
          tabIndex={0}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>

        {/* DROPDOWN MENU */}
        <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col gap-6">
            
            {/* STATUS FILTER */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Status</p>
              <select
                value={selectedStatus ?? ""}
                onChange={(e) => setSelectedStatus((e.target.value as "ACTIVE" | "INACTIVE") || null)}
                className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* DEPARTMENT FILTER */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Department</p>
              <select
                value={selectedDepartment ?? ""}
                onChange={(e) => setSelectedDepartment(e.target.value || null)}
                className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">All Departments</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            {/* SUBJECT FILTER */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Subject</p>
              <select
                value={selectedSubject ?? ""}
                onChange={(e) => setSelectedSubject(e.target.value || null)}
                className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* EXPERIENCE RANGE */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Experience (Years)</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={experienceRange.min}
                  onChange={(e) =>
                    setExperienceRange({
                      ...experienceRange,
                      min: Math.max(0, Math.min(50, Number(e.target.value))),
                    })
                  }
                  className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={experienceRange.max}
                  onChange={(e) =>
                    setExperienceRange({
                      ...experienceRange,
                      max: Math.max(0, Math.min(50, Number(e.target.value))),
                    })
                  }
                  className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* RESET */}
            <button
              type="button"
              onClick={() => {
                setSelectedStatus(null);
                setSelectedDepartment(null);
                setSelectedSubject(null);
                setExperienceRange({ min: 0, max: 50 });
              }}
              className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherFilters;
