import { routes } from "@/config/routes";
import type {
  LoginResponse,
  LogoutOptions,
  RegisterRequestBody,
} from "@/types/requests";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(routes.login, {
    method: "POST",
    headers: defaultHeaders,
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to sign in" }));
    throw new Error(errorData.message || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function register(
  body: RegisterRequestBody,
): Promise<Record<string, unknown>> {
  const response = await fetch(routes.register, {
    method: "POST",
    headers: defaultHeaders,
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to create account" }));
    throw new Error(errorData.message || `Server error: ${response.status}`);
  }

  return response.json();
}

export async function uploadPhotos(
  files: File[],
): Promise<Record<string, unknown>> {
  const formData = new FormData();
  files.forEach((file) => formData.append("file", file));

  const response = await fetch(routes.photoUpload, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to upload photos" }));
    throw new Error(errorData.message || `Upload failed: ${response.status}`);
  }

  return response.json();
}

export async function getAllPhotos(): Promise<unknown[]> {
  const response = await fetch(routes.photoGetAll, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to fetch photos" }));
    throw new Error(
      errorData.message || `Failed to fetch photos: ${response.status}`,
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : (data?.photos ?? []);
}

export async function logout(options?: LogoutOptions): Promise<void> {
  const response = await fetch(routes.logout, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      ...(options?.cookieHeader ? { Cookie: options.cookieHeader } : {}),
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
}
