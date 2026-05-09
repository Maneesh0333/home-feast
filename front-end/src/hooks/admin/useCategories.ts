import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";

import { ResponseType } from "../../types/Shared/types";
import { toast } from "sonner";
import { FormType, UpdateCategorySchemaType } from "@/types/admin/types";

export type CategoriesStats = {
  Active: number;
  InActive: number;
};

export type Category = {
  _id: string;
  categoryId: string;
  icon: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  createdAt: string;
};

type CategoriesResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  results: number;
  totalCategories: number;
  stats: CategoriesStats;
  categories: Category[];
};

type ApiResponse = ResponseType & {
  data: CategoriesResponse;
};

export type CategoryLite = Pick<
  Category,
  "_id" | "name" | "categoryId" | "icon"
>;

type ApiResponseAllCategories = {
  success: boolean;
  message: string;
  data: CategoryLite[];
};

export const useCategories = (
  search: string = "",
  status: string = "All",
  page: number = 1,
  limit: number = 5,
) => {
  return useQuery<CategoriesResponse, AxiosError<ResponseType>>({
    queryKey: ["categories", status, search, page, limit],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponse>("/categories", {
        params: { status, search, page, limit },
      });
      return res.data.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export const useAllCategories = () => {
  return useQuery<CategoryLite[]>({
    queryKey: ["categories-all"],

    queryFn: async () => {
      const res =
        await axiosApi.get<ApiResponseAllCategories>("/categories/all");
      return res.data.data;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export const useDisableCategories = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/categories/${id}/disable`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to disable category");
        return;
      }
      toast.success(data.message ?? "Category disabled");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }
      toast.error(
        error.response?.data?.message ?? "Failed to disable category",
      );
    },
  });
};

export const useEnableCategories = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/categories/${id}/enable`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to enable category");
        return;
      }
      toast.success(data.message ?? "Category enabled");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }
      toast.error(error.response?.data?.message ?? "Failed to enable category");
    },
  });
};

export const useCreateCategories = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, FormType>({
    mutationFn: async (formData) => {
      const res = await axiosApi.post<ResponseType>("/categories", formData);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to create category");
        return;
      }

      toast.success(data.message ?? "Category created.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }

      toast.error(error.response.data?.message ?? "Failed to create category");
    },
  });
};

export const useUpdateCategories = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { categoryId: string; dataMod: Partial<UpdateCategorySchemaType> }
  >({
    mutationFn: async ({ categoryId, dataMod }) => {
      const res = await axiosApi.patch<ResponseType>(
        `/categories/${categoryId}`,
        dataMod,
      );
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to update category");
        return;
      }
      toast.success(data.message ?? "Category updated");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }
      toast.error(error.response?.data?.message ?? "Failed to update category");
    },
  });
};
