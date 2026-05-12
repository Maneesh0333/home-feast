import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";

type Plan = {
  type: "daily" | "weekly" | "monthly";
  price: number;
};

type User = {
   _id: string;
  name: string;
  city: string;
};

type TopCook = {
  _id: string;
  user: User;
  kitchenName: string;
  plans: Plan[];
  average: number;
  totalReviews: number;
};

type HomeStats = {
  VerifiedCooks: number;
  Subscription: number;
  TopCook: TopCook | null;
};

type HomeStatsResponse = {
  success: boolean;
  message: string;
  data: HomeStats;
};

export const useHomeStats = () => {
  return useQuery<HomeStats>({
    queryKey: ["home-stats"],

    queryFn: async () => {
      const { data } =
        await axiosApi.get<HomeStatsResponse>("/users/stats");

      return data.data;
    },

    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });
};