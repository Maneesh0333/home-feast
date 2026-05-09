import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosApi from "@/lib/axios";
import { toast } from "sonner";

import type { RegisterFormType } from "../../types/auth/types";
import { ResponseType } from "@/types/Shared/types";

export function useRegister() {
  return useMutation<ResponseType, AxiosError<ResponseType>, RegisterFormType>({
    mutationFn: async (formData) => {
      const res = await axiosApi.post("/auth/register", formData);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Registration failed");
        return;
      }

      toast.success(data.message ?? "Account created");
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response.data?.message ?? "Registration failed");
    },
  });
}
