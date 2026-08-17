import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useDeleteWorkspace } from "../hooks/useDeleteWorkspace";
import { useParams } from "react-router-dom";
import { ConfirmationDialog } from "@/features/organizations/components/ConfirmationDialog";

interface DeleteWorkspaceDialogProps {
  name: string;
  workspaceSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteWorkspaceDialog = ({
  name,
  workspaceSlug,
  open,
  onOpenChange,
}: DeleteWorkspaceDialogProps) => {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const {
    mutate: deleteWorkspace,
    isPending,
    error,
  } = useDeleteWorkspace(orgSlug!);
  const [confirmText, setConfirmText] = useState("");

  const canConfirm = confirmText === workspaceSlug;

  const handleConfirm = () => {
    if (!canConfirm) return;

    deleteWorkspace(workspaceSlug, {
      onSuccess: () => {
        setConfirmText("");
        onOpenChange(false);
        toast.add({
          type: "success",
          title: `Deleted ${name}`,
        });
      },
    });
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${name}?`}
      description="Owners, admins and the workspace creator can delete a workspace."
      onConfirm={handleConfirm}
      confirmDisabled={!canConfirm || isPending}
      isLoading={isPending}
    >
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-3">
        <ul className="space-y-1.5 text-sm text-destructive">
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>All projects in this workspace are deleted</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>All tasks in those projects are deleted</span>
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-slug" className="text-sm text-muted-foreground">
          Type{" "}
          <span className="font-semibold text-foreground">{workspaceSlug}</span>{" "}
          to confirm
        </Label>
        <Input
          id="confirm-slug"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={workspaceSlug}
          autoComplete="off"
          autoFocus
          className="h-10"
          onKeyDown={(e) => {
            if (e.key === "Enter" && canConfirm) {
              e.preventDefault();
              handleConfirm();
            }
          }}
        />

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            {error.message}
          </div>
        )}
      </div>
    </ConfirmationDialog>
  );
};

export default DeleteWorkspaceDialog;
