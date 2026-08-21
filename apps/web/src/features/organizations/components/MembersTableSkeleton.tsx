import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";

const MembersTableSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      <div className="flex-1 overflow-auto">
        <Table className="min-w-160">
          <TableHeader>
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              {columns.map((_, index) => (
                <TableHead key={index} className="h-10 bg-muted/40 px-4">
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-b border-border/40">
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex} className="px-4 py-3">
                    <Skeleton className="h-5 w-full max-w-30" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MembersTableSkeleton;
