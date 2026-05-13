"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { LoginForm } from "../auth/LoginForm";
import { AuthFooter } from "../auth/AuthFooter";

type Props = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  onSwitchToSignup?: () => void;
};

export function LoginModal({
  children,
  open,
  onOpenChange,
  onSwitchToSignup,
}: Props) {
  const handleSwitch = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }

    setTimeout(() => {
      if (onSwitchToSignup) {
        onSwitchToSignup();
      }
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="rounded-xl p-6 overflow-y-auto max-h-[90vh]">
        <LoginForm />

        <AuthFooter
          text="Don’t have an account?"
          actionText="Sign up"
          onClick={handleSwitch}
        />
      </DialogContent>
    </Dialog>
  );
}
