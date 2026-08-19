import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority, TaskStatus } from "@/types/task";
import { ALL_PRIORITY_OPTIONS, ALL_STATUS_OPTIONS } from "../constants";

interface TaskFiltersProps {
  status: TaskStatus | "ALL";
  onStatusChange: (value: TaskStatus | "ALL") => void;
  priority: Priority | "ALL";
  onPriorityChange: (value: Priority | "ALL") => void;
}

const TaskFilters = ({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
}: TaskFiltersProps) => {
  return (
    <div className="flex gap-2">
      <Select
        items={ALL_STATUS_OPTIONS}
        defaultValue="ALL"
        value={status}
        onValueChange={(value) => onStatusChange(value as TaskStatus | "ALL")}
      >
        <SelectTrigger className="w-full max-w-48">
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

      <Select
        items={ALL_PRIORITY_OPTIONS}
        defaultValue="ALL"
        value={priority}
        onValueChange={(value) => onPriorityChange(value as Priority | "ALL")}
      >
        <SelectTrigger className="w-full max-w-48">
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
  );
};

export default TaskFilters;
