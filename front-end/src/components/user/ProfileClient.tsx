"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionModal } from "@/components/modal/SubscriptionModal";
import { useGetCookProfileById } from "@/hooks/user/useGetCookProfileById";
import { Spinner } from "../ui/spinner";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import NoInternet from "../shared/NoInternet";
import ErrorState from "../shared/ErrorState";
import CookReviews from "./CookReviews";

export default function ProfileClient({ id }: { id: string }) {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetCookProfileById(id);

  const cook = data?.cook;
  const plans = data?.plan;
  const menu = data?.menu;
  const subscribers = data?.subscribers;

  const [selectedPlan, setSelectedPlan] = useState<
    "weekly" | "daily" | "monthly"
  >("weekly");
  const isOnline = useNetworkStatus();

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load cook profile"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col px-6 md:px-10 py-12 md:py-16">
      {/* Back */}
      <Link
        href="/"
        className="text-sm bg-transparent text-gray-500 hover:text-orange-500 cursor-pointer"
      >
        ← Back to browse
      </Link>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {/* TOP SECTION */}
          <div className="grid md:grid-cols-2 gap-10 mt-8">
            {/* LEFT */}
            <Card className="px-3 pt-6">
              <CardHeader className="flex flex-row items-start gap-4 pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  👩‍🍳
                </div>

                <div className="flex-1 space-y-1">
                  <h2 className="text-xl font-semibold text-blue-900">
                    {cook?.kitchenName || "Kitchen Name not added"}
                  </h2>

                  <p className="text-sm text-gray-500 mt-0.5">
                    {cook &&
                      cook?.user?.name[0]?.toUpperCase() +
                        cook?.user?.name?.slice(1)}{" "}
                    ·📍{cook?.user?.city || "City not Added"}
                    km
                  </p>

                  <span className="inline-block mt-1 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">
                    {cook?.verificationStatus === "Approved" &&
                      "✓ Verified cook"}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-relaxed mb-6">
                  {cook?.bio || "Bio not added"}
                </p>

                <div className="flex items-center justify-center gap-12">
                  <div>
                    <div className="text-2xl text-center font-bold text-blue-900">
                      {cook?.rating?.average?.toFixed(1) || 0.0}
                    </div>
                    <div className="text-xs text-gray-500">Avg rating</div>
                  </div>
                  <div>
                    <div className="text-2xl text-center font-bold text-blue-900">
                      {subscribers || 0}
                    </div>
                    <div className="text-xs text-gray-500">Subscribers</div>
                  </div>
                  <div>
                    <div className="text-2xl text-center font-bold text-blue-900">
                      {cook?.experienceYears || 0} yrs
                    </div>
                    <div className="text-xs text-gray-500">Experience</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RIGHT - PLAN CARD */}
            <Card className="px-3 pt-6">
              {/* Header */}
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">
                  Choose your plan
                </CardTitle>
              </CardHeader>

              {/* Content */}
              <CardContent>
                <div className="space-y-3">
                  {plans?.map((plan) => (
                    <div
                      key={plan?._id}
                      onClick={() => setSelectedPlan(plan?.type)}
                      className={`border rounded-xl p-4 cursor-pointer transition ${
                        selectedPlan === plan?.type
                          ? "ring-1 ring-orange-400"
                          : "hover:border-orange-400"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        {/* Left */}
                        <div>
                          <div className="font-semibold">
                            {plan?.type[0].toUpperCase() + plan?.type.slice(1)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {plan?.type === "daily"
                              ? "Perfect for testing out our meals"
                              : plan?.type === "weekly"
                                ? "Great for busy weekdays"
                                : "Our most popular and cost-effective plan"}
                          </div>
                        </div>

                        {/* Right */}
                        <div className="text-right">
                          <div className="text-xl font-semibold text-blue-900">
                            {plan?.price}
                          </div>
                          <div className="text-xs text-gray-500">
                            {plan?.type === "daily"
                              ? "/meal"
                              : plan?.type === "weekly"
                                ? "/week"
                                : "/month"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Footer */}
              <CardFooter className="border-0 bg-transparent">
                <SubscriptionModal
                  plans={plans}
                  selectedPlan={selectedPlan}
                  cook={cook}
                />
              </CardFooter>
            </Card>
          </div>

          {/* MENU */}
          <div className="mt-10">
            <h3 className="font-semibold text-2xl mb-4">Today's menu</h3>

            {menu && menu?.length > 0 ? (
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
                {menu?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🍗</div>
                      <div>
                        <div className="font-semibold text-base">
                          {item?.name[0].toUpperCase() + item?.name.slice(1)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item?.type} · ~{item?.calories} kcal
                        </div>
                      </div>
                    </div>

                    <div className="text-orange-500 font-semibold">
                      ₹{item?.price}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-50 w-full border rounded-2xl text-sm items-center justify-center">
                No today's menu yet
              </div>
            )}
          </div>

          <CookReviews cookId={id} />
        </>
      )}
    </div>
  );
}
