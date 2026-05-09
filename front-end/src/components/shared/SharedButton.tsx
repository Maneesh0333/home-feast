import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type Props = {
  loading?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export function SharedButton({
  loading = false,
  type = "submit",
  children,
  disabled = false,
  onClick,
  className,
}: Props) {
  return (
    <Button
      size={"xllite"}
      onClick={onClick}
      type={type}
      disabled={loading || disabled}
      className={`w-full cursor-pointer rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 ${className}`}
    >
      <span className={loading ? "opacity-0" : "opacity-100"}>{children}</span>
      {loading && (
        <span className="absolute flex">
          <Spinner />
        </span>
      )}
    </Button>
  );
}
