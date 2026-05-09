"use client";

import Header from "@/components/shared/Header";
import StatsGrid from "@/components/shared/StatsGrid";
import { ChartBar } from "@/components/shared/BarChart";
import { useCookOverview } from "@/hooks/cook/useCookOverview";
import { Spinner } from "@/components/ui/spinner";
import QuickActions from "@/components/shared/QuickActions";
import { QuickAction } from "@/app/types/(Cook)/overview";
import ErrorState from "@/components/shared/ErrorState";
import NoInternet from "@/components/shared/NoInternet";
import { useNetworkStatus } from "@/utils/useNetworkStatus";

export default function Overview() {
  const adminActions: QuickAction[] = [
    {
      icon: "✅",
      title: "Handle Orders",
      description: "",
      path: "/orders",
    },
    {
      icon: "🚨",
      title: "Handle Complaints",
      description: "23 open",
      path: "/admin/complaints",
    },
    {
      icon: "📊",
      title: "View Analytics",
      description: "Revenue & growth",
      path: "/admin/analytics",
    },
    {
      icon: "🏷️",
      title: "Handle Categories",
      description: "Add new categories",
      path: "/admin/categories",
    },
  ];

  const { data, isLoading, isError, refetch, isFetching } = useCookOverview();
  const isOnline = useNetworkStatus();

  if (!isOnline) return <NoInternet />;

  if (isError) {
    return (
      <ErrorState
        message="Failed to load requests"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  const statsData = [
    {
      label: "Total earnings",
      value: `₹${data?.stats.totalEarnings || "0"}`,
      sub: "",
    },
    {
      label: "Active subscribers",
      value: data?.stats.activeSubscribers || "0",
      sub: "Currently active",
    },
    {
      label: "Avg rating",
      value: data?.rating.average + " ★" || "0 ★",
      sub: data?.rating.totalReviews + " reviews"  ,
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-2 space-y-6">
      <Header
        title="Good morning, Meera"
        description="Here's your kitchen summary for today"
      />

      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <StatsGrid
            statsData={statsData}
            className="grid-cols-3! max-md:grid-cols-1"
          />

          <div className="grid grid-cols-2 max-lg:grid-cols-1">
            <ChartBar data={data?.chartData} />
          </div>

          <QuickActions actions={adminActions} />
        </>
      )}
    </div>
  );
}
