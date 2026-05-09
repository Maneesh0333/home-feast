import axiosApi from "@/lib/axios";
import { ResponseType } from "@/types/Shared/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* 🔹 TYPES */
type EarningsStats = {
  monthlyEarnings: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
};

export type EarningsHistory = {
  _id: string;
  planType: "daily" | "weekly" | "monthly";
  paymentStatus: "paid" | "pending";
  date: string;
  customerName: string;
  amount: number;
};

type CookEarningsData = {
  stats: EarningsStats;
  history: EarningsHistory[];
};

type CookEarningsResponse = ResponseType & {
  data: CookEarningsData;
};

export const useCookEarnings = () => {
  return useQuery<CookEarningsData, AxiosError<ResponseType>>({
    queryKey: ["cook-earnings"],

    queryFn: async () => {
      const res = await axiosApi.get<CookEarningsResponse>("cooks/earning");
      return res.data.data;
    },

    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5, // cache for 5 mins (good for earnings)
  });
};
