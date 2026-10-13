import { OrgRoleBadge } from "@/features/organizations/components/OrgRoleBadge";
import { formatInvitationDate } from "@/lib/utils";
import type { Invitation } from "@/types/invitation";
import { createColumnHelper } from "@tanstack/react-table";
import { Mail } from "lucide-react";

const columnHelper = createColumnHelper<Invitation>();

export const columns = [
  columnHelper.accessor("email", {
    header: ({ table }) => {
      const count = table.getFilteredRowModel().rows.length;
      return `Pending Invites (${count})`;
    },
    cell: (info) => {
      const email = info.getValue();
      const createdAt = info.row.original.createdAt;

      return (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {email}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Invited {formatInvitationDate(createdAt)}
            </p>
          </div>
        </div>
      );
    },
  }),

  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => (
      <div className="flex items-center">
        <OrgRoleBadge role={info.getValue()} />
      </div>
    ),
  }),
];
