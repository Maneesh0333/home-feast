import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosApi from "@/lib/axios";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { ResponseType } from "../../types/Shared/types";

/* ---------------- TYPES ---------------- */
export type Plan = {
  _id: string;
  type: "daily" | "weekly" | "monthly";
  price: number;
  isActive: boolean;
  createdAt: string;
};

type ApiResponse = ResponseType & {
  data: Plan[];
};

export const usePlans = () => {
  return useQuery<Plan[], AxiosError<ResponseType>>({
    queryKey: ["plans"],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponse>("/plans");
      return res.data.data;
    },

    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePlan = () => {
  const qc = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { type: string; price: number }
  >({
    mutationFn: async (data) => {
      const res = await axiosApi.post<ResponseType>("/plans", data);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to create plan");
        return;
      }

      toast.success("Plan created");
      qc.invalidateQueries({ queryKey: ["plans"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again.");
        return;
      }

      toast.error(
        error.response?.data?.message ?? "Failed to create plan"
      );
    },
  });
};

export const useUpdatePlan = () => {
  const qc = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { id: string; price: number }
  >({
    mutationFn: async ({ id, price }) => {
      const res = await axiosApi.patch<ResponseType>(
        `/plans/${id}`,
        { price }
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to update plan");
        return;
      }

      toast.success("Plan updated");
      qc.invalidateQueries({ queryKey: ["plans"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error");
        return;
      }

      toast.error(
        error.response?.data?.message ?? "Failed to update plan"
      );
    },
  });
};

export const useEnablePlan = () => {
  const qc = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/plans/${id}/enable`
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to enable plan");
        return;
      }

      toast.success(data.message ?? "Plan enabled");
      qc.invalidateQueries({ queryKey: ["plans"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again.");
        return;
      }

      toast.error(
        error.response?.data?.message ?? "Failed to enable plan"
      );
    },
  });
};

export const useDisablePlan = () => {
  const qc = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/plans/${id}/disable`
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to disable plan");
        return;
      }

      toast.success(data.message ?? "Plan disabled");
      qc.invalidateQueries({ queryKey: ["plans"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again.");
        return;
      }

      toast.error(
        error.response?.data?.message ?? "Failed to disable plan"
      );
    },
  });
};