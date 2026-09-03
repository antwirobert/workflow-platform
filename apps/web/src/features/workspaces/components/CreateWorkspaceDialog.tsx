import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Lock, Plus } from "lucide-react";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import { ROLES_MANAGEMENT } from "@/constants";
import type { OrgRole } from "@/types/organization";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  const isPriviledged = ROLES_MANAGEMENT.includes(role);

  return (
    <ActionDialog
      trigger={
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                className={cn(
                  "shrink-0 gap-1.5 self-start sm:self-auto",
                  !isPriviledged &&
                    "hover:cursor-not-allowed! cursor-not-allowed!",
                )}
              >
                <Plus className="size-4" />
                New workspace
              </Button>
            }
          />
          {!isPriviledged && (
            <TooltipContent className="w-52">
              <Lock className="size-4" />
              <p>Only owners and admins can create workspaces.</p>
            </TooltipContent>
          )}
        </Tooltip>
      }
      isDisabled={!isPriviledged}
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
