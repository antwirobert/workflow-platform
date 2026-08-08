import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type OrgRole = "OWNER" | "ADMIN" | "MEMBER";

const roleConfig: Record<OrgRole, { label: string; className: string }> = {
  OWNER: {
    label: "Owner",
    className:
      "bg-violet-50 text-violet-700 border-violet-200/60 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50",
  },
  ADMIN: {
    label: "Admin",
    className:
      "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50",
  },
  MEMBER: {
    label: "Member",
    className: "bg-secondary text-secondary-foreground border-transparent",
  },
};

export const OrgRoleBadge = ({ role }: { role: OrgRole }) => {
  const config = roleConfig[role];

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-5 rounded-md px-1.5 text-[11px] font-medium",
        config.className,
      )}
    >
      {config.label}
    </Badge>
  );
};
