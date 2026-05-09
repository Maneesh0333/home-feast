import axiosApi from "@/lib/axios";
import { ResponseType } from "@/types/Shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type SubscriptionStatus =
  | "pending"
  | "active"
  | "cancelled"
  | "expired"
  | "rejected";

export type Subscription = {
  _id: string;
  planType: "daily" | "weekly" | "monthly";
  mealTime: "lunch" | "dinner" | "both";
  price: number;
  status: SubscriptionStatus;
  paymentStatus: "pending" | "paid";
  deliveryAddress: string;
  createdAt: string;

  user: {
    _id?: string; 
    name: string;
    phone: string;
  };
};

type RequestResponse = ResponseType & {
  data: {
  requests: Subscription[];
  stats: Record<SubscriptionStatus, number>;
  page: number;
  limit: number;
  total: number;          
  totalRequests: number; 
  totalPages: number;
  results: number;
};
};

export const useCookRequests = (
  status: string = "All",
  search: string = "",
  page: number = 1,
  limit: number = 5
) => {
  return useQuery<RequestResponse["data"], AxiosError<ResponseType>>({
    queryKey: ["cook-requests", status, search, page, limit],
    queryFn: async () => {
      const res = await axiosApi.get<RequestResponse>(
        "/subscriptions/cook/requests",
        {
          params: { status, search, page, limit },
        }
      );

      return res.data.data;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export const useAcceptSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const res = await axiosApi.patch(`/subscriptions/${id}/accept`);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Accept failed");
        return;
      }

      toast.success(data.message || "Request accepted");

      queryClient.invalidateQueries({
        queryKey: ["cook-requests"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again.");
        return;
      }

      toast.error(error.response.data?.message || "Accept failed");
    },
  });
};

export const useRejectSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const res = await axiosApi.patch(`/subscriptions/${id}/reject`);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Reject failed");
        return;
      }

      toast.success(data.message || "Request rejected");

      queryClient.invalidateQueries({
        queryKey: ["cook-requests"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, try again.");
        return;
      }

      toast.error(error.response.data?.message || "Reject failed");
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { id: string; paymentStatus: "paid" }
  >({
    mutationFn: async ({ id, paymentStatus }) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/subscriptions/${id}/payment/status`,
        { paymentStatus },
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Action failed");
        return;
      }

      toast.success(data.message ?? "Payment Status updated");

      // 🔄 Refetch bookings
      queryClient.invalidateQueries({ queryKey: ["cook-requests"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again");
        return;
      }

      toast.error(
        error.response?.data?.message ?? "Action failed",
      );
    },
  });
};