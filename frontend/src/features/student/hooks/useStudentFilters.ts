import { useEffect, useMemo, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

import type { Student } from "../types/student.types";

const DEFAULT_ITEMS_PER_PAGE = 5;

const DEFAULT_ATTENDANCE_RANGE = {
  min: 0,
  max: 100,
};

export function useStudentFilters(students: Student[] = []) {
  const safeStudents = Array.isArray(students) ? students : [];
  /*
   =========================
   BASIC STATES
   =========================
  */

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(DEFAULT_ITEMS_PER_PAGE);

  /*
   =========================
   FILTER STATES
   =========================
  */

  const [selectedClass, setSelectedClass] =
    useState<string | null>(null);

  const [attendanceRange, setAttendanceRange] =
    useState(DEFAULT_ATTENDANCE_RANGE);

  /*
   =========================
   DEBOUNCED SEARCH
   =========================
  */

  const debouncedSearch =
    useDebounce(search, 300);

  /*
   =========================
   RESET PAGE ON FILTER CHANGE
   =========================
  */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    selectedClass,
    attendanceRange,
    itemsPerPage,
  ]);

  /*
   =========================
   SEARCH NORMALIZATION
   =========================
  */

  const normalizedSearch = useMemo(
    () =>
      debouncedSearch
        .trim()
        .toLowerCase(),
    [debouncedSearch],
  );

  /*
   =========================
   FILTERED STUDENTS
   =========================
  */

  const filteredStudents = useMemo(() => {
    return safeStudents.filter((student) => {
      const fullName =
        `${student.firstName} ${student.lastName}`.toLowerCase();

      /*
       =========================
       SEARCH MATCH
       =========================
      */

      const matchesSearch =
        fullName.includes(
          normalizedSearch,
        ) ||
        student.email
          .toLowerCase()
          .includes(
            normalizedSearch,
          ) ||
        student.className
          .toLowerCase()
          .includes(
            normalizedSearch,
          ) ||
        student.rollNumber.includes(
          normalizedSearch,
        );

      /*
       =========================
       CLASS FILTER
       =========================
      */

      const matchesClass =
        selectedClass
          ? student.className ===
            selectedClass
          : true;

      /*
       =========================
       ATTENDANCE FILTER
       =========================
      */

      const matchesAttendance =
        student.attendance >=
          attendanceRange.min &&
        student.attendance <=
          attendanceRange.max;

      return (
        matchesSearch &&
        matchesClass &&
        matchesAttendance
      );
    });
  }, [
    safeStudents,
    normalizedSearch,
    selectedClass,
    attendanceRange,
  ]);

  /*
   =========================
   PAGINATION
   =========================
  */

  const totalPages = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(
        filteredStudents.length /
          itemsPerPage,
      ),
    );
  }, [
    filteredStudents.length,
    itemsPerPage,
  ]);

  const paginatedStudents =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      return filteredStudents.slice(
        start,
        start + itemsPerPage,
      );
    }, [
      filteredStudents,
      currentPage,
      itemsPerPage,
    ]);

  /*
   =========================
   UNIQUE CLASSES
   =========================
  */

  const classes = useMemo(() => {
    return Array.from(
      new Set(
        safeStudents.map(
          (student) =>
            student.className,
        ),
      ),
    );
  }, [safeStudents]);

  /*
   =========================
   RESET FILTERS
   =========================
  */

  const resetFilters = () => {
    setSearch("");

    setSelectedClass(null);

    setAttendanceRange(
      DEFAULT_ATTENDANCE_RANGE,
    );

    setCurrentPage(1);
  };

  /*
   =========================
   ACTIVE FILTER COUNT
   =========================
  */

  const activeFiltersCount =
    useMemo(() => {
      let count = 0;

      if (search.trim()) {
        count++;
      }

      if (selectedClass) {
        count++;
      }

      if (
        attendanceRange.min !==
          0 ||
        attendanceRange.max !==
          100
      ) {
        count++;
      }

      return count;
    }, [
      search,
      selectedClass,
      attendanceRange,
    ]);

  /*
   =========================
   RETURN
   =========================
  */

  return {
    /*
     =========================
     SEARCH
     =========================
    */

    search,
    setSearch,

    /*
     =========================
     PAGINATION
     =========================
    */

    currentPage,
    setCurrentPage,

    itemsPerPage,
    setItemsPerPage,

    totalPages,

    paginatedStudents,
    filteredStudents,

    /*
     =========================
     FILTERS
     =========================
    */

    selectedClass,
    setSelectedClass,

    attendanceRange,
    setAttendanceRange,

    classes,

    /*
     =========================
     ADVANCED
     =========================
    */

    resetFilters,
    activeFiltersCount,
  };
}