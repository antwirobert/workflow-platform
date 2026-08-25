import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types/task";
import {
  Calendar,
  Ellipsis,
  Flag,
  User,
  X,
  Lock,
  Pencil,
  Trash2,
  Send,
  Loader2,
} from "lucide-react";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import TextAvatar from "@/components/TextAvatar";
import { formatDueDate, getIdentityColor } from "@/lib/utils";
import { useState } from "react";
import { ROLES_MANAGEMENT } from "@/constants";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import EditTaskDialog from "./EditTaskDialog";
import { useParams } from "react-router-dom";
import DeleteTaskDialog from "./DeleteTaskDialog";
import { Textarea } from "@/components/ui/textarea";
import CommentThread from "@/features/comments/components/CommentThread";
import { useCreateComment } from "@/features/comments/hooks/useCreateComment";
import { toast } from "@/components/ui/toast";
import { useComments } from "@/features/comments/hooks/useComments";

interface TaskDetailsSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TaskDetailsSheet = ({
  task,
  open,
  onOpenChange,
}: TaskDetailsSheetProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [comment, setComment] = useState({ body: "" });
  const { activeOrganization } = useActiveOrganization();
  const { orgSlug, workspaceSlug, projectSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const {
    mutate: createComment,
    isPending,
    error,
  } = useCreateComment(orgSlug!, workspaceSlug!, projectSlug!, task?.id ?? "");

  const { data, isLoading, isError, isFetching, refetch } = useComments(
    orgSlug!,
    workspaceSlug!,
    projectSlug!,
    task?.id ?? "",
  );

  if (
    !task ||
    !activeOrganization ||
    !orgSlug ||
    !workspaceSlug ||
    !projectSlug
  )
    return null;

  const color = getIdentityColor(task.assignee?.id ?? "");

  const handleCreateComment = () => {
    if (!comment?.body.trim()) return;

    createComment(comment, {
      onSuccess: () => {
        setComment({ body: "" });
        toast.add({
          type: "success",
          title: "Comment added",
        });
      },
      onError: () => {
        setComment({ body: "" });
        toast.add({
          type: "error",
          title: error?.message || "Something unexpected went wrong",
        });
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="space-y-0 p-0 text-left">
          <div className="flex items-center justify-between px-4 py-3">
            <TaskStatusBadge status={task.status} />
            <div className="flex items-center gap-1">
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
                      onClick={() => setIsEditOpen(true)}
                      className="cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-100"
                    >
                      <Pencil className="size-3.5 text-muted-foreground" />
                      Edit task
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setIsDeleteOpen(true)}
                      disabled={
                        !ROLES_MANAGEMENT.includes(activeOrganization.role)
                      }
                      className={
                        ROLES_MANAGEMENT.includes(activeOrganization.role)
                          ? "cursor-pointer gap-2 rounded-md px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive"
                          : "cursor-not-allowed gap-2 rounded-md px-2 py-1.5 text-sm disabled:opacity-100"
                      }
                      variant="destructive"
                    >
                      {ROLES_MANAGEMENT.includes(activeOrganization.role) ? (
                        <>
                          <Trash2 className="size-3.5" />
                          Delete task
                        </>
                      ) : (
                        <div className="flex items-start gap-2 py-0.5">
                          <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-muted-foreground">
                              Delete task
                            </span>
                            <span className="text-[11px] leading-snug text-muted-foreground/70">
                              Only the creator, an admin, or the owner can
                              delete this task
                            </span>
                          </div>
                        </div>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 py-4">
            <SheetTitle className="text-lg font-semibold tracking-tight leading-snug">
              {task.title}
            </SheetTitle>
          </div>

          <Separator />

          <div className="flex flex-col gap-3 px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="flex w-28 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <User className="size-3.5 opacity-70" />
                Assignee
              </span>
              {task.assignee?.name ? (
                <div className="flex items-center gap-2">
                  <TextAvatar
                    name={task.assignee?.name ?? ""}
                    colorClass={color.bg}
                    textClass={color.text}
                    className="size-6 text-[10px] rounded-full"
                  />
                  <span className="text-sm">{task.assignee?.name}</span>
                </div>
              ) : (
                "—"
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="flex w-28 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <Flag className="size-3.5 opacity-70" />
                Priority
              </span>
              <TaskPriorityBadge priority={task.priority} />
            </div>

            <div className="flex items-center gap-3">
              <span className="flex w-28 shrink-0 items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3.5 opacity-70" />
                Due date
              </span>
              <span className="text-sm tabular-nums text-muted-foreground">
                {task.dueDate ? formatDueDate(task.dueDate) : "—"}
              </span>
            </div>
          </div>

          <Separator />

          <div className="px-4 py-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </p>
            <SheetDescription className="text-sm leading-relaxed text-foreground">
              {task.description || (
                <span className="text-muted-foreground">No description</span>
              )}
            </SheetDescription>
          </div>

          <Separator />

          <CommentThread
            comments={data!}
            isLoading={isLoading}
            isError={isError}
            isFetching={isFetching}
            refetch={refetch}
            taskId={task.id}
          />
        </div>

        <SheetFooter className="mt-auto border-t p-3">
          <div className="relative flex w-full flex-col">
            <Textarea
              placeholder="Write a comment..."
              className="min-h-18 w-full resize-none pb-12 text-sm focus-visible:ring-1"
              value={comment?.body}
              onChange={(e) =>
                setComment((prevComment) => ({
                  ...prevComment,
                  body: e.target.value,
                }))
              }
            />
            <div className="absolute bottom-2 right-2">
              <Button
                size="sm"
                className="shrink-0 gap-1.5 h-8"
                disabled={isPending || !comment.body.trim()}
                onClick={handleCreateComment}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetFooter>

        <EditTaskDialog
          orgSlug={orgSlug}
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
          task={task}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />

        <DeleteTaskDialog
          task={task}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
        />
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailsSheet;
