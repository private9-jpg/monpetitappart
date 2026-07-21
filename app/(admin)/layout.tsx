import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-zinc-900 px-4 py-3 text-white">
        <div className="mx-auto max-w-7xl">
          <span className="text-sm font-medium">Administration</span>
        </div>
      </header>
      <main className="flex-1 bg-zinc-50">{children}</main>
    </div>
  );
}
