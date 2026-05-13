"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { SignupForm } from "../auth/SignupForm";
import { AuthFooter } from "../auth/AuthFooter";

type Props = {
  children?: React.ReactNode;
  role: "User" | "Cook";
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onSwitchToLogin?: () => void;
};

export function SignupModal({
  children,
  role,
  open,
  onOpenChange,
  onSwitchToLogin,
}: Props) {
  const handleSwitch = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }

    setTimeout(() => {
      if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        style={{ scrollbarWidth: "none" }}
        className="rounded-xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <SignupForm role={role} />

        <AuthFooter
          text="Already have an account?"
          actionText="Log in"
          onClick={handleSwitch}
        />
      </DialogContent>
    </Dialog>
  );
}
