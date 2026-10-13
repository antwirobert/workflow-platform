import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const PendingInvitesTableSkeleton = () => {
  return (
    <div className="mb-8 flex h-full w-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      <div className="flex-1 overflow-auto">
        <Table className="min-w-160">
          <TableHeader>
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              <TableHead className="h-10 bg-muted/40 px-4">
                <Skeleton className="h-3 w-28" />
              </TableHead>
              <TableHead className="h-10 bg-muted/40 px-4">
                <Skeleton className="h-3 w-14" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow
                key={i}
                className="border-b border-border/40 hover:bg-transparent"
              >
                <TableCell className="px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Skeleton className="h-7 w-7 shrink-0 rounded-md" />
                    <div className="min-w-0 space-y-1.5">
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <Skeleton className="h-5 w-16 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendingInvitesTableSkeleton;
