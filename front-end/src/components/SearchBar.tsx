"use client";

import { SelectDropDown } from "./Select";
import SearchInput from "./shared/SearchInput";

type MealType = "Veg" | "Non-Veg" | "Both";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  type: MealType;
  setType: (v: MealType) => void;
  cuisine: string;
  setCuisine: (v: string) => void;
};

export default function SearchBar({
  search,
  setSearch,
  type,
  setType,
  cuisine,
  setCuisine,
}: Props) {
  return (
    <div className="flex gap-5 flex-wrap">
      {/* SEARCH */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search cooks..."
      />

      {/* TYPE */}
      <SelectDropDown
        value={type}
        onChange={(val) => setType(val as MealType)}
        options={[
          { label: "Vegetarian", value: "veg" },
          { label: "Non-Vegetarian", value: "nonveg" },
        ]}
        placeholder="Meal type"
      />

      {/* CUISINE */}
      <SelectDropDown
        value={cuisine}
        onChange={(v) => setCuisine(v as string)}
        options={[
          { label: "South Indian", value: "south" },
          { label: "North Indian", value: "north" },
          { label: "Bengali", value: "bengali" },
          { label: "Gujarati", value: "gujarati" },
        ]}
        placeholder="Cuisines"
      />
    </div>
  );
}