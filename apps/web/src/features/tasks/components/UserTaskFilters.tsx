import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_PRIORITY_OPTIONS, ALL_STATUS_OPTIONS } from "@/constants";
import type { Priority, TaskStatus } from "@/types/task";
import { Search } from "lucide-react";

interface UserTaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: TaskStatus | "ALL";
  onStatusChange: (value: TaskStatus | "ALL") => void;
  priority: Priority | "ALL";
  onPriorityChange: (value: Priority | "ALL") => void;
}

const UserTaskFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
}: UserTaskFiltersProps) => {
  return (
    <div className="my-4 grid grid-cols-1 sm:grid-cols-5 gap-2 w-full">
      <div className="relative col-span-1 sm:col-span-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search workspaces..."
          className="w-full pl-9 pr-3 bg-muted/50 focus:bg-background transition"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="col-span-1 sm:col-span-1">
        <Select
          items={ALL_STATUS_OPTIONS}
          defaultValue="ALL"
          value={status}
          onValueChange={(value) => onStatusChange(value as TaskStatus | "ALL")}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ALL_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-1 sm:col-span-1">
        <Select
          items={ALL_PRIORITY_OPTIONS}
          defaultValue="ALL"
          value={priority}
          onValueChange={(value) => onPriorityChange(value as Priority | "ALL")}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ALL_PRIORITY_OPTIONS.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserTaskFilters;
