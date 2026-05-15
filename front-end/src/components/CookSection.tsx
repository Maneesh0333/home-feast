"use client";

import { useState } from "react";
import Link from "next/link";

import SearchBar from "./SearchBar";
import { Card, CardContent } from "./ui/card";

import { useSearchCookProfiles } from "@/hooks/user/useSearchCookProfiles";
import ErrorState from "@/components/shared/ErrorState";
import NoInternet from "@/components/shared/NoInternet";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { Spinner } from "@/components/ui/spinner";
import { MealType, PlanType } from "@/types/user/types";

type Props = {
  scrollRef: React.RefObject<HTMLElement | null>;
};

export default function CookSection({ scrollRef }: Props) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<MealType>("Both");
  const [cuisine, setCuisine] = useState("All");
  const [plan, setPlan] = useState<PlanType>("All");
  const [location, setLocation] = useState<[number, number]>([0, 0]);

  const isOnline = useNetworkStatus();

  const { data, isLoading, isError, isFetching, refetch } =
    useSearchCookProfiles({
      search,
      type: type,
      cuisine: cuisine,
      planType: plan,
      lat: location?.[1],
      lng: location?.[0],
    });

  const cooks = data?.data || [];

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load cooks"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <section id="search" ref={scrollRef} className="flex flex-col gap-6 px-16 max-md:px-6 py-10">
      {/* 🔍 SEARCH */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        type={type}
        setType={(val) => {
          setType(val);
        }}
        plan={plan}
        setPlan={setPlan}
        cuisine={cuisine}
        setCuisine={setCuisine}
        setLocation={setLocation}
      />

      {/* 🔹 HEADER */}
      <div className="mt-5">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-serif font-bold text-blue-900">
            Home cooks
          </h2>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="flex-1 min-h-60  flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : cooks.length === 0 ? (
          <div className="text-center text-gray-500 py-28">No cooks found</div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {cooks.map((cook) => (
              <Link href={`/cook-profile/${cook.user._id}`} key={cook._id}>
                <Card className="p-0 rounded-2xl transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  {/* IMAGE */}
                  <div className="h-36 flex items-center justify-center text-4xl relative bg-gradient-to-br from-orange-100 to-orange-200">
                    👩‍🍳
                    <div className="absolute top-2 right-2 bg-white text-green-600 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                      ✓ Verified
                    </div>
                  </div>

                  {/* BODY */}
                  <CardContent className="p-4">
                    <div className="font-semibold">
                      {cook.kitchenName || "Kitchen Name not added"}
                    </div>

                    <div className="text-xs text-gray-500">
                      {cook &&
                        cook?.user?.name[0]?.toUpperCase() +
                          cook?.user?.name?.slice(1)}{" "}
                      · {cook.user?.city || "City not Added"}
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-1 rounded flex items-center gap-1 ${
                          cook.mealType === "Veg"
                            ? "bg-green-100 text-green-700"
                            : cook.mealType === "Non-Veg"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {cook.mealType === "Veg"
                          ? "🟢 Veg"
                          : cook.mealType === "Non-Veg"
                            ? "🔴 Non-Veg"
                            : "🟡 Both"}
                      </span>

                      <span className="text-xs font-medium flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        {cook.rating?.average?.toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-gray-500">
                      From{" "}
                      <span className="text-orange-500 font-bold">
                        ₹{cook.cheapestPlan.price || 0}/
                        {cook.cheapestPlan.type || "meal"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
