import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateOrganizationForm from "./CreateOrganizationForm";

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateOrganizationDialog = ({
  open,
  onOpenChange,
}: CreateOrganizationDialogProps) => {
  return (
    <ActionDialog
      trigger={
        <Button className="shrink-0 gap-1.5 self-start sm:self-auto">
          <Plus className="size-4" />
          New organization
        </Button>
      }
      title="Create organization"
      description="Organizations group your workspaces, projects, and teammates."
      open={open}
      onOpenChange={onOpenChange}
    >
      <CreateOrganizationForm onClose={() => onOpenChange(false)} />
    </ActionDialog>
  );
};

export default CreateOrganizationDialog;
