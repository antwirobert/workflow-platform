import { useParams } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspace";
import { Button } from "@/components/ui/button";
import { Activity, Layers, Plus, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import WorkspaceOverview from "../components/WorkspaceOverview";
import WorkspaceProjects from "../components/WorkspaceProjects";
import WorkspaceMembers from "../components/WorkspaceMembers ";
import { cn, getIdentityColor } from "@/lib/utils";

const WorkspaceDetailPage = () => {
  const { orgSlug, workspaceSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
  }>();
  const {
    data: workspace,
    isLoading,
    isError,
  } = useWorkspace(orgSlug ?? null, workspaceSlug ?? null);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !workspace) {
    return <p>No data</p>;
  }

  const color = getIdentityColor(workspace.id);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl space-y-1.5">
            <div className="flex gap-2">
              <div
                className={cn(
                  "size-2.5 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10",
                  color.bg,
                )}
              />
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {workspace.name}
                </h1>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{workspace.projectCount} projects</span>
                  <span>• {workspace.taskCount} open tasks</span>
                  <span>• {workspace.memberCount} members</span>
                </div>
              </div>
            </div>
          </div>

          <Button className="shrink-0 gap-1.5 self-start sm:self-auto">
            <Plus className="size-4" /> New Project
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">
              <Activity /> Overview
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Layers /> Projects
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users /> Members
            </TabsTrigger>
          </TabsList>

          <Separator className="-mt-2" />

          <TabsContent value="overview" className="mt-4 flex-1 overflow-auto">
            <WorkspaceOverview />
          </TabsContent>

          <TabsContent value="projects" className="mt-4 flex-1 overflow-auto">
            <WorkspaceProjects />
          </TabsContent>

          <TabsContent value="members" className="mt-4 flex-1 overflow-auto">
            <WorkspaceMembers />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default WorkspaceDetailPage;
