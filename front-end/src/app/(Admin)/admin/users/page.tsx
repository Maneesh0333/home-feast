"use client";

import UserRow from "@/components/admin/UserRow";
import ErrorState from "@/components/shared/ErrorState";
import FilterChips from "@/components/shared/FilterChips";
import Header from "@/components/shared/Header";
import NoInternet from "@/components/shared/NoInternet";
import SearchInput from "@/components/shared/SearchInput";
import Table from "@/components/shared/Table";
import { Spinner } from "@/components/ui/spinner";
import {
  useBlockUsers,
  useUnblockUsers,
  useUsers,
} from "@/hooks/admin/useUsers";
import { getChips } from "@/utils/getFilterShips";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { useEffect, useState } from "react";

export default function Users() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const isOnline = useNetworkStatus();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useUsers(
    search,
    activeFilter,
    page,
  );

  const blockMutation = useBlockUsers();
  const unblockMutation = useUnblockUsers();

  const users = data?.users ?? [];
  const chips = getChips(data?.stats, data?.totalUsers).reverse();

  useEffect(() => {
    setPage(1);
  }, [activeFilter, search]);

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load users"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }
  return (
    <div className="h-full flex flex-col px-2 space-y-6">
      <Header
        title="User Management"
        description={`${data?.totalUsers || 0} registered customers`}
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
            data={users}
            colSpan={5}
            isFetching={isFetching}
            renderRow={(item) => (
              <UserRow
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
