import type { Task } from "@/types/task";
import TasksTable from "./TasksTable";

interface TasksListViewProps {
  tasks: Task[];
  isError: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  refetch: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TasksListView = ({
  tasks,
  isError,
  isFetching,
  isPlaceholderData,
  refetch,
  open,
  onOpenChange,
}: TasksListViewProps) => {
  return (
    <TasksTable
      tasks={tasks}
      isError={isError}
      isFetching={isFetching}
      isPlaceholderData={isPlaceholderData}
      refetch={refetch}
      open={open}
      onOpenChange={onOpenChange}
      isClickable
    />
  );
};

export default TasksListView;
