"use client";

import ErrorState from "@/components/shared/ErrorState";
import Header from "@/components/shared/Header";
import NoInternet from "@/components/shared/NoInternet";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import UserProfileForm from "@/components/user/UserProfileForm";
import { useProfile } from "@/hooks/user/useProfile ";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { useState } from "react";

export default function UserProfile() {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProfile();
  const [open, setOpen] = useState(false);

  const isOnline = useNetworkStatus();

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
    <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
      {/* Header */}

      <Header
        title="My Profile"
        description="Manage your personal details and preferences"
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <section className="rounded-2xl border p-6 max-md:p-3 flex max-md:gap-3 gap-6 items-center">
            <div className="w-14 h-14 max-md:w-10 max-md:h-10 rounded-2xl flex items-center justify-center bg-orange-500 text-white text-xl shrink-0">
              {profile?.name[0].toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="text-lg font-semibold">{profile?.name}</div>
              <div className="text-sm text-gray-500">
                {profile?.email} {profile?.phone}
              </div>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer p-5 text-sm font-semibold"
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

                <UserProfileForm
                  profile={profile}
                  closeSheet={() => setOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </section>

          {/* Personal Information */}
          <section className="rounded-2xl border p-6 max-md:p-3">
            <h2 className="font-serif font-bold text-lg mb-4">
              📄 Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ["Full Name", profile?.name],
                ["Email", profile?.email],
                ["Phone", profile?.phone],
                ["City", profile?.city || "City not added"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl p-4 border">
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
