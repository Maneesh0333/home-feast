import { StatsData } from "@/app/types/(Cook)/overview";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StatsCard({ label, value, sub }: StatsData) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">{value}</CardContent>
      <CardFooter className="border-0 bg-transparent">{sub}</CardFooter>
    </Card>

    // <div className="p-4 rounded-xl border border-[#E2DDD6]">
    //   <div className="text-xs text-[var(--earth-mid)] uppercase font-semibold mt-1">
    //     {label}
    //   </div>

    //   <div className="text-2xl font-bold mt-1">{value}</div>

    //   <div className="text-xs text-[var(--earth-mid)] mt-1">{sub}</div>
    // </div>
  );
}
