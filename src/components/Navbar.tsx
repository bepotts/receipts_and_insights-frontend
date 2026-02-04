"use client";

import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

export default function Navbar() {
  const { logout, isLoggedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground hover:opacity-90 transition-opacity"
        >
          Receipts and Insights
        </Link>
        {isLoggedIn() ? (
          <button
            type="button"
            onClick={() => logout()}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 font-medium text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/signin"
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 font-medium text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
