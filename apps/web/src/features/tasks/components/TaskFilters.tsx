import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority, TaskStatus } from "@/types/task";

const ALL_STATUSES = [
  { label: "All statuses", value: "ALL" },
  { label: "Todo", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Done", value: "DONE" },
  { label: "Cancelled", value: "CANCELLED" },
];

const ALL_PRIORITIES = [
  { label: "All priorities", value: "ALL" },
  { label: "Urgent", value: "URGENT" },
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

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
        items={ALL_STATUSES}
        defaultValue="ALL"
        value={status}
        onValueChange={(value) => onStatusChange(value as TaskStatus | "ALL")}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {ALL_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        items={ALL_PRIORITIES}
        defaultValue="ALL"
        value={priority}
        onValueChange={(value) => onPriorityChange(value as Priority | "ALL")}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {ALL_PRIORITIES.map((priority) => (
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
