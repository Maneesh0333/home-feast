import { SharedButton } from "./SharedButton";

type Props = {
  message?: string;
  onRetry: () => void;
  isLoading?: boolean;
};
export default function ErrorState({
  message = "Something went wrong",
  onRetry,
  isLoading = false,
}: Props) {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-2xl font-semibold">{message}</h1>

      <SharedButton
        onClick={onRetry}
        loading={isLoading}
        disabled={isLoading}
        className="bg-accent-foreground text-background hover:bg-accent-foreground/80 w-fit"
      >
        Try Again
      </SharedButton>
    </div>
  );
}
