import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { getIdentityColor } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import TextAvatar from "../../../components/TextAvatar";

const OrganizationSwitcherTrigger = ({
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { activeOrganization } = useActiveOrganization();

  if (!activeOrganization) {
    return <p>No active org</p>;
  }

  const color = getIdentityColor(activeOrganization.id);

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
          name={activeOrganization.name}
          colorClass={color.bg}
          textClass={color.text}
          className="size-8 shrink-0 rounded-md text-xs font-semibold"
        />

        <div className="flex min-w-0 flex-col leading-none">
          <span className="truncate text-sm tracking-tight capitalize font-semibold">
            {activeOrganization.name}
          </span>
          <span className="mt-0.5 truncate text-xs text-muted-foreground">
            {activeOrganization.slug}
          </span>
        </div>
      </div>

      <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100" />
    </div>
  );
};

export default OrganizationSwitcherTrigger;
