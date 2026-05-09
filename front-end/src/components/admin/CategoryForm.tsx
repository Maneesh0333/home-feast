import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { useEffect } from "react";
import { FormField } from "../shared/FormField";
import {
  Category,
  useCreateCategories,
  useUpdateCategories,
} from "@/hooks/admin/useCategories";
import { SharedButton } from "../shared/SharedButton";
import { SelectDropDown } from "../Select";
import { Label } from "../ui/label";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/schemas/admin/category.schema";
import { FormType } from "@/types/admin/types";

type Props = {
  category?: Category | null;
  closeSheet: () => void;
};

export default function CategoryForm({ category, closeSheet }: Props) {
  const createMutation = useCreateCategories();
  const updateMudation = useUpdateCategories();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isValid, isDirty, dirtyFields, errors },
  } = useForm({
    resolver: yupResolver(
      category ? updateCategorySchema : createCategorySchema,
    ),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || "",
        description: category.description || "",
        status: category.status || "Active",
      });
    } else {
      reset({
        name: "",
        description: "",
        status: "Active",
      });
    }
  }, [category, reset]);

  const onSubmit = (data: FormType) => {
    if (category) {
      const dataMod = Object.fromEntries(
        Object.entries(data).filter(([key]) =>
          Object.keys(dirtyFields).includes(key),
        ),
      );

      updateMudation.mutate(
        { dataMod, categoryId: category._id },
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
      className="flex flex-col h-full justify-between"
    >
      <div className="flex flex-col gap-5">
        <FormField
          id="name"
          label="Category Name"
          register={register("name")}
          placeholder="Enter category name"
          error={errors.name?.message}
        />

        <FormField
          id="description"
          label="Description"
          register={register("description")}
          placeholder="Enter a description"
          error={errors.description?.message}
        />

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
                className="w-full text-sm"
              />
              {fieldState.error && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldState.error?.message}
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
          (category ? updateMudation.isPending : createMutation.isPending)
        }
        loading={category ? updateMudation.isPending : createMutation.isPending}
      >
        {category ? "Update Category" : "Save Category"}
      </SharedButton>
    </form>
  );
}
