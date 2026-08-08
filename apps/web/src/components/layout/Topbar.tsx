import { Bell, Search } from "lucide-react";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";
import { useMatches } from "react-router-dom";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-3">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <span>|</span>
          <div className="flex items-center gap-2 text-sm">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;

              return (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className={`transition-colors ${
                      isLast
                        ? "text-foreground font-semibold text-base"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {crumb}
                  </span>

                  {!isLast && (
                    <span className="text-muted-foreground/50">/</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="w-55 pl-9 pr-3 rounded-full bg-muted/50 focus:bg-background transition"
            />
          </div>

          <button className="relative flex items-center justify-center rounded-full p-2 hover:bg-muted transition">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
