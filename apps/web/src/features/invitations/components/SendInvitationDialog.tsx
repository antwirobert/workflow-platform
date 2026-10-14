import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { Lock, UserPlus } from "lucide-react";
import { useState } from "react";
import SendInvitationForm from "./SendInvitationForm";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROLES_MANAGEMENT } from "@/constants";
import { cn } from "@/lib/utils";

interface SendInvitationDialogProps {
  orgSlug: string;
  size?: boolean;
}

const SendInvitationDialog = ({ orgSlug, size }: SendInvitationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeOrganization } = useActiveOrganization();
  const isPriviledged = ROLES_MANAGEMENT.includes(
    activeOrganization?.role ?? "",
  );

  return (
    <ActionDialog
      trigger={
        <>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className={cn(
                    "shrink-0 gap-1.5 self-start",
                    !isPriviledged &&
                      "hover:cursor-not-allowed! cursor-not-allowed!",
                  )}
                  size={size ? "xs" : "default"}
                >
                  <UserPlus className="size-4" />
                  Invite members
                </Button>
              }
            />
            {!isPriviledged && (
              <TooltipContent className="w-52">
                <Lock className="size-4" />
                <p>Only owners and admins can invite new members.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </>
      }
      title="Invite teammates"
      description={`Add an email and role for each person you want to join ${activeOrganization?.name}`}
      open={isOpen}
      onOpenChange={setIsOpen}
      isDisabled={!isPriviledged}
    >
      <SendInvitationForm orgSlug={orgSlug} onClose={() => setIsOpen(false)} />
    </ActionDialog>
  );
};

export default SendInvitationDialog;
