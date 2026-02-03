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
      </main>
    </div>
  );
}
