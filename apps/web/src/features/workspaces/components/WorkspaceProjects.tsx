import { useState } from "react";
import { useParams } from "react-router-dom";
import TextAvatar from "@/components/TextAvatar";
import { cn, getIdentityColor, timeAgo } from "@/lib/utils";
import PaginationControls from "@/components/PaginationControls";
import ErrorState from "@/components/ErrorState";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";

const WorkspaceProjects = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_TABLE_LIMIT);

  const { orgSlug, workspaceSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
  }>();

  const {
    data: projects,
    isError,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useProjects(orgSlug ?? null, workspaceSlug ?? null, {
    page,
    limit,
  });

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(DEFAULT_PAGE);
  };

  return (
    <div className="space-y-6">
      {isError && (
        <ErrorState
          title="Couldn't load projects"
          description="Something went wrong fetching projects for this workspace."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      )}

      {!isError && projects?.data.length === 0 && (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
          <div>
            <p className="text-sm font-medium text-foreground">
              No projects yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Projects created in this workspace will appear here.
            </p>
          </div>
        </div>
      )}

      {!isError && projects && projects.data.length > 0 && (
        <>
          <div
            className={cn(
              "grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              isPlaceholderData ? "opacity-60 pointer-events-none" : "",
            )}
          >
            {projects.data.map((project) => {
              const { id, name, description, updatedAt } = project;
              const color = getIdentityColor(id);

              return (
                <div
                  key={id}
                  className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <TextAvatar
                      name={name}
                      colorClass={color.bg}
                      textClass={color.text}
                      className="size-10 shrink-0 rounded-lg text-sm font-semibold"
                    />
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      updated {timeAgo(updatedAt)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
                      {name}
                    </h3>
                    {description ? (
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground/70">
                        No description
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <PaginationControls
            currentPage={page}
            limit={limit}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            totalItems={projects.meta.total}
            totalPages={projects.meta.totalPages}
          />
        </>
      )}
    </div>
  );
};

export default WorkspaceProjects;
