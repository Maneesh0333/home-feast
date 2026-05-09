import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search as SearchIcon } from "lucide-react";

export function Search() {
  return (
    <InputGroup className="h-10 focus-within:border-orange-500! ring-0!">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}
