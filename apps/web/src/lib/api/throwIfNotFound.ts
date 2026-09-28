export function throwIfNotFound(error: unknown): never {
  const status =
    (error as { status?: number })?.status ??
    (error as { response?: { status?: number } })?.response?.status;

  if (status === 404) {
    throw new Response("Not Found", { status: 404 });
  }
  throw error;
}
