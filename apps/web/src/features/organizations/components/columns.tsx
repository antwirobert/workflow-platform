import TextAvatar from "@/components/TextAvatar";
import { OrgRoleBadge } from "@/features/organizations/components/OrgRoleBadge";
import { getIdentityColor } from "@/lib/utils";
import type { Member } from "@/types/organization";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Member>();

export const columns = [
  columnHelper.accessor("user", {
    id: "member",
    header: "Member",
    cell: (info) => {
      const { id, name } = info.getValue();
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
  columnHelper.accessor("user", {
    id: "email",
    header: "Email",
    cell: (info) => {
      const { email } = info.getValue();

      return (
        <span className="truncate text-sm text-muted-foreground">{email}</span>
      );
    },
  }),
];
