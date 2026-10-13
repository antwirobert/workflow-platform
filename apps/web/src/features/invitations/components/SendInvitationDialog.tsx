import ActionDialog from "@/components/ActionDialog";
import { Button } from "@/components/ui/button";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import SendInvitationForm from "./sendInvitationForm";

interface SendInvitationDialogProps {
  orgSlug: string;
  size?: boolean;
}

const SendInvitationDialog = ({ orgSlug, size }: SendInvitationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeOrganization } = useActiveOrganization();

  return (
    <ActionDialog
      trigger={
        <Button
          className="shrink-0 gap-1.5 self-start"
          size={size ? "xs" : "default"}
        >
          <UserPlus className="size-4" />
          Invite members
        </Button>
      }
      title="Invite teammates"
      description={`Add an email and role for each person you want to join ${activeOrganization?.name}`}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SendInvitationForm orgSlug={orgSlug} onClose={() => setIsOpen(false)} />
    </ActionDialog>
  );
};

export default SendInvitationDialog;
