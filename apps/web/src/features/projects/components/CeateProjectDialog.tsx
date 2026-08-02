import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateProjectForm from "./CreateProjectForm";

const CreateProjectDialog = ({
  orgId,
  workspaceId,
}: {
  orgId: string;
  workspaceId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateProjectForm
        orgId={orgId}
        workspaceId={workspaceId}
        onClose={() => setIsOpen(false)}
      />
    </ActionDialog>
  );
};

export default CreateProjectDialog;
