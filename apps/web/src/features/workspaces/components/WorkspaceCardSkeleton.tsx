import { Skeleton } from "@/components/ui/skeleton";

const WorkspaceCardSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-2.5 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="size-8 shrink-0 rounded-md" />
          </div>

          <Skeleton className="h-5 w-16 rounded-md" />

          <Skeleton className="h-3 w-28" />

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="size-3.5 shrink-0 rounded-sm" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-3.5 shrink-0 rounded-sm" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-3.5 shrink-0 rounded-sm" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkspaceCardSkeleton;
