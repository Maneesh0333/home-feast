import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { FormField } from "../shared/FormField";
import { SharedButton } from "../shared/SharedButton";
import { Profile, useUpdateProfile } from "@/hooks/user/useProfile ";
import { UserProfileFormValues } from "@/types/user/types";
import { userProfileSchema } from "@/schemas/user/userProfile.schema";

type Props = {
  profile: Profile | undefined;
  closeSheet: () => void;
};

export default function UserProfileForm({ profile, closeSheet }: Props) {
  const updateMutation = useUpdateProfile();

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<UserProfileFormValues>({
    resolver: yupResolver(userProfileSchema),
    mode: "onChange",
  });

  watch();

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        city: profile.city ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: UserProfileFormValues) => {
    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        Object.keys(dirtyFields).includes(key),
      ),
    );

    updateMutation.mutate(updatedData, {
      onSuccess: () => {
        closeSheet();
        reset();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col h-full justify-between"
    >
      <div
        className="flex flex-col gap-3 pb-6 overflow-y-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <FormField
          id="name"
          label="Name"
          register={register("name")}
          placeholder="Enter name"
          error={errors.name?.message}
        />

        <FormField
          id="email"
          label="Email"
          register={register("email")}
          placeholder="Enter email"
          error={errors.email?.message}
        />

        <FormField
          id="phone"
          label="Phone"
          register={register("phone")}
          placeholder="Enter phone"
          error={errors.phone?.message}
        />

        <FormField
          id="city"
          label="City"
          register={register("city")}
          placeholder="Enter city"
          error={errors.city?.message}
        />
      </div>

      <SharedButton
        type="submit"
        disabled={!isValid || !isDirty || updateMutation.isPending}
        loading={updateMutation.isPending}
      >
        Update Profile
      </SharedButton>
    </form>
  );
}
