"use client";

import Header from "@/components/shared/Header";
import { Spinner } from "@/components/ui/spinner";
import ErrorState from "@/components/shared/ErrorState";

import NoInternet from "@/components/shared/NoInternet";

import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { MenuManager } from "@/components/cook/Menu";
import { useTodayMenu } from "@/hooks/cook/useTodayMenu";
import Pagination from "@/components/shared/Pagination";
import { useState } from "react";

export default function TodayMenu() {
  const [page, setPage] = useState(1);
  const isOnline = useNetworkStatus();
  const { data, isLoading, isError, isFetching, refetch } = useTodayMenu(page);

  const menu = data?.menu || [];
  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load today menu"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-2 space-y-6">
      <Header title="Today's Menu" description="Today menu items" />
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <MenuManager menu={menu} />
        </>
      )}
      <Pagination
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
