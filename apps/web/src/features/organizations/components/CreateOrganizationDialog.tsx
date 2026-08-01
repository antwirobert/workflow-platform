import { useState } from "react";
import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateOrganizationForm from "./CreateOrganizationForm";

const CreateOrganizationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

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
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CreateOrganizationForm onClose={() => setIsOpen(false)} />
    </ActionDialog>
  );
};

export default CreateOrganizationDialog;
