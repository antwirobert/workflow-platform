import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { getIdentityColor } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import TextAvatar from "../../../components/TextAvatar";
import { Skeleton } from "@/components/ui/skeleton";

const OrganizationSwitcherTrigger = ({
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { activeOrganization, isLoading, isError } = useActiveOrganization();

  const color = getIdentityColor(activeOrganization?.id ?? "dummy-id");

  if (isLoading) {
    return (
      <div
        {...props}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Skeleton className="size-8 shrink-0 rounded-md" />
          <div className="flex min-w-0 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
        <Skeleton className="size-4 shrink-0 rounded-sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        {...props}
        className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 
        hover:bg-sidebar-accent hover:text-sidebar-accent-foreground 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring 
        transition-colors cursor-pointer"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <TextAvatar
            name="?"
            colorClass={color.bg}
            textClass={color.text}
            className="size-8 shrink-0 rounded-md text-xs font-semibold"
          />

          <div className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-sm tracking-tight capitalize font-semibold">
              Couldn't load
            </span>
            <span className="mt-0.5 truncate text-xs text-muted-foreground">
              Tap to retry
            </span>
          </div>
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100" />
      </div>
    );
  }

  return (
    <div
      {...props}
      className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 
      hover:bg-sidebar-accent hover:text-sidebar-accent-foreground 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring 
      transition-colors cursor-pointer"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <TextAvatar
          name={activeOrganization?.name ?? "?"}
          colorClass={color.bg}
          textClass={color.text}
          className="size-8 shrink-0 rounded-md text-xs font-semibold"
        />

        <div className="flex min-w-0 flex-col leading-none">
          <span className="truncate text-sm tracking-tight capitalize font-semibold">
            {activeOrganization?.name ?? "Select organization"}
          </span>
          <span className="mt-0.5 truncate text-xs text-muted-foreground">
            {activeOrganization?.slug ?? "Create one to start"}
          </span>
        </div>
      </div>

      <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100" />
    </div>
  );
};

export default OrganizationSwitcherTrigger;
