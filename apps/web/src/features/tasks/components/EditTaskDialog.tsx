import ActionDialog from "@/components/ActionDialog";
import EditTaskForm from "./EditTaskForm";
import type { Task } from "@/types/task";

interface EditTaskDialogProps {
  orgSlug: string;
  workspaceSlug: string;
  projectSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

const EditTaskDialog = ({
  orgSlug,
  workspaceSlug,
  projectSlug,
  task,
  open,
  onOpenChange,
}: EditTaskDialogProps) => {
  return (
    <ActionDialog open={open} onOpenChange={onOpenChange} title="Edit project">
      <EditTaskForm
        orgSlug={orgSlug}
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        task={task}
        onClose={() => onOpenChange(false)}
      />
    </ActionDialog>
  );
};

export default EditTaskDialog;
