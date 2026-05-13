"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SharedButton } from "@/components/shared/SharedButton";
import { FormField } from "@/components/shared/FormField";

import { CookProfile, useUpdateProfile } from "@/hooks/cook/useProfile";
import { updateCookProfileSchema } from "@/schemas/cook/profile.schema";
import SelectInput from "../shared/SelectInput";
import { minutesToTime } from "@/utils/minutesToTime";
import dynamic from "next/dynamic";
import { useCategories } from "@/hooks/shared/useCategory";
import { Button } from "../ui/button";
import { getMyLocation } from "@/utils/getMyLocation";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { UpdateCookProfileSchemaType } from "@/types/cook/types";

const LeafletMaps = dynamic(() => import("./LeafletMaps"), {
  ssr: false,

  loading: () => (
    <div className="h-40 animate-pulse rounded-xl border bg-muted flex items-center justify-center">
      Loading map...
    </div>
  ),
});

type Props = {
  profile: CookProfile | undefined;
  onClose: () => void;
};

export default function EditProfileForm({ profile, onClose }: Props) {
  const updateMutation = useUpdateProfile();
  const { data, isLoading } = useCategories();
  const category = data || [];
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isDirty, isValid, dirtyFields, errors },
  } = useForm({
    resolver: yupResolver(updateCookProfileSchema),
    mode: "onChange",
    values: {
      name: profile?.user?.name || "",
      email: profile?.user?.email || "",
      phone: profile?.user?.phone || "",
      city: profile?.user?.city || "",
      location: profile?.location?.coordinates || [78.9629, 20.5937],
      category: profile?.category?._id || "",
      kitchenName: profile?.kitchenName || "",
      bio: profile?.bio || "",
      experienceYears: profile?.experienceYears || 0,
      payment: profile?.payment || [],
      mealType: profile?.mealType || "Both",
      lunchDeliveryTime: {
        start: minutesToTime(profile?.lunchDeliveryTime?.start),
        end: minutesToTime(profile?.lunchDeliveryTime?.end),
      },

      dinnerDeliveryTime: {
        start: minutesToTime(profile?.dinnerDeliveryTime?.start),
        end: minutesToTime(profile?.dinnerDeliveryTime?.end),
      },
    },
  });

  const location = useWatch({
    control: control,
    name: "location",
  });

  const onSubmit = (data: UpdateCookProfileSchemaType) => {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        Object.keys(dirtyFields).includes(key),
      ),
    );

    updateMutation.mutate(filtered, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      const location = await getMyLocation();

      setValue("location", location, {
        shouldDirty: true,
      });

      toast.success("Location fetched");
    } catch {
      toast.error("Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 justify-between"
    >
      <div className="flex flex-col gap-5">
        <FormField
          id="name"
          label="Name"
          register={register("name")}
          error={errors.name?.message}
          placeholder="Enter Name"
        />

        <FormField
          id="email"
          label="Email"
          register={register("email")}
          error={errors.email?.message}
          placeholder="Enter Email"
        />

        <FormField
          id="phone"
          label="Phone"
          register={register("phone")}
          error={errors.phone?.message}
          placeholder="Enter Phone no."
        />

        <FormField
          id="city"
          label="City"
          register={register("city")}
          error={errors.city?.message}
          placeholder="Enter City"
        />

        {/* Map */}
        <div>
          <Label className="mb-1">Location</Label>
          <div className="h-40 w-full rounded-xl overflow-hidden">
            <LeafletMaps
              location={[location?.[1], location?.[0]] as [number, number]}
              onChange={(newLocation) => {
                setValue("location", [newLocation[1], newLocation[0]], {
                  shouldDirty: true,
                });
              }}
            />
          </div>
          <Button
            type="button"
            onClick={handleClick}
            className="mt-2 w-full cursor-pointer"
          >
            {loading ? <Spinner className="h-4 w-4" /> : "Get my location"}
          </Button>
        </div>

        <FormField
          id="kitchenName"
          label="Kitchen Name"
          placeholder="Enter Kitchen Name"
          register={register("kitchenName")}
          error={errors.kitchenName?.message}
        />

        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Category"
              value={field.value ?? ""}
              onChange={field.onChange}
              options={category?.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
              error={fieldState.error?.message}
              isLoading={isLoading}
            />
          )}
        />

        <Controller
          name="mealType"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Meal Type"
              value={field.value ?? ""}
              onChange={field.onChange}
              options={[
                { label: "Veg", value: "Veg" },
                { label: "Non-Veg", value: "Non-Veg" },
                { label: "Both", value: "Both" },
              ]}
              error={fieldState.error?.message}
            />
          )}
        />

        <div>
          <Label>Bio</Label>
          <Textarea
            placeholder="Enter a bio"
            {...register("bio")}
            className="ring-0! mt-1 resize-none"
          />
          {errors.bio && (
            <p className="text-xs text-red-500">{errors.bio.message}</p>
          )}
        </div>

        <FormField
          id="experienceYears"
          label="Experience"
          type="number"
          register={register("experienceYears")}
          placeholder="Enter Experience Years"
          error={errors.experienceYears?.message}
        />

        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState }) => (
            <SelectInput
              label="Payment Methods"
              value={(field.value ?? []).filter((v): v is string => Boolean(v))}
              onChange={field.onChange}
              options={[
                { label: "Cash", value: "Cash" },
                { label: "UPI", value: "UPI" },
              ]}
              error={fieldState.error?.message}
              multiple
            />
          )}
        />

        <div>
          <Label>Lunch Start</Label>
          <input
            type="time"
            {...register("lunchDeliveryTime.start")}
            className="w-full border p-2 rounded-lg mt-1"
          />
          {errors.lunchDeliveryTime?.start && (
            <p className="text-xs text-red-500">
              {errors.lunchDeliveryTime?.start.message}
            </p>
          )}
        </div>

        <div>
          <Label>Lunch End</Label>
          <input
            type="time"
            {...register("lunchDeliveryTime.end")}
            className="w-full border p-2 rounded-lg mt-1"
          />
          {errors.lunchDeliveryTime?.end && (
            <p className="text-xs text-red-500">
              {errors.lunchDeliveryTime?.end.message}
            </p>
          )}
        </div>

        {/* DINNER */}
        <div>
          <Label>Dinner Start</Label>
          <input
            type="time"
            {...register("dinnerDeliveryTime.start")}
            className="w-full border p-2 rounded-lg mt-1"
          />
          {errors.dinnerDeliveryTime?.start && (
            <p className="text-xs text-red-500">
              {errors.dinnerDeliveryTime?.start.message}
            </p>
          )}
        </div>

        <div>
          <Label>Dinner End</Label>
          <input
            type="time"
            {...register("dinnerDeliveryTime.end")}
            className="w-full border p-2 rounded-lg mt-1"
          />
          {errors.dinnerDeliveryTime?.end && (
            <p className="text-xs text-red-500">
              {errors.dinnerDeliveryTime?.end.message}
            </p>
          )}
        </div>
      </div>

      <SharedButton
        type="submit"
        disabled={!isDirty || !isValid || updateMutation.isPending}
        loading={updateMutation.isPending}
      >
        Update Profile
      </SharedButton>
    </form>
  );
}
