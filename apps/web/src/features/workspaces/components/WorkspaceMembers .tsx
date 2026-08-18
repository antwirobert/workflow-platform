import type { Dispatch, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginatedResponse } from "@/features/organizations/types";
import { cn } from "@/lib/utils";
import type { Member } from "@/types/organization";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./Columns";
import PaginationControls from "@/components/PaginationControls";
import { DEFAULT_SUB_TABLE_LIMIT } from "@/constants";
import ErrorState from "@/components/ErrorState";

interface WorkspaceMembersProps {
  members: PaginatedResponse<Member>;
  membersError: boolean;
  membersFetching: boolean;
  refetchMembers: () => void;
  onMemberPageChange: Dispatch<SetStateAction<number>>;
  onMemberPageSizeChange: Dispatch<SetStateAction<number>>;
}

const WorkspaceMembers = ({
  members,
  membersError,
  membersFetching,
  refetchMembers,
  onMemberPageChange,
  onMemberPageSizeChange,
}: WorkspaceMembersProps) => {
  const table = useReactTable({
    data: members.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {membersError && (
        <ErrorState
          title="Couldn't load members"
          description="Something went wrong fetching members for this workspace."
          onRetry={refetchMembers}
          isRetrying={membersFetching}
        />
      )}

      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm",
          membersFetching ? "opacity-60 transition-opacity" : "",
        )}
      >
        <div className="flex-1 overflow-auto">
          <Table className="min-w-160">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border/60 hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-10 bg-muted/40 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-border/40 transition-colors hover:bg-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No tasks yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <PaginationControls
        currentPage={members.meta.page}
        totalPages={members.meta.totalPages}
        totalItems={members.meta.total}
        limit={DEFAULT_SUB_TABLE_LIMIT}
        onPageChange={onMemberPageChange}
        onPageSizeChange={onMemberPageSizeChange}
      />
    </>
  );
};

export default WorkspaceMembers;
