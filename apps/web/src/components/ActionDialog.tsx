import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ActionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDisabled?: boolean;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const ActionDialog = ({
  open,
  onOpenChange,
  isDisabled,
  trigger,
  title,
  description,
  children,
}: ActionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger disabled={isDisabled}>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-semibold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
