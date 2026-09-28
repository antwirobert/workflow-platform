export function throwIfNotFound(error: unknown, resource = "Page"): never {
  const status =
    (error as { status?: number })?.status ??
    (error as { response?: { status?: number } })?.response?.status;

  if (status === 404) {
    throw new Response(`${resource} not found`, { status: 404 });
  }
  throw error;
}
