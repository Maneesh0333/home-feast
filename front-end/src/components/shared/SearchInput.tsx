import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "../ui/input";

type SearchInputProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) {
  const [input, setInput] = useState(value);

  const [debouncedValue] = useDebounce(input, 1000);

  /* 🔥 Sync with parent */
  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <Input
      type="text"
      value={input}
      placeholder={placeholder}
      onChange={(e) => setInput(e.target.value)}
      className={`px-4 py-2 rounded-lg bg-white text-sm outline-none ${className}`}
    />
  );
}
