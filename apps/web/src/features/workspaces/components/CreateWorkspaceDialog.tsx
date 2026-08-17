import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import { ROLES_MANAGEMENT } from "@/constants";
import type { OrgRole } from "@/types/organization";

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgSlug: string;
  role: OrgRole;
}

const CreateWorkspaceDialog = ({
  open,
  onOpenChange,
  orgSlug,
  role,
}: CreateWorkspaceDialogProps) => {
  return (
    <ActionDialog
      trigger={
        <Button
          className="shrink-0 gap-1.5 self-start sm:self-auto"
          disabled={!ROLES_MANAGEMENT.includes(role)}
        >
          <Plus className="size-4" />
          New workspace
        </Button>
      }
      title="Create workspace"
      description="Workspaces group projects by team or initiative."
      open={ROLES_MANAGEMENT.includes(role) ? open : false}
      onOpenChange={(nextOpen) => {
        if (!ROLES_MANAGEMENT.includes(role)) return;
        onOpenChange(nextOpen);
      }}
    >
      <CreateWorkspaceForm
        onClose={() => onOpenChange(false)}
        orgSlug={orgSlug}
      />
    </ActionDialog>
  );
};

export default CreateWorkspaceDialog;
