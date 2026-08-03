import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksListView from "../components/TasksListView";

const TasksPage = () => {
  return (
    <Tabs defaultValue="account" className="w-100">
      <TabsList variant="line">
        <TabsTrigger value="kanban-board">Board</TabsTrigger>
        <TabsTrigger value="tasks-list">List</TabsTrigger>
      </TabsList>
      <TabsContent value="kanban-board">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="tasks-list">
        <TasksListView />
      </TabsContent>
    </Tabs>
  );
};

export default TasksPage;
