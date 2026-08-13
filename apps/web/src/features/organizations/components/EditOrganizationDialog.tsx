import ActionDialog from "@/components/ActionDialog";
import EditOrganizationForm from "./EditOrganizationForm";

interface EditOrganizationDialogProps {
  slug: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditOrganizationDialog = ({
  slug,
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
        slug={slug}
        name={name}
        onClose={() => onOpenChange(false)}
      />
    </ActionDialog>
  );
};

export default EditOrganizationDialog;
