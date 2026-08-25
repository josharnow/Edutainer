const apiBaseUrl = process.env.NEXT_PUBLIC_SCOPE_API_BASE_URL?.trim(); // Trim whitespace from the environment variable

/** Builds a URL for the supplied API in both server and client code. */
export function createScopeApiUrl(
  pathname: string,
  searchParams?: URLSearchParams,
) {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_SCOPE_API_BASE_URL is not configured.");
  }

  // Automatically normalize the pathname and search parameters.
  const url = new URL(`${apiBaseUrl.replace(/\/$/, "")}/${pathname}`);

  if (searchParams) {
    // Automatically encode the parameters.
    url.search = searchParams.toString();
  }

  return url;
}
