import type { Teacher, UpdateTeacherPayload } from '../types/teacher.types';


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

export const updateTeacher = async (teacher: Teacher | UpdateTeacherPayload): Promise<Teacher> => {
  return new Promise<Teacher>((resolve) => {
    setTimeout(() => {
      const localTeachers: Teacher[] = JSON.parse(localStorage.getItem("mock_teachers") || "[]");
      const teacherRecord = teacher as Partial<Teacher> & Partial<UpdateTeacherPayload>;
      const existing = localTeachers.find((t) => t.id === teacher.id);
      const normalizedTeacher: Teacher = {
        id: teacher.id,
        schoolId: teacherRecord.schoolId || existing?.schoolId || "school-1",
        fullName: teacherRecord.fullName || existing?.fullName || "",
        email: teacherRecord.email || existing?.email || "",
        phone: teacherRecord.phone || existing?.phone || "",
        password: teacherRecord.password ?? existing?.password,
        firstLogin: teacherRecord.firstLogin ?? existing?.firstLogin ?? true,
        employeeId: teacherRecord.employeeId || existing?.employeeId || "",
        department: teacherRecord.department || existing?.department || "",
        subject: teacherRecord.subject || existing?.subject || "",
        qualification: teacherRecord.qualification || existing?.qualification || "",
        experienceYears: teacherRecord.experienceYears ?? existing?.experienceYears ?? 0,
        joiningDate: teacherRecord.joiningDate || existing?.joiningDate || new Date().toISOString(),
        coordinatorFor: teacherRecord.coordinatorFor ?? existing?.coordinatorFor,
        status: teacherRecord.status || existing?.status || "ACTIVE",
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profilePic: teacherRecord.profilePic ?? existing?.profilePic,
      };
      const idx = localTeachers.findIndex(t => t.id === normalizedTeacher.id);
      if (idx !== -1) {
        localTeachers[idx] = normalizedTeacher;
      } else {
        localTeachers.push(normalizedTeacher);
      }
      localStorage.setItem("mock_teachers", JSON.stringify(localTeachers));
      resolve(normalizedTeacher);
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