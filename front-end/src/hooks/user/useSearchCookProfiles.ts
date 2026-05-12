import { useQuery } from "@tanstack/react-query";
import axiosApi from "@/lib/axios";
import type { AxiosError } from "axios";
import { ResponseType } from "@/types/Shared/types";
import { MealType, PlanType } from "@/types/user/types";

/* ---------------- TYPES ---------------- */
export type CookProfile = {
  _id: string;
  kitchenName: string;
  bio: string;
  experienceYears: number;
  rating: {
    average: number;
    count: number;
  };
  cheapestPlan: {
    type: "daily" | "weekly" | "monthly";
    price: number;
  };
  mealType: "Veg" | "Non-Veg" | "Both";
  user: {
    _id: string;
    name: string;
    city: string;
  };
};

type ApiResponse = ResponseType & {
  data: CookProfile[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/* ---------------- HOOK ---------------- */
export const useSearchCookProfiles = ({
  search = "",
  type,
  cuisine,
  planType,
  lat,
  lng,
  page = 1,
  limit = 10,
}: {
  search?: string;
  type?: MealType;
  cuisine?: string;
  planType?: PlanType;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
}) => {
  return useQuery<ApiResponse, AxiosError<ResponseType>>({
    queryKey: ["cooks", search, type, cuisine, page, limit, planType, lat, lng],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponse>("/cooks/search/profile", {
        params: {
          search,
          type,
          cuisine,
          page,
          limit,
          planType,
          lat,
          lng
        },
      });

      return res.data;
    },

    placeholderData: (prev) => prev,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};
