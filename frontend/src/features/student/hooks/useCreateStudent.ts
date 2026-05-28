import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { QUERY_KEYS } from "@/constants/queryKeys";

import { createStudent } from "../services/student.service";
import { useNotificationStore } from "@/features/notification/store/notificationStore";
import { useStudents } from "../hooks/useStudents";

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { data: existingStudents = [] } = useStudents();

  return useMutation({
    mutationFn: createStudent,

    onSuccess: (newStudent) => {
      // Check for duplicate roll number within same class
      const duplicate = existingStudents.find(
        (s) => s.className === newStudent.className && s.rollNumber === newStudent.rollNumber,
      );
      if (duplicate) {
        toast.error("Roll number already exists in this class");
        return;
      }

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
      toast.success('Student created successfully');
    },

    onError: () => {
      toast.error(
        "Failed to create student",
      );
    },
  });
}