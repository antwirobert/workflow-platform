import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateProjectForm from "./CreateProjectForm";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgSlug: string;
  workspaceSlug: string;
}

const CreateProjectDialog = ({
  open,
  onOpenChange,
  orgSlug,
  workspaceSlug,
}: CreateProjectDialogProps) => {
  return (
    <ActionDialog
      trigger={
        <Button className="shrink-0 gap-1.5 self-start sm:self-auto">
          <Plus className="size-4" />
          New project
        </Button>
      }
      title="Create project"
      description="Projects organize work into focused, cross-functional efforts."
      open={open}
      onOpenChange={onOpenChange}
    >
      <CreateProjectForm
        orgSlug={orgSlug}
        workspaceSlug={workspaceSlug}
        onClose={() => onOpenChange(false)}
      />
    </ActionDialog>
  );
};

export default CreateProjectDialog;
