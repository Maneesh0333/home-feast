"use client";

import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { OTPInput } from "@/components/auth/OTPInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { useVerifyOtp } from "@/hooks/Auth/useVerifyOtp";
import { VerifyFormType } from "@/types/auth/types";
import { verifyOtpSchema } from "@/schemas/auth/auth.schema";

import { useSearchParams, useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { mutate, isPending } = useVerifyOtp();
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { isValid, errors },
  } = useForm<VerifyFormType>({
    resolver: yupResolver(verifyOtpSchema),
    mode: "onChange",
    values: {
      otp: "",
      email: email || "",
    },
  });

  const otp = useWatch({
    control,
    name: "otp",
  });

  const onSubmit = (formData: VerifyFormType) => {
    mutate(formData, {
      onSuccess: () => {
        setTimeout(() => {
          router.replace("/");
        }, 700);
      },
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg p-6">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="font-playfair text-2xl sm:text-3xl font-black">
            Verify your Email
          </CardTitle>

          <CardDescription className="text-sm leading-relaxed">
            Enter the 6-digit code sent to:
            <br />
            <span className="font-medium text-foreground break-all">
              {email}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex justify-center">
              <OTPInput
                value={otp}
                onChange={(value) =>
                  setValue("otp", value, {
                    shouldValidate: true,
                  })
                }
              />
            </div>

            {errors.otp && (
              <p className="text-sm text-destructive text-center">
                {errors.otp.message}
              </p>
            )}

            <AuthButton
              type="submit"
              loading={isPending}
              disabled={!isValid || isPending}
            >
              Verify
            </AuthButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
