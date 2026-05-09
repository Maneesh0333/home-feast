import { useState } from "react";

const chips = [
  { label: "All cooks", value: "" },
  { label: "Monthly plans", value: "monthly" },
  { label: "Weekly plans", value: "weekly" },
  { label: "Veg only", value: "veg" },
  { label: "Near me (<1km)", value: "near" },
  { label: "Top rated", value: "top" },
  { label: "South Indian", value: "south" },
  { label: "North Indian", value: "north" },
];

type PropsType = {
  onChange:(value: string)=>void
}

export default function FilterChips({ onChange }: PropsType) {
  const [active, setActive] = useState("");

  const handleClick = (value: string) => {
    setActive(value);
    onChange(value);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.value}
          onClick={() => handleClick(chip.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition
            ${
              active === chip.value
                ? "bg-blue-900 text-white border-blue-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-500"
            }
          `}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}