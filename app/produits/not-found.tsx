"use client";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-2xl font-semibold">Page non trouvée</h2>
      <p className="mt-2 text-zinc-600">La page que vous recherchez n&apos;existe pas.</p>
    </div>
  );
}
