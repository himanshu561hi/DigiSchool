type SearchBarProps = {
  value: string;

  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  placeholder?: string;
};

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white
text-slate-900
border-slate-200 dark:bg-slate-900
dark:text-slate-100
dark:border-slate-700 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

export default SearchBar;
