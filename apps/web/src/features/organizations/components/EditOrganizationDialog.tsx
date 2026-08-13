import ActionDialog from "@/components/ActionDialog";
import EditOrganizationForm from "./EditOrganizationForm";

interface EditOrganizationDialogProps {
  orgSlug: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditOrganizationDialog = ({
  orgSlug,
  name,
  open,
  onOpenChange,
}: EditOrganizationDialogProps) => {
  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit organization"
    >
      <EditOrganizationForm
        orgSlug={orgSlug}
        name={name}
        onClose={() => onOpenChange(false)}
      />
    </ActionDialog>
  );
};

export default EditOrganizationDialog;
