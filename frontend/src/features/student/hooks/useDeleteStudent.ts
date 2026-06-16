import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { QUERY_KEYS } from "@/constants/queryKeys";

import { deleteStudent } from "../services/student.service";

export function useDeleteStudent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STUDENTS],
      });

      toast.success(
        "Student deleted successfully",
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete student",
      );
    },
  });
}