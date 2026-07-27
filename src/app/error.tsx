"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md rounded-lg border bg-red-50 p-6 text-center shadow">
        <h1 className="mb-2 text-2xl font-bold text-red-700">
          Something went wrong
        </h1>

        <p className="mb-4 text-gray-600">
          {error.message || "An unexpected error occurred."}
        </p>

        <button
          onClick={reset}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}