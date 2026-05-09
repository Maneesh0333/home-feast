import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosApi from "@/lib/axios";
import { LoginFormType } from "../../types/auth/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ResponseType } from "@/types/Shared/types";

type SuccessResponse = ResponseType & {
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: "User" | "Cook" | "Admin";
    };
  };
};

type ErrorResponse = ResponseType & {
  code?: string;
};

export function useLogin() {
  const router = useRouter();

  return useMutation<SuccessResponse, AxiosError<ErrorResponse>, LoginFormType>(
    {
      mutationFn: async (formData) => {
        const res = await axiosApi.post("/auth/login", formData);
        return res.data;
      },
      onSuccess: (data) => {
        if (!data.success) {
          toast.error(data.message ?? "Login Failed");
          return;
        }

        toast.success(data.message ?? "Login success.");
      },

      onError: (error, data) => {
        if (!error.response) {
          toast.error("Network error, please try again later.");
          return;
        }

        if (error.response.data?.code === "EMAIL_NOT_VERIFIED") {
          router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
        }

        toast.error(error.response.data?.message ?? "Login Failed");
      },
    },
  );
}
