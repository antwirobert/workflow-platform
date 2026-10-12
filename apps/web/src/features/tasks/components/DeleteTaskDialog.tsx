import { toast } from "@/components/ui/toast";
import { useParams } from "react-router-dom";
import { ConfirmationDialog } from "@/features/organizations/components/ConfirmationDialog";
import { useDeleteTask } from "../hooks/useDeleteTask";
import type { Task } from "@/types/task";

interface DeleteTaskDialogProps {
  task: Task;
  workspaceSlug?: string;
  projectSlug?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteTaskDialog = ({
  task,
  workspaceSlug: taskWorkspaceSlug,
  projectSlug: taskProjectSlug,
  open,
  onOpenChange,
}: DeleteTaskDialogProps) => {
  const { orgSlug, workspaceSlug, projectSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();
  const workspace =
    taskWorkspaceSlug ?? workspaceSlug ?? task.project.workspace.slug;
  const project = taskProjectSlug ?? projectSlug ?? task.project.slug;
  const {
    mutate: deleteTask,
    isPending,
    error,
  } = useDeleteTask(orgSlug ?? "", workspace, project);

  const handleConfirm = () => {
    deleteTask(task.id, {
      onSuccess: () => {
        onOpenChange(false);
        toast.add({
          type: "success",
          title: `Deleted ${task.title}`,
        });
      },
    });
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${task.title}?`}
      description="Creators, admins and owners can delete a task. This also removes its comments and attachments."
      onConfirm={handleConfirm}
      confirmDisabled={isPending}
      isLoading={isPending}
    >
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          {error.message}
        </div>
      )}
    </ConfirmationDialog>
  );
};

export default DeleteTaskDialog;
