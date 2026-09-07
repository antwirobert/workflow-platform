import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useSearch } from "../hooks/useSearch";
import { useActiveOrganization } from "@/features/organizations/hooks/useActiveOrganization";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { Badge } from "@/components/ui/badge";
import type { SearchType } from "../types";
import { CheckSquare, Hash, Search } from "lucide-react";

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
  const peopleCount = data?.people.length ?? 0;
  const totalCount = taskCount + projectCount + workspaceCount + peopleCount;

  const hasResults =
    data &&
    (data.tasks.length > 0 || type === "tasks") &&
    (data.projects.length > 0 || type === "projects") &&
    (data.workspaces.length > 0 || type === "workspaces") &&
    (data.people.length > 0 || type === "people");

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command shouldFilter={false} className="max-w-sm rounded-lg border">
        <CommandInput
          placeholder="Search tasks, projects, workspaces and people..."
          value={query}
          onValueChange={onSearchChange}
        />
        <CommandList>
          <div>
            {TYPES.map((t) => (
              <Badge
                key={t.value}
                onClick={() => onTypeChange(t.value)}
                variant={type === t.value ? "default" : "ghost"}
              >
                {t.label}
              </Badge>
            ))}
          </div>

          {query.trim().length < 3 && !isFetching && !hasResults && (
            <CommandEmpty>
              <Search />
              <h3>Search anything</h3>
              <p>
                Find tasks, projects, workspaces, and people across your
                organizatoin.
              </p>
            </CommandEmpty>
          )}

          {query.trim().length >= 3 && (
            <CommandEmpty>
              <Search />
              <h3>No results for "{query}"</h3>
              <p>Try different keywords or broaden your search scope.</p>
            </CommandEmpty>
          )}

          <CommandGroup>
            {type === "projects" &&
              (data?.projects.length ?? 0) > 0 &&
              data?.projects.map((project) => (
                <CommandItem key={project.id}>
                  <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                  {project.name}
                </CommandItem>
              ))}

            {type === "tasks" &&
              (data?.tasks.length ?? 0) > 0 &&
              data?.tasks.map((task) => (
                <CommandItem key={task.id}>
                  <CheckSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                  {task.title}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default SearchCommand;
