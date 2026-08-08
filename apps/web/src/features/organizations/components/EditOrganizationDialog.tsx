import ActionDialog from "@/components/ActionDialog";
import EditOrganizationForm from "./EditOrganizationForm";

interface EditOrganizationDialogProps {
  id: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditOrganizationDialog = ({
  id,
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
        id={id}
        name={name}
        onClose={() => onOpenChange(false)}
      />
    </ActionDialog>
  );
};

export default EditOrganizationDialog;
