import { Button } from "../ui/button";

export type Chip = {
  lable: string;
  value: string;
};

type FilterChipsProps = {
  chips: Chip[];
  active: string;
  onChange: (value: string) => void;
  activeClassName?: string;
  inactiveClassName?: string;
};

export default function FilterChips({
  chips,
  active,
  onChange,
}: FilterChipsProps) {
  return (
    <div className="flex-1 flex border-b border-b-foreground/20 text-foreground/50">
      {chips.map((chip) => {
        const isActive = active === chip.value;

        return (
          <div
            key={chip.value}
            onClick={() => onChange(chip.value)}
          >
            <Button
              className={`cursor-pointer bg-transparent text-foreground font-semibold text-sm ${isActive && "text-[#E07B2A]"}`}
            >
              {chip.lable}
            </Button>
            {isActive && (
              <div className="h-[2px] bg-[#E07B2A] rounded-full mt-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}
