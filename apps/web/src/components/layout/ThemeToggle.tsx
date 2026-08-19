import { Check, Laptop, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/theme-provider";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          data-active={theme === "light"}
          className="flex items-center justify-between gap-2 data-[active=true]:bg-accent data-[active=true]:font-medium"
        >
          <span className="flex items-center gap-2">
            <Sun className="size-4" /> Light
          </span>
          {theme === "light" && (
            <Check className="size-3.5 text-muted-foreground shrink-0" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          data-active={theme === "dark"}
          className="flex items-center justify-between gap-2 data-[active=true]:bg-accent data-[active=true]:font-medium"
        >
          <span className="flex items-center gap-2">
            <Moon className="size-4" /> Dark
          </span>
          {theme === "dark" && (
            <Check className="size-3.5 text-muted-foreground shrink-0" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          data-active={theme === "system"}
          className="flex items-center justify-between gap-2 data-[active=true]:bg-accent data-[active=true]:font-medium"
        >
          <span className="flex items-center gap-2">
            <Laptop className="size-4" /> System
          </span>
          {theme === "system" && (
            <Check className="size-3.5 text-muted-foreground shrink-0" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
