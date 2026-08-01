import { Plus, type LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  btnCaption: string;
  icon: LucideIcon;
}

const EmptyState = ({
  title,
  description,
  btnCaption,
  icon: Icon,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-8 py-14 text-center shadow-sm transition">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      <Button className="mt-5 flex items-center gap-2 rounded-full px-5 shadow-sm">
        {" "}
        <Plus className="h-4 w-4" /> <span>{btnCaption}</span>{" "}
      </Button>
    </div>
  );
};

export default EmptyState;
