import { useState, useEffect, useRef } from "react";
import SearchBar from "@/components/shared/SearchBar";
import RowsPerPageSelect from "@/components/ui/RowsPerPageSelect";
import PermissionGuard from "@/components/guards/PermissionGuard";

type StudentTableActionsProps = {
  search: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onAddStudent: () => void;
  isLoading: boolean;
  isUpdating: boolean;
};

function StudentTableActions({
  search,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  onAddStudent,
  isLoading,
  isUpdating,
}: StudentTableActionsProps) {
  const [isTop, setIsTop] = useState(false);
  const prevY = useRef(0);

    // Show FAB at top when manager scrolls near top of page, otherwise keep at bottom
  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      const nearTop = scrollY <= 200;
      setIsTop(nearTop);
    };
    window.addEventListener('scroll', handler);
    // Initialise on mount
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);



  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <SearchBar
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search students..."
          />
          <button
            type="button"
            onClick={onAddStudent}
            disabled={isLoading || isUpdating}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90 focus:outline-none transition md:hidden"
            aria-label="Add Student"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="hidden sm:block">
        <RowsPerPageSelect value={itemsPerPage} onChange={onItemsPerPageChange} />
      </div>

      <PermissionGuard permission="students.create">
        {/* DESKTOP BUTTON */}
        <button
          type="button"
          onClick={onAddStudent}
          disabled={isLoading || isUpdating}
          className="hidden sm:block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
        >
          {isLoading ? "Adding..." : isUpdating ? "Updating..." : "Add Student"}
        </button>


      </PermissionGuard>
    </div>
  );
}

export default StudentTableActions;
