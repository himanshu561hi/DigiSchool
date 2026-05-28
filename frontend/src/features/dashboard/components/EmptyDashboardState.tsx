type EmptyDashboardStateProps = {
  title: string;

  description: string;
};

function EmptyDashboardState({ title, description }: EmptyDashboardStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>

      <p className="mt-3 max-w-md text-slate-500">{description}</p>
    </div>
  );
}

export default EmptyDashboardState;
