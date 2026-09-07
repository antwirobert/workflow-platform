import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import TextAvatar from "@/components/TextAvatar";
import { cn, getIdentityColor } from "@/lib/utils";
import { useSearch } from "../hooks/useSearch";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useSearchFilters } from "../hooks/useSearchFilters";
import type { SearchType } from "../types";
import {
  CheckSquare,
  Hash,
  Layers,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { TaskStatusBadge } from "@/features/tasks/components/TaskStatusBadge";
import { OrgRoleBadge } from "@/features/organizations/components/OrgRoleBadge";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TYPES: { label: string; value: SearchType | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Tasks", value: "tasks" },
  { label: "Projects", value: "projects" },
  { label: "Workspaces", value: "workspaces" },
  { label: "People", value: "people" },
];

const SearchCommand = ({ open, onOpenChange }: SearchCommandProps) => {
  const { activeOrganization } = useActiveOrganization();
  const {
    search: query,
    type,
    onSearchChange,
    onTypeChange,
  } = useSearchFilters();

  const { data, isFetching } = useSearch(
    activeOrganization?.slug ?? null,
    query,
    type === "ALL" ? undefined : type,
  );

  const taskCount = data?.tasks.length ?? 0;
  const projectCount = data?.projects.length ?? 0;
  const workspaceCount = data?.workspaces.length ?? 0;
  const memberCount = data?.people.length ?? 0;
  const totalCount = taskCount + projectCount + workspaceCount + memberCount;

  const showEmptyPrompt = query.trim().length < 3 && !isFetching;
  const showNoResults =
    query.trim().length >= 3 && !isFetching && totalCount === 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command
        shouldFilter={false}
        className="rounded-xl border border-border/60 shadow-lg"
      >
        <CommandInput
          placeholder="Search tasks, projects, workspaces and people..."
          value={query}
          onValueChange={onSearchChange}
        />

        {/* Type filters */}
        <div className="flex flex-wrap gap-1.5 border-b border-border/60 px-3 py-2.5">
          {TYPES.map((t) => (
            <Badge
              key={t.value}
              variant={type === t.value ? "default" : "secondary"}
              onClick={() => onTypeChange(t.value)}
              className={cn(
                "h-6 cursor-pointer rounded-md px-2 text-[11px] font-medium transition-colors",
                type !== t.value &&
                  "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {t.label}
            </Badge>
          ))}
        </div>

        <CommandList className="max-h-80">
          {/* Loading */}
          {isFetching && (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Searching...
            </div>
          )}

          {/* Empty prompt */}
          {showEmptyPrompt && (
            <CommandEmpty className="py-10">
              <div className="flex flex-col items-center gap-2 text-center">
                <Search className="size-5 text-muted-foreground/60" />
                <p className="text-sm font-medium text-foreground">
                  Search anything
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Find tasks, projects, workspaces, and people across your
                  organization.
                </p>
              </div>
            </CommandEmpty>
          )}

          {/* No results */}
          {showNoResults && (
            <CommandEmpty className="py-10">
              <div className="flex flex-col items-center gap-2 text-center">
                <Search className="size-5 text-muted-foreground/60" />
                <p className="text-sm font-medium text-foreground">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Try different keywords or broaden your search scope.
                </p>
              </div>
            </CommandEmpty>
          )}

          {/* Tasks */}
          {(type === "tasks" || type === "ALL") && taskCount > 0 && (
            <CommandGroup
              heading={
                <span className="flex items-center gap-1.5">
                  <CheckSquare className="size-3.5" />
                  Tasks
                  <span className="text-muted-foreground">({taskCount})</span>
                </span>
              }
            >
              {data?.tasks.map((task) => {
                const color = task.assignee
                  ? getIdentityColor(task.assignee.id ?? "")
                  : null;

                return (
                  <CommandItem
                    key={task.id}
                    value={`task-${task.id}`}
                    className="gap-2.5 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {task.title}
                      </p>
                    </div>
                    <TaskStatusBadge status={task.status} />
                    {task.assignee?.name && color && (
                      <TextAvatar
                        name={task.assignee.name}
                        colorClass={color.bg}
                        textClass={color.text}
                        className="size-6 shrink-0 rounded-full text-[10px] font-semibold"
                      />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Projects */}
          {(type === "projects" || type === "ALL") && projectCount > 0 && (
            <CommandGroup
              heading={
                <span className="flex items-center gap-1.5">
                  <Hash className="size-3.5" />
                  Projects
                  <span className="text-muted-foreground">
                    ({projectCount})
                  </span>
                </span>
              }
            >
              {data?.projects.map((project) => {
                const color = getIdentityColor(project.id);

                return (
                  <CommandItem
                    key={project.id}
                    value={`project-${project.id}`}
                    className="gap-2.5 px-3 py-2"
                  >
                    <TextAvatar
                      name={project.name}
                      colorClass={color.bg}
                      textClass={color.text}
                      className="size-7 shrink-0 rounded-md text-[10px] font-semibold"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {project.name}
                      </p>
                      {project.description && (
                        <p className="truncate text-xs text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* Workspaces */}
          {(type === "workspaces" || type === "ALL") && workspaceCount > 0 && (
            <CommandGroup
              heading={
                <span className="flex items-center gap-1.5">
                  <Layers className="size-3.5" />
                  Workspaces
                  <span className="text-muted-foreground">
                    ({workspaceCount})
                  </span>
                </span>
              }
            >
              {data?.workspaces.map((workspace) => {
                const color = getIdentityColor(workspace.id);

                return (
                  <CommandItem
                    key={workspace.id}
                    value={`workspace-${workspace.id}`}
                    className="gap-2.5 px-3 py-2"
                  >
                    <div
                      className={cn(
                        "size-2.5 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10",
                        color.bg,
                      )}
                    />
                    <p className="truncate text-sm font-medium">
                      {workspace.name}
                    </p>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* People */}
          {(type === "people" || type === "ALL") && memberCount > 0 && (
            <CommandGroup
              heading={
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  People
                  <span className="text-muted-foreground">({memberCount})</span>
                </span>
              }
            >
              {data?.people.map((member) => {
                const color = getIdentityColor(member.user.id);

                return (
                  <CommandItem
                    key={member.user.id}
                    value={`person-${member.user.id}`}
                    className="gap-2.5 px-3 py-2"
                  >
                    <TextAvatar
                      name={member.user.name}
                      colorClass={color.bg}
                      textClass={color.text}
                      className="size-7 shrink-0 rounded-full text-[10px] font-semibold"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {member.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                    <OrgRoleBadge role={member.role} />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default SearchCommand;
