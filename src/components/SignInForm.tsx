"use client";

import { useState } from "react";
import Link from "next/link";
import validator from "validator";
import { User } from "@/types/user";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function SignInForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const validateEmail = (email: string): boolean => {
    return validator.isEmail(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!backendUrl) {
        throw new Error("Backend URL is not configured");
      }

      const requestBody = {
        email: formData.email,
        password: formData.password,
      };

      const loginUrl = `${backendUrl}/auth/login`;

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Failed to sign in",
        }));
        throw new Error(
          errorData.message || `Server error: ${response.status}`,
        );
      }

      const responseData = await response.json();

      const newUser: User = {
        firstName: responseData.first_name ?? responseData.firstName ?? "",
        lastName: responseData.last_name ?? responseData.lastName ?? "",
        email: formData.email,
        password: formData.password,
        isLoggedIn: true,
      };

      setUser(newUser);

      setFormData({
        email: "",
        password: "",
      });
      alert("Signed in successfully!");
    } catch (error) {
      console.error("Error signing in:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to sign in. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      if (!backendUrl) {
        throw new Error("Backend URL is not configured");
      }

      const logoutUrl = `${backendUrl}/auth/logout`;

      const response = await fetch(logoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Failed to logout",
        }));
        throw new Error(
          errorData.message || `Server error: ${response.status}`,
        );
      }

      setUser(null);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to logout. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 text-center flex-1">
            Sign In
          </h2>
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="ml-4 py-2 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-zinc-50 focus:ring-black dark:focus:ring-zinc-50"
              } bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-zinc-50 focus:ring-black dark:focus:ring-zinc-50"
              } bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-lg bg-foreground text-background font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-black dark:text-zinc-50 hover:underline"
          >
            Sign up
          </Link>
        </p>

        {user && (
          <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-3">
              User Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Email:
                </span>{" "}
                <span className="text-zinc-900 dark:text-zinc-50">
                  {user.email}
                </span>
              </p>
              <p>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Is Logged In:
                </span>{" "}
                <span
                  className={
                    user.isLoggedIn
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {user.isLoggedIn ? "Yes" : "No"}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
