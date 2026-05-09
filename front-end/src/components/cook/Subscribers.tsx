"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import SearchInput from "../shared/SearchInput";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCookSubscribersInfinite } from "@/hooks/cook/useSubscribers";
import NoInternet from "../shared/NoInternet";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import ErrorState from "../shared/ErrorState";

dayjs.extend(relativeTime);

function Subscribers() {
  const [search, setSearch] = useState("");
  const isOnline = useNetworkStatus();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useCookSubscribersInfinite(search);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Flatten paginated data
  const subscribers =
    data?.pages.flatMap((page) => page.subscribers) ?? [];

  // 🔥 Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 } // loads a bit earlier (better UX)
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (!isOnline) return <NoInternet />;

  if (isError) {
    return (
      <ErrorState
        message="Failed to load subscribers"
        onRetry={refetch}
        isLoading={isFetchingNextPage}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="text-lg font-semibold">
          All subscribers
        </CardTitle>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search subscribers..."
        />
      </CardHeader>

      <CardContent className="space-y-3">
        {subscribers.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-10">
            No subscribers found
          </p>
        ) : (
          subscribers.map((sub) => {
            const initials = sub.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div key={sub._id} className="flex flex-col gap-2 border-t py-3">
                <div className="flex items-center justify-between">
                  {/* LEFT */}
                  <div className="flex gap-3 items-center">
                    <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-[#EBE3D5] font-bold text-[#4A3C2A]">
                      {initials}
                    </span>

                    <div className="flex flex-col">
                      <span className="font-semibold capitalize">
                        {sub.user.name}
                      </span>

                      <span className="text-xs text-gray-500 capitalize">
                        {sub.planType} plan · {sub.mealTime}
                      </span>

                      <span className="text-[11px] text-gray-400">
                        Joined {dayjs(sub.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <span
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold capitalize ${
                      sub.paymentStatus === "paid"
                        ? "text-[#2D6A2D] bg-[#D0EDD0]"
                        : "text-[#8B6914] bg-[#FEF5E0]"
                    }`}
                  >
                    {sub.paymentStatus}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* 🔥 Scroll trigger */}
        <div ref={loadMoreRef} className="flex justify-center">
          {isFetchingNextPage && <Spinner />}
          {!hasNextPage && subscribers.length > 0 && (
            <span className="text-xs text-gray-400">
              No more subscribers
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Subscribers;