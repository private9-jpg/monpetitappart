import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "SEO",
  robots: { index: false, follow: false },
};

export default function AdminSeoPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
          <h1 className="text-xl font-semibold text-zinc-900">SEO</h1>
          <p className="mt-1 text-sm text-zinc-600">Métadonnées, sitemap, JSON-LD et suivi d&apos;indexation.</p>
        </div>
        <div className="p-4 sm:p-6">
          <p className="text-sm text-zinc-600">Module SEO — en construction.</p>
        </div>
      </main>
    </div>
  );
}
