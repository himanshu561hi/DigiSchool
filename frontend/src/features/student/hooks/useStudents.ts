import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getStudents } from "../services/student.service";
import { useAuthStore } from "@/features/auth/store/authStore";

export function useStudents() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, user?.schoolId],
    queryFn: () => getStudents(user?.schoolId),
  });
}