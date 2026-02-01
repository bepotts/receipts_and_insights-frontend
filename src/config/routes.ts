/**
 * Central route URL configuration.
 * Values are read from .env.local (or .env) via Next.js env loading.
 * NEXT_PUBLIC_* variables are exposed to the browser.
 */

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

/**
 * API route URLs from environment.
 * Uses explicit env vars when set; otherwise builds from API base URL.
 */
export const routes = {
  apiBaseUrl,

  get login(): string {
    return process.env.NEXT_PUBLIC_LOGIN_ROUTE ?? `${apiBaseUrl}/auth/login`;
  },

  get register(): string {
    return (
      process.env.NEXT_PUBLIC_REGISTER_ROUTE ?? `${apiBaseUrl}/auth/register`
    );
  },

  get logout(): string {
    return process.env.NEXT_PUBLIC_LOGOUT_ROUTE ?? `${apiBaseUrl}/auth/logout`;
  },
} as const;
