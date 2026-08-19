import { RouterProvider } from "react-router/dom";
import { router } from "./routes/router";
import { useSessionBootstrap } from "./features/auth/hooks/useSessionBootstrap";
import { Toaster } from "./components/ui/toast";
import { ThemeProvider } from "./providers/theme-provider";

const App = () => {
  const { isLoading } = useSessionBootstrap();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme-storage">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
