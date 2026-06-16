type DashboardHeaderProps = {
  title: string;

  subtitle: string;
};

function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {title}
      </h1>

      <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}

export default DashboardHeader;
