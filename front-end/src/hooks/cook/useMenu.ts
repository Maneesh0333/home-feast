import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "@/lib/axios";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { ResponseType } from "../../types/Shared/types";

export type MenuItem = {
  _id: string;
  name: string;
  price: number;
  type: "Veg" | "Non-Veg";
  status: "Active" | "Inactive";
  description: string;
  time: "Lunch" | "Dinner";
  calories: number;
  createdAt: string;
  availableToday: boolean;
};

type MenuStats = {
  veg: number;
  nonveg: number;
};

type MenuResponse = {
  menu: MenuItem[];
  stats: MenuStats;
  page: number;
  limit: number;
  total: number;
  totalMenu: number;
  totalPages: number;
  results: number;
};

type ApiResponse = ResponseType & {
  data: MenuResponse;
};

export const useMenu = (
  search: string = "",
  status: string = "All",
  page: number = 1,
  limit: number = 5,
) => {
  return useQuery<MenuResponse, AxiosError<ResponseType>>({
    queryKey: ["menu", status, search, page, limit],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponse>("/menus", {
        params: { type: status, search, page, limit },
      });
      return res.data.data;
    },
    placeholderData: (prev) => prev,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

type MenuTypeResponse = {
  _id: string;
  mealType: "Veg" | "Non-Veg" | "Both";
};

type ApiResponseMenuType = ResponseType & {
  data: MenuTypeResponse;
};

export const useMenuType = (cookId: string | undefined) => {
  return useQuery<MenuTypeResponse, AxiosError<ResponseType>>({
    queryKey: ["menu-type"],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponseMenuType>(
        `cooks/meal-type/${cookId}`,
      );
      return res.data.data;
    },
    enabled: !!cookId,
    placeholderData: (prev) => prev,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useDisableMenus = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/menus/${id}/disable`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to disable menu");
        return;
      }
      toast.success(data.message ?? "Menu disabled");
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }
      toast.error(error.response?.data?.message ?? "Failed to disable manu");
    },
  });
};

export const useEnableMenus = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/menus/${id}/enable`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to enable menu");
        return;
      }
      toast.success(data.message ?? "Menu enabled");
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again later.");
        return;
      }
      toast.error(error.response?.data?.message ?? "Failed to enable menu");
    },
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, Partial<MenuItem>>(
    {
      mutationFn: async (formData) => {
        const res = await axiosApi.post<ResponseType>("/menus", formData);
        return res.data;
      },

      onSuccess: (data) => {
        if (!data.success) {
          toast.error(data.message ?? "Failed to create menu");
          return;
        }

        toast.success("Menu created");
        queryClient.invalidateQueries({ queryKey: ["menu"] });
      },

      onError: (error) => {
        toast.error(error.response?.data?.message ?? "Failed to create menu");
      },
    },
  );
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ResponseType,
    AxiosError<ResponseType>,
    { id: string; dataMod: Partial<MenuItem> }
  >({
    mutationFn: async ({ id, dataMod }) => {
      const res = await axiosApi.patch<ResponseType>(`/menus/${id}`, dataMod);
      return res.data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to update menu");
        return;
      }

      toast.success("Menu updated");
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Failed to update menu");
    },
  });
};

export const useToggleTodayMenu = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, string>({
    mutationFn: async (id) => {
      const { data } = await axiosApi.patch<ResponseType>(
        `/menus/${id}/toggle`,
      );
      return data;
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message ?? "Failed to update today menu");
        return;
      }

      toast.success(data.message ?? "Updated today's menu");

      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },

    onError: (error) => {
      if (!error.response) {
        toast.error("Network error, please try again.");
        return;
      }

      toast.error(
        error.response?.data?.message ?? "Failed to update today menu",
      );
    },
  });
};
