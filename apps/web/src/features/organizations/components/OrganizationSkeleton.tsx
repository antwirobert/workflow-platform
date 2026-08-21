import { Skeleton } from "@/components/ui/skeleton";
import MembersTableSkeleton from "./MembersTableSkeleton";

const OrganizationSkeleton = () => {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl space-y-2">
            <Skeleton className="h-7 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-10 w-36 shrink-0 self-start" />
        </div>
        <div className="mb-5 grid grid-cols-4 gap-2">
          <Skeleton className="col-span-3 h-10 w-full" />
          <Skeleton className="col-span-1 h-10 w-full" />
        </div>
        <MembersTableSkeleton />
      </div>
    </section>
  );
};

export default OrganizationSkeleton;
