import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrgRole } from "@/types/organization";
import { Search } from "lucide-react";

const items = [
  { label: "All roles", value: "ALL" },
  { label: "Owner", value: "OWNER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Member", value: "MEMBER" },
];

interface MemberFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: OrgRole | "ALL";
  onRoleChange: (value: OrgRole | "ALL") => void;
}

const MemberFilters = ({
  search,
  onSearchChange,
  role,
  onRoleChange,
}: MemberFiltersProps) => {
  return (
    <div className="mb-5 sm:grid grid-cols-4 gap-x-2">
      <div className="col-span-3 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or email"
          className="w-full pl-9 pr-3 bg-muted/50 focus:bg-background transition"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="mt-2 sm:mt-0">
        <Select
          items={items}
          value={role}
          onValueChange={(value) => onRoleChange(value as OrgRole | "ALL")}
          defaultValue="ALL"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MemberFilters;
