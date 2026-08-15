import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateWorkspaceForm from "./CreateWorkspaceForm";

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgSlug: string;
}

const CreateWorkspaceDialog = ({
  open,
  onOpenChange,
  orgSlug,
}: CreateWorkspaceDialogProps) => {
  return (
    <ActionDialog
      trigger={
        <Button className="shrink-0 gap-1.5 self-start sm:self-auto">
          <Plus className="size-4" />
          New workspace
        </Button>
      }
      title="Create workspace"
      description="Workspaces group projects by team or initiative."
      open={open}
      onOpenChange={onOpenChange}
    >
      <CreateWorkspaceForm
        onClose={() => onOpenChange(false)}
        orgSlug={orgSlug}
      />
    </ActionDialog>
  );
};

export default CreateWorkspaceDialog;
