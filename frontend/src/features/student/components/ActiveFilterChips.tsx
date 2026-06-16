import { Funnel, RotateCcw, X } from "lucide-react";

type Props = {
  search: string;

  selectedClass: string | null;

  attendanceRange: {
    min: number;
    max: number;
  };

  onClearSearch: () => void;

  onClearClass: () => void;

  onClearAttendance: () => void;

  onResetAll: () => void;
};

function ActiveFilterChips({
  search,
  selectedClass,
  attendanceRange,
  onClearSearch,
  onClearClass,
  onClearAttendance,
  onResetAll,
}: Props) {
  const hasActiveFilters =
    Boolean(search) ||
    Boolean(selectedClass) ||
    attendanceRange.min !== 0 ||
    attendanceRange.max !== 100;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* ========================= */}
        {/* LEFT */}
        {/* ========================= */}

        <div className="flex flex-wrap items-center gap-3">
          {/* LABEL */}

          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Funnel className="h-4 w-4" />

            <span>Active Filters</span>
          </div>

          {/* SEARCH CHIP */}

          {search && (
            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-200
                bg-blue-50
                px-4
                py-2
                text-sm
                text-blue-700
                dark:border-blue-900
                dark:bg-blue-950/40
                dark:text-blue-300
              "
            >
              <span className="font-medium">Search:</span>

              <span>{search}</span>

              <button
                type="button"
                onClick={onClearSearch}
                className="
                  rounded-full
                  p-1
                  transition
                  hover:bg-blue-100
                  dark:hover:bg-blue-900
                "
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* CLASS CHIP */}

          {selectedClass && (
            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-200
                bg-emerald-50
                px-4
                py-2
                text-sm
                text-emerald-700
                dark:border-emerald-900
                dark:bg-emerald-950/40
                dark:text-emerald-300
              "
            >
              <span className="font-medium">Class:</span>

              <span>{selectedClass}</span>

              <button
                type="button"
                onClick={onClearClass}
                className="
                  rounded-full
                  p-1
                  transition
                  hover:bg-emerald-100
                  dark:hover:bg-emerald-900
                "
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* ATTENDANCE CHIP */}

          {(attendanceRange.min !== 0 || attendanceRange.max !== 100) && (
            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-purple-200
                bg-purple-50
                px-4
                py-2
                text-sm
                text-purple-700
                dark:border-purple-900
                dark:bg-purple-950/40
                dark:text-purple-300
              "
            >
              <span className="font-medium">Attendance:</span>

              <span>
                {attendanceRange.min}% - {attendanceRange.max}%
              </span>

              <button
                type="button"
                onClick={onClearAttendance}
                className="
                  rounded-full
                  p-1
                  transition
                  hover:bg-purple-100
                  dark:hover:bg-purple-900
                "
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* ========================= */}
        {/* RESET BUTTON */}
        {/* ========================= */}

        <button
          type="button"
          onClick={onResetAll}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-2
            text-sm
            font-medium
            text-red-600
            transition
            hover:bg-red-100
            dark:border-red-900
            dark:bg-red-950/30
            dark:text-red-300
            dark:hover:bg-red-950/50
          "
        >
          <RotateCcw className="h-4 w-4" />
          Reset All
        </button>
      </div>
    </div>
  );
}

export default ActiveFilterChips;
