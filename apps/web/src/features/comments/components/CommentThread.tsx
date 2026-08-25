import TextAvatar from "@/components/TextAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getIdentityColor, timeAgo } from "@/lib/utils";
import type { Comment } from "@/types/comment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Lock, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { ROLES_MANAGEMENT } from "@/constants";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useAuthStore } from "@/stores/authStore";
import DeleteCommentDialog from "./DeleteCommentDialog";

interface CommentThreadProps {
  comments: Comment[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => void;
  taskId: string;
}

const CommentThread = ({
  comments,
  isLoading,
  isError,
  isFetching,
  refetch,
  taskId,
}: CommentThreadProps) => {
  const user = useAuthStore((state) => state.user);
  const { activeOrganization } = useActiveOrganization();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!activeOrganization) return null;

  return (
    <div className="px-4 py-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Activity
      </p>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-2.5">
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-4 text-center">
          <p className="text-sm font-medium text-destructive">
            Couldn't load activity
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Something went wrong fetching comments.
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-3 gap-1.5 text-white bg-destructive hover:bg-destructive/90"
          >
            <RefreshCw
              className={cn("size-3.5", isFetching && "animate-spin")}
            />
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => {
            const {
              id,
              body,
              author: { id: authorId, name },
              createdAt,
            } = comment;

            const isCreator = authorId === user?.id;
            const color = getIdentityColor(authorId);

            return (
              <div key={id} className="flex items-baseline gap-2.5">
                <TextAvatar
                  name={name}
                  colorClass={color.bg}
                  textClass={color.text}
                  className="size-7 shrink-0 rounded-full text-[10px] font-semibold"
                />

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {name}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                      {timeAgo(createdAt)}
                    </span>
                    <div className="ml-auto">
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
                            {/* <DropdownMenuItem
                      onClick={() => setIsEditOpen(true)}
                      className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-100"
                      >
                      <Pencil className="size-3.5 text-muted-foreground" />
                      Edit task
                      </DropdownMenuItem> */}

                            <DropdownMenuItem
                              onClick={() => setIsDeleteOpen(true)}
                              disabled={
                                !ROLES_MANAGEMENT.includes(
                                  activeOrganization.role,
                                ) && !isCreator
                              }
                              className={
                                ROLES_MANAGEMENT.includes(
                                  activeOrganization.role,
                                ) && isCreator
                                  ? "cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
                                  : "cursor-not-allowed gap-2 rounded-md px-2 py-1.5 text-sm disabled:opacity-100"
                              }
                              variant="destructive"
                            >
                              {ROLES_MANAGEMENT.includes(
                                activeOrganization.role,
                              ) && isCreator ? (
                                <>
                                  <Trash2 className="size-3.5" />
                                  Delete comment
                                </>
                              ) : (
                                <div className="flex items-start gap-2 py-0.5">
                                  <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-sm text-muted-foreground">
                                      Delete comment
                                    </span>
                                    <span className="text-[11px] leading-snug text-muted-foreground/70">
                                      Only the author, an admin, or the owner
                                      can delete this comment.
                                    </span>
                                  </div>
                                </div>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>

                <DeleteCommentDialog
                  commentId={id}
                  taskId={taskId}
                  open={isDeleteOpen}
                  onOpenChange={setIsDeleteOpen}
                />
              </div>
            );
          })}
        </div>
      ) : (
        !isLoading &&
        !isError && (
          <p className="text-sm text-muted-foreground">
            No comments yet. Start the discussion
          </p>
        )
      )}
    </div>
  );
};

export default CommentThread;
