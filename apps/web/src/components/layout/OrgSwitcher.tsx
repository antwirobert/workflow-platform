import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { getIdentityColor } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import TextAvatar from "../TextAvatar";

const OrgSwitcher = ({ ...props }: React.ComponentPropsWithoutRef<"div">) => {
  const { activeOrganization } = useActiveOrganization();

  if (!activeOrganization) {
    return <p>No active org</p>;
  }

  const color = getIdentityColor(activeOrganization.id);

  return (
    <div
      {...props}
      className="flex items-center justify-between p-2 hover:bg-sidebar-accent hover:cursor-pointer rounded-lg"
    >
      <div className="flex gap-3">
        <TextAvatar
          name={activeOrganization.name}
          colorClass={color.bg}
          textClass={color.text}
          className="p-2"
        />
        <div className="flex flex-col">
          <span className="flex-1 truncate font-semibold">
            {activeOrganization.name}
          </span>
          <span className="flex-1 truncate text-sm -mt-1">
            {activeOrganization.slug}
          </span>
        </div>
      </div>
      <ChevronsUpDown className="w-4 h-4 shrink-0" />
    </div>
  );
};

export default OrgSwitcher;
