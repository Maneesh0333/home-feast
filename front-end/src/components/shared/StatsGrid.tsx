import { StatsData } from "@/app/types/(Cook)/overview";
import StatsCard from "./StatsCard";

type StatsDataProps = {
  statsData: StatsData[];
  className?: string;
};

export default function StatsGrid({ statsData, className }: StatsDataProps) {
  return (
    <div className={`grid grid-cols-4 max-md:grid-cols-1 max-lg:grid-cols-2 gap-4 ${className}`}>
      {statsData.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
