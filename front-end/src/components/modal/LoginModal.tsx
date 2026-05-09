import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { LoginForm } from "../auth/LoginForm";

type Props = {
  className?: string;
};

export function LoginModal({ className }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="xllite"
          variant="outline"
          className={`px-5 font-semibold rounded-lg cursor-pointer ${className}`}
        >
          Log in
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-xl p-6 overflow-y-auto max-h-[90vh]">
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
