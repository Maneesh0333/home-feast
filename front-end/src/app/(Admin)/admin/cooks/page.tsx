"use client";

import CookApplicationRow from "@/components/admin/CookApplicationRow";
import CookRow from "@/components/admin/CookRow";
import { MenuManager } from "@/components/cook/Menu";
import { MenuItemModal } from "@/components/modal/MenuItemModal";
import ErrorState from "@/components/shared/ErrorState";
import FilterChips, { Chip } from "@/components/shared/FilterChips";
import Header from "@/components/shared/Header";
import NoInternet from "@/components/shared/NoInternet";
import SearchInput from "@/components/shared/SearchInput";
import Table from "@/components/shared/Table";
import { Spinner } from "@/components/ui/spinner";
import { useApproveCook, useBlockCook, useCook, useRejectCook, useUnblockCook } from "@/hooks/admin/useCook";
import { useBlockUsers, useUnblockUsers } from "@/hooks/admin/useUsers";
import { getChips } from "@/utils/getFilterShips";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { useEffect, useState } from "react";

export default function Cooks() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const isOnline = useNetworkStatus();

  const { data, isLoading, isError, isFetching, refetch } = useCook(
    activeFilter,
    search,
    page,
    "cooks",
  );

  const blockMutation = useBlockCook();
  const unblockMutation = useUnblockCook();

  const cooks = data?.cooks ?? [];
  const chips = getChips(data?.stats, data?.totalCooks).reverse();

  useEffect(() => {
    setPage(1);
  }, [activeFilter, search]);

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load Cook applications"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto px-2 space-y-6">
      <Header
        title="Cook Management"
        description={`${data?.totalCooks || 0} registered cooks`}
      />

      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <FilterChips
              chips={chips}
              active={activeFilter}
              onChange={setActiveFilter}
            />

            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search cooks..."
              className="w-70 max-md:w-full"
            />
          </div>

          <Table
            headers={["Name", "Email", "Phone", "Status", "Actions"]}
            data={cooks}
            colSpan={5}
            isFetching={isFetching}
            renderRow={(item) => (
              <CookRow
                key={item._id}
                item={item}
                blockMutation={blockMutation}
                unblockMutation={unblockMutation}
              />
            )}
          />
        </>
      )}
    </div>
  );
}
