"use server";

import { cookies } from "next/headers";
import { logout as logoutRequest } from "@/api/requests";
import { CookieValues } from "@/types/cookies";

/**
 * Logs the user out by invoking the backend logout endpoint
 * and clearing the session cookie from the current request context.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    await logoutRequest({ cookieHeader });
  } finally {
    cookieStore.delete(CookieValues.session_token);
  }
}
