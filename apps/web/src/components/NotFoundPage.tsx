import { Link, isRouteErrorResponse, useRouteError } from "react-router";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/organizations" className="underline">
        Back to organizations
      </Link>
    </div>
  );
}

export function RouteErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred."}
      </p>
      <Link to="/organizations" className="underline">
        Back to organizations
      </Link>
    </div>
  );
}
