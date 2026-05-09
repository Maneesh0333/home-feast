"use client";

import { useState } from "react";

import EditProfileForm from "@/components/cook/EditProfileForm";
import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { useProfile } from "@/hooks/cook/useProfile";
import NoInternet from "@/components/shared/NoInternet";
import ErrorState from "@/components/shared/ErrorState";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { Spinner } from "@/components/ui/spinner";

export default function Profile() {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProfile();

  const isOnline = useNetworkStatus();
  const [open, setOpen] = useState(false);

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load profile"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-2 space-y-6">
      <Header title="Profile" description="Manage your profile" />

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">Kitchen profile</CardTitle>
            </CardHeader>

            <CardContent>
              {/* Top section */}
              <div className="flex items-center gap-4 pb-5 border-b">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl">
                  👩‍🍳
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold">{profile?.user?.name}</p>

                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 cursor-pointer text-xs"
                        onClick={() => setOpen(true)}
                      >
                        Edit profile
                      </Button>
                    </SheetTrigger>

                    <SheetContent className="p-5 overflow-y-auto">
                      <SheetHeader className="p-0! mb-3">
                        <SheetTitle>Edit Profile</SheetTitle>
                        <SheetDescription className="text-xs">
                          Fill the details to edit
                        </SheetDescription>
                      </SheetHeader>

                      <EditProfileForm
                        profile={profile}
                        onClose={() => setOpen(false)}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Profile fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Kitchen name</Label>
                  <Input
                    readOnly
                    value={profile?.kitchenName || "Not added"}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Your full name
                  </Label>
                  <Input readOnly value={profile?.user?.name || ""} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Phone number</Label>
                  <Input readOnly value={profile?.user?.phone || ""} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">City</Label>
                  <Input
                    readOnly
                    value={profile?.user?.city || "City not added"}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold">
                    Bio / description
                  </Label>
                  <Textarea
                    readOnly
                    className="resize-none"
                    value={profile?.bio || "Bio not added"}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Experience (years)
                  </Label>
                  <Input
                    readOnly
                    type="number"
                    value={profile?.experienceYears || 0}
                  />
                </div>

                {/* ✅ Category (safe for array) */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Cuisine specialty
                  </Label>
                  <Input
                    readOnly
                    value={
                      profile?.category?.name || "Category not added"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Lunch delivery time
                  </Label>
                  <Input
                    readOnly
                    value={
                      profile?.lunchDeliveryTime?.display ||
                      "Lunch delivery time not added"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Dinner delivery time
                  </Label>
                  <Input
                    readOnly
                    value={
                      profile?.dinnerDeliveryTime?.display ||
                      "Dinner delivery time not added"
                    }
                  />
                </div>

                {/* Payment FIX */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Payment</Label>
                  <Input
                    readOnly
                    value={
                      profile?.payment?.length
                        ? profile.payment.join(", ")
                        : "Payment not added"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">MealType</Label>
                  <Input
                    readOnly
                    value={
                      profile?.mealType?.length
                        ? profile.mealType
                        : "meal type not added"
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
