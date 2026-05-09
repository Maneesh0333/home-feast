import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosApi from "@/lib/axios";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { ResponseType } from "@/types/Shared/types";
import { subscriptionSchemaType } from "@/types/user/types";

type CreateSubscriptionPayload = subscriptionSchemaType & {
  cookId: string;
  planType: "daily" | "weekly" | "monthly";
};

export const useCreateSubscription = () => {
  const qc = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    CreateSubscriptionPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosApi.post<ResponseType>(
        "/subscriptions",
        payload
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to create subscription");
        return;
      }

      toast.success("Subscription created 🎉");
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again.");
        return;
      }

      toast.error(
        error.response?.data?.message ?? "Failed to create subscription"
      );
    },
  });
};

