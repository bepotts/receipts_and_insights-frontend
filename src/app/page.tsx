import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl font-semibold text-foreground">
          Receipts and Insights
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Manage your receipts and get expense insights in one place.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            Sign up
          </Link>
          <Link
            href="/signin"
            className="px-6 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
