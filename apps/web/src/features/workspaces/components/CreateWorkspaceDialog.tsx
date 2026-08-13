import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateWorkspaceForm from "./CreateWorkspaceForm";

const CreateWorkspaceDialog = ({ orgSlug }: { orgSlug: string }) => {
  const [isOpen, setIsOpen] = useState(false);

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
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateWorkspaceForm onClose={() => setIsOpen(false)} orgSlug={orgSlug} />
    </ActionDialog>
  );
};

export default CreateWorkspaceDialog;
