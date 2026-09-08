import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Link, useMatches } from "react-router-dom";
import { Button } from "../ui/button";
import { Fragment, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import SearchCommand from "@/features/search/components/SearchCommand";

type Match = {
  pathname: string;
  handle?: {
    title?: string | ((data: unknown) => string);
    clickable?: boolean;
  };
  data?: unknown;
};

const Topbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const matches = useMatches() as Match[];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const crumbs = matches
    .filter((match) => Boolean(match.handle?.title))
    .map((match) => {
      const title = match.handle?.title;
      const label =
        typeof title === "function" ? title(match.data) : (title as string);

      return {
        label,
        to: match.pathname,
        clickable: match.handle?.clickable ?? true,
      };
    });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="-ml-1" />

          <div className="hidden h-4 w-px shrink-0 bg-border sm:block" />

          <nav className="flex min-w-0 items-center gap-1.5 text-sm">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              const isClickable = crumb.clickable && !isLast;

              return (
                <Fragment key={crumb.to}>
                  {isClickable ? (
                    <Link
                      to={crumb.to}
                      className="hidden truncate text-muted-foreground transition-colors hover:text-foreground sm:inline"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        "truncate font-medium text-muted-foreground",
                        isLast && "hidden truncate text-foreground sm:inline",
                      )}
                    >
                      {crumb.label}
                    </span>
                  )}

                  {!isLast && (
                    <span className="hidden text-muted-foreground/40 sm:inline">
                      /
                    </span>
                  )}
                </Fragment>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="group flex h-8 w-56 items-center gap-2 rounded-md border border-transparent bg-muted/50 px-2.5 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground"
          >
            <Search className="size-3.5 shrink-0 opacity-70" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="relative size-8 text-muted-foreground"
          >
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
            <span className="sr-only">Notifications</span>
          </Button>

          <ThemeToggle />
        </div>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Topbar;
