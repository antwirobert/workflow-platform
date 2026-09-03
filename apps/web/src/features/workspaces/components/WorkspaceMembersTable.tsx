import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PaginationControls from "@/components/PaginationControls";
import ErrorState from "@/components/ErrorState";
import { columns } from "./task-columns";
import type { PaginatedResponse, WorkspaceMember } from "../types";
import { memberColumns } from "./member-columns";

interface WorkspaceMembersTableProps {
  members: PaginatedResponse<WorkspaceMember>;
  isError: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  refetch: () => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const WorkspaceMembersTable = ({
  members,
  isError,
  isFetching,
  isPlaceholderData,
  refetch,
  page,
  limit,
  onPageChange,
  onPageSizeChange,
}: WorkspaceMembersTableProps) => {
  const table = useReactTable({
    data: members.data,
    columns: memberColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      {isError && (
        <ErrorState
          title="Couldn't load members"
          description="Something went wrong fetching members."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      )}

      <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
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
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b border-border/40 transition-colors hover:bg-transparent"
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
                  );
                })
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
        isPlaceholderData={isPlaceholderData}
      />
    </div>
  );
};

export default WorkspaceMembersTable;
