"use client";

import { useUser } from "@/contexts/UserContext";

export default function LandingPage() {
  const { user } = useUser();

  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm p-8">
        <p className="text-black dark:text-zinc-50 text-lg mb-2">hello</p>
        <p className="text-black dark:text-zinc-50 text-lg mb-2">
          {user?.firstName ?? ""} {user?.lastName ?? ""}
        </p>
        <p className="text-black dark:text-zinc-50 text-lg">
          this is the landing page
        </p>
      </div>
    </div>
  );
}
