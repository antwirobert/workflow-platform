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
import PaginationControls from "@/components/PaginationControls";
import ErrorState from "@/components/ErrorState";
import { columns } from "./columns";

interface MembersTableProps {
  members: PaginatedResponse<Member>;
  isError: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  onRetry: () => void;
  page: number;
  limit: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  onPageSizeChange: Dispatch<SetStateAction<number>>;
}

const MembersTable = ({
  members,
  isError,
  isFetching,
  isPlaceholderData,
  onRetry,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
}: MembersTableProps) => {
  const table = useReactTable({
    data: members.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {isError && (
        <ErrorState
          title="Couldn't load members"
          description="Something went wrong fetching members."
          onRetry={onRetry}
          isRetrying={isFetching}
        />
      )}

      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm",
          isPlaceholderData ? "opacity-60 pointer-events-none" : "",
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
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PaginationControls
        currentPage={page}
        limit={limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        totalItems={members.meta.total}
        totalPages={members.meta.totalPages}
      />
    </>
  );
};

export default MembersTable;
