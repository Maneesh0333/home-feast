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
import { MenuManager } from "@/components/cook/Menu";
import { useTodayMenu } from "@/hooks/cook/useTodayMenu";

export default function TodayMenu() {
  const isOnline = useNetworkStatus();
  const { data, isLoading, isError, isFetching, refetch } = useTodayMenu();

  const menu = data || [];
  if (!isOnline) {
    return <NoInternet />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load today menu"
        onRetry={refetch}
        isLoading={isFetching}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-2 space-y-6">
      <Header title="Today's Menu" description="Today menu items" />
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <MenuManager
            menu={menu}
          />
        </>
      )}
    </div>
  );
}

