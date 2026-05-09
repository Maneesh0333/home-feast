import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";
import { ResponseType } from "@/types/Shared/types";
import { toast } from "sonner";
import { UserProfileFormValues } from "@/types/user/types";

export type Profile = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
};

type ApiResponse = ResponseType & {
  data: Profile;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await axiosApi.get<ApiResponse>("/users/profile");
      return data.data;
    },
  });
};


export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    Partial<UserProfileFormValues>
  >({
    mutationFn: async (formData) => {
      const { data } = await axiosApi.patch<ResponseType>(
        "/users/profile",
        formData,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Update failed");
        return;
      }

      toast.success(data.message ?? "Profile updated");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again");
        return;
      }

      toast.error(error.response.data?.message || "Failed to update profile");
    },
  });
};
