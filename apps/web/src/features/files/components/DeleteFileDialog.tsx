import { toast } from "@/components/ui/toast";
import { useParams } from "react-router-dom";
import { ConfirmationDialog } from "@/features/organizations/components/ConfirmationDialog";

import { useDeleteFile } from "../hooks/useDeleteFile";
import type { TaskFile } from "@/types/file";

interface DeleteFileDialogProps {
  file: TaskFile | null;
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteFileDialog = ({
  file,
  taskId,
  open,
  onOpenChange,
}: DeleteFileDialogProps) => {
  const { orgSlug, workspaceSlug, projectSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();
  const {
    mutate: deleteFile,
    isPending,
    error,
  } = useDeleteFile(orgSlug!, workspaceSlug!, projectSlug!, taskId);

  if (!file) return;

  const handleConfirm = () => {
    deleteFile(file.id, {
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
      title={`Delete ${file.filename}?`}
      description="Uploaders can delete their own files. Admins and owners can delete any attachment."
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

export default DeleteFileDialog;
