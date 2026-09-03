import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { Lock, Plus } from "lucide-react";
import CreateProjectForm from "./CreateProjectForm";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { ROLES_MANAGEMENT } from "@/constants";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { activeOrganization } = useActiveOrganization();
  const isPriviledged = ROLES_MANAGEMENT.includes(
    activeOrganization?.role ?? "",
  );

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
                New project
              </Button>
            }
          />
          {!isPriviledged && (
            <TooltipContent className="w-52">
              <Lock className="size-4" />
              <p>Only owners and admins can create projects.</p>
            </TooltipContent>
          )}
        </Tooltip>
      }
      isDisabled={!isPriviledged}
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
