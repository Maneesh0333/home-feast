"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
}

export function OTPInput({ value, onChange }: OTPInputProps) {
  const slotStyle =
    "h-12 w-12 font-semibold text-lg ring-0!"

  return (
    <InputOTP maxLength={6} value={value} onChange={onChange}>
      <InputOTPGroup>
        <InputOTPSlot index={0} className={slotStyle} />
        <InputOTPSlot index={1} className={slotStyle} />
        <InputOTPSlot index={2} className={slotStyle} />
      </InputOTPGroup>

      <InputOTPSeparator />

      <InputOTPGroup>
        <InputOTPSlot index={3} className={slotStyle} />
        <InputOTPSlot index={4} className={slotStyle} />
        <InputOTPSlot index={5} className={slotStyle} />
      </InputOTPGroup>
    </InputOTP>
  )
}