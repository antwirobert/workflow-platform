import type { Task } from "@/types/task";
import TasksTable from "./TasksTable";

interface TasksListViewProps {
  tasks: Task[];
  isError: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  refetch: () => void;
}

const TasksListView = ({
  tasks,
  isError,
  isFetching,
  isPlaceholderData,
  refetch,
}: TasksListViewProps) => {
  return (
    <TasksTable
      tasks={tasks}
      isError={isError}
      isFetching={isFetching}
      isPlaceholderData={isPlaceholderData}
      refetch={refetch}
      isClickable
    />
  );
};

export default TasksListView;
