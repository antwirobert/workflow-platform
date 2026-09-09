import { Skeleton } from "@/components/ui/skeleton";

const DashboardPageSkeleton = () => {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-8 w-72" />
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <Skeleton className="size-3.5 rounded-sm" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-7 w-10" />
              <Skeleton className="mt-1.5 h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left */}
          <div className="min-w-0 space-y-8">
            {/* Assigned to you */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-14" />
              </div>
              <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 border-b border-border/40 px-4 py-3 last:border-0"
                  >
                    <Skeleton className="size-1.5 rounded-full" />
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="hidden h-3 w-12 sm:block" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent workspaces */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-14" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Skeleton className="size-6 rounded-md" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-8">
            {/* Activity */}
            <div className="space-y-3">
              <Skeleton className="h-3 w-16" />
              <div className="space-y-4 rounded-xl border border-border/60 bg-card p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-2.5">
                    <Skeleton className="size-7 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Due this week */}
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-4 py-3"
                  >
                    <Skeleton className="size-2 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPageSkeleton;
