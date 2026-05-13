"use client";

import { OrderRow } from "@/components/cook/OrderRow";
import ErrorState from "@/components/shared/ErrorState";
import FilterChips from "@/components/shared/FilterChips";
import Header from "@/components/shared/Header";
import NoInternet from "@/components/shared/NoInternet";
import Pagination from "@/components/shared/Pagination";
import SearchInput from "@/components/shared/SearchInput";
import { Spinner } from "@/components/ui/spinner";
import {
  useCookRequests,
  useAcceptSubscription,
  useRejectSubscription,
  useUpdatePaymentStatus,
} from "@/hooks/cook/useCookRequests";
import { getChips } from "@/utils/getFilterShips";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { useState } from "react";

export default function Orders() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isError, refetch, isFetching, isLoading } = useCookRequests(
    filter,
    search,
    page,
  );

  const [active, setActive] = useState<{
    id: string;
    type: "accept" | "reject";
  } | null>(null);

  const acceptMutation = useAcceptSubscription();
  const rejectMutation = useRejectSubscription();
  const paymentStatusMutation = useUpdatePaymentStatus();

  const isOnline = useNetworkStatus();

  const requests = data?.requests ?? [];
  const chips = getChips(data?.stats, data?.totalRequests).reverse();

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

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-2 space-y-6">
      <Header
        title="Subscription orders"
        description="Manage all your subscriber requests"
      />

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FilterChips
              chips={chips}
              active={filter}
              onChange={(value) => {
                setFilter(value);
                setPage(1);
              }}
            />

            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search requests..."
              className="w-70 max-md:w-full"
            />
          </div>

          <div className="flex flex-col flex-1 space-y-2">
            {requests.length === 0 ? (
              <p className="flex-1 flex items-center justify-center text-sm text-gray-500 text-center py-10">
                No requests found
              </p>
            ) : (
              requests.map((request) => (
                <OrderRow
                  key={request._id}
                  request={request}
                  onAccept={() => {
                    setActive({ id: request._id, type: "accept" });
                    acceptMutation.mutate(request._id, {
                      onSettled: () => setActive(null),
                    });
                  }}
                  onReject={() => {
                    setActive({ id: request._id, type: "reject" });
                    rejectMutation.mutate(request._id, {
                      onSettled: () => setActive(null),
                    });
                  }}
                  loadingState={active}
                  paymentStatusMutation={paymentStatusMutation}
                />
              ))
            )}
          </div>
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
