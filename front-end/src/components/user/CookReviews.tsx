import React from "react";
import ErrorState from "../shared/ErrorState";
import NoInternet from "../shared/NoInternet";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthStore } from "@/stores/authStore";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { useInfiniteReviews } from "@/hooks/cook/useReviews";
import Header from "../shared/Header";
import { Spinner } from "../ui/spinner";
import RatingSummary from "../shared/RatingSummary";
import CustomerReviews from "../cook/CustomerReviews";

dayjs.extend(relativeTime);

export type ReviewUI = {
  name: string;
  rating: number;
  date: string;
  text: string;
};

type Props = {
  cookId: string;
};

function CookReviews({ cookId }: Props) {
  const isOnline = useNetworkStatus();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useInfiniteReviews(cookId);

  // 🔹 Flatten all pages
  const allReviews = data?.pages.flatMap((page) => page.reviews) ?? [];

  // 🔹 Backend stats (no frontend calculation needed now ✅)
  const average = data?.pages[0]?.average ?? 0;
  const total = data?.pages[0]?.total ?? 0;
  const breakdown = data?.pages[0]?.breakdown ?? {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  // 🔹 Map API → UI format
  const reviews: ReviewUI[] = allReviews.map((r) => ({
    name: r.customer.name,
    rating: r.rating,
    date: dayjs(r.createdAt).fromNow(),
    text: r.comment,
  }));

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load reviews"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }
  return (
    <div className="flex-1 flex flex-col mt-10 space-y-6">
      <Header
        title="Reviews"
        description=""
      />

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <RatingSummary
            average={average}
            total={total}
            breakdown={breakdown}
          />

          <CustomerReviews reviews={reviews} />

          {/* Load more */}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full rounded-xl border py-3 text-sm font-medium transition-all duration-200"
            >
              {isFetchingNextPage
                ? "Loading..."
                : `Load More Reviews (${Math.max(total - reviews.length, 0)} more)`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default CookReviews;
