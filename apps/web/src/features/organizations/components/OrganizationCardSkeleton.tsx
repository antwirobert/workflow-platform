import { Skeleton } from "@/components/ui/skeleton";

const OrganizationCardSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4"
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <Skeleton className="size-11 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganizationCardSkeleton;
