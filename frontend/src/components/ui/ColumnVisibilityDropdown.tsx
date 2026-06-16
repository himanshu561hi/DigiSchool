import { Settings2 } from "lucide-react";

type Props<T> = {
  columns: {
    key: keyof T;
    header: string;
  }[];

  visibleColumns: (keyof T)[];

  onToggleColumn: (key: keyof T) => void;
};

function ColumnVisibilityDropdown<T>({
  columns,
  visibleColumns,
  onToggleColumn,
}: Props<T>) {
  return (
    <div className="relative group">
      {/* BUTTON */}

      <button
        type="button"
        tabIndex={0}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          text-slate-700
          transition
          hover:bg-slate-100
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-200
          dark:hover:bg-slate-800
        "
      >
        <Settings2 className="h-4 w-4" />
        Columns
      </button>

      {/* DROPDOWN */}

      <div
        className="
  absolute
  right-0
  top-14
  z-50
  w-56
  rounded-2xl
  border
  border-slate-200
  bg-white
  p-3
  shadow-xl
  opacity-0
  invisible
  transition-all
  duration-200
  group-hover:visible
  group-hover:opacity-100
  group-focus-within:visible
  group-focus-within:opacity-100
  dark:border-slate-700
  dark:bg-slate-900
"
      >
        <div className="flex flex-col gap-2">
          {columns.map((column) => {
            const checked = visibleColumns.includes(column.key);

            return (
              <label
                key={String(column.key)}
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2
                  transition
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                "
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleColumn(column.key)}
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {column.header}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ColumnVisibilityDropdown;
