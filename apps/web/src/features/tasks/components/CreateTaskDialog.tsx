import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateTaskForm from "./CreateTaskForm";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgSlug: string;
  workspaceSlug: string;
  projectSlug: string;
}

const CreateTaskDialog = ({
  open,
  onOpenChange,
  orgSlug,
  workspaceSlug,
  projectSlug,
}: CreateTaskDialogProps) => {
  return (
    <ActionDialog
      trigger={
        <Button className="shrink-0 gap-1.5 self-start sm:self-auto">
          <Plus className="size-4" />
          New task
        </Button>
      }
      title="Create task"
      open={open}
      onOpenChange={onOpenChange}
    >
      <CreateTaskForm
        orgSlug={orgSlug}
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        onClose={() => onOpenChange(false)}
      />
    </ActionDialog>
  );
};

export default CreateTaskDialog;
