"use client";

import Header from "@/components/shared/Header";
import { Spinner } from "@/components/ui/spinner";
import ErrorState from "@/components/shared/ErrorState";

import {
  MenuItem,
  useDisableMenus,
  useEnableMenus,
  useMenu,
  useToggleTodayMenu,
} from "@/hooks/cook/useMenu";
import NoInternet from "@/components/shared/NoInternet";
import { useEffect, useState } from "react";
import { getChips } from "@/utils/getFilterShips";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import Table from "@/components/shared/Table";
import SearchInput from "@/components/shared/SearchInput";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SharedButton } from "@/components/shared/SharedButton";
import MenuRow from "@/components/cook/MenuRow";
import MenuForm from "@/components/cook/MenuForm";
import FilterChips from "@/components/shared/FilterChips";

export default function Menu() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useMenu(
    search,
    activeFilter,
    page,
  );

  const enableMutation = useEnableMenus();
  const disableMutation = useDisableMenus();
  const toggleTodayMutation = useToggleTodayMenu();

  const isOnline = useNetworkStatus();

  const menus = data?.menu ?? [];
  const chips = getChips(data?.stats, data?.totalMenu).reverse();

  useEffect(() => {
    setPage(1);
  }, [activeFilter, search]);

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load menu"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col px-2 space-y-6">
      <Header
        title="Menu management"
        description="Add, edit and manage your daily menu"
        children={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <SharedButton
                className="w-fit"
                onClick={() => {
                  setSelectedMenu(null);
                  setOpen(true);
                }}
              >
                + Add Menu
              </SharedButton>
            </SheetTrigger>
            <SheetContent className="p-5 overflow-y-auto">
              <SheetHeader className="p-0! mb-3">
                <SheetTitle>
                  {selectedMenu ? "Edit Menu" : "Add Menu"}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {selectedMenu
                    ? "Fill the details to edit"
                    : "Fill the details to add"}
                </SheetDescription>
              </SheetHeader>
              <MenuForm menu={selectedMenu} closeSheet={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        }
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
              placeholder="Search Menu..."
              className="w-70 max-md:w-full"
            />
          </div>

          <Table
            headers={[
              "Name",
              "Price",
              "Type",
              "Status",
              "Created",
              "Available Today",
              "Actions",
            ]}
            data={menus}
            colSpan={7}
            isFetching={isFetching}
            renderRow={(item) => (
              <MenuRow
                key={item._id}
                item={item}
                disableMutation={disableMutation}
                enableMutation={enableMutation}
                toggleTodayMutation={toggleTodayMutation}
                onEdit={(menu) => {
                  setSelectedMenu(menu);
                  setOpen(true);
                }}
              />
            )}
          />
        </>
      )}
    </div>
  );
}
// <div className="flex-1 flex flex-col overflow-y-auto px-6 pb-6 space-y-6">
//   <Header
//     title="Menu management"
//     description="Toggle items on/off for today's service"
//     children={<MenuItemModal />}
//   />

//   <MenuManager
//     title="All menu items"
//     menu={menu}
//     onToggle={(id) => toggleMutation.mutate(id)}
//   />

//   <MenuManager
//     title="Today's availability"
//     menu={todayMenu}
//     onToggle={(id) => toggleMutation.mutate(id)}
//   />
// </div>
