import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type SubmitButtonProps = {
  loading?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function AuthButton({
  loading = false,
  type = "submit",
  children,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      disabled={loading || disabled}
      className="w-full h-12 mt-4 cursor-pointer rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? <Spinner /> : children}
    </Button>
  );
}
