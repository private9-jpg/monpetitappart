export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
      <p className="mt-4 text-sm text-zinc-500">Chargement...</p>
    </div>
  );
}
