import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Hash, CheckSquare, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "../hooks/useSearch";
import { useOrgStore } from "@/stores/orgStore";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import type { SearchType } from "../types";

const TYPES: { value: SearchType; label: string }[] = [
  { value: "tasks", label: "Tasks" },
  { value: "projects", label: "Projects" },
  { value: "comments", label: "Comments" },
];

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("tasks");
  const navigate = useNavigate();
  const activeOrgSlug = useOrgStore((s) => s.activeOrgSlug);
  const activeWorkspaceSlug = useWorkspaceStore((s) => s.activeWorkspaceSlug);

  const { data, isFetching } = useSearch(activeOrgSlug, query, type);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  function close() {
    onOpenChange(false);
    setQuery("");
  }

  function goToProject(projectId: string, workspaceId: string) {
    close();
    navigate(
      `/organizations/${activeOrgSlug}/workspaces/${workspaceId}/projects/${projectId}`,
    );
  }

  // Same workspaceId gap as before — see note below
  function goToTask(taskId: string, projectId: string) {
    close();
    navigate(
      `/organizations/${activeOrgSlug}/workspaces/${activeWorkspaceSlug}/projects/${projectId}/tasks/${taskId}`,
    );
  }

  function goToComment(taskId: string, projectId: string) {
    close();
    navigate(
      `/organizations/${activeOrgSlug}/workspaces/${activeWorkspaceSlug}/projects/${projectId}/tasks/${taskId}`,
    );
  }

  const hasResults =
    data &&
    ((type === "tasks" && data.tasks.length > 0) ||
      (type === "projects" && data.projects.length > 0) ||
      (type === "comments" && data.comments.length > 0));

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={`Search ${type}...`}
          value={query}
          onValueChange={setQuery}
        />

        <div className="flex gap-1 border-b border-border px-3 py-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                type === t.value
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <CommandList>
          {query.trim().length < 2 && (
            <CommandEmpty>Type at least 2 characters to search.</CommandEmpty>
          )}
          {query.trim().length >= 2 && !isFetching && !hasResults && (
            <CommandEmpty>No {type} found.</CommandEmpty>
          )}

          {type === "projects" &&
            data?.projects.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => goToProject(project.id, project.workspaceId)}
              >
                <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                {project.name}
              </CommandItem>
            ))}

          {type === "tasks" &&
            data?.tasks.map((task) => (
              <CommandItem
                key={task.id}
                onSelect={() => goToTask(task.id, task.projectId)}
              >
                <CheckSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                {task.title}
              </CommandItem>
            ))}

          {type === "comments" &&
            data?.comments.map((comment) => (
              <CommandItem
                key={comment.id}
                onSelect={() => goToComment(comment.taskId, "")}
              >
                <MessageSquare className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{comment.body}</span>
              </CommandItem>
            ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
