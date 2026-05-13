"use client";

import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectDropDown } from "../Select";
import { DatePickerInput } from "../DatePicker";

import { CookProfileDetail, Plan } from "@/hooks/user/useGetCookProfileById";
import { subscriptionSchema } from "@/schemas/user/subscription.schema";
import { useAuthStore } from "@/stores/authStore";
import { useCreateSubscription } from "@/hooks/user/useCreateSubscription ";
import { subscriptionSchemaType } from "@/types/user/types";
import { SharedButton } from "../shared/SharedButton";
import { useState } from "react";

type Props = {
  cook: CookProfileDetail | undefined;
  selectedPlan: "weekly" | "daily" | "monthly";
  plans: Plan[] | undefined;
};

export function SubscriptionModal({ cook, selectedPlan, plans }: Props) {
  const plan = plans?.find((p) => p.type === selectedPlan);
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCreateSubscription();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<subscriptionSchemaType>({
    resolver: yupResolver(subscriptionSchema),
    mode: "onChange",
    defaultValues: {
      mealTime: "lunch",
      startDate: new Date(),
    },
  });

  const mealTime = useWatch({
    control: control,
    name: "mealTime",
  });

  const startDate = useWatch({
    control: control,
    name: "startDate",
  });

  const onSubmit = (formData: subscriptionSchemaType) => {
    mutate(
      {
        cookId: cook!._id,
        planType: selectedPlan,
        mealTime: formData.mealTime,
        startDate: formData.startDate,
        deliveryAddress: formData.deliveryAddress,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            setOpen(false);
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          disabled={!user}
          size="xllite"
          className={`${!user ? "cursor-not-allowed!" : "cursor-pointer"} w-full font-semibold bg-orange-500 text-white`}
        >
          {user ? "Subscribe" : "Login first"}
        </Button>
      </DialogTrigger>

      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Confirm subscription
          </DialogTitle>

          <DialogDescription>
            {selectedPlan[0]?.toUpperCase() + selectedPlan?.slice(1)} plan · ₹
            {plan?.price ?? 0}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Address */}
          <div>
            <Label>Delivery address</Label>
            <Input
              placeholder="House no, street, locality"
              {...register("deliveryAddress")}
              className="mt-1"
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-xs mt-1">
                {errors?.deliveryAddress?.message}
              </p>
            )}
          </div>

          {/* Meal time */}
          <div>
            <Label>Meal timing</Label>

            <SelectDropDown
              options={[
                {
                  label: `Lunch (${cook?.lunchDeliveryTime?.display})`,
                  value: "lunch",
                },
                {
                  label: `Dinner (${cook?.dinnerDeliveryTime?.display})`,
                  value: "dinner",
                },
                {
                  label: "Both",
                  value: "both",
                },
              ]}
              value={mealTime}
              onChange={(val) =>
                setValue("mealTime", val as "lunch" | "dinner" | "both")
              }
              className="w-full mt-1"
            />

            {errors.mealTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mealTime.message}
              </p>
            )}
          </div>

          {/* Date */}
          <DatePickerInput
            value={startDate}
            onChange={(date) => setValue("startDate", date)}
            error={errors.startDate?.message}
          />

          {/* Info */}
          <div className="bg-orange-100 p-3 rounded text-black/80">
            Your subscription will be confirmed within 2 hours.
          </div>

          <SharedButton type="submit" loading={isPending} disabled={!isValid}>
            Confirm subscription
          </SharedButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
