import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { SignupForm } from "../auth/SignupForm";

type Props = {
  children: React.ReactNode;
  role: "User" | "Cook";
};

export function SignupModal({ children, role }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        style={{ scrollbarWidth: "none" }}
        className="rounded-xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <SignupForm role={role} />
      </DialogContent>
    </Dialog>
  );
}
