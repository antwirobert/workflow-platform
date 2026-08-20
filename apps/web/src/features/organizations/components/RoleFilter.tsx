import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const items = [
  { label: "All roles", value: null },
  { label: "Owner", value: "OWNER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Member", value: "MEMBER" },
];

const RoleFilter = () => {
  return (
    <Select items={items}>
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
