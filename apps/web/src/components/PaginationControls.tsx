import { DEFAULT_TABLE_LIMIT } from "@/constants";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  totalItems,
  limit = DEFAULT_TABLE_LIMIT,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) => {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, totalItems);

  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      {/* Left: summary */}
      <p className="hidden text-sm text-muted-foreground lg:block">
        {totalItems === 0
          ? "No results"
          : `Showing ${from}–${to} of ${totalItems}`}
      </p>

      <div className="flex flex-1 items-center justify-end max-lg:justify-between gap-4">
        {onPageSizeChange && (
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={String(limit)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-17.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <p className="text-sm text-muted-foreground tabular-nums">
          Page {currentPage} of {totalPages || 1}
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:inline-flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
          >
            <ChevronsLeft className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:inline-flex"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
