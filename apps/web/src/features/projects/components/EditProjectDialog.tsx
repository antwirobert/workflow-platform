import ActionDialog from "@/components/ActionDialog";
import EditProjectForm from "./EditProjectForm";

interface EditProjectDialogProps {
  name: string;
  description: string;
  projectSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProjectDialog = ({
  name,
  description,
  projectSlug,
  open,
  onOpenChange,
}: EditProjectDialogProps) => {
  return (
    <ActionDialog open={open} onOpenChange={onOpenChange} title="Edit project">
      <EditProjectForm
        name={name}
        description={description}
        projectSlug={projectSlug}
        onClose={() => onOpenChange(false)}
      />
    </ActionDialog>
  );
};

export default EditProjectDialog;
