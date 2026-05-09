import axiosApi from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type OverviewData = {
  stats: {
    totalEarnings: number;
    activeSubscribers: number;
  };
  chartData: {
    date: string;
    amount: number;
  }[];
  rating: {
    average: number;
    totalReviews: number;
};
};

export const useCookOverview = () => {
  return useQuery<OverviewData>({
    queryKey: ["cook-overview"],
    queryFn: async () => {
      const res = await axiosApi.get("/cooks/overview");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 3,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};
