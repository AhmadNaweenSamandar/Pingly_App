// Fallback to localhost if the environment variable isn't set
// in deployment we have to save the backend URL in an environment variable (e.g., REACT_APP_BACKEND_URL) and use that instead of hardcoding localhost, but for development this is fine.
const BACKEND_URL = 'http://localhost:3000';

export const formatImageUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined; // Return undefined so image fallbacks (like an avatar placeholder) can trigger

  // If it's already a full web URL (e.g., from an external OAuth provider like Google), return it as-is
  if (path.startsWith("http")) return path;

  // Normalize the path by ensuring it has exactly one leading slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${BACKEND_URL}${normalizedPath}`;
};