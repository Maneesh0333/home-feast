import { Subscription, useUpdatePaymentStatus } from "@/hooks/cook/useCookRequests";
import { ActionButton } from "../shared/ActionButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import DetailsForm from "./DetailsForm";

dayjs.extend(relativeTime);

type OrderRowProps = {
  request: Subscription;
  onAccept: () => void;
  onReject: () => void;
  loadingState: { id: string; type: "accept" | "reject" } | null;
  paymentStatusMutation: ReturnType<typeof useUpdatePaymentStatus>;
};

export function OrderRow({
  request,
  onAccept,
  onReject,
  loadingState,
  paymentStatusMutation,
}: OrderRowProps) {
  const initials = request.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isAcceptLoading =
    loadingState?.id === request._id && loadingState?.type === "accept";

  const isRejectLoading =
    loadingState?.id === request._id && loadingState?.type === "reject";

  const isMarkingPaid =
    paymentStatusMutation.isPending &&
    paymentStatusMutation.variables?.id === request._id;

  return (
    <div className="flex flex-col items-start gap-2 py-4 border-b border-[#E2DDD6]">
      {/* Top Row */}
      <div className="flex items-center gap-3 w-full">
        {/* Avatar */}
        <div className="w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-sm bg-[#EBF3FC] text-[#1A3C6B]">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="font-semibold">
            {request?.user.name?.charAt(0).toUpperCase() +
              request?.user.name?.slice(1)}
          </div>

          <div className="text-xs text-[#5C5C5E] capitalize">
            {request.planType} • {request.mealTime}
          </div>

          <div className="text-xs text-[#5C5C5E]">
            {dayjs(request.createdAt).fromNow()}
          </div>
        </div>

        {/* Status */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-md capitalize ${
            request.status === "pending"
              ? "bg-[#FEF5E0] text-[#8B6914]"
              : request.status === "active"
              ? "bg-[#E6F4EC] text-[#2E7D52]"
              : "bg-[#FDECEA] text-[#C0392B]"
          }`}
        >
          {request.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pl-12 w-full mt-2">
        <Sheet>
          <SheetTrigger asChild>
            <ActionButton variant="secondary">View</ActionButton>
          </SheetTrigger>

          <SheetContent className="p-5 overflow-y-auto">
            <SheetHeader className="mb-3 p-0!">
              <SheetTitle>Customer details</SheetTitle>
              <SheetDescription className="text-xs">
                Review customer subscription details.
              </SheetDescription>
            </SheetHeader>

            <DetailsForm request={request} />
          </SheetContent>
        </Sheet>

        {request.status === "active" &&
          request.paymentStatus === "pending" && (
            <ActionButton
              variant="secondary"
              isLoading={isMarkingPaid}
              onClick={() =>
                paymentStatusMutation.mutate({
                  id: request._id,
                  paymentStatus: "paid",
                })
              }
            >
              Mark as Paid
            </ActionButton>
          )}

        {request.status === "pending" && (
          <>
            <ActionButton
              variant="success"
              onClick={onAccept}
              isLoading={isAcceptLoading}
              disabled={isAcceptLoading}
            >
              ✓ Accept
            </ActionButton>

            <ActionButton
              variant="danger"
              onClick={onReject}
              isLoading={isRejectLoading}
              disabled={isRejectLoading}
            >
              ✕ Reject
            </ActionButton>
          </>
        )}
      </div>
    </div>
  );
}