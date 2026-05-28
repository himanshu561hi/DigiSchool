import { useState, useMemo } from "react";
import type { Teacher } from "../types/teacher.types";

export function useTeacherFilters(teachers: Teacher[]) {
  const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "INACTIVE" | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [experienceRange, setExperienceRange] = useState({ min: 0, max: 50 });

  // Extract unique departments and subjects
  const departments = useMemo(() => {
    const deps = new Set(teachers.map((t) => t.department).filter(Boolean));
    return Array.from(deps).sort();
  }, [teachers]);

  const subjects = useMemo(() => {
    const subs = new Set(teachers.map((t) => t.subject).filter(Boolean));
    return Array.from(subs).sort();
  }, [teachers]);

  // Apply filters to data
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      // 1. Status Match
      if (selectedStatus && teacher.status !== selectedStatus) {
        return false;
      }

      // 2. Department Match
      if (selectedDepartment && teacher.department !== selectedDepartment) {
        return false;
      }

      // 3. Subject Match
      if (selectedSubject && teacher.subject !== selectedSubject) {
        return false;
      }

      // 4. Experience Match
      const exp = teacher.experienceYears ?? 0;
      if (exp < experienceRange.min || exp > experienceRange.max) {
        return false;
      }

      return true;
    });
  }, [
    teachers,
    selectedStatus,
    selectedDepartment,
    selectedSubject,
    experienceRange,
  ]);

  return {
    selectedStatus,
    setSelectedStatus,
    selectedDepartment,
    setSelectedDepartment,
    selectedSubject,
    setSelectedSubject,
    experienceRange,
    setExperienceRange,
    departments,
    subjects,
    filteredTeachers,
  };
}
