import PageHeader from "@/components/PageHeader";
import CreateProjectDialog from "../components/CeateProjectDialog";
import { FolderOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import ProjectCard from "../components/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "react-router-dom";
import { useState } from "react";
import PaginationControls from "@/components/PaginationControls";
import { useProjects } from "../hooks/useProjects";
import { usePagination } from "@/hooks/usePagination";
import { useProjectFilters } from "../hooks/useProjectFilters";

const ProjectsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { page, limit, onPageChange, onPageSizeChange } = usePagination();
  const { search, onSearchChange } = useProjectFilters();
  const { orgSlug, workspaceSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
  }>();

  const {
    data: projects,
    isLoading,
    isError,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useProjects(
    orgSlug ?? null,
    workspaceSlug ?? null,
    {
      page,
      limit,
    },
    search || undefined,
  );

  console.log(projects?.data);

  if (!orgSlug || !workspaceSlug) return null;

  return (
    <PageHeader
      title="Projects"
      description="Organize work into focused, cross-functional efforts."
      action={
        <CreateProjectDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
        />
      }
    >
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects..."
          className="w-full pl-9 pr-3 bg-muted/50 focus:bg-background transition"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="size-9 shrink-0 rounded-lg" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <ErrorState
          title="Couldn't load projects"
          description="Something went wrong fetching this workspace's projects."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      )}

      {!isLoading && !isError && projects?.data.length === 0 && (
        <EmptyState
          title="No projects yet"
          description="Projects group related tasks. Create your first one to get started."
          btnCaption="New project"
          icon={FolderOpen}
          onOpenChange={() => setIsOpen(true)}
        />
      )}

      {!isLoading && !isError && (projects?.data.length ?? 0) > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects?.data.map((project) => (
              <ProjectCard
                key={project.id}
                targetOrgSlug={orgSlug}
                targetWorkspaceSlug={workspaceSlug}
                {...project}
              />
            ))}
          </div>

          <PaginationControls
            currentPage={page}
            limit={limit}
            onPageChange={(newPage) => onPageChange(newPage)}
            onPageSizeChange={(size) => onPageSizeChange(size)}
            totalItems={projects!.meta.total}
            totalPages={projects!.meta.totalPages}
            isPlaceholderData={isPlaceholderData}
          />
        </>
      )}
    </PageHeader>
  );
};

export default ProjectsPage;
