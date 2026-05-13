"use client";

import { useState } from "react";
import Header from "@/components/shared/Header";
import { Spinner } from "@/components/ui/spinner";
import Table from "@/components/shared/Table";
import { SharedButton } from "@/components/shared/SharedButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  usePlans,
  useEnablePlan,
  useDisablePlan,
  Plan,
} from "@/hooks/cook/usePlan";

import PlanRow from "@/components/cook/PlanRow";
import PlanForm from "@/components/cook/PlanForm";

import ErrorState from "@/components/shared/ErrorState";
import NoInternet from "@/components/shared/NoInternet";
import { useNetworkStatus } from "@/utils/useNetworkStatus";

export default function PlanPage() {
  const { data, isLoading, isError, isFetching, refetch } = usePlans();

  const enableMutation = useEnablePlan();
  const disableMutation = useDisablePlan();

  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const isOnline = useNetworkStatus();
  const plans = data ?? [];

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load plans"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col px-2 space-y-6">
      <Header
        title="Subscription Plans"
        description={`${plans.length} plans created`}
      >
        <SharedButton
            className="w-fit"
            onClick={() => {
              setSelectedPlan(null);
              setOpen(true);
            }}
          >
            + Add Plan
          </SharedButton>
      </Header>

      {/* 🟡 LOADING */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Table
          headers={["Type", "Price", "Status", "Created", "Actions"]}
          data={plans}
          colSpan={5}
          isFetching={isFetching}
          renderRow={(plan) => (
            <PlanRow
              key={plan._id}
              plan={plan}
              onEdit={(p) => {
                setSelectedPlan(p);
                setOpen(true);
              }}
              enableMutation={enableMutation}
              disableMutation={disableMutation}
            />
          )}
        />
      )}

      {/* 🟣 SHEET (ADD / EDIT) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="p-5 overflow-y-scroll">
          <SheetHeader className="p-0! mb-3">
            <SheetTitle>{selectedPlan ? "Edit Plan" : "Add Plan"}</SheetTitle>
            <SheetDescription className="text-xs">
              {selectedPlan
                ? "Fill the details to edit"
                : "Fill the details to add"}
            </SheetDescription>
          </SheetHeader>

          <PlanForm plan={selectedPlan} closeSheet={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
