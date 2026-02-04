"use client";

import { useState } from "react";
import validator from "validator";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/types/user";
import {
  register as registerRequest,
  logout as logoutRequest,
} from "@/api/requests";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUpForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const validateEmail = (email: string): boolean => {
    return validator.isEmail(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
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
      await registerRequest({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      const newUser: User = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        isLoggedIn: true,
      };

      setUser(newUser);

      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error creating account:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutRequest();
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
            Create an Account
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.firstName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-zinc-50 focus:ring-black dark:focus:ring-zinc-50"
                } bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.lastName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-zinc-50 focus:ring-black dark:focus:ring-zinc-50"
                } bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-zinc-50 focus:ring-black dark:focus:ring-zinc-50"
              } bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-lg bg-foreground text-background font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <a
            href="#"
            className="font-medium text-black dark:text-zinc-50 hover:underline"
          >
            Sign in
          </a>
        </p>

        {user && (
          <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-3">
              User Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  First Name:
                </span>{" "}
                <span className="text-zinc-900 dark:text-zinc-50">
                  {user.firstName}
                </span>
              </p>
              <p>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Last Name:
                </span>{" "}
                <span className="text-zinc-900 dark:text-zinc-50">
                  {user.lastName}
                </span>
              </p>
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
                  Password:
                </span>{" "}
                <span className="text-zinc-900 dark:text-zinc-50">
                  ••••••••
                </span>
              </p>
              <p>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Is Logged In:
                </span>{" "}
                <span
                  className={`${
                    user.isLoggedIn
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
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
