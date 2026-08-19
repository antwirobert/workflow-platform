import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useParams } from "react-router-dom";
import { ConfirmationDialog } from "@/features/organizations/components/ConfirmationDialog";
import { useDeleteProject } from "../hooks/useDeleteProject";

interface DeleteProjectDialogProps {
  name: string;
  projectSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteProjectDialog = ({
  name,
  projectSlug,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) => {
  const { orgSlug, workspaceSlug } = useParams<{
    orgSlug: string;
    workspaceSlug: string;
  }>();
  const {
    mutate: deleteProject,
    isPending,
    error,
  } = useDeleteProject(orgSlug!, workspaceSlug!);
  const [confirmText, setConfirmText] = useState("");

  const canConfirm = confirmText === projectSlug;

  const handleConfirm = () => {
    if (!canConfirm) return;

    deleteProject(projectSlug, {
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
      description="Owners, admins and the project creator can delete a project."
      onConfirm={handleConfirm}
      confirmDisabled={!canConfirm || isPending}
      isLoading={isPending}
    >
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-3">
        <ul className="space-y-1.5 text-sm text-destructive">
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>
              Every task, comment and attachment in this project is deleted
            </span>
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-slug" className="text-sm text-muted-foreground">
          Type{" "}
          <span className="font-semibold text-foreground">{projectSlug}</span>{" "}
          to confirm
        </Label>
        <Input
          id="confirm-slug"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={projectSlug}
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

export default DeleteProjectDialog;
