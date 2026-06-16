type ActivityCardProps = {
  title: string;

  time: string;
};

function ActivityCard({ title, time }: ActivityCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100">
      <div className="flex items-start justify-between gap-4">
        <p className="font-medium text-slate-800">{title}</p>

        <span className="text-xs text-slate-500">{time}</span>
      </div>
    </div>
  );
}

export default ActivityCard;
