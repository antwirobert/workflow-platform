import { RouterProvider } from "react-router/dom";
import { router } from "./routes/router";
import { useSessionBootstrap } from "./features/auth/hooks/useSessionBootstrap";

const App = () => {
  const { isLoading } = useSessionBootstrap();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
