"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { FormField } from "../shared/FormField";
import { AuthButton } from "./AuthButton";
import { LoginFormType } from "@/types/auth/types";
import { loginSchema } from "@/schemas/auth/auth.schema";
import { useLogin } from "@/hooks/Auth/useLogin";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore.getState();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = async (data: LoginFormType) => {
    mutate(data, {
      onSuccess: (data) => {
        login(data.data);
        router.replace("/");
      },
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl font-semibold text-[#1A3C6B]">
          Welcome back
        </DialogTitle>
        <DialogDescription>Log in to your HomeFeast account</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          id="email"
          label="Email"
          register={register("email")}
          placeholder="you@example.com"
          error={errors.email?.message}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          register={register("password")}
          placeholder="••••••••"
          error={errors.password?.message}
        />

        <AuthButton loading={isPending} disabled={!isValid}>
          Log in
        </AuthButton>
      </form>
    </>
  );
}
