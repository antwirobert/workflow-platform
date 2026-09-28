import ActionDialog from "@/components/ActionDialog";
import SettingsView from "./SettingsView";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Settings"
      description="Manage your account, preferences, and workspace defaults."
      size="xl"
    >
      <SettingsView />
    </ActionDialog>
  );
};

export default SettingsDialog;
