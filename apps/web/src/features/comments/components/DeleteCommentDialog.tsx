import { toast } from "@/components/ui/toast";
import { useParams } from "react-router-dom";
import { ConfirmationDialog } from "@/features/organizations/components/ConfirmationDialog";
import { useDeleteComment } from "../hooks/useDeleteComment";

interface DeleteCommentDialogProps {
  commentId: string;
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteCommentDialog = ({
  commentId,
  taskId,
  open,
  onOpenChange,
}: DeleteCommentDialogProps) => {
  const { orgSlug, workspaceSlug, projectSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();
  const {
    mutate: deleteComment,
    isPending,
    error,
  } = useDeleteComment(orgSlug!, workspaceSlug!, projectSlug!, taskId);

  const handleConfirm = () => {
    deleteComment(commentId, {
      onSuccess: () => {
        onOpenChange(false);
        toast.add({
          type: "success",
          title: "Deleted",
        });
      },
    });
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title={"Delete this comment?"}
      description="Authors can delete their own comments. Admins and owners can moderate any comment."
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

export default DeleteCommentDialog;
