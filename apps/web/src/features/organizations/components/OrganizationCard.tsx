import TextAvatar from "@/components/TextAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIdentityColor } from "@/lib/utils";
import { Layers, Users } from "lucide-react";

interface OrganizationCardProps {
  id: string;
  name: string;
  slug: string;
}

const OrganizationCard = ({ id, name, slug }: OrganizationCardProps) => {
  const color = getIdentityColor(id);

  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border hover:shadow-md">
      <div className="flex min-w-0 items-center gap-3.5">
        <TextAvatar
          name={name}
          colorClass={color.bg}
          textClass={color.text}
          className="size-11 shrink-0 rounded-lg text-sm font-semibold"
        />

        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="capitalize truncate text-sm font-semibold tracking-tight text-foreground">
              {name}
            </h3>
            <Badge
              variant="secondary"
              className="h-5 shrink-0 rounded-md px-1.5 text-[11px] font-medium text-muted-foreground"
            >
              {slug}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Layers className="size-3.5 opacity-70" />3 workspaces
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5 opacity-70" />5 members
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="shrink-0 opacity-80 transition-opacity group-hover:opacity-100"
      >
        Manage
      </Button>
    </div>
  );
};

export default OrganizationCard;
