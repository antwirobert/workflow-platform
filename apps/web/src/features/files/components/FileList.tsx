import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatBytes, timeAgo } from "@/lib/utils";
import {
  Ellipsis,
  Loader2,
  Lock,
  Paperclip,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useUploadFile } from "../hooks/useUploadFile";
import { useFiles } from "../hooks/useFiles";
import { ROLES_MANAGEMENT } from "@/constants";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useAuthStore } from "@/stores/authStore";
import DeleteFileDialog from "./DeleteFileDialog";
import { toast } from "@/components/ui/toast";
import type { TaskFile } from "@/types/file";

interface FileListProps {
  taskId: string;
}

const FileList = ({ taskId }: FileListProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFileToDelete, setSelectedFileToDelete] =
    useState<TaskFile | null>(null);
  const user = useAuthStore((state) => state.user);
  const { activeOrganization } = useActiveOrganization();
  const { orgSlug, workspaceSlug, projectSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const {
    mutate: upload,
    isPending,
    error,
  } = useUploadFile(
    orgSlug ?? "",
    workspaceSlug ?? "",
    projectSlug ?? "",
    taskId,
  );

  const {
    data: files,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useFiles(orgSlug ?? "", workspaceSlug ?? "", projectSlug ?? "", taskId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file)
      upload(file, {
        onSuccess: () => {
          toast.add({
            type: "success",
            title: "File uploaded",
          });
        },

        onError: () => {
          toast.add({
            type: "error",
            title: error?.message,
          });
        },
      });
    e.target.value = "";
  };

  if (!activeOrganization || !user) return;

  return (
    <div className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Attachments
        </p>

        <Input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Paperclip className="size-3.5" />
              Upload
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-lg border border-border/60 px-3 py-2.5"
            >
              <Skeleton className="size-8 shrink-0 rounded-md" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-4 text-center">
          <p className="text-sm font-medium text-destructive">
            Couldn't load attachments
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-2 gap-1.5 text-white bg-destructive hover:bg-destructive/90"
          >
            <RefreshCw
              className={cn("size-3.5", isFetching && "animate-spin")}
            />
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && (files?.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground">No attachments yet</p>
      )}

      {!isLoading && !isError && (files?.length ?? 0) > 0 && (
        <div className="space-y-2">
          {files?.map((file) => {
            const {
              id,
              filename,
              size,
              uploadedBy: { id: uploadedById, name },
              createdAt,
            } = file;
            const isCreator = user.id === uploadedById;

            return (
              <div
                key={id}
                className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card px-3 py-2.5 transition-colors hover:border-border"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Paperclip className="size-3.5 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {filename}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {formatBytes(size)}
                    <span className="mx-1 text-muted-foreground/40">·</span>
                    {name}
                    <span className="mx-1 text-muted-foreground/40">·</span>
                    {timeAgo(createdAt)}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 data-[state=open]:opacity-100"
                      >
                        <Ellipsis className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent className="w-52 p-1" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => setSelectedFileToDelete(file)}
                        disabled={
                          !ROLES_MANAGEMENT.includes(activeOrganization.role) &&
                          !isCreator
                        }
                        className={
                          ROLES_MANAGEMENT.includes(activeOrganization.role) &&
                          isCreator
                            ? "cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
                            : "cursor-not-allowed gap-2 rounded-md px-2 py-1.5 text-sm disabled:opacity-100"
                        }
                        variant="destructive"
                      >
                        {ROLES_MANAGEMENT.includes(activeOrganization.role) &&
                        isCreator ? (
                          <>
                            <Trash2 className="size-3.5" />
                            Delete file
                          </>
                        ) : (
                          <div className="flex items-start gap-2 py-0.5">
                            <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm text-muted-foreground">
                                Delete file
                              </span>
                              <span className="text-[11px] leading-snug text-muted-foreground/70">
                                Only the uploader, an admin, or the owner can
                                delete this file.
                              </span>
                            </div>
                          </div>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DeleteFileDialog
                  file={selectedFileToDelete}
                  taskId={taskId}
                  open={selectedFileToDelete !== null}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) setSelectedFileToDelete(null);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileList;
