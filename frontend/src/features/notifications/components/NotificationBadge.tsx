import React from "react";

interface NotificationBadgeProps {
  count?: number;
  showDot?: boolean;
  pulse?: boolean;
  className?: string;
}

export default function NotificationBadge({ 
  count = 0, 
  showDot = false, 
  pulse = true,
  className = ""
}: NotificationBadgeProps) {
  
  if (count === 0 && !showDot) return null;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {showDot ? (
        <span className="relative flex h-2.5 w-2.5">
          {pulse && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-sm border border-white dark:border-slate-900"></span>
        </span>
      ) : (
        <span className="relative flex">
          {pulse && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
          <span className="relative inline-flex items-center justify-center px-1.5 py-0.5 min-w-[1.25rem] h-5 rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border border-white dark:border-slate-900">
            {count > 99 ? '99+' : count}
          </span>
        </span>
      )}
    </div>
  );
}
