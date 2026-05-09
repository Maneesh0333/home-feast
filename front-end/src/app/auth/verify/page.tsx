"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useEffect } from "react";
import { OTPInput } from "@/components/auth/OTPInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { useVerifyOtp } from "@/hooks/Auth/useVerifyOtp";
import { VerifyFormType } from "@/types/auth/types";
import { verifyOtpSchema } from "@/schemas/auth/auth.schema";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

function Verify() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { mutate, isPending } = useVerifyOtp();
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm<VerifyFormType>({
    resolver: yupResolver(verifyOtpSchema),
    mode: "onChange",
    defaultValues: { otp: "", email: "" },
  });

  const otp = watch("otp", "");

  useEffect(() => {
    if (email) {
      setValue("email", email, { shouldValidate: true });
    }
  }, [email, setValue]);

  const onSubmit = (formData: VerifyFormType) => {
    mutate(formData, {
      onSuccess: ()=>{
        setTimeout(()=>{
          router.replace("/");
        }, 700)
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg p-6">
        {/* Header */}
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

        {/* Content */}
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* OTP */}
            <div className="flex justify-center">
              <OTPInput
                value={otp}
                onChange={(value) =>
                  setValue("otp", value, { shouldValidate: true })
                }
              />
            </div>

            {/* Error */}
            {errors.otp && (
              <p className="text-sm text-destructive text-center">
                {errors.otp.message}
              </p>
            )}

            {/* Submit */}
            <AuthButton
              type="submit"
              loading={isPending}
              disabled={!isValid || isPending}
            >
              Verify
            </AuthButton>
          </form>
        </CardContent>

        {/* Footer */}
        {/* <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground text-center">
            Didn’t receive the code?{" "}
            <button
              type="button"
              className="font-medium text-foreground underline"
            >
              Resend
            </button>
          </p>
        </CardFooter> */}
      </Card>
    </div>
  );
}

export default Verify;
