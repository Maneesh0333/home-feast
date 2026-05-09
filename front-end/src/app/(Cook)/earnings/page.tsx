"use client";

import Header from "@/components/shared/Header";
import StatsGrid from "@/components/shared/StatsGrid";
import EarningHistory from "@/components/cook/EarningHistory";
import ErrorState from "@/components/shared/ErrorState";
import NoInternet from "@/components/shared/NoInternet";
import { Spinner } from "@/components/ui/spinner";

import { useCookEarnings } from "@/hooks/cook/useCookEarnings";
import { useNetworkStatus } from "@/utils/useNetworkStatus";

export default function Earnings() {
  const isOnline = useNetworkStatus();

  const { data, isLoading, isError, isFetching, refetch } = useCookEarnings();

  if (!isOnline) return <NoInternet />;

  if (isError) {
    return (
      <ErrorState
        message="Failed to load earnings"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  const statsData = [
    {
      label: "This month's earnings",
      value: `₹${data?.stats.monthlyEarnings ?? "0"}`,
      sub: "",
    },
    {
      label: "Weekly plans revenue",
      value: `₹${data?.stats.weeklyRevenue ?? "0"}`,
      sub: "",
    },
    {
      label: "Monthly plans revenue",
      value: `₹${data?.stats.monthlyRevenue ?? "0"}`,
      sub: "",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-2 space-y-6">
      <Header title="Earnings" description="Track your income and payouts" />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <StatsGrid
            statsData={statsData}
            className="grid-cols-3! max-md:grid-cols-1!"
          />

          <EarningHistory history={data?.history} />
        </div>
      )}
    </div>
  );
}
