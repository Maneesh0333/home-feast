"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useMySubscriptions } from "@/hooks/user/useMySubscriptions";
import { useNetworkStatus } from "@/utils/useNetworkStatus";

import Header from "@/components/shared/Header";
import ErrorState from "@/components/shared/ErrorState";
import NoInternet from "@/components/shared/NoInternet";
import SearchInput from "@/components/shared/SearchInput";
import { Spinner } from "@/components/ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ReviewForm from "@/components/user/ReviewForm";

dayjs.extend(relativeTime);

export default function MySubscriptions() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const isOnline = useNetworkStatus();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMySubscriptions(search);

  /* Flatten pages */
  const subscriptions = data?.pages.flatMap((page) => page.subscriptions) ?? [];

  /* Infinite Scroll Observer */
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "200px" }, // preload early
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  if (!isOnline) return <NoInternet />;

  if (isError) {
    return (
      <ErrorState
        message="Failed to load subscriptions"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
      {/* 🔹 Header */}
      <Header
        title="My Subscriptions"
        description="Manage and track all your meal plans"
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by cook..."
          />

          {/* 🔹 List */}
          <section className="rounded-2xl border">
            {subscriptions.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-10">
                No subscriptions found
              </p>
            ) : (
              subscriptions.map((sub, index) => {
                const isLast = index === subscriptions.length - 1;

                const initials = sub.cookUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={sub._id}
                    ref={isLast ? lastItemRef : null}
                    className={`flex flex-col gap-2 p-4 ${
                      index !== 0 ? "border-t" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* LEFT */}
                      <div className="flex gap-3 items-center">
                        <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#EBF3FC] text-[#1A3C6B] font-bold">
                          {initials}
                        </span>

                        <div className="flex flex-col">
                          <span className="font-semibold capitalize">
                            {sub.cookUser.name}
                          </span>

                          <span className="text-xs text-gray-500 capitalize">
                            {sub.planType} plan · {sub.mealTime}
                          </span>

                          <span className="text-[11px] text-gray-400">
                            Started {dayjs(sub.startDate).fromNow()}
                          </span>

                          {/* 💰 Payment (secondary) */}
                          <span
                            className={`text-[11px] font-medium ${
                              sub.paymentStatus === "paid"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {sub.paymentStatus === "paid"
                              ? "✔ Paid"
                              : "⏳ Pending payment"}
                          </span>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex flex-col gap-3 items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold w-fit capitalize ${
                            sub.status === "active"
                              ? "bg-green-100 text-green-700"
                              : sub.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : sub.status === "expired"
                                  ? "bg-gray-200 text-gray-600"
                                  : "bg-red-100 text-red-600"
                          }`}
                        >
                          {sub.status}
                        </span>

                        {sub.status === "expired" && (
                          <>
                            {!sub.isReviewed ? (
                              <Sheet open={open} onOpenChange={setOpen}>
                                <SheetTrigger>
                                  <span className="text-xs text-gray-600 cursor-pointer">
                                    Write a rewiew
                                  </span>
                                </SheetTrigger>

                                <SheetContent className="p-5 overflow-y-auto">
                                  <SheetHeader className="mb-3 p-0!">
                                    <SheetTitle>Write Review</SheetTitle>
                                    <SheetDescription className="text-xs">
                                      Fill the details to write a review
                                    </SheetDescription>
                                  </SheetHeader>
                                  <ReviewForm
                                    subscriptionId={sub._id}
                                    closeSheet={() => setOpen(false)}
                                  />
                                </SheetContent>
                              </Sheet>
                            ) : (
                              <span className="text-xs text-gray-600 cursor-pointer">
                                Reviewed
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* EXTRA */}
                    <div className="pl-12 text-xs text-gray-500">
                      Ends {dayjs(sub.endDate).format("DD MMM YYYY")}
                    </div>
                  </div>
                );
              })
            )}

            {/* Bottom Loader */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
