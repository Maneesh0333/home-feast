import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import { ResponseType } from "../../types/Shared/types";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export type Cook = {
  _id: string;
  verificationStatus: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  bio: string;
  city: string;
  category: [];
  rating: {
    average: number;
    totalReviews: number;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: "Blocked" | "Active";
  };
};

export type CookStats = {
  Pending: number;
  Approved: number;
  Rejected: number;
};

type CookResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  results: number;
  totalCooks: number;
  stats: CookStats;
  cooks: Cook[];
};

type ApiResponseType = ResponseType & {
  data: CookResponse;
};

export const useCook = (
  status: string = "All",
  search: string = "",
  page: number = 1,
  view: "cooks" | "applications",
  limit: number = 5,
) => {
  return useQuery<CookResponse, AxiosError<ResponseType>>({
    queryKey: ["cooks", status, search, page, view, limit],
    queryFn: async () => {
      const res = await axiosApi.get<ApiResponseType>("/admin/cooks", {
        params: { status, search, view, page, limit },
      });

      return res.data.data;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useApproveCook = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const res = await axiosApi.patch(`/admin/cooks/${id}/approve`);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Approval failed");
        return;
      }

      toast.success(data.message || "Approval successful");

      queryClient.invalidateQueries({
        queryKey: ["cooks"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response.data?.message || "Approval failed");
    },
  });
};

export const useRejectCook = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const res = await axiosApi.patch<ResponseType>(
        `/admin/cooks/${id}/reject`,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Rejection failed");
        return;
      }

      toast.success(data.message || "Entrepreneur rejected");

      queryClient.invalidateQueries({
        queryKey: ["cooks"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response?.data?.message || "Rejection failed");
    },
  });
};

export const useBlockCook = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const res = await axiosApi.patch<ResponseType>(
        `/admin/users/${id}/block`,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Block failed");
        return;
      }

      toast.success(data.message || "Cook blocked");

      queryClient.invalidateQueries({
        queryKey: ["cooks"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response?.data?.message || "Block failed");
    },
  });
};

export const useUnblockCook = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const res = await axiosApi.patch<ResponseType>(
        `/admin/users/${id}/unblock`,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message || "Unblock failed");
        return;
      }

      toast.success(data.message || "Cook unblocked");

      queryClient.invalidateQueries({
        queryKey: ["cooks"],
      });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }
      toast.error(error.response?.data?.message || "Unblock failed");
    },
  });
};
