import { Filter } from "lucide-react";

type Props = {
  classes: string[];
  selectedClass: string | null;
  setSelectedClass: (value: string | null) => void;
  attendanceRange: { min: number; max: number };
  setAttendanceRange: (range: { min: number; max: number }) => void;
  /** When true, renders just the Filter button (for embedding in tab bar) */
  renderButton?: boolean;
};

function StudentFilters({
  classes = [],
  selectedClass,
  setSelectedClass,
  attendanceRange,
  setAttendanceRange,
  renderButton = false,
}: Props) {
  const safeClasses = Array.isArray(classes) ? classes : [];
  const hasFilters =
    !!selectedClass || attendanceRange.min !== 0 || attendanceRange.max !== 100;

  const activeCount =
    (selectedClass ? 1 : 0) +
    (attendanceRange.min !== 0 || attendanceRange.max !== 100 ? 1 : 0);

  const filterDropdown = (
    <div className="relative group shrink-0">
      <button
        type="button"
        tabIndex={0}
        className="
          inline-flex items-center justify-center gap-1.5
          rounded-xl border border-slate-300 bg-white
          h-9 px-3 sm:px-4
          text-sm font-bold text-slate-700
          transition hover:bg-slate-100
          dark:border-slate-700 dark:bg-slate-800
          dark:text-slate-200 dark:hover:bg-slate-700
        "
      >
        <Filter className="h-4 w-4 shrink-0" />
        <span className="hidden sm:block">Filters</span>
        {hasFilters && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white leading-none">
            {activeCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      <div
        className="
          absolute right-0 top-11 z-50 w-80
          rounded-2xl border border-slate-200 bg-white p-5 shadow-xl
          opacity-0 invisible transition-all duration-200
          group-hover:visible group-hover:opacity-100
          group-focus-within:visible group-focus-within:opacity-100
          dark:border-slate-700 dark:bg-slate-900
        "
      >
        <div className="flex flex-col gap-6">
          {/* CLASS FILTER */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Class
            </p>
            <select
              value={selectedClass ?? ""}
              onChange={(e) => setSelectedClass(e.target.value || null)}
              className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="">All Classes</option>
              {safeClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* ATTENDANCE RANGE */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Attendance Range
            </p>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={0}
                max={100}
                value={attendanceRange.min}
                onChange={(e) =>
                  setAttendanceRange({
                    ...attendanceRange,
                    min: Math.max(0, Math.min(100, Number(e.target.value))),
                  })
                }
                className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                placeholder="Min"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={attendanceRange.max}
                onChange={(e) =>
                  setAttendanceRange({
                    ...attendanceRange,
                    max: Math.max(0, Math.min(100, Number(e.target.value))),
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
              setSelectedClass(null);
              setAttendanceRange({ min: 0, max: 100 });
            }}
            className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );

  // Just return the filter button (for embedding in the tab bar)
  if (renderButton) return filterDropdown;

  // Active filter chips row — only shown when filters are active
  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedClass && (
        <div className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 whitespace-nowrap">
          Class: {selectedClass}
          <button
            type="button"
            onClick={() => setSelectedClass(null)}
            className="text-blue-500 hover:text-blue-800 dark:hover:text-blue-200"
          >
            ✕
          </button>
        </div>
      )}
      {(attendanceRange.min !== 0 || attendanceRange.max !== 100) && (
        <div className="flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 whitespace-nowrap">
          Att: {attendanceRange.min}–{attendanceRange.max}%
          <button
            type="button"
            onClick={() => setAttendanceRange({ min: 0, max: 100 })}
            className="text-purple-500 hover:text-purple-800 dark:hover:text-purple-200"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentFilters;
