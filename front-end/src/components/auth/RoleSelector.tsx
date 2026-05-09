import { RoleCard } from "./RoleCard";

type RoleSelectorProps = {
  value: "User" | "Cook";
  onChange: (val: "User" | "Cook") => void;
  error?: string;
};

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  return (
    <div>
      <label>I am signing up as</label>

      <div className="grid grid-cols-2 mt-2 gap-3">
        <RoleCard
          value="User"
          title="Customer"
          subtitle="Book Cook"
          selected={value === "User"}
          onSelect={onChange}
        />

        <RoleCard
          value="Cook"
          title="Cook"
          subtitle="Offer services"
          selected={value === "Cook"}
          onSelect={onChange}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}