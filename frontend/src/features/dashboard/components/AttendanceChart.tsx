import { useState } from "react";
import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import type { AttendanceData } from "../types/dashboard.types";

type Props = {
  data?: AttendanceData[];
  onTimeframeChange?: (days: number) => void;
};

function AttendanceChart({ data = [], onTimeframeChange }: Props) {
  const [timeframe, setTimeframe] = useState<number>(7);

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const days = parseInt(e.target.value, 10);
    setTimeframe(days);
    if (onTimeframeChange) {
      onTimeframeChange(days);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
            Attendance Overview
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            School-wide vs Teachers attendance
          </p>
        </div>
        
        {/* ATTRACTIVE DROPDOWN */}
        <div className="relative self-start">
          <select 
            value={timeframe}
            onChange={handleTimeframeChange}
            className="appearance-none rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 pr-8 text-xs font-semibold text-slate-700 shadow-sm outline-none transition hover:bg-slate-100 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={365}>This Year</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="h-[200px] sm:h-[260px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              domain={['auto', 100]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number, name: string) => [`${value}%`, name === 'attendance' ? 'Students' : 'Teachers']}
              labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-xs font-medium text-slate-600 dark:text-slate-300 ml-1">{value === 'attendance' ? 'Students' : 'Teachers'}</span>}
            />
            <Area
              type="monotone"
              dataKey="attendance"
              name="attendance"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorStudents)"
            />
            <Area
              type="monotone"
              dataKey="teachers"
              name="teachers"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTeachers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceChart;
