import { useQuery } from "@tanstack/react-query";
import axiosApi from "@/lib/axios";
import type { AxiosError } from "axios";
import { ResponseType } from "@/types/Shared/types";

/* ---------------- TYPES ---------------- */
export type TodayMenuItem = {
  _id: string;
  name: string;
  price: number;
  type: "veg" | "nonveg";
  time: "lunch" | "dinner";
  calories: number;
};

/* ---------------- API RESPONSE ---------------- */
type ApiResponse = ResponseType & {
  data: { menu: TodayMenuItem[]; totalPages: number; page: number };
};

/* ---------------- HOOK ---------------- */
export const useTodayMenu = (page: number, limit: number = 5) => {
  return useQuery<ApiResponse["data"], AxiosError<ResponseType>>({
    queryKey: ["today-menu", page, limit],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponse>("/menus/today", {
        params: { page, limit },
      });
      return res.data.data;
    },

    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};
