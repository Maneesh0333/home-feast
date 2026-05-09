import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "./ui/spinner";

type Option = {
  label: string;
  value: string;
};

type PropsType = {
  options: Option[];
  placeholder?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  className?: string;
  emptyText?: string;
  multiple?: boolean;
  loading?: boolean;
};

export function SelectDropDown({
  options,
  placeholder = "Select an option",
  value,
  onChange,
  className = "",
  emptyText = "No items",
  multiple = false,
  loading = false,
}: PropsType) {
  const handleMultiSelect = (val: string) => {
    if (!multiple || !onChange) return;

    const current = Array.isArray(value) ? value : [];

    if (current.includes(val)) {
      onChange(current.filter((v) => v !== val));
    } else {
      onChange([...current, val]);
    }
  };

  return (
    <Select
      value={!multiple ? (value as string) : undefined}
      onValueChange={(val) => {
        if (multiple) {
          handleMultiSelect(val);
        } else {
          onChange?.(val);
        }
      }}
    >
      <SelectTrigger className={`h-10! text-base ring-0! ${className}`}>
        <SelectValue
          placeholder={
            multiple && Array.isArray(value) && value.length
              ? value.join(", ")
              : placeholder
          }
        />
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectGroup>
          {loading ? (
            <div className="flex items-center justify-center min-h-10">
              <Spinner className="h-5 w-5"/>
            </div>
          ) : options.length === 0 ? (
            <SelectItem value="__empty" disabled>
              {emptyText}
            </SelectItem>
          ) : (
            options.map((opt) => {
              const isSelected =
                multiple && Array.isArray(value)
                  ? value.includes(opt.value)
                  : false;

              return (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className={`px-3 py-2 ${isSelected ? "bg-muted" : ""}`}
                >
                  {opt.label}
                </SelectItem>
              );
            })
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
