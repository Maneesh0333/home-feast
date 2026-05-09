import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosApi from "@/lib/axios";
import { VerifyFormType } from "../../types/auth/types";
import { AxiosError } from "axios";
import { ResponseType } from "@/types/Shared/types";

export function useVerifyOtp() {
  return useMutation<ResponseType, AxiosError<ResponseType>, VerifyFormType>({
    mutationFn: async (data) => {
      const res = await axiosApi.post("/auth/verify", data);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Verification failed");
        return;
      }

      toast.success(data.message ?? "Verification success");
    },

    onError: (error: any) => {
      if (!error?.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response.data.message || "Verification failed");
    },
  });
}
