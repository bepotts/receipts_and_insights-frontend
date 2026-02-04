"use server";

import { cookies } from "next/headers";
import { routes } from "@/config/routes";
import { CookieValues } from "@/types/cookies";

/**
 * Logs the user out by invoking the backend logout endpoint
 * and clearing the session cookie from the current request context.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(routes.logout, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      credentials: "include",
    });

    if (!response.ok) {
      let message = `Logout request failed with status ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData?.message) {
          message = errorData.message;
        }
      } catch {
        const fallbackText = await response.text().catch(() => "");
        if (fallbackText) {
          message = fallbackText;
        }
      }

      throw new Error(message);
    }
  } finally {
    cookieStore.delete(CookieValues.session_token);
  }
}
