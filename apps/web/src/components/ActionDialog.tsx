import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ActionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDisabled?: boolean;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "xl2" | "full";
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  xl2: "sm:max-w-2xl",
  full: "sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1200px]",
};

const ActionDialog = ({
  open,
  onOpenChange,
  isDisabled,
  trigger,
  title,
  description,
  children,
  size = "sm",
}: ActionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger disabled={isDisabled}>{trigger}</DialogTrigger>
      <DialogContent className={cn(sizeClasses[size])}>
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
