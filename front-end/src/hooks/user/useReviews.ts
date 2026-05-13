import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";
import { ResponseType } from "@/types/Shared/types";
import { toast } from "sonner";

type CreateReviewPayload = {
  subscriptionId: string;
  rating: number;
  comment?: string;
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    CreateReviewPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosApi.post<ResponseType>(
        "cooks/review",
        payload,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Failed to submit review");
        return;
      }

      toast.success(data.message || "Review submitted successfully ⭐");
      queryClient.invalidateQueries({ queryKey: ["my-subscriptions"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again");
        return;
      }

      toast.error(error.response.data?.message || "Failed to submit review");
    },
  });
};


