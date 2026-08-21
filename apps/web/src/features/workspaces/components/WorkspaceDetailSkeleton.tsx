import { Skeleton } from "@/components/ui/skeleton";

const WorkspaceDetailSkeleton = () => {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Skeleton className="mt-2 size-2.5 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <Skeleton className="mt-0 h-px w-full" />

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="min-w-0 space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-3 w-28" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4"
                >
                  <div className="flex items-center gap-3.5">
                    <Skeleton className="size-10 shrink-0 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <div className="hidden flex-col items-end gap-1.5 sm:flex">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-3 w-16" />
              <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-3 w-20" />
              <div className="space-y-2.5 rounded-xl border border-border/60 bg-card p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-6" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default WorkspaceDetailSkeleton;
