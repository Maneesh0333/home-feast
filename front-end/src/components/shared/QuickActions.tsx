import { QuickAction } from "@/app/types/(Cook)/overview";
import Link from "next/link";

type QuickActionsProps = {
  actions: QuickAction[];
};

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-[#1A3C6B] p-4 text-white rounded-xl border border-[#ffffff1f]">
      <div className="font-semibold mb-3 text-[var(--warm-white)]">Quick Actions</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            href={action.path}
            key={action.title}
            className="p-3 border border-[#ffffff1f] rounded-xl hover:bg-[#ffffff1f] hover:border-gray-400 cursor-pointer transition"
          >
            <div className="text-xl">{action.icon}</div>
            <div className="text-sm text-[var(--warm-white)] font-semibold mt-1">
              {action.title}
            </div>
            <div className="text-xs text-[rgba(255,255,255,0.4)]">
              {action.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
