"use client";

import CategoriesRow from "@/components/admin/CategoriesRow";
import ErrorState from "@/components/shared/ErrorState";
import FilterChips, { Chip } from "@/components/shared/FilterChips";
import Header from "@/components/shared/Header";
import NoInternet from "@/components/shared/NoInternet";
import SearchInput from "@/components/shared/SearchInput";
import Table from "@/components/shared/Table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  useCategories,
  useDisableCategories,
  useEnableCategories,
  type Category,
} from "@/hooks/admin/useCategories";
import { getChips } from "@/utils/getFilterShips";
import { useNetworkStatus } from "@/utils/useNetworkStatus";
import { useEffect, useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CategoryForm from "@/components/admin/CategoryForm";
import { SharedButton } from "@/components/shared/SharedButton";

export default function Categories() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useCategories(
    search,
    activeFilter,
    page,
  );

  const enableMutation = useEnableCategories();
  const disableMutation = useDisableCategories();
  const isOnline = useNetworkStatus();

  const categories = data?.categories ?? [];
  const chips = getChips(data?.stats, data?.totalCategories).reverse();

  useEffect(() => {
    setPage(1);
  }, [activeFilter, search]);

  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load categories"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto px-2 space-y-6">
      <Header
        title="Cuisine categories"
        description={`${data?.totalCategories || 0} registered Categories`}
        children={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <SharedButton className="w-fit"
                onClick={() => {
                  setSelectedCategory(null);
                  setOpen(true);
                }}
              >
                + Add Category
              </SharedButton>
            </SheetTrigger>
            <SheetContent className="p-5">
              <SheetHeader className="p-0! mb-3">
                <SheetTitle>
                  {selectedCategory ? "Edit Category" : "Add Category"}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {selectedCategory
                    ? "Fill the details to edit"
                    : "Fill the details to add"}
                </SheetDescription>
              </SheetHeader>
              <CategoryForm category={selectedCategory} closeSheet={()=>setOpen(false)}/>
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
              placeholder="Search cooks..."
              className="w-70 max-md:w-full"
            />
          </div>

          <Table
            headers={["Category Id", "Name", "Description", "Status", "Created At", "Actions"]}
            data={categories}
            colSpan={6}
            isFetching={isFetching}
            renderRow={(item) => (
              <CategoriesRow
                key={item._id}
                item={item}
                disableMutation={disableMutation}
                enableMutation={enableMutation}
                onEdit={(cat) => {
                  setSelectedCategory(cat);
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
