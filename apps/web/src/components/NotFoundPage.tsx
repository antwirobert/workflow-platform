import { Link, isRouteErrorResponse, useRouteError } from "react-router";

export function NotFoundPage({
  title = "Page not found",
  message = "The page you're looking for doesn't exist.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">{message}</p>
      <Link to="/organizations" className="underline">
        Back to organizations
      </Link>
    </div>
  );
}

export function RouteErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    const resource =
      typeof error.data === "string"
        ? error.data.replace(" not found", "")
        : "";
    return resource && resource !== "Page" ? (
      <NotFoundPage
        title={`${resource} not found`}
        message={`This ${resource.toLowerCase()} doesn't exist or you don't have access to it.`}
      />
    ) : (
      <NotFoundPage />
    );
  }
}
