"use client";

import Header from "@/components/shared/Header";
import StatsGrid from "@/components/shared/StatsGrid";
import QuickActions from "@/components/shared/QuickActions";
import { useAdminOverview } from "@/hooks/admin/useAdminOverview";
import { Spinner } from "@/components/ui/spinner";
import ErrorState from "@/components/shared/ErrorState";
import NoInternet from "@/components/shared/NoInternet";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { QuickAction } from "@/app/types/(Cook)/overview";
import dynamic from "next/dynamic";

const ChartBar = dynamic(
  () => import("@/components/shared/BarChart"),
  {
    ssr: false,

    loading: () => (
      <div className="h-[400px] rounded-xl border bg-muted animate-pulse flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading chart...
        </p>
      </div>
    ),
  },
);



const adminActions: QuickAction[] = [
  {
    icon: "👨‍🍳",
    title: "Approve Cooks",
    description: "Review and verify new cook applications",
    path: "/admin/approvals",
  },
  {
    icon: "👥",
    title: "Manage Users",
    description: "View or suspend user accounts",
    path: "/admin/users",
  },
  {
    icon: "🍳", 
    title: "Manage Cooks",
    description: "View or suspend cooks accounts",
    path: "/admin/cooks",
  },
  {
    icon: "🏷️",
    title: "Categories",
    description: "Add or organize categories",
    path: "/admin/categories",
  },
];


export default function Overview() {
  const isOnline = useNetworkStatus();

  const { data, isLoading, isError, refetch, isFetching } = useAdminOverview();

  if (!isOnline) return <NoInternet />;

  if (isError) {
    return (
      <ErrorState
        message="Failed to load dashboard"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  const statsData = [
    {
      label: "Registered users",
      value: data?.stats.totalUsers || 0,
      sub: "",
    },
    {
      label: "Active subscribers",
      value: data?.stats.activeSubscribers || 0,
      sub: "",
    },
    {
      label: "Verified cooks",
      value: data?.stats.verifiedCooks || 0,
      sub: "",
    },
    {
      label: "Platform revenue",
      value: `₹${data?.stats.revenue || 0}`,
      sub: "",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-2 space-y-6">
      {/* 🔹 Header */}
      <Header
        title="Good morning, Admin"
        description="Here’s your platform summary"
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {/* 🔹 Stats */}
          <section>
            <StatsGrid statsData={statsData} />
          </section>

          {/* 🔹 Chart */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1">
            <ChartBar data={data?.chartData || []} />
          </div>

          {/* 🔹 Quick Actions */}
          <section>
            <QuickActions actions={adminActions} />
          </section>
        </>
      )}
    </div>
  );
}
