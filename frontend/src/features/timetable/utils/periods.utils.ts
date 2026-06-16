export type Period = { index: number; time: string; isLunch?: boolean };

export const DEFAULT_PERIODS: Period[] = [
  { index: 0, time: "09:00 AM - 09:45 AM" },
  { index: 1, time: "09:45 AM - 10:30 AM" },
  { index: 2, time: "10:30 AM - 11:15 AM" },
  { index: 3, time: "11:15 AM - 11:45 AM", isLunch: true },
  { index: 4, time: "11:45 AM - 12:30 PM" },
  { index: 5, time: "12:30 PM - 01:15 PM" },
];

/** Load periods from localStorage (set by Manager in Timetable), fallback to defaults */
export const getStoredPeriods = (schoolId?: string): Period[] => {
  const key = schoolId ? `mock_periods_${schoolId}` : "mock_periods";
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : DEFAULT_PERIODS;
};

/** Parse a time string like "09:00 AM - 09:45 AM" → { startMin, endMin } */
const parseTimeRange = (timeStr: string): { startMin: number; endMin: number } | null => {
  // Expected format: "HH:MM AM/PM - HH:MM AM/PM"
  const parts = timeStr.split("-").map(s => s.trim());
  if (parts.length < 2) return null;

  const toMin = (t: string): number => {
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const period = match[3].toUpperCase();
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  return { startMin: toMin(parts[0]), endMin: toMin(parts[1]) };
};

/** Get the period index that is currently active (within its time window) */
export const getCurrentPeriodIndex = (schoolId?: string): number => {
  const periods = getStoredPeriods(schoolId).filter(p => !p.isLunch);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  for (const p of periods) {
    const range = parseTimeRange(p.time);
    if (range && nowMin >= range.startMin && nowMin <= range.endMin) {
      return p.index;
    }
  }
  // Default: first non-lunch period
  return periods[0]?.index ?? 0;
};

/** Check if current time is at least 5 minutes into the given period */
export const isPeriodAvailableForAttendance = (periodIndex: number, schoolId?: string): boolean => {
  const periods = getStoredPeriods(schoolId);
  const period = periods.find(p => p.index === periodIndex);
  if (!period || period.isLunch) return false;

  const range = parseTimeRange(period.time);
  if (!range) return true; // fallback: allow

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= range.startMin + 5;
};

/** Get period display list for dropdowns (excludes lunch) */
export const getTeachingPeriods = (schoolId?: string): Period[] => {
  return getStoredPeriods(schoolId).filter(p => !p.isLunch);
};
