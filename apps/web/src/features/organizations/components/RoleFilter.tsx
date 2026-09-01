import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrgRole } from "@/types/organization";

const items = [
  { label: "All roles", value: "ALL" },
  { label: "Owner", value: "OWNER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Member", value: "MEMBER" },
];

interface RoleFilterProps {
  role: OrgRole | "ALL";
  onRoleChange: (value: OrgRole | "ALL") => void;
}

const RoleFilter = ({ role, onRoleChange }: RoleFilterProps) => {
  return (
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
  );
};

export default RoleFilter;
