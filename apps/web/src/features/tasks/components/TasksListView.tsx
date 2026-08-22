import type { Task } from "@/types/task";
import TasksTable from "./TasksTable";

interface TasksListViewProps {
  tasks: Task[];
  isLoading: boolean;
  isFetching: boolean;
}

const TasksListView = ({
  tasks,
  isLoading,
  isFetching,
}: TasksListViewProps) => {
  return (
    <TasksTable tasks={tasks} isLoading={isLoading} isFetching={isFetching} />
  );
};

export default TasksListView;
