"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "../shared/FormField";
import { SharedButton } from "../shared/SharedButton";
import { SelectDropDown } from "../Select";
import { Label } from "../ui/label";

import {
  useCreateMenu,
  useUpdateMenu,
  MenuItem,
  useMenuType,
} from "@/hooks/cook/useMenu";
import { createMenuSchema, updateMenuSchema } from "@/schemas/cook/menu.schema";
import { FormType } from "@/types/cook/types";
import { useAuthStore } from "@/stores/authStore";

type Props = {
  menu?: MenuItem | null;
  closeSheet: () => void;
};

export default function MenuForm({ menu, closeSheet }: Props) {
  const createMutation = useCreateMenu();
  const updateMutation = useUpdateMenu();
  const id = useAuthStore((state) => state.user?.id);
  const { data: menutype, isLoading } = useMenuType(id);

  console.log(menutype);
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isValid, isDirty, dirtyFields, errors },
  } = useForm({
    resolver: yupResolver(menu ? updateMenuSchema : createMenuSchema),
    mode: "onChange",
    values: {
      name: menu?.name || "",
      price: menu?.price || 0,
      type: menu?.type || "Veg",
      status: menu?.status || "Active",
      calories: menu?.calories || 0,
      description: menu?.description || "",
      time: menu?.time || "Lunch",
    },
  });

  const onSubmit = (data: FormType) => {
    if (menu) {
      const dataMod = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          Object.keys(dirtyFields).includes(key),
        ),
      );

      updateMutation.mutate(
        { id: menu._id, dataMod },
        {
          onSuccess: () => {
            reset();
            closeSheet();
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 justify-between"
    >
      <div className="flex flex-col gap-5">
        {/* NAME */}
        <FormField
          id="name"
          label="Dish Name"
          register={register("name")}
          placeholder="Enter dish name"
          error={errors.name?.message}
        />

        {/* PRICE */}
        <FormField
          id="price"
          label="Price"
          type="number"
          register={register("price")}
          placeholder="Enter price"
          error={errors.price?.message}
        />

        <FormField
          id="calories"
          label="Calories"
          type="number"
          register={register("calories")}
          placeholder="Enter Calories"
          error={errors.calories?.message}
        />

        <FormField
          id="description"
          label="Description"
          register={register("description")}
          placeholder="Enter a small description"
          error={errors.description?.message}
        />

        {/* TYPE */}
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label className="mb-1">Meal Type</Label>
              <SelectDropDown
                value={field.value}
                onChange={field.onChange}
                loading={isLoading}
                options={[
                  { label: "Veg", value: "Veg" },
                  { label: "Non-Veg", value: "Non-Veg" },
                ].filter(
                  (item) =>
                    item.label === menutype?.mealType ||
                    menutype?.mealType === "Both",
                )}
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

        {/* STATUS */}
        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label className="mb-1">Status</Label>
              <SelectDropDown
                value={field.value}
                onChange={field.onChange}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
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

        <Controller
          name="time"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label className="mb-1">Meal Time</Label>
              <SelectDropDown
                value={field.value}
                onChange={field.onChange}
                options={[
                  { label: "Lunch", value: "Lunch" },
                  { label: "Dinner", value: "Dinner" },
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
      </div>

      <SharedButton
        type="submit"
        disabled={
          !isValid ||
          !isDirty ||
          (menu ? updateMutation.isPending : createMutation.isPending)
        }
        loading={menu ? updateMutation.isPending : createMutation.isPending}
      >
        {menu ? "Update Menu" : "Save Menu"}
      </SharedButton>
    </form>
  );
}
