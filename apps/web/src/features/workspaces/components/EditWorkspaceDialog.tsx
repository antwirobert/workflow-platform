import ActionDialog from "@/components/ActionDialog";
import EditWorkspaceForm from "./EditWorkspaceForm";

interface EditWorkspaceDialogProps {
  name: string;
  workspaceSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditWorkspaceDialog = ({
  name,
  workspaceSlug,
  open,
  onOpenChange,
}: EditWorkspaceDialogProps) => {
  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit workspace"
    >
      <EditWorkspaceForm
        name={name}
        workspaceSlug={workspaceSlug}
        onClose={() => onOpenChange(false)}
      />
    </ActionDialog>
  );
};

export default EditWorkspaceDialog;
