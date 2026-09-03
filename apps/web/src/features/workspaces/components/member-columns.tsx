import TextAvatar from "@/components/TextAvatar";
import { OrgRoleBadge } from "@/features/organizations/components/OrgRoleBadge";
import { getIdentityColor } from "@/lib/utils";
import { createColumnHelper } from "@tanstack/react-table";
import type { WorkspaceMember } from "../types";

const columnHelper = createColumnHelper<WorkspaceMember>();

export const memberColumns = [
  columnHelper.accessor("name", {
    header: "Member",
    cell: (info) => {
      const name = info.getValue();
      const id = info.row.original.id;
      const color = getIdentityColor(id);

      return (
        <div className="flex min-w-0 items-center gap-2.5">
          <TextAvatar
            name={name}
            colorClass={color.bg}
            textClass={color.text}
            className="size-8 shrink-0 rounded-full text-xs font-semibold"
          />
          <span className="truncate text-sm font-medium text-foreground">
            {name}
          </span>
        </div>
      );
    },
  }),

  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => <OrgRoleBadge role={info.getValue()} />,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => {
      const email = info.getValue();

      return (
        <span className="truncate text-sm text-muted-foreground">{email}</span>
      );
    },
  }),
  columnHelper.accessor("assignedTaskCount", {
    header: "Assigned tasks",
    cell: (info) => {
      const assignedTask = info.getValue();

      return (
        <span className="truncate text-sm text-muted-foreground">
          {assignedTask}
        </span>
      );
    },
  }),
];
