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
  data: TodayMenuItem[];
};

/* ---------------- HOOK ---------------- */
export const useTodayMenu = () => {
  return useQuery<TodayMenuItem[], AxiosError<ResponseType>>({
    queryKey: ["today-menu"],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponse>("/menus/today");
      return res.data.data;
    },

    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};