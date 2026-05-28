import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { QUERY_KEYS } from "@/constants/queryKeys";

import { updateStudent } from "../services/student.service";

export function useUpdateStudent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: updateStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STUDENTS],
      });

      toast.success(
        "Student updated successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to update student",
      );
    },
  });
}