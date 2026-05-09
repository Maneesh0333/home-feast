"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { registerSchema } from "@/schemas/auth/auth.schema";
import { FormField } from "../shared/FormField";
import { RoleSelector } from "../auth/RoleSelector";
import { AuthButton } from "./AuthButton";
import { AuthFooter } from "../auth/AuthFooter";
import { RegisterFormType } from "@/types/auth/types";
import { useRegister } from "@/hooks/Auth/useRegister";
import { useRouter } from "next/navigation";

type Props = {
  role: "User" | "Cook";
};
export function SignupForm({ role }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormType>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      signupAs: role,
    },
  });

  const signupAs = watch("signupAs");
  const { mutate, isPending } = useRegister();

  const onSubmit = async (data: RegisterFormType) => {
    console.log("Form Submitted:", data);
    mutate(data, {
      onSuccess: () => {
        router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
      },
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl font-semibold text-[#1A3C6B]">
          Create your account
        </DialogTitle>
        <DialogDescription>
          Join thousands enjoying homemade food daily
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="space-y-4">
          <FormField
            id="name"
            label="Full name"
            register={register("name")}
            placeholder="Anjali"
            error={errors.name?.message}
          />

          <FormField
            id="email"
            label="Email"
            register={register("email")}
            placeholder="you@example.com"
            error={errors.email?.message}
          />

          <FormField
            id="phone"
            label="Phone number"
            register={register("phone")}
            placeholder="+91 9876543210"
            error={errors.phone?.message}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            register={register("password")}
            placeholder="Min. 6 characters"
            error={errors.password?.message}
          />

          <RoleSelector
            value={signupAs}
            onChange={(val) => setValue("signupAs", val)}
            error={errors.signupAs?.message}
          />
        </div>

        <AuthButton type="submit" loading={isPending} disabled={!isValid}>
          Create account
        </AuthButton>

        <AuthFooter text="Already have an account?" actionText="Log in" />
      </form>
    </>
  );
}
