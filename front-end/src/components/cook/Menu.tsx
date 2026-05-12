"use client";

import { TodayMenuItem } from "@/hooks/cook/useTodayMenu";

type Props = {
  menu: TodayMenuItem[];
};

export function MenuManager({ menu }: Props) {
  return (
    <div className="border rounded-2xl p-5">
      {menu.length === 0 ? (
        <div className="flex-1 h-full flex items-center justify-center">
          <p className="text-sm text-gray-500">No items found</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {menu.map((item) => (
            <div
              key={item._id}
              className="py-4 flex justify-between border-b items-center"
            >
              {/* LEFT */}
              <div className="space-y-1">
                {/* Name */}
                <div className="text-sm font-semibold">
                  {item.name}
                </div>

                {/* Price + Type */}
                <div className="text-xs text-[#5C5C5E] flex items-center gap-2">
                  <span>₹{item.price}</span>

                  <span
                    className={`font-medium ${
                      item.type === "veg" ? "text-[#2E7D52]" : "text-[#C0392B]"
                    }`}
                  >
                    {item.type === "veg" ? "Veg" : "Non-Veg"}
                  </span>

                  {/* Time badge */}
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
                    {item.time === "lunch" ? "Lunch" : "Dinner"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-[11px] text-gray-400">
                  {item.calories} kcal
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
