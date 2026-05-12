"use client";

import { useCategories } from "@/hooks/shared/useCategory";
import { SelectDropDown } from "./Select";
import SearchInput from "./shared/SearchInput";
import { MealType, PlanType } from "@/types/user/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import LocationForm from "./user/LocationForm";
import { useState } from "react";
import { MapPin } from "lucide-react";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  type: MealType;
  setType: (v: MealType) => void;
  cuisine: string;
  setCuisine: (v: string) => void;
  plan: PlanType;
  setPlan: (v: PlanType) => void;
  setLocation: (v: [number, number]) => void;
};

export default function SearchBar({
  search,
  setSearch,
  type,
  setType,
  cuisine,
  setCuisine,
  plan,
  setPlan,
  setLocation,
}: Props) {
  const { data: category = [], isLoading } = useCategories();
  const [open, setOpen] = useState(false);
  const [locationsearch, setLocationsearch] = useState("");

  return (
    <div className="flex gap-5 flex-wrap">
      {/* SEARCH */}
      <div className="flex gap-1 w-full">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search cooks or kitchen name"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <span className="rounded-lg flex items-center justify-center h-10 w-10 bg-transparent cursor-pointer border text-foreground/60">
              <MapPin size={20} />
            </span>
          </SheetTrigger>

          <SheetContent className="p-5 overflow-y-auto">
            <SheetHeader className="p-0! mb-3">
              <SheetTitle>Location</SheetTitle>
              <SheetDescription className="text-xs">
                Search the location
              </SheetDescription>
            </SheetHeader>
            <LocationForm
              setOpen={setOpen}
              locationsearch={locationsearch}
              setLocationsearch={setLocationsearch}
              setLocation={setLocation}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* TYPE */}
      <SelectDropDown
        value={type}
        onChange={(val) => setType(val as MealType)}
        options={[
          { label: "Both", value: "Both" },
          { label: "Vegetarian", value: "Veg" },
          { label: "Non-Vegetarian", value: "Non-Veg" },
        ]}
        placeholder="Meal type"
      />

      {/* CUISINE */}
      <SelectDropDown
        value={cuisine}
        onChange={(v) => setCuisine(v as string)}
        options={[
          {
            label: "All Cuisines",
            value: "All",
          },
          ...category?.map((item) => ({
            label: item.name,
            value: item._id,
          })),
        ]}
        placeholder="Cuisines"
        loading={isLoading}
      />

      {/* Plan */}
      <SelectDropDown
        value={plan}
        onChange={(v) => setPlan(v as PlanType)}
        options={[
          {
            label: "All Plans",
            value: "All",
          },
          {
            label: "Daily",
            value: "daily",
          },
          {
            label: "Weekly",
            value: "weekly",
          },
          {
            label: "Monthly",
            value: "monthly",
          },
        ]}
        placeholder="Plans"
      />
    </div>
  );
}
