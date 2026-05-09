import { useQuery } from "@tanstack/react-query";
import axiosApi from "@/lib/axios";

type OverviewResponse = {
  stats: {
    totalUsers: number;
    verifiedCooks: number;
    activeSubscribers: number;
    revenue: number;
  };
  chartData: {
    date: string;
    amount: number;
  }[];
};

export const useAdminOverview = () => {
  return useQuery<OverviewResponse>({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await axiosApi.get("/admin/overview");
      return res.data.data;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
