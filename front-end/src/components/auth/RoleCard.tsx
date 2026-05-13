import { Card, CardDescription, CardTitle } from "../ui/card";

type RoleCardProps = {
  value: "User" | "Cook";
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: (value: "User" | "Cook") => void;
};

export function RoleCard({
  value,
  title,
  subtitle,
  selected,
  onSelect,
}: RoleCardProps) {
  return (
    <Card
      onClick={() => onSelect(value)}
      className={`flex flex-col items-center gap-1 cursor-pointer border transition-all ${
        selected
          ? "bg-card border-orange-500 text-orange-700 shadow-sm"
          : "bg-background border hover:border-gray-100/30"
      }`}
    >
      <CardTitle>🛍️</CardTitle>
      <CardDescription className="text-center">
        <h1 className="text-xs font-bold mt-1 text-foreground/80">{title}</h1>
        <p className="text-[10px] opacity-80">{subtitle}</p>
      </CardDescription>
    </Card>
  );
}
