import type { Teacher } from '../types/teacher.types';


export const getTeachers = async (
  schoolId?: string,
): Promise<Teacher[]> => {
  const localTeachers = JSON.parse(localStorage.getItem("mock_teachers") || "[]");
  const teachers = Array.isArray(localTeachers) ? localTeachers : [];

  return teachers.filter(
    (teacher) => teacher && (schoolId ? teacher.schoolId === schoolId : true),
  );
};

export const createTeacher = async (teacher: Teacher): Promise<Teacher> => {
  return new Promise<Teacher>((resolve) => {
    setTimeout(() => {
      const localTeachers = JSON.parse(localStorage.getItem("mock_teachers") || "[]");
      localTeachers.unshift(teacher);
      localStorage.setItem("mock_teachers", JSON.stringify(localTeachers));
      resolve(teacher);
    }, 800);
  });
};

export const updateTeacher = async (teacher: Teacher): Promise<Teacher> => {
  return new Promise<Teacher>((resolve) => {
    setTimeout(() => {
      const localTeachers: Teacher[] = JSON.parse(localStorage.getItem("mock_teachers") || "[]");
      const idx = localTeachers.findIndex(t => t.id === teacher.id);
      if (idx !== -1) {
        localTeachers[idx] = teacher;
      } else {
        localTeachers.push(teacher);
      }
      localStorage.setItem("mock_teachers", JSON.stringify(localTeachers));
      resolve(teacher);
    }, 800);
  });
};

export const deleteTeacher = async (teacherId: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const localTeachers: Teacher[] = JSON.parse(localStorage.getItem("mock_teachers") || "[]");
      const filtered = localTeachers.filter(t => t.id !== teacherId);
      localStorage.setItem("mock_teachers", JSON.stringify(filtered));

      // We can't actually delete from the mock JSON, but in a real app the backend handles it.
      resolve();
    }, 500);
  });
};