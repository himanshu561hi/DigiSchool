type RowsPerPageSelectProps = {
  value: number;

  onChange: (value: number) => void;
};

function RowsPerPageSelect({ value, onChange }: RowsPerPageSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Rows:
      </span>

      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        <option value={5}>5</option>

        <option value={10}>10</option>

        <option value={25}>25</option>

        <option value={50}>50</option>
      </select>
    </div>
  );
}

export default RowsPerPageSelect;
