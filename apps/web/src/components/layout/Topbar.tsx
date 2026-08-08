import { Bell, Search } from "lucide-react";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";
import { useMatches } from "react-router-dom";
import { Button } from "../ui/button";
import { Fragment } from "react";

type Match = {
  handle?: {
    title?: string | ((data: unknown) => string);
  };
  data?: unknown;
};

const Topbar = () => {
  const matches = useMatches() as Match[];

  const crumbs = matches
    .filter((match) => Boolean(match.handle?.title))
    .map((match) => {
      const title = match.handle?.title;
      return typeof title === "function"
        ? title(match.data)
        : (title as string);
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

              return (
                <Fragment key={index}>
                  <span
                    className={
                      isLast
                        ? "truncate font-medium text-foreground"
                        : "hidden truncate text-muted-foreground sm:inline"
                    }
                  >
                    {crumb}
                  </span>

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
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-8 w-56 rounded-md border-transparent bg-muted/50 pl-8 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-border focus-visible:bg-background"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative size-8 text-muted-foreground"
          >
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
