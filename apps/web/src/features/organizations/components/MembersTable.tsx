import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PaginationControls from "@/components/PaginationControls";
import ErrorState from "@/components/ErrorState";
import { columns } from "./columns";
import { useOrganizationMembers } from "@/features/organizations/hooks/useOrganizationMembers";
import { DEFAULT_PAGE, DEFAULT_TABLE_LIMIT } from "@/constants";

const MembersTable = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_TABLE_LIMIT);

  const { orgSlug } = useParams<{ orgSlug: string }>();

  const {
    data: members,
    isError,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useOrganizationMembers(orgSlug ?? null, {
    page,
    limit,
  });

  const table = useReactTable({
    data: members?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(DEFAULT_PAGE);
  };

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

      {members && (
        <>
          <div
            className={cn(
              "flex h-full w-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm",
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
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            totalItems={members.meta.total}
            totalPages={members.meta.totalPages}
          />
        </>
      )}
    </div>
  );
};

export default MembersTable;
