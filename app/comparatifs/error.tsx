"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-2xl font-semibold">Une erreur est survenue</h2>
      <p className="mt-2 text-zinc-600">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
      >
        Réessayer
      </button>
    </div>
  );
}
