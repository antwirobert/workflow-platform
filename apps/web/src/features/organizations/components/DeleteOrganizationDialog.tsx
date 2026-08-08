import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useState } from "react";
import { useDeleteOrganization } from "../hooks/useDeleteOrganization";
import { toast } from "@/components/ui/toast";

interface DeleteOrganizationDialogProps {
  id: string;
  name: string;
  slug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteOrganizationDialog = ({
  id,
  name,
  slug,
  open,
  onOpenChange,
}: DeleteOrganizationDialogProps) => {
  const { mutate: deleteOrganization, isPending } = useDeleteOrganization();
  const [confirmText, setConfirmText] = useState("");

  const canConfirm = confirmText === slug;

  const handleConfirm = () => {
    if (!canConfirm) return;

    deleteOrganization(id, {
      onSuccess: () => {
        setConfirmText("");
        onOpenChange(false);
        toast.add({
          type: "success",
          description: `Deleted ${name}`,
        });
      },
    });
  };

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${name}?`}
      description="Only the organization owner can do this, and it cannot be undone."
      onConfirm={handleConfirm}
      confirmDisabled={!canConfirm || isPending}
      isLoading={isPending}
    >
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3.5 py-3">
        <ul className="space-y-1.5 text-sm text-destructive">
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>
              Every workspace, project and task inside is permanently removed
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>All members lose access immediately</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>The slug becomes available for reuse</span>
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-slug" className="text-sm text-muted-foreground">
          Type <span className="font-semibold text-foreground">{slug}</span> to
          confirm
        </Label>
        <Input
          id="confirm-slug"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={slug}
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
      </div>
    </ConfirmationDialog>
  );
};

export default DeleteOrganizationDialog;
