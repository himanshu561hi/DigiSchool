function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* HEADER */}

      <div>
        <div className="h-8 w-60 rounded bg-slate-200" />

        <div className="mt-3 h-4 w-96 rounded bg-slate-100" />
      </div>

      {/* STATS */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-28 rounded bg-slate-200" />

            <div className="mt-5 h-10 w-24 rounded bg-slate-100" />

            <div className="mt-4 h-3 w-32 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* CHARTS */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl border border-slate-200 bg-white" />

        <div className="h-80 rounded-2xl border border-slate-200 bg-white" />
      </div>
    </div>
  );
}

export default DashboardSkeleton;
