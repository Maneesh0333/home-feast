"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { SharedButton } from "@/components/shared/SharedButton";
import { FormField } from "@/components/shared/FormField";
import { SelectDropDown } from "@/components/Select";
import { Label } from "@/components/ui/label";

import { useCreatePlan, useUpdatePlan, Plan } from "@/hooks/cook/usePlan";

import { createPlanSchema, updatePlanSchema } from "@/schemas/cook/plan.schema";

type Props = {
  plan?: Plan | null;
  closeSheet: () => void;
};

type FormType = {
  type: "daily" | "weekly" | "monthly";
  price: number;
};

export default function PlanForm({ plan, closeSheet }: Props) {
  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isValid, isDirty, errors, dirtyFields },
  } = useForm<FormType>({
    resolver: yupResolver(plan ? updatePlanSchema : createPlanSchema),
    mode: "onChange",
    values: {
      type: plan?.type || "daily",
      price: plan?.price || 0,
    },
  });

  const onSubmit = (data: FormType) => {
    if (plan) {
      const dataMod = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          Object.keys(dirtyFields).includes(key),
        ),
      );

      updateMutation.mutate(
        { id: plan._id, price: Number(dataMod.price) },
        {
          onSuccess: () => {
            reset();
            closeSheet();
          },
        },
      );
    } else {
      createMutation.mutate(
        {
          type: data.type,
          price: Number(data.price),
        },
        {
          onSuccess: () => {
            reset();
            closeSheet();
          },
        },
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col gap-5 justify-between"
    >
      {/* TYPE */}
      <div className="flex flex-col gap-5">
        {!plan && (
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label className="mb-1">Plan Type</Label>
                <SelectDropDown
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "Daily Plan", value: "daily" },
                    { label: "Weekly Plan", value: "weekly" },
                    { label: "Monthly Plan", value: "monthly" },
                  ]}
                  className="w-full"
                />
                {fieldState.error && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        )}

        {/* PRICE */}
        <FormField
          id="price"
          label="Price"
          type="number"
          register={register("price")}
          placeholder="Enter price"
          error={errors.price?.message}
        />
      </div>

      {/* BUTTON */}
      <SharedButton
        type="submit"
        disabled={
          !isValid ||
          !isDirty ||
          (plan ? updateMutation.isPending : createMutation.isPending)
        }
        loading={plan ? updateMutation.isPending : createMutation.isPending}
      >
        {plan ? "Update Plan" : "Create Plan"}
      </SharedButton>
    </form>
  );
}
